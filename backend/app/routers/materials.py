import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import User, Material, TokenUsage
from app.schemas import (
    MaterialGenerationRequest,
    MaterialGenerationResponse,
    MaterialResponse,
    MaterialUpdate
)
from app.auth import get_current_user
from app.llm_service import llm_service
from app.document_service import document_exporter
from app.config import get_settings

router = APIRouter(prefix="/materials", tags=["materials"])
settings = get_settings()


@router.get("/models/pricing")
def get_model_pricing():
    """Get pricing information for all available models."""
    models = ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo", "gpt-3.5-turbo", "gpt-5"]
    pricing_info = {}
    for model in models:
        pricing_info[model] = llm_service.get_pricing_info(model)
    return pricing_info


@router.post("/generate", response_model=MaterialGenerationResponse)
def generate_material(
    request: MaterialGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify generation password to protect API usage
    if request.generation_password != settings.GENERATION_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid generation password. Access denied."
        )
    
    try:
        # Generate content using LLM
        chapters_data = [{"title": ch.title, "description": ch.description} for ch in request.chapters]
        generated_content, prompt_tokens, completion_tokens = llm_service.generate_material(
            request.title,
            chapters_data,
            request.model
        )
        
        total_tokens = prompt_tokens + completion_tokens
        estimated_cost = llm_service.estimate_cost(prompt_tokens, completion_tokens, request.model)
        
        # Save material to database
        material = Material(
            user_id=current_user.id,
            title=request.title,
            table_of_contents=json.dumps([ch.dict() for ch in request.chapters]),
            generated_content=json.dumps(generated_content)
        )
        db.add(material)
        
        # Save token usage
        token_usage = TokenUsage(
            user_id=current_user.id,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=total_tokens,
            estimated_cost=estimated_cost,
            model_used=request.model
        )
        db.add(token_usage)
        
        db.commit()
        db.refresh(material)
        
        return MaterialGenerationResponse(
            material_id=material.id,
            generated_content=generated_content,
            tokens_used=total_tokens,
            estimated_cost=estimated_cost
        )
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating material: {str(e)}"
        )


@router.get("/", response_model=List[MaterialResponse])
def get_user_materials(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    materials = db.query(Material).filter(Material.user_id == current_user.id).all()
    return materials


@router.get("/{material_id}", response_model=MaterialResponse)
def get_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    material = db.query(Material).filter(
        Material.id == material_id,
        Material.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    return material


@router.put("/{material_id}", response_model=MaterialResponse)
def update_material(
    material_id: int,
    update_data: MaterialUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    material = db.query(Material).filter(
        Material.id == material_id,
        Material.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    material.generated_content = update_data.generated_content
    db.commit()
    db.refresh(material)
    
    return material


@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    material = db.query(Material).filter(
        Material.id == material_id,
        Material.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    db.delete(material)
    db.commit()
    
    return None


@router.get("/{material_id}/export/docx")
def export_material_docx(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export material to DOCX format."""
    material = db.query(Material).filter(
        Material.id == material_id,
        Material.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    if not material.generated_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Material has no generated content to export"
        )
    
    try:
        content = json.loads(material.generated_content)
        docx_buffer = document_exporter.export_to_docx(content)
        
        # Create safe filename
        safe_title = "".join(c for c in material.title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{safe_title}.docx"
        
        return StreamingResponse(
            docx_buffer,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error exporting to DOCX: {str(e)}"
        )


@router.get("/{material_id}/export/pdf")
def export_material_pdf(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export material to PDF format."""
    material = db.query(Material).filter(
        Material.id == material_id,
        Material.user_id == current_user.id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material not found"
        )
    
    if not material.generated_content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Material has no generated content to export"
        )
    
    try:
        content = json.loads(material.generated_content)
        pdf_buffer = document_exporter.export_to_pdf(content)
        
        # Create safe filename
        safe_title = "".join(c for c in material.title if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{safe_title}.pdf"
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error exporting to PDF: {str(e)}"
        )

