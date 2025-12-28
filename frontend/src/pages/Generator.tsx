import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plus, Trash2, Loader } from 'lucide-react'
import api from '../api/axios'
import RichTextEditor from '../components/RichTextEditor'
import './Generator.css'

interface Chapter {
  title: string
  description: string
}

export default function Generator() {
  const [searchParams] = useSearchParams()
  const urlMaterialId = searchParams.get('id')
  
  const [materialId, setMaterialId] = useState<string | null>(urlMaterialId)
  const [title, setTitle] = useState('')
  const [chapters, setChapters] = useState<Chapter[]>([{ title: '', description: '' }])
  const [model, setModel] = useState('gpt-4o-mini')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [editorContent, setEditorContent] = useState('')
  const [tokensUsed, setTokensUsed] = useState(0)
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [generationPassword, setGenerationPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [modelPricing, setModelPricing] = useState<Record<string, { input: number; output: number }>>({})

  useEffect(() => {
    if (urlMaterialId) {
      loadMaterial(urlMaterialId)
    }
    loadModelPricing()
  }, [urlMaterialId])

  const loadModelPricing = async () => {
    try {
      const response = await api.get('/materials/models/pricing')
      setModelPricing(response.data)
    } catch (error) {
      console.error('Failed to load model pricing:', error)
    }
  }

  const getPriceLabel = (modelName: string): string => {
    const pricing = modelPricing[modelName]
    if (!pricing) return ''
    
    const inputPrice = pricing.input
    if (inputPrice < 1) return 'Very Cheap'
    if (inputPrice < 2) return 'Cheap'
    if (inputPrice < 10) return 'Moderate'
    return 'Expensive'
  }

  const formatPricing = (modelName: string): string => {
    const pricing = modelPricing[modelName]
    if (!pricing) return ''
    return `($${pricing.input}/1M input, $${pricing.output}/1M output)`
  }

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

  const handleGenerateClick = () => {
    // Check if password is stored
    const storedPassword = localStorage.getItem('generation_password')
    if (storedPassword) {
      setGenerationPassword(storedPassword)
      generateMaterial(storedPassword)
    } else {
      setShowPasswordModal(true)
    }
  }

  const handlePasswordSubmit = () => {
    if (!generationPassword.trim()) {
      setPasswordError('Password is required')
      return
    }
    setPasswordError('')
    setShowPasswordModal(false)
    // Store password for future use
    localStorage.setItem('generation_password', generationPassword)
    generateMaterial(generationPassword)
  }

  const generateMaterial = async (password: string) => {
    if (!title.trim()) {
      alert('Please enter a textbook title')
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
        model,
        generation_password: password
      })

      // Capture the material ID from the response
      setMaterialId(response.data.material_id.toString())
      setGeneratedContent(response.data.generated_content)
      setEditorContent(formatContentForEditor(response.data.generated_content))
      setTokensUsed(response.data.tokens_used)
      setEstimatedCost(response.data.estimated_cost)
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Invalid password - clear stored password and show modal again
        localStorage.removeItem('generation_password')
        setGenerationPassword('')
        setShowPasswordModal(true)
        setPasswordError('Invalid password. Please try again.')
      } else {
        alert(error.response?.data?.detail || 'Failed to generate textbook')
      }
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="generator">
      <div className="generator-header">
        <div>
          <h1>{materialId ? 'Edit Textbook' : 'Generate New Textbook'}</h1>
          <p>Create professional textbooks with real exercises and activities</p>
        </div>
      </div>

      {!generatedContent ? (
        <div className="generator-form card">
          <div className="form-section">
            <label>Textbook Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Business English Textbook for Professionals"
              className="input-large"
            />
          </div>

          <div className="form-section">
            <div className="section-header">
              <label>Textbook Chapters</label>
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
                      placeholder="Chapter title (e.g., Present Simple Tense, Business Vocabulary)"
                      className="chapter-title-input"
                    />
                    <textarea
                      value={chapter.description}
                      onChange={(e) => updateChapter(index, 'description', e.target.value)}
                      placeholder="Specific focus or level (optional, e.g., 'Beginner level with daily routines focus')"
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
              <option value="gpt-4o-mini">
                GPT-4o Mini (Fastest, Most Affordable) - {getPriceLabel('gpt-4o-mini')} {formatPricing('gpt-4o-mini')}
              </option>
              <option value="gpt-4o">
                GPT-4o (Balanced) - {getPriceLabel('gpt-4o')} {formatPricing('gpt-4o')}
              </option>
              <option value="gpt-4-turbo">
                GPT-4 Turbo (High Quality) - {getPriceLabel('gpt-4-turbo')} {formatPricing('gpt-4-turbo')}
              </option>
              <option value="gpt-3.5-turbo">
                GPT-3.5 Turbo (Economical) - {getPriceLabel('gpt-3.5-turbo')} {formatPricing('gpt-3.5-turbo')}
              </option>
              <option value="gpt-5">
                GPT-5 (Latest, Premium) - {getPriceLabel('gpt-5')} {formatPricing('gpt-5')}
              </option>
            </select>
            {modelPricing[model] && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Current selection: <strong>{getPriceLabel(model)}</strong> - {formatPricing(model)}
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={generating}
            className="btn btn-primary btn-large"
          >
            {generating ? (
              <>
                <Loader size={20} className="spinner" />
                Generating Textbook...
              </>
            ) : (
              'Generate Textbook'
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
            <button onClick={() => {
              setGeneratedContent(null)
              setMaterialId(null)
            }} className="btn btn-secondary">
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

      {/* Generation Password Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Generation Password Required</h2>
            <p>Enter the generation password to use the AI API for creating textbooks.</p>
            
            <div className="form-group">
              <label htmlFor="gen-password">Generation Password</label>
              <input
                id="gen-password"
                type="password"
                value={generationPassword}
                onChange={(e) => {
                  setGenerationPassword(e.target.value)
                  setPasswordError('')
                }}
                placeholder="Enter generation password"
                className={passwordError ? 'input-error' : ''}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit()
                  }
                }}
                autoFocus
              />
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setGenerationPassword('')
                  setPasswordError('')
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

