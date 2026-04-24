import { PRESETS } from './constants'

export default function HorizontalSplitSlider({ split, onChange }) {
  const handleA = e => {
    const val = Math.min(100, Math.max(0, Number(e.target.value)))
    if (!isNaN(val)) onChange(val)
  }
  const handleB = e => {
    const val = Math.min(100, Math.max(0, Number(e.target.value)))
    if (!isNaN(val)) onChange(100 - val)
  }

  return (
    <div style={{ marginTop: 14 }}>

      {/* ── Bar + presets on a compact layout ── */}

      {/* section label inline with presets */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C8D0DC' }}>Traffic Split</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {PRESETS.map(([a, b]) => {
            const active = split === a
            return (
              <button
                key={a}
                onClick={() => onChange(a)}
                style={{
                  fontSize: 10, fontWeight: 700, fontFamily: 'DM Mono, monospace',
                  padding: '3px 8px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  background: active ? 'var(--accent)' : '#F1F5F9',
                  color: active ? '#fff' : '#94A3B8',
                  transition: 'background .15s, color .15s',
                }}
              >
                {a}/{b}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Interactive proportional bar ── */}
      <div style={{ position: 'relative', height: 28 }}>

        {/* soft-tinted fill bar */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 7, overflow: 'hidden', border: '1px solid #E2E6EC', display: 'flex' }}>
          {/* A side */}
          <div style={{ flex: split, background: '#BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRight: '1px solid #93C5FD' }}>
            {split >= 10 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1D4ED8', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
                A · {split}%
              </span>
            )}
          </div>
          {/* B side */}
          <div style={{ flex: 100 - split, background: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {(100 - split) >= 10 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#475569', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap' }}>
                {100 - split}% · B
              </span>
            )}
          </div>
        </div>

        {/* invisible range input */}
        <input
          id="split-slider"
          type="range" min={0} max={100} step={1} value={split}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'ew-resize', zIndex: 4, margin: 0 }}
        />

        {/* thumb on the boundary */}
        <div style={{
          position: 'absolute',
          left: `calc(${split}% - 8px)`,
          top: '50%', transform: 'translateY(-50%)',
          width: 16, height: 16, borderRadius: '50%',
          background: '#fff',
          border: '2px solid var(--accent)',
          boxShadow: '0 1px 4px rgba(24,95,165,.25)',
          zIndex: 3, pointerEvents: 'none',
        }} />

      </div>

    </div>
  )
}
