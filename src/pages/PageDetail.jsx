import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import LiveVariantConfig from '../components/LiveVariantConfig'

const mockVariants = [
  { id: 'ah3kl', title: 'Pricing First', description: 'Moving pricing above fold to increase intent', lp2l: '8.4%', content: 'mta' },
  { id: 'bx9mq', title: 'Social Proof Heavy', description: 'Leading with testimonials before product details', lp2l: '6.1%', content: 'fallback' },
  { id: 'cx3df', title: 'Benefit Led', description: 'Opening with key product benefits before price', lp2l: '—', content: 'mta' },
]

const mockPublishes = [
  { ver: 3, name: 'Pricing above fold test', date: 'Apr 18', by: 'dicky', a: 'ah3kl@v2', b: 'bx9mq@v1', splitA: 60, splitB: 40, live: true },
  { ver: 2, name: 'Added variant B', date: 'Apr 10', by: 'dicky', a: 'ah3kl@v1', b: 'bx9mq@v1', splitA: 70, splitB: 30, live: false },
  { ver: 1, name: 'Initial publish', date: 'Apr 1', by: 'dicky', a: 'ah3kl@v1', b: null, splitA: 100, splitB: 0, live: false },
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

      {/* Publish History */}
      <div style={{ ...card, marginBottom: 0, marginTop: 20 }}>
        <div style={{ ...cardHeader }}>Publish History</div>
        {mockPublishes.map((p, i) => (
          <div key={p.ver} style={{ padding: '14px 20px', borderTop: i === 0 ? 'none' : '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 14 }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: p.live ? '#0D4A80' : '#EEF2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: p.live ? '#FFF' : '#64748B', flexShrink: 0 }}>
              #{p.ver}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>
                {p.date} · by {p.by} · A: {p.a} ({p.splitA}%) {p.b ? `· B: ${p.b} (${p.splitB}%)` : ''}
              </div>
            </div>
            {p.live
              ? <span style={{ padding: '3px 10px', background: '#DBEAFE', color: '#1D4ED8', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>● Live</span>
              : <button id={`revert-${p.ver}`} onClick={() => showToast(`Reverted to Publish #${p.ver}`)}
                  style={{ padding: '5px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 5, fontSize: 11, color: '#64748B', cursor: 'pointer' }}>
                  Revert to this
                </button>
            }
          </div>
        ))}
      </div>
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
