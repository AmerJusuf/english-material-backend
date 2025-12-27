import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Trash2, Download, Loader } from 'lucide-react'
import api from '../api/axios'
import RichTextEditor from '../components/RichTextEditor'
import './Generator.css'

interface Chapter {
  title: string
  description: string
}

export default function Generator() {
  const [searchParams] = useSearchParams()
  const materialId = searchParams.get('id')
  
  const [title, setTitle] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([{ title: '', description: '' }])
  const [model, setModel] = useState('gpt-4o-mini')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [editorContent, setEditorContent] = useState('')
  const [tokensUsed, setTokensUsed] = useState(0)
  const [estimatedCost, setEstimatedCost] = useState(0)

  useEffect(() => {
    if (materialId) {
      loadMaterial(materialId)
    }
  }, [materialId])

  const loadMaterial = async (id: string) => {
    try {
      const response = await api.get(`/materials/${id}`)
      setTitle(response.data.title)
      const toc = JSON.parse(response.data.table_of_contents)
      setChapters(toc)
      
      if (response.data.generated_content) {
        const content = JSON.parse(response.data.generated_content)
        setGeneratedContent(content)
        setEditorContent(formatContentForEditor(content))
      }
    } catch (error) {
      console.error('Failed to load material:', error)
    }
  }

  const formatContentForEditor = (content: any) => {
    let html = `<h1>${content.title}</h1>`
    
    content.chapters?.forEach((chapter: any) => {
      html += `<h2>Chapter ${chapter.number}: ${chapter.title}</h2>`
      html += `<div>${chapter.content.replace(/\n/g, '<br>')}</div>`
    })
    
    return html
  }

  const addChapter = () => {
    setChapters([...chapters, { title: '', description: '' }])
  }

  const removeChapter = (index: number) => {
    if (chapters.length > 1) {
      setChapters(chapters.filter((_, i) => i !== index))
    }
  }

  const updateChapter = (index: number, field: 'title' | 'description', value: string) => {
    const updated = [...chapters]
    updated[index][field] = value
    setChapters(updated)
  }

  const generateMaterial = async () => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    if (chapters.some(ch => !ch.title.trim())) {
      alert('Please fill in all chapter titles')
      return
    }

    setGenerating(true)

    try {
      const response = await api.post('/materials/generate', {
        title,
        chapters,
        model
      })

      setGeneratedContent(response.data.generated_content)
      setEditorContent(formatContentForEditor(response.data.generated_content))
      setTokensUsed(response.data.tokens_used)
      setEstimatedCost(response.data.estimated_cost)
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to generate material')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="generator">
      <div className="generator-header">
        <div>
          <h1>{materialId ? 'Edit Material' : 'Generate New Material'}</h1>
          <p>Create comprehensive English learning materials with AI</p>
        </div>
      </div>

      {!generatedContent ? (
        <div className="generator-form card">
          <div className="form-section">
            <label>Material Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Business English for Professionals"
              className="input-large"
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <label>Table of Contents</label>
              <button onClick={addChapter} className="btn btn-secondary btn-sm">
                <Plus size={16} />
                Add Chapter
              </button>
            </div>

            <div className="chapters-list">
              {chapters.map((chapter, index) => (
                <div key={index} className="chapter-item">
                  <div className="chapter-number">{index + 1}</div>
                  <div className="chapter-inputs">
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) => updateChapter(index, 'title', e.target.value)}
                      placeholder="Chapter title"
                      className="chapter-title-input"
                    />
                    <textarea
                      value={chapter.description}
                      onChange={(e) => updateChapter(index, 'description', e.target.value)}
                      placeholder="Additional context or description (optional)"
                      rows={2}
                      className="chapter-description-input"
                    />
                  </div>
                  {chapters.length > 1 && (
                    <button
                      onClick={() => removeChapter(index)}
                      className="btn-icon btn-danger"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label>AI Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="select">
              <option value="gpt-4o-mini">GPT-4o Mini (Fastest, Most Affordable)</option>
              <option value="gpt-4o">GPT-4o (Balanced)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo (High Quality)</option>
              <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Premium)</option>
            </select>
          </div>

          <button
            onClick={generateMaterial}
            disabled={generating}
            className="btn btn-primary btn-large"
          >
            {generating ? (
              <>
                <Loader size={20} className="spinner" />
                Generating Material...
              </>
            ) : (
              'Generate Material'
            )}
          </button>
        </div>
      ) : (
        <div className="editor-container">
          <div className="editor-stats">
            <div className="stat-item">
              <span className="stat-label">Tokens Used:</span>
              <span className="stat-value">{tokensUsed.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Estimated Cost:</span>
              <span className="stat-value">${estimatedCost.toFixed(4)}</span>
            </div>
            <button onClick={() => setGeneratedContent(null)} className="btn btn-secondary">
              Generate New
            </button>
          </div>
          
          <RichTextEditor
            content={editorContent}
            onChange={setEditorContent}
            materialId={materialId}
          />
        </div>
      )}
    </div>
  )
}

