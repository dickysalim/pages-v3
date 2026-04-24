export const SKU_COLORS = {
  MTA: { bg: '#DBEAFE', color: '#1D4ED8' },
  M3P: { bg: '#DCFCE7', color: '#166534' },
}

export default function SkuBadge({ sku }) {
  const s = SKU_COLORS[sku] || { bg: '#F1F5F9', color: '#475569' }
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, letterSpacing: '0.2px' }}>
      {sku}
    </span>
  )
}
