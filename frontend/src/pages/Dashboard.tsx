import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, Calendar, Trash2 } from 'lucide-react'
import api from '../api/axios'
import './Dashboard.css'

interface Material {
  id: number
  title: string
  created_at: string
  updated_at: string
}

export default function Dashboard() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMaterials()
  }, [])

  const fetchMaterials = async () => {
    try {
      const response = await api.get('/materials/')
      setMaterials(response.data)
    } catch (error) {
      console.error('Failed to fetch materials:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteMaterial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this material?')) return

    try {
      await api.delete(`/materials/${id}`)
      setMaterials(materials.filter(m => m.id !== id))
    } catch (error) {
      console.error('Failed to delete material:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading materials...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>My Materials</h1>
          <p>Manage and view your generated learning materials</p>
        </div>
        <Link to="/generator" className="btn btn-primary">
          <Plus size={20} />
          Generate New Material
        </Link>
      </div>

      {materials.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} />
          <h2>No materials yet</h2>
          <p>Start by generating your first learning material</p>
          <Link to="/generator" className="btn btn-primary">
            <Plus size={20} />
            Create First Material
          </Link>
        </div>
      ) : (
        <div className="materials-grid">
          {materials.map((material) => (
            <div key={material.id} className="material-card">
              <div className="material-icon">
                <FileText size={32} />
              </div>
              <div className="material-content">
                <h3>{material.title}</h3>
                <div className="material-meta">
                  <span>
                    <Calendar size={14} />
                    {formatDate(material.created_at)}
                  </span>
                </div>
              </div>
              <div className="material-actions">
                <Link to={`/generator?id=${material.id}`} className="btn btn-secondary">
                  View
                </Link>
                <button
                  onClick={() => deleteMaterial(material.id)}
                  className="btn-icon btn-danger"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

