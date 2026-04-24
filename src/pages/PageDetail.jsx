import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import LiveVariantConfig from '../components/LiveVariantConfig'

const mockVariants = [
  // Inactive — oldest variants
  { id: 'v001', ver: 1, title: 'Pricing First', description: 'Moving pricing above fold to increase purchase intent and reduce drop-off on first scroll. Hypothesis: visitors who see price early self-qualify faster.', lp2l: '5.2%', content: 'mta', publisher: 'Dicky', pageViews: 3820, conversions: 199 },
  { id: 'v002', ver: 2, title: 'Social Proof Heavy', description: 'Leading with testimonials and trust signals before introducing the product and price. Builds credibility upfront.', lp2l: '6.1%', content: 'fallback', publisher: 'Dicky', pageViews: 4100, conversions: 250 },
  { id: 'v003', ver: 3, title: 'Benefit Led', description: 'Opening with key product benefits before price reveal to frame value first. Works best with warm traffic.', lp2l: '7.8%', content: 'mta', publisher: 'Dicky', pageViews: 2980, conversions: 232 },
  { id: 'v004', ver: 4, title: 'Urgency + Scarcity', description: 'Countdown timer and low-stock messaging above fold. Designed for retargeting audiences already familiar with the product.', lp2l: '9.2%', content: 'fallback', publisher: 'Dicky', pageViews: 5640, conversions: 519 },
  { id: 'v005', ver: 5, title: 'Video Hero', description: 'Auto-playing muted video loop replacing the static hero image. Strong for cold traffic as it provides product context without requiring reading.', lp2l: '8.4%', content: 'mta', publisher: 'Dicky', pageViews: 3210, conversions: 269 },
  // Live variants (slotA and slotB initial)
  { id: 'v006', ver: 6, title: 'Minimalist CTA', description: 'Stripped-down layout focusing attention on a single CTA with minimal distractions. Proven to increase click-through on first scroll.', lp2l: '11.3%', content: 'fallback', publisher: 'Dicky', pageViews: 6720, conversions: 759 },
  { id: 'v007', ver: 7, title: 'Before & After', description: 'Side-by-side comparison of results before and after using the product. High trust-building format for skeptical audiences.', lp2l: '10.1%', content: 'mta', publisher: 'Dicky', pageViews: 4890, conversions: 494 },
  // Draft — newest, never published
  { id: 'v008', ver: 8, title: 'Community Led', description: '', lp2l: '—', content: 'fallback', publisher: 'Dicky', pageViews: 0, conversions: 0 },
]

const LP_TITLES = {
  owt32: 'Metafiber Main Sales Letter',
  bx9m2: 'Metafiber Promo Ramadan',
  cz7k8: '3Peptide Main Sales Letter',
  dq4p1: '3Peptide Bundle Offer',
  ex5r3: 'Metafiber Cold Traffic',
  fy6s9: '3Peptide Retargeting',
}

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
