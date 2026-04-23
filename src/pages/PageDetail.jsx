import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'

const mockVariants = [
  { id: 'ah3kl', title: 'Pricing First', description: 'Moving pricing above fold', lp2l: '8.4%' },
  { id: 'bx9mq', title: 'Social Proof Heavy', description: 'Leading with testimonials', lp2l: '6.1%' },
  { id: 'cx3df', title: 'Benefit Led', description: 'Opening with key benefits', lp2l: '—' },
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

function MockPagePreview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: 8, background: '#F8FAFC', borderRadius: 4 }}>
      <div style={{ height: 32, background: '#0D4A80', borderRadius: 3, opacity: 0.85 }} />
      <div style={{ height: 8, background: '#CBD5E1', borderRadius: 2 }} />
      <div style={{ height: 8, background: '#CBD5E1', borderRadius: 2, width: '70%' }} />
      <div style={{ height: 18, background: '#DBEAFE', borderRadius: 2, marginTop: 4 }} />
      <div style={{ height: 8, background: '#CBD5E1', borderRadius: 2 }} />
      <div style={{ height: 8, background: '#CBD5E1', borderRadius: 2, width: '80%' }} />
      <div style={{ height: 14, background: '#0D4A80', borderRadius: 3, marginTop: 4, opacity: 0.65 }} />
    </div>
  )
}

function VariantsTab({ lpId }) {
  const navigate = useNavigate()
  const showToast = useToast()
  const [split, setSplit] = useState(60)
  const [slotA, setSlotA] = useState('ah3kl@v2')
  const [slotB, setSlotB] = useState('bx9mq@v1')
  const [dragOverA, setDragOverA] = useState(false)
  const [dragOverB, setDragOverB] = useState(false)

  const getVariantTitle = (id) => {
    if (!id) return null
    const varId = id.split('@')[0]
    const v = mockVariants.find(x => x.id === varId)
    return v ? v.title : id
  }

  const handleDrop = (slot, e) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('variantId')
    if (slot === 'A') { setSlotA(id); setDragOverA(false) }
    else { setSlotB(id); setDragOverB(false) }
  }

  const slotStyle = (highlight) => ({
    flex: 1, minWidth: 0,
    border: `2px ${highlight ? 'solid' : 'dashed'} ${highlight ? '#0D4A80' : '#CBD5E1'}`,
    borderRadius: 8, padding: 16,
    background: highlight ? '#EEF5FF' : '#F8FAFC',
    transition: 'border-color 0.15s, background 0.15s',
  })

  return (
    <div>
      {/* Live config card */}
      <div style={{ ...card }}>
        <div style={{ ...cardHeader }}>
          <span>Live Variant Configuration</span>
          <button id="publish-btn"
            style={{ padding: '7px 18px', background: '#0D4A80', color: '#FFF', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.2px' }}
            onMouseEnter={e => e.currentTarget.style.background = '#0A3D6B'}
            onMouseLeave={e => e.currentTarget.style.background = '#0D4A80'}
            onClick={() => showToast('Published successfully')}>
            Publish
          </button>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 14 }}>
            {/* Slot A */}
            <div style={slotStyle(dragOverA)}
              onDragOver={e => { e.preventDefault(); setDragOverA(true) }}
              onDragLeave={() => setDragOverA(false)}
              onDrop={e => handleDrop('A', e)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0D4A80', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Position A</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{split}%</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 10, minHeight: 18 }}>
                {slotA ? getVariantTitle(slotA) : <em style={{ color: '#94A3B8' }}>Drop variant here</em>}
              </div>
              <MockPagePreview />
              {slotA && (
                <button onClick={() => setSlotA(null)}
                  style={{ marginTop: 10, width: '100%', padding: '5px', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 5, fontSize: 11, color: '#64748B', cursor: 'pointer' }}>
                  Remove
                </button>
              )}
            </div>

            {/* Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, flexShrink: 0, padding: '0 4px' }}>
              <span style={{ fontSize: 9, color: '#94A3B8', textAlign: 'center', letterSpacing: '0.3px', textTransform: 'uppercase' }}>Split</span>
              <input id="split-slider" type="range" min={0} max={100} step={5} value={split}
                onChange={e => setSplit(Number(e.target.value))}
                style={{ writingMode: 'vertical-lr', direction: 'rtl', width: 6, height: 90, cursor: 'pointer', accentColor: '#0D4A80' }}
              />
              <span style={{ fontSize: 9, color: '#94A3B8' }}>{100 - split}%</span>
            </div>

            {/* Slot B */}
            <div style={slotStyle(dragOverB)}
              onDragOver={e => { e.preventDefault(); setDragOverB(true) }}
              onDragLeave={() => setDragOverB(false)}
              onDrop={e => handleDrop('B', e)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0D4A80', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Position B</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{100 - split}%</span>
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 10, minHeight: 18 }}>
                {slotB ? getVariantTitle(slotB) : <em style={{ color: '#94A3B8' }}>Drop variant here</em>}
              </div>
              <MockPagePreview />
              {slotB && (
                <button onClick={() => setSlotB(null)}
                  style={{ marginTop: 10, width: '100%', padding: '5px', background: 'transparent', border: '1px solid #E2E8F0', borderRadius: 5, fontSize: 11, color: '#64748B', cursor: 'pointer' }}>
                  Remove
                </button>
              )}
            </div>
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>
            Drag a variant from the table below into Position A or B
          </div>
        </div>
      </div>

      {/* Variant Table */}
      <div style={{ ...card }}>
        <div style={{ ...cardHeader }}>Variants</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['', 'Variant Title', 'Description', 'Total LP2L', 'Actions'].map((h, i) => (
                <th key={i} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockVariants.map((v, i) => (
              <tr key={v.id} draggable onDragStart={e => e.dataTransfer.setData('variantId', v.id)}
                style={{ borderTop: '1px solid #F1F5F9', cursor: 'grab' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '12px 12px 12px 16px', color: '#CBD5E1', fontSize: 16 }}>⠿</td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{v.title}</td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748B' }}>{v.description}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{v.lp2l}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button id={`studio-${v.id}`} onClick={() => navigate(`/landing-pages/${lpId}/studio/${v.id}`)}
                      style={{ padding: '5px 10px', background: '#0D4A80', color: '#FFF', border: 'none', borderRadius: 5, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
                      Open Studio
                    </button>
                    <button id={`clone-${v.id}`} onClick={() => showToast('Variant cloned')}
                      style={{ padding: '5px 10px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: 5, fontSize: 11, cursor: 'pointer' }}>
                      Clone
                    </button>
                    <button id={`archive-${v.id}`} onClick={() => showToast('Variant archived')}
                      style={{ padding: '5px 10px', background: '#FFF5F5', color: '#DC2626', border: '1px solid #FECACA', borderRadius: 5, fontSize: 11, cursor: 'pointer' }}>
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Publish History */}
      <div style={{ ...card, marginBottom: 0 }}>
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
