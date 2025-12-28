import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../api/axios'
import './TokenUsage.css'

interface TokenUsageData {
  total_tokens: number
  total_cost: number
  usage_by_model: {
    [key: string]: {
      total_tokens: number
      total_cost: number
      request_count: number
    }
  }
  recent_usage: Array<{
    id: number
    total_tokens: number
    estimated_cost: number
    model_used: string
    timestamp: string
  }>
}

export default function TokenUsage() {
  const [data, setData] = useState<TokenUsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsageData()
  }, [])

  const fetchUsageData = async () => {
    try {
      const response = await api.get('/tokens/usage')
      setData(response.data)
    } catch (error) {
      console.error('Failed to fetch token usage:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading usage data...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="error-state">
        <p>Failed to load usage data</p>
      </div>
    )
  }

  const chartData = Object.entries(data.usage_by_model).map(([model, usage]) => ({
    name: model.replace('gpt-', 'GPT-'),
    tokens: usage.total_tokens,
    cost: usage.total_cost,
    requests: usage.request_count
  }))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="token-usage">
      <div className="page-header">
        <div>
          <h1>Token Usage & Costs</h1>
          <p>Track your API usage and estimated costs</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Tokens</div>
            <div className="stat-value">{data.total_tokens.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Cost</div>
            <div className="stat-value">${data.total_cost.toFixed(4)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Requests</div>
            <div className="stat-value">
              {Object.values(data.usage_by_model).reduce((sum, model) => sum + model.request_count, 0)}
            </div>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="card chart-container">
          <h2>Usage by Model</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => {
                  if (name === 'cost') return `$${value.toFixed(4)}`
                  return value.toLocaleString()
                }}
              />
              <Bar dataKey="tokens" fill="#667eea" name="Tokens" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {data.recent_usage.length === 0 ? (
            <div className="empty-message">No activity yet</div>
          ) : (
            data.recent_usage.map((usage) => (
              <div key={usage.id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-model">{usage.model_used}</div>
                  <div className="activity-date">{formatDate(usage.timestamp)}</div>
                </div>
                <div className="activity-stats">
                  <div className="activity-tokens">
                    {usage.total_tokens.toLocaleString()} tokens
                  </div>
                  <div className="activity-cost">
                    ${usage.estimated_cost.toFixed(4)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

