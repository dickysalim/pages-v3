const mockBlocks = [
  { id: 'block003', title: 'Product Pitch Long — MTA', sku: 'MTA', useCount: 12 },
  { id: 'block004', title: 'Product Pitch Long — M3P', sku: 'M3P', useCount: 8 },
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

export default function GlobalBlocks() {
  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>Global Blocks</h1>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Title', 'SKU', 'Use Count'].map((h) => (
                <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0', background: '#EEF2F8' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockBlocks.map((block, i) => (
              <tr key={block.id}
                style={{ borderTop: i === 0 ? 'none' : '1px solid #F1F5F9' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F8FBFF'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 500, color: '#0F172A' }}>{block.title}</td>
                <td style={{ padding: '13px 16px' }}><SkuBadge sku={block.sku} /></td>
                <td style={{ padding: '13px 16px', fontSize: 13, color: '#0F172A' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 72, height: 5, background: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', background: '#0D4A80', width: `${Math.min(100, (block.useCount / 15) * 100)}%`, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{block.useCount}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 16px', borderTop: '1px solid #E2E8F0', background: '#EEF2F8', fontSize: 12, color: '#64748B' }}>
          {mockBlocks.length} global blocks
        </div>
      </div>
    </div>
  )
}
