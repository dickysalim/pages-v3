import { useRef, useEffect } from 'react'
import { CONTENT, LOGO, btnStyle } from './constants'

// Compact: 160 × 300
export default function PhoneFrame({ slot, assignedVariant, dragOver, onDragOver, onDragLeave, onDrop, onClear, onOpenStudio }) {
  const filled = !!assignedVariant
  const imgs = filled ? (CONTENT[assignedVariant.content] || CONTENT.mta) : []
  const scrollRef = useRef(null)

  // reset scroll to top whenever a new variant is assigned
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [assignedVariant?.id])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 180 }}>
      {/* slot label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: 180 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--accent)' }}>
          Position {slot}
        </span>
      </div>

      {/* phone shell */}
      <div
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        style={{
          width: 180, height: 390, borderRadius: 26,
          border: dragOver ? '2.5px solid var(--accent)' : filled ? '2.5px solid #222' : '2.5px dashed #C8D0DC',
          background: filled ? '#fff' : dragOver ? '#E6F1FB' : '#F2F4F7',
          position: 'relative', overflow: 'hidden',
          boxShadow: dragOver ? '0 0 0 3px #E6F1FB, 0 2px 16px rgba(0,0,0,.1)' : '0 2px 16px rgba(0,0,0,.1)',
          transition: 'border-color .2s, box-shadow .2s, background .2s',
          cursor: filled ? 'default' : 'copy',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* notch */}
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 56, height: 18, background: filled ? '#222' : '#C8D0DC', borderRadius: '0 0 10px 10px', zIndex: 10 }} />

        {filled ? (
          <div ref={scrollRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
            <div style={{ background: '#683b11', height: 42, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <img src={LOGO} alt="logo" style={{ height: 22, objectFit: 'contain' }} />
            </div>
            {imgs.map((src, i) => <img key={i} src={src} alt="" style={{ width: '100%', display: 'block' }} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: 16, zIndex: 1 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E2E6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#6B7280" strokeWidth="1.5"><path d="M10 4v12M4 10h12" /></svg>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#6B7280', marginBottom: 3 }}>Empty slot</div>
            <div style={{ fontSize: 10, color: '#C8D0DC' }}>Drag a variant here</div>
          </div>
        )}
      </div>

      {/* variant tag */}
      <div style={{ background: filled ? '#E6F1FB' : '#F2F4F7', color: filled ? 'var(--accent)' : '#6B7280', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, width: 180, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {filled ? assignedVariant.title : 'No variant assigned'}
      </div>

      {/* footer: only Remove, visible when filled */}
      {filled && (
        <button onClick={onClear} style={{ ...btnStyle('ghost'), width: 180 }}>Remove</button>
      )}
    </div>
  )
}
