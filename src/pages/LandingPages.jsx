import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const mockLPs = [
  { id: 'owt32', title: 'Metafiber Main Sales Letter', url: '/routing-system-test', sku: 'MTA', lp2l: 8.4, trend: 'up' },
  { id: 'bx9m2', title: 'Metafiber Promo Ramadan', url: '/metafiber-promo', sku: 'MTA', lp2l: 6.1, trend: 'down' },
  { id: 'cz7k8', title: '3Peptide Main Sales Letter', url: '/3peptide-main', sku: 'M3P', lp2l: 11.2, trend: 'up' },
  { id: 'dq4p1', title: '3Peptide Bundle Offer', url: '/3peptide-bundle', sku: 'M3P', lp2l: 9.7, trend: 'up' },
  { id: 'ex5r3', title: 'Metafiber Cold Traffic', url: '/metafiber-cold', sku: 'MTA', lp2l: 4.3, trend: 'down' },
  { id: 'fy6s9', title: '3Peptide Retargeting', url: '/3peptide-retarget', sku: 'M3P', lp2l: 14.1, trend: 'up' },
]

const SKU_COLORS = {
  MTA: { bg: '#DBEAFE', color: '#1D4ED8' },
  M3P: { bg: '#DCFCE7', color: '#166534' },
}

function SkuBadge({ sku }) {
  const s = SKU_COLORS[sku] || { bg: '#F1F5F9', color: '#475569' }
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, letterSpacing: '0.2px' }}>
      {sku}
    </span>
  )
}

function SortIcon({ col, sortCol, sortDir }) {
  if (sortCol !== col) return <span style={{ opacity: 0.3, marginLeft: 4, fontSize: 10 }}>↕</span>
  return <span style={{ marginLeft: 4, fontSize: 10, color: '#0D4A80' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>
}

export default function LandingPages() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [skuFilter, setSkuFilter] = useState('All')
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    let data = mockLPs
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(lp => lp.title.toLowerCase().includes(q) || lp.url.toLowerCase().includes(q))
    }
    if (skuFilter !== 'All') data = data.filter(lp => lp.sku === skuFilter)
    if (sortCol) {
      data = [...data].sort((a, b) => {
        let va = a[sortCol], vb = b[sortCol]
        if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase() }
        if (va < vb) return sortDir === 'asc' ? -1 : 1
        if (va > vb) return sortDir === 'asc' ? 1 : -1
        return 0
      })
    }
    return data
  }, [search, skuFilter, sortCol, sortDir])

  const thBase = {
    padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600,
    color: '#64748B', letterSpacing: '0.5px', textTransform: 'uppercase',
    borderBottom: '1px solid #E2E8F0', background: '#EEF2F8',
    userSelect: 'none', whiteSpace: 'nowrap',
  }
  const th = (col, sortable) => ({ ...thBase, cursor: sortable ? 'pointer' : 'default' })

  return (
    <div style={{ padding: 32 }}>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', flex: 1, margin: 0, letterSpacing: '-0.3px' }}>
          Landing Pages
        </h1>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </span>
          <input id="lp-search" type="text" placeholder="Search title or URL…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, color: '#0F172A', background: '#FFFFFF', outline: 'none', width: 220 }}
          />
        </div>
        <select id="sku-filter" value={skuFilter} onChange={e => setSkuFilter(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, color: '#0F172A', background: '#FFFFFF', outline: 'none', cursor: 'pointer' }}>
          <option value="All">All SKUs</option>
          <option value="MTA">MTA</option>
          <option value="M3P">M3P</option>
        </select>
      </div>

      {/* Table card */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th('title', true)} onClick={() => handleSort('title')}>LP Title <SortIcon col="title" sortCol={sortCol} sortDir={sortDir} /></th>
              <th style={th(null, false)}>LP URL</th>
              <th style={th('sku', true)} onClick={() => handleSort('sku')}>SKU <SortIcon col="sku" sortCol={sortCol} sortDir={sortDir} /></th>
              <th style={th('lp2l', true)} onClick={() => handleSort('lp2l')}>Last 14D LP2L <SortIcon col="lp2l" sortCol={sortCol} sortDir={sortDir} /></th>
              <th style={th(null, false)}>Trend</th>
              <th style={th(null, false)}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px 16px', textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No landing pages found</td></tr>
            ) : filtered.map((lp, i) => (
              <tr key={lp.id} style={{ borderTop: '1px solid #F1F5F9' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{lp.title}</td>
                <td style={{ padding: '13px 16px', fontSize: 12, color: '#64748B', fontFamily: 'monospace' }}>{lp.url}</td>
                <td style={{ padding: '13px 16px' }}><SkuBadge sku={lp.sku} /></td>
                <td style={{ padding: '13px 16px' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#0F172A' }}>{lp.lp2l}%</span>
                </td>
                <td style={{ padding: '13px 16px' }}>
                  {lp.trend === 'up'
                    ? <span style={{ color: '#16A34A', fontSize: 13, fontWeight: 600 }}>↑ Up</span>
                    : <span style={{ color: '#DC2626', fontSize: 13, fontWeight: 600 }}>↓ Down</span>
                  }
                </td>
                <td style={{ padding: '13px 16px' }}>
                  <button id={`edit-lp-${lp.id}`} onClick={() => navigate(`/landing-pages/${lp.id}`)}
                    style={{ padding: '6px 14px', background: '#0D4A80', color: '#FFFFFF', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', letterSpacing: '0.1px' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#0A3D6B'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0D4A80'}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 16px', borderTop: '1px solid #EEF2F8', background: '#EEF2F8', fontSize: 12, color: '#64748B' }}>
          Showing {filtered.length} of {mockLPs.length} landing pages
        </div>
      </div>
    </div>
  )
}
