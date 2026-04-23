import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from './Toast'

/* ── mock content maps ───────────────────────────────────────── */
const CONTENT = {
  mta: [
    'https://mganik-assets.pages.dev/img/vdq0frxtjxwc5xu7vgi7.webp',
    'https://mganik-assets.pages.dev/img/bjuhkaqjaqn1mls9d1le.webp',
    'https://mganik-assets.pages.dev/img/e0abqkhmyb2r4gfumz3a.webp',
    'https://mganik-assets.pages.dev/img/rlhezbc96mrm0gw2dxgi.webp',
    'https://mganik-assets.pages.dev/img/dvjqurqqljftczc9zrku.webp',
    'https://mganik-assets.pages.dev/img/jjco2emdutmhv48mybks.webp',
  ],
  fallback: [
    'https://mganik-assets.pages.dev/img/tkkfziptw5qdurc07h8b.webp',
    'https://mganik-assets.pages.dev/img/rlhezbc96mrm0gw2dxgi.webp',
    'https://mganik-assets.pages.dev/img/dvjqurqqljftczc9zrku.webp',
    'https://mganik-assets.pages.dev/img/ejgj7qh85gqppzvvk1rt.webp',
    'https://mganik-assets.pages.dev/img/jjco2emdutmhv48mybks.webp',
  ],
}
const LOGO = 'https://mganik-assets.pages.dev/img/mh5ow3xakq4lpfmge8dk.webp'

/* ── sub-components ──────────────────────────────────────────── */
function PhoneFrame({ slot, assignedVariant, dragOver, onDragOver, onDragLeave, onDrop, onClear, onOpenStudio }) {
  const filled = !!assignedVariant
  const imgs = filled ? CONTENT[assignedVariant.content] || CONTENT.mta : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* header row */}
      <div style={{ width: 220, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent)' }}>
          Position {slot}
        </span>
      </div>

      {/* phone shell */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        style={{
          width: 220,
          height: 420,
          borderRadius: 28,
          border: dragOver
            ? '3px solid var(--accent)'
            : filled
            ? '3px solid #222'
            : '3px dashed #C8D0DC',
          background: filled ? '#fff' : dragOver ? '#E6F1FB' : '#F2F4F7',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: dragOver
            ? '0 0 0 3px #E6F1FB, 0 2px 20px rgba(0,0,0,.12)'
            : '0 2px 20px rgba(0,0,0,.12)',
          transition: 'border-color .2s, box-shadow .2s, background .2s',
          cursor: filled ? 'default' : 'copy',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* notch */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 60, height: 20, background: filled ? '#222' : '#C8D0DC',
          borderRadius: '0 0 12px 12px', zIndex: 10,
        }} />

        {filled ? (
          /* scrollable content */
          <div style={{
            position: 'absolute', inset: 0,
            overflowY: 'auto', overflowX: 'hidden',
            scrollbarWidth: 'none', paddingTop: 20,
          }}>
            <div style={{ background: '#683b11', height: 44, display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <img src={LOGO} alt="logo" style={{ height: 24, width: 'auto', objectFit: 'contain' }} />
            </div>
            {imgs.map((src, i) => (
              <img key={i} src={src} alt="" style={{ width: '100%', display: 'block' }} />
            ))}
          </div>
        ) : (
          /* empty state */
          <div style={{ textAlign: 'center', padding: 20, zIndex: 1 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E2E6EC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#6B7280" strokeWidth="1.5"><path d="M10 4v12M4 10h12" /></svg>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#6B7280', marginBottom: 4 }}>Empty slot</div>
            <div style={{ fontSize: 11, color: '#C8D0DC' }}>Drag a variant here</div>
          </div>
        )}
      </div>

      {/* variant tag */}
      <div style={{
        background: filled ? '#E6F1FB' : '#F2F4F7',
        color: filled ? 'var(--accent)' : '#6B7280',
        fontSize: 11, fontWeight: 600,
        padding: '4px 10px', borderRadius: 20,
        width: 220, textAlign: 'center',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {filled ? assignedVariant.name : 'No variant assigned'}
      </div>

      {/* footer buttons */}
      <div style={{ display: 'flex', gap: 6, width: 220, opacity: filled ? 1 : 0.35, pointerEvents: filled ? 'auto' : 'none' }}>
        <button
          onClick={() => onOpenStudio && onOpenStudio(assignedVariant?.id)}
          style={btnStyle('primary')}
        >Open Studio</button>
        <button
          onClick={onClear}
          style={btnStyle('ghost')}
        >Remove</button>
      </div>
    </div>
  )
}

function btnStyle(variant) {
  const base = {
    flex: 1, fontFamily: 'var(--font)', fontSize: 12,
    padding: '7px 0', borderRadius: 6, cursor: 'pointer',
    textAlign: 'center', transition: 'all .15s',
  }
  if (variant === 'primary') return { ...base, background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' }
  return { ...base, background: '#fff', color: '#6B7280', border: '1px solid #C8D0DC' }
}

/* ── main export ─────────────────────────────────────────────── */
export default function LiveVariantConfig({ variants, lpId, onPublish }) {
  const navigate = useNavigate()
  const showToast = useToast()

  const [split, setSplit] = useState(60)
  const [slotA, setSlotA] = useState(variants[0] ? { ...variants[0], content: variants[0].content || 'mta' } : null)
  const [slotB, setSlotB] = useState(null)
  const [dragOverA, setDragOverA] = useState(false)
  const [dragOverB, setDragOverB] = useState(false)
  const draggingRef = useRef(null)

  const assignedIds = [slotA?.id, slotB?.id].filter(Boolean)

  const handleDrop = (slot, e) => {
    e.preventDefault()
    const v = draggingRef.current
    if (!v) return
    if (slot === 'A') { setSlotA(v); setDragOverA(false) }
    else { setSlotB(v); setDragOverB(false) }
    showToast(`${v.name} placed in Position ${slot}`)
    draggingRef.current = null
  }

  const fillPercent = split  // slider value = A%

  return (
    <div>
      {/* ── card ── */}
      <div style={{ background: '#fff', border: '1px solid #E2E6EC', borderRadius: 10, overflow: 'hidden', marginBottom: 20, boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
        {/* card header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2E6EC', fontSize: 13, fontWeight: 600, color: '#0F172A', background: '#EEF2F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Live Variant Configuration</span>
          <button
            id="publish-btn"
            onClick={() => { onPublish?.(); showToast('Publishing…') }}
            style={{ padding: '7px 18px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >Publish</button>
        </div>

        <div style={{ padding: 24 }}>
          {/* ── phone slots + slider ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'center', marginBottom: 16 }}>

            {/* slot A */}
            <PhoneFrame
              slot="A"
              assignedVariant={slotA}
              dragOver={dragOverA}
              onDragOver={e => { e.preventDefault(); setDragOverA(true) }}
              onDragLeave={() => setDragOverA(false)}
              onDrop={e => handleDrop('A', e)}
              onClear={() => { setSlotA(null); showToast('Position A cleared') }}
              onOpenStudio={id => navigate(`/landing-pages/${lpId}/studio/${id}`)}
            />

            {/* vertical slider */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 8px', userSelect: 'none' }}>
              {/* A label */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'DM Mono, monospace', color: '#1A1916' }}>{split}</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: '#6B7280' }}>A</span>
              </div>

              <div style={{ width: 1, height: 16, background: '#C8D0DC' }} />

              {/* track + thumb */}
              <div style={{ position: 'relative', width: 28, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: 4, height: '100%', background: '#E2E6EC', borderRadius: 2 }} />
                <div style={{ position: 'absolute', bottom: 0, width: 4, background: 'var(--accent)', borderRadius: 2, height: `${fillPercent}%`, transition: 'height .08s' }} />
                <input
                  id="split-slider"
                  type="range"
                  min={0} max={100} step={5}
                  value={split}
                  onChange={e => setSplit(Number(e.target.value))}
                  style={{
                    WebkitAppearance: 'none', appearance: 'none',
                    writingMode: 'vertical-lr', direction: 'rtl',
                    width: 28, height: 140,
                    background: 'transparent', cursor: 'pointer',
                    position: 'relative', zIndex: 2,
                    accentColor: 'var(--accent)',
                  }}
                />
              </div>

              <div style={{ width: 1, height: 16, background: '#C8D0DC' }} />

              {/* B label */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: '#6B7280' }}>B</span>
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'DM Mono, monospace', color: '#1A1916' }}>{100 - split}</span>
              </div>

              <div style={{ fontSize: 10, color: '#C8D0DC', textAlign: 'center', lineHeight: 1.4, marginTop: 4 }}>slide<br />to split</div>
            </div>

            {/* slot B */}
            <PhoneFrame
              slot="B"
              assignedVariant={slotB}
              dragOver={dragOverB}
              onDragOver={e => { e.preventDefault(); setDragOverB(true) }}
              onDragLeave={() => setDragOverB(false)}
              onDrop={e => handleDrop('B', e)}
              onClear={() => { setSlotB(null); showToast('Position B cleared') }}
              onOpenStudio={id => navigate(`/landing-pages/${lpId}/studio/${id}`)}
            />
          </div>

          {/* drag hint */}
          <div style={{ textAlign: 'center', fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" style={{ opacity: 0.5 }}><path d="M7 4a1 1 0 000 2h6a1 1 0 000-2H7zM5 9a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM7 14a1 1 0 000 2h6a1 1 0 000-2H7z" /></svg>
            Drag a variant from the table below into Position A or B
          </div>
        </div>
      </div>

      {/* ── variant table ── */}
      <div style={{ background: '#fff', border: '1px solid #E2E6EC', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}>
        {/* table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr 80px 160px', padding: '8px 14px', background: '#EEF2F8', borderBottom: '1px solid #E2E6EC' }}>
          {['', 'Variant', 'Description', 'LP2L', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B7280' }}>{h}</div>
          ))}
        </div>

        {/* rows */}
        {variants.map((v, i) => {
          const inSlot = assignedIds.includes(v.id)
          return (
            <div
              key={v.id}
              id={`row-${v.id}`}
              draggable={!inSlot}
              onDragStart={e => {
                draggingRef.current = { ...v, content: v.content || 'mta' }
                e.dataTransfer.effectAllowed = 'move'
              }}
              onDragEnd={() => { draggingRef.current = null }}
              style={{
                display: 'grid', gridTemplateColumns: '24px 1fr 1fr 80px 160px',
                padding: '12px 14px', borderTop: i === 0 ? 'none' : '1px solid #E2E6EC',
                cursor: inSlot ? 'default' : 'grab',
                opacity: inSlot ? 0.4 : 1,
                pointerEvents: inSlot ? 'none' : 'auto',
                alignItems: 'center',
                transition: 'background .1s',
              }}
              onMouseEnter={e => { if (!inSlot) e.currentTarget.style.background = '#E6F1FB' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {/* drag handle */}
              <div style={{ color: '#6B7280' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <circle cx="4.5" cy="3.5" r="1" /><circle cx="9.5" cy="3.5" r="1" />
                  <circle cx="4.5" cy="7" r="1" /><circle cx="9.5" cy="7" r="1" />
                  <circle cx="4.5" cy="10.5" r="1" /><circle cx="9.5" cy="10.5" r="1" />
                </svg>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#1A1916' }}>{v.title}</div>
              <div style={{ fontSize: 12, color: '#6B7280' }}>{v.description}</div>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: 'DM Mono, monospace', color: v.lp2l !== '—' ? '#2A7D4F' : '#6B7280' }}>{v.lp2l}</div>
              <div style={{ display: 'flex', gap: 4 }}>
                <button id={`studio-${v.id}`} onClick={e => { e.stopPropagation(); navigate(`/landing-pages/${lpId}/studio/${v.id}`) }} style={pillStyle('accent')}>Studio</button>
                <button id={`clone-${v.id}`} onClick={e => { e.stopPropagation(); showToast('Variant cloned') }} style={pillStyle()}>Clone</button>
                <button id={`archive-${v.id}`} onClick={e => { e.stopPropagation(); showToast('Variant archived') }} style={pillStyle()}>Archive</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function pillStyle(variant) {
  const base = {
    fontSize: 11, padding: '4px 9px', borderRadius: 20,
    border: '1px solid #C8D0DC', background: '#fff',
    color: '#6B7280', cursor: 'pointer', fontFamily: 'var(--font)',
    transition: 'all .15s',
  }
  if (variant === 'accent') return { ...base, background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' }
  return base
}
