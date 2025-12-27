import json
from fastapi import APIRouter, Depends, HTTPException, status
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

router = APIRouter(prefix="/materials", tags=["materials"])


@router.post("/generate", response_model=MaterialGenerationResponse)
def generate_material(
    request: MaterialGenerationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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

