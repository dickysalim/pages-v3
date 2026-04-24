import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from './Toast'

/* ── content maps ───────────────────────────────────────────── */
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

/* ── PhoneFrame ─────────────────────────────────────────────── */
// Compact: 160 × 300
function PhoneFrame({ slot, assignedVariant, dragOver, onDragOver, onDragLeave, onDrop, onClear, onOpenStudio }) {
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
          <div ref={scrollRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', paddingTop: 18 }}>
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

/* ── HorizontalSplitSlider ──────────────────────────────────── */
const inputNumStyle = {
  width: 44, padding: '2px 4px', fontSize: 13, fontWeight: 700,
  fontFamily: 'DM Mono, monospace', color: '#1A1916',
  border: '1px solid #C8D0DC', borderRadius: 5, background: '#F8FAFC',
  textAlign: 'center', outline: 'none', appearance: 'textfield',
}

function HorizontalSplitSlider({ split, onChange }) {
  const handleA = e => {
    const val = Math.min(100, Math.max(0, Number(e.target.value)))
    if (!isNaN(val)) onChange(val)
  }
  const handleB = e => {
    const val = Math.min(100, Math.max(0, Number(e.target.value)))
    if (!isNaN(val)) onChange(100 - val)
  }

  return (
    <div style={{ marginTop: 16 }}>
      {/* slider row with inline percentage inputs at edges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* A label + editable number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent)' }}>A</span>
          <input
            id="split-input-a"
            type="number" min={0} max={100} step={1}
            value={split}
            onChange={handleA}
            style={inputNumStyle}
          />
          <span style={{ fontSize: 11, color: '#94A3B8' }}>%</span>
        </div>

        {/* track */}
        <div style={{ flex: 1, position: 'relative', height: 28, display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, height: 6, borderRadius: 3, background: '#E2E6EC' }} />
          <div style={{ position: 'absolute', left: 0, height: 6, borderRadius: '3px 0 0 3px', background: 'var(--accent)', width: `${split}%` }} />
          <div style={{ position: 'absolute', right: 0, height: 6, borderRadius: '0 3px 3px 0', background: '#CBD5E1', width: `${100 - split}%` }} />
          <div style={{ position: 'absolute', left: `calc(${split}% - 1px)`, height: 6, width: 2, background: '#fff', zIndex: 3 }} />
          <input
            id="split-slider"
            type="range" min={0} max={100} step={1} value={split}
            onChange={e => onChange(Number(e.target.value))}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'ew-resize', zIndex: 4, margin: 0 }}
          />
          <div style={{ position: 'absolute', left: `calc(${split}% - 11px)`, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '2.5px solid var(--accent)', boxShadow: '0 1px 6px rgba(24,95,165,.25)', zIndex: 3, pointerEvents: 'none' }} />
        </div>

        {/* B editable number + label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>%</span>
          <input
            id="split-input-b"
            type="number" min={0} max={100} step={1}
            value={100 - split}
            onChange={handleB}
            style={inputNumStyle}
          />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent)' }}>B</span>
        </div>
      </div>

      {/* A / B color legend */}
      <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--accent)' }} />
          <span style={{ fontSize: 10, color: '#6B7280' }}>Position A receives more traffic →</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: '#CBD5E1' }} />
          <span style={{ fontSize: 10, color: '#6B7280' }}>← Position B receives more traffic</span>
        </div>
      </div>
    </div>
  )
}

/* ── MiniPhonePreview ───────────────────────────────────────── */
function MiniPhonePreview({ variant, anchorRect }) {
  if (!variant || !anchorRect) return null
  const imgs = CONTENT[variant.content] || CONTENT.mta
  const W = 130, H = 250
  const left = anchorRect.left - W - 14
  const top = Math.max(8, anchorRect.top + anchorRect.height / 2 - H / 2)

  return (
    <div style={{ position: 'fixed', left, top, width: W, height: H, borderRadius: 18, border: '2.5px solid #222', background: '#fff', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,.2)', pointerEvents: 'none', zIndex: 9999, animation: 'previewFadeIn .15s ease' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 34, height: 11, background: '#222', borderRadius: '0 0 7px 7px', zIndex: 10 }} />
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', paddingTop: 11 }}>
        <div style={{ background: '#683b11', height: 24, display: 'flex', alignItems: 'center', padding: '0 6px' }}>
          <img src={LOGO} alt="logo" style={{ height: 13, objectFit: 'contain' }} />
        </div>
        {imgs.map((src, i) => <img key={i} src={src} alt="" style={{ width: '100%', display: 'block' }} />)}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,.6))', padding: '18px 8px 8px', fontSize: 10, fontWeight: 600, color: '#fff', textAlign: 'center' }}>
        {variant.title}
      </div>
      <style>{`@keyframes previewFadeIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  )
}

/* ── helpers ─────────────────────────────────────────────────── */
function btnStyle(v) {
  const base = { flex: 1, fontFamily: 'var(--font)', fontSize: 11, padding: '6px 0', borderRadius: 6, cursor: 'pointer', textAlign: 'center', transition: 'all .15s', border: 'none' }
  return v === 'primary'
    ? { ...base, background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' }
    : { ...base, background: '#fff', color: '#6B7280', border: '1px solid #C8D0DC' }
}
function pillStyle(accent) {
  const base = { fontSize: 11, padding: '4px 8px', borderRadius: 20, border: '1px solid #C8D0DC', background: '#fff', color: '#6B7280', cursor: 'pointer', fontFamily: 'var(--font)' }
  return accent ? { ...base, background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' } : base
}

/* ── main export ─────────────────────────────────────────────── */
export default function LiveVariantConfig({ variants, lpId, onPublish }) {
  const navigate = useNavigate()
  const showToast = useToast()

  const [split, setSplit] = useState(60)
  const [slotA, setSlotA] = useState(variants[0] ? { ...variants[0] } : null)
  const [slotB, setSlotB] = useState(null)
  const [dragOverA, setDragOverA] = useState(false)
  const [dragOverB, setDragOverB] = useState(false)
  const draggingRef = useRef(null)

  const [previewVariant, setPreviewVariant] = useState(null)
  const [previewAnchor, setPreviewAnchor] = useState(null)

  const assignedIds = [slotA?.id, slotB?.id].filter(Boolean)

  const handleDrop = (slot, e) => {
    e.preventDefault()
    const v = draggingRef.current
    if (!v) return
    if (slot === 'A') { setSlotA(v); setDragOverA(false) }
    else { setSlotB(v); setDragOverB(false) }
    showToast(`${v.title} placed in Position ${slot}`)
    draggingRef.current = null
  }

  return (
    <>
      <MiniPhonePreview variant={previewVariant} anchorRect={previewAnchor} />

      {/* two-column — stretch so both are same height */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignItems: 'stretch' }}>

        {/* ── LEFT: phone config card ── */}
        <div style={{ background: '#fff', border: '1px solid #E2E6EC', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,.06)', display: 'flex', flexDirection: 'column' }}>
          {/* header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E6EC', fontSize: 13, fontWeight: 600, color: '#0F172A', background: '#EEF2F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <span>Live Variant Configuration</span>
            <button id="publish-btn"
              onClick={() => { onPublish?.(); showToast('Publishing…') }}
              style={{ padding: '6px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              Publish
            </button>
          </div>

          <div style={{ padding: '16px 16px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* phones side by side */}
            <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
              <PhoneFrame slot="A" assignedVariant={slotA} dragOver={dragOverA}
                onDragOver={e => { e.preventDefault(); setDragOverA(true) }}
                onDragLeave={() => setDragOverA(false)}
                onDrop={e => handleDrop('A', e)}
                onClear={() => { setSlotA(null); showToast('Position A cleared') }}
                onOpenStudio={id => navigate(`/landing-pages/${lpId}/studio/${id}`)} />

              <PhoneFrame slot="B" assignedVariant={slotB} dragOver={dragOverB}
                onDragOver={e => { e.preventDefault(); setDragOverB(true) }}
                onDragLeave={() => setDragOverB(false)}
                onDrop={e => handleDrop('B', e)}
                onClear={() => { setSlotB(null); showToast('Position B cleared') }}
                onOpenStudio={id => navigate(`/landing-pages/${lpId}/studio/${id}`)} />
            </div>

            {/* horizontal split slider — below both phones */}
            <HorizontalSplitSlider split={split} onChange={setSplit} />


          </div>
        </div>

        {/* ── RIGHT: variant panel — same height as left, inner scrolls ── */}
        <div style={{ background: '#fff', border: '1px solid #E2E6EC', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,.06)', display: 'flex', flexDirection: 'column' }}>
          {/* fixed header */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E6EC', fontSize: 13, fontWeight: 600, color: '#0F172A', background: '#EEF2F8', flexShrink: 0 }}>
            Variants
            <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 500, color: '#6B7280' }}>hover to preview · drag to place</span>
          </div>

          {/* fixed column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: '16px 1fr 52px 90px', padding: '6px 12px', background: '#F8FAFC', borderBottom: '1px solid #E2E6EC', flexShrink: 0 }}>
            {['', 'Variant', 'LP2L', ''].map((h, i) => (
              <div key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94A3B8' }}>{h}</div>
            ))}
          </div>

          {/* scrollable list fills remaining height */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {variants.map((v, i) => {
              const inSlot = assignedIds.includes(v.id)
              return (
                <div
                  key={v.id}
                  id={`row-${v.id}`}
                  draggable={!inSlot}
                  onDragStart={e => {
                    draggingRef.current = { ...v }
                    e.dataTransfer.effectAllowed = 'move'
                    setPreviewVariant(null)
                  }}
                  onDragEnd={() => { draggingRef.current = null }}
                  onMouseEnter={e => {
                    if (inSlot) return
                    e.currentTarget.style.background = '#E6F1FB'
                    setPreviewVariant(v)
                    setPreviewAnchor(e.currentTarget.getBoundingClientRect())
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA'
                    setPreviewVariant(null)
                    setPreviewAnchor(null)
                  }}
                  style={{
                    display: 'grid', gridTemplateColumns: '16px 1fr 52px 90px',
                    padding: '11px 12px',
                    borderTop: i === 0 ? 'none' : '1px solid #F1F5F9',
                    background: i % 2 === 0 ? '#fff' : '#FAFAFA',
                    cursor: inSlot ? 'default' : 'grab',
                    opacity: inSlot ? 0.4 : 1,
                    pointerEvents: inSlot ? 'none' : 'auto',
                    alignItems: 'center',
                    transition: 'background .1s',
                  }}
                >
                  <div style={{ color: '#C8D0DC' }}>
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor">
                      <circle cx="4.5" cy="3.5" r="1" /><circle cx="9.5" cy="3.5" r="1" />
                      <circle cx="4.5" cy="7" r="1" /><circle cx="9.5" cy="7" r="1" />
                      <circle cx="4.5" cy="10.5" r="1" /><circle cx="9.5" cy="10.5" r="1" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1916', marginBottom: 2 }}>{v.title}</div>
                    <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.3 }}>{v.description}</div>
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'DM Mono, monospace', color: v.lp2l !== '—' ? '#2A7D4F' : '#C8D0DC' }}>{v.lp2l}</div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    <button id={`studio-${v.id}`} onClick={e => { e.stopPropagation(); navigate(`/landing-pages/${lpId}/studio/${v.id}`) }} style={pillStyle(true)}>Studio</button>
                    <button id={`clone-${v.id}`} onClick={e => { e.stopPropagation(); showToast('Variant cloned') }} style={pillStyle(false)}>Clone</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </>
  )
}
