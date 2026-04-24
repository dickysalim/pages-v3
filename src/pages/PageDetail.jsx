import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import LiveVariantConfig from '../components/LiveVariantConfig'
import { mockVariants, LP_TITLES } from '../data/mock'

// Shared styles
const card = { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.06)', marginBottom: 20 }
const cardHeader = { padding: '14px 20px', borderBottom: '1px solid #E2E8F0', fontSize: 13, fontWeight: 600, color: '#0F172A', background: '#EEF2F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const thStyle = { padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', background: '#EEF2F8' }


function VariantsTab({ lpId }) {
  const showToast = useToast()

  return (
    <div>
      <LiveVariantConfig
        variants={mockVariants}
        lpId={lpId}
        onPublish={() => showToast('Published successfully')}
      />
    </div>
  )
}

function AnalyticsTab() {
  const panelStyle = {
    background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10,
    padding: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={panelStyle}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>📊</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Page Performance</div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>In Progress</div>
      </div>
      <div style={panelStyle}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>🔬</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>Variant Performance</div>
        <div style={{ fontSize: 12, color: '#94A3B8' }}>In Progress</div>
      </div>
    </div>
  )
}

export default function PageDetail() {
  const { lpId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('variants')
  const title = LP_TITLES[lpId] || `Landing Page ${lpId}`

  const tabStyle = (tab) => ({
    padding: '9px 18px', border: 'none', background: 'transparent', cursor: 'pointer',
    fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
    color: activeTab === tab ? '#0D4A80' : '#64748B',
    borderBottom: `2px solid ${activeTab === tab ? '#0D4A80' : 'transparent'}`,
    transition: 'color 0.15s',
  })

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => navigate('/')}
          style={{ padding: '6px 12px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 12, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 1px 2px rgba(15,23,42,0.05)' }}>
          ← Back
        </button>
        <div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 2 }}>Landing Pages / {lpId}</div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>{title}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #E2E8F0', marginBottom: 24, display: 'flex' }}>
        <button id="tab-variants" style={tabStyle('variants')} onClick={() => setActiveTab('variants')}>Variants</button>
        <button id="tab-analytics" style={tabStyle('analytics')} onClick={() => setActiveTab('analytics')}>Analytics</button>
      </div>

      {activeTab === 'variants' ? <VariantsTab lpId={lpId} /> : <AnalyticsTab />}
    </div>
  )
}
