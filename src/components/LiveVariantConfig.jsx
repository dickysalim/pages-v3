import { useState, useRef, useEffect, useCallback } from 'react'
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

/* ── HorizontalSplitSlider ──────────────────────────────────── */
const PRESETS = [[50, 50], [60, 40], [70, 30], [80, 20]]

const inputNumStyle = {
  width: 42, padding: '3px 4px', fontSize: 15, fontWeight: 700,
  fontFamily: 'DM Mono, monospace', color: '#1A1916',
  border: 'none', borderBottom: '2px solid #C8D0DC', borderRadius: 0,
  background: 'transparent', textAlign: 'center', outline: 'none',
  appearance: 'textfield', lineHeight: 1,
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

/* ── localStorage helpers ───────────────────────────────────── */
const logKey = lpId => `publish_log_${lpId}`
const loadLog = lpId => { try { return JSON.parse(localStorage.getItem(logKey(lpId)) || '[]') } catch { return [] } }
const saveLog = (lpId, log) => localStorage.setItem(logKey(lpId), JSON.stringify(log))

/* ── PublishModal ────────────────────────────────────────────── */
function PublishModal({ onConfirm, onCancel }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const nameRef = useRef(null)
  useEffect(() => { nameRef.current?.focus() }, [])

  const inputBase = {
    width: '100%', padding: '8px 10px', fontSize: 13, fontFamily: 'var(--font)',
    border: '1px solid #D1D5DB', borderRadius: 7, outline: 'none',
    background: '#F9FAFB', color: '#0F172A', boxSizing: 'border-box',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.45)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <div style={{ background: '#fff', borderRadius: 12, width: 420, boxShadow: '0 8px 32px rgba(0,0,0,.18)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E6EC', background: '#EEF2F8' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Publish Configuration</div>
          <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Add a name and notes for this publish event</div>
        </div>
        <div style={{ padding: '20px' }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Publish Name <span style={{ color: '#EF4444' }}>*</span></label>
          <input
            ref={nameRef}
            value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. Launch A/B Test v2"
            style={inputBase}
            onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onConfirm(name.trim(), desc.trim()) }}
          />
          <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginTop: 14, marginBottom: 5 }}>Description <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></label>
          <textarea
            value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="What changed in this publish?"
            rows={3}
            style={{ ...inputBase, resize: 'vertical', lineHeight: 1.5 }}
          />
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #E2E6EC', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: '1px solid #D1D5DB', background: '#fff', color: '#374151', cursor: 'pointer' }}>Cancel</button>
          <button
            onClick={() => { if (name.trim()) onConfirm(name.trim(), desc.trim()) }}
            disabled={!name.trim()}
            style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none', cursor: name.trim() ? 'pointer' : 'default', background: name.trim() ? 'var(--accent)' : '#E2E6EC', color: name.trim() ? '#fff' : '#94A3B8' }}>
            Publish
          </button>
        </div>
      </div>
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
  const [showModal, setShowModal] = useState(false)
  const [publishLog, setPublishLog] = useState(() => loadLog(lpId))

  // snapshot of last-published state for dirty detection
  const publishedRef = useRef({ split: 60, slotAId: variants[0]?.id ?? null, slotBId: null })
  const isDirty = (
    split !== publishedRef.current.split ||
    (slotA?.id ?? null) !== publishedRef.current.slotAId ||
    (slotB?.id ?? null) !== publishedRef.current.slotBId
  )

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

  const handlePublish = () => { if (isDirty) setShowModal(true) }

  const confirmPublish = useCallback((name, desc) => {
    const entry = {
      id: Date.now(),
      name,
      desc,
      timestamp: new Date().toISOString(),
      split,
      slotA: slotA ? { id: slotA.id, title: slotA.title } : null,
      slotB: slotB ? { id: slotB.id, title: slotB.title } : null,
    }
    const newLog = [entry, ...publishLog]
    setPublishLog(newLog)
    saveLog(lpId, newLog)
    publishedRef.current = { split, slotAId: slotA?.id ?? null, slotBId: slotB?.id ?? null }
    setShowModal(false)
    onPublish?.()
    showToast('Published ✓')
  }, [split, slotA, slotB, publishLog, lpId, onPublish, showToast])

  return (
    <>
      {showModal && <PublishModal onConfirm={confirmPublish} onCancel={() => setShowModal(false)} />}
      <MiniPhonePreview variant={previewVariant} anchorRect={previewAnchor} />

      {/* two-column — left panel is fixed to phone width, right panel takes remaining space */}
      <div style={{ display: 'grid', gridTemplateColumns: '482px 1fr', gap: 14, alignItems: 'stretch', minWidth: 960 }}>

        {/* ── LEFT: phone config card — fixed width to match 2 phones ── */}
        <div style={{ width: 482, background: '#fff', border: isDirty ? '1px solid var(--accent)' : '1px solid #E2E6EC', borderRadius: 10, overflow: 'hidden', boxShadow: isDirty ? '0 0 0 3px rgba(37,99,235,.1)' : '0 1px 3px rgba(15,23,42,.06)', display: 'flex', flexDirection: 'column', transition: 'border-color .2s, box-shadow .2s' }}>
          {/* header */}
          <div style={{ padding: '12px 16px', borderBottom: isDirty ? '1px solid #BFDBFE' : '1px solid #E2E6EC', fontSize: 13, fontWeight: 600, color: '#0F172A', background: isDirty ? '#EFF6FF' : '#EEF2F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, transition: 'background .2s, border-color .2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Live Variant Configuration</span>
              {isDirty && (
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', background: '#DBEAFE', border: '1px solid #BFDBFE', borderRadius: 20, padding: '2px 8px', letterSpacing: '0.04em' }}>
                  Unsaved changes
                </span>
              )}
            </div>
            <button id="publish-btn"
              onClick={handlePublish}
              disabled={!isDirty}
              style={{
                padding: '6px 16px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                cursor: isDirty ? 'pointer' : 'default', border: 'none',
                background: isDirty ? 'var(--accent)' : '#E2E6EC',
                color: isDirty ? '#fff' : '#94A3B8',
                transition: 'background .2s, color .2s',
              }}>
              Publish
            </button>
          </div>

          <div style={{ padding: '16px 45px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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

            {/* horizontal split slider — constrained to phone area width */}
            <div style={{ width: 392, alignSelf: 'center' }}>
              <HorizontalSplitSlider split={split} onChange={setSplit} />
            </div>


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

      {/* ── Publish Log panel ───────────────────────────── */}
      <div style={{ marginTop: 14, background: '#fff', border: '1px solid #E2E6EC', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,.06)' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #E2E6EC', background: '#EEF2F8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="14" height="14" rx="2" /><path d="M7 7h6M7 10h6M7 13h4" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Publish Log</span>
          <span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 2 }}>{publishLog.length} {publishLog.length === 1 ? 'entry' : 'entries'}</span>
        </div>

        {publishLog.length === 0 ? (
          <div style={{ padding: '20px 16px', textAlign: 'center', fontSize: 11, color: '#C8D0DC' }}>No publishes yet</div>
        ) : (
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {publishLog.map((entry, i) => {
              const d = new Date(entry.timestamp)
              const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
              const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
              return (
                <div key={entry.id} style={{
                  display: 'grid', gridTemplateColumns: '140px 1fr auto',
                  padding: '10px 16px', gap: 12, alignItems: 'start',
                  borderTop: i === 0 ? 'none' : '1px solid #F1F5F9',
                  background: i % 2 === 0 ? '#fff' : '#FAFAFA',
                }}>
                  {/* timestamp */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>{dateStr}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{timeStr}</div>
                  </div>
                  {/* name + desc */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{entry.name}</div>
                    {entry.desc && <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2, lineHeight: 1.4 }}>{entry.desc}</div>}
                    <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap' }}>
                      {entry.slotA && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', background: '#EBF4FF', border: '1px solid #BFDBFE', borderRadius: 20, padding: '1px 7px' }}>A: {entry.slotA.title}</span>}
                      {entry.slotB && <span style={{ fontSize: 10, fontWeight: 600, color: '#475569', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 20, padding: '1px 7px' }}>B: {entry.slotB.title}</span>}
                      <span style={{ fontSize: 10, color: '#94A3B8', background: '#F8FAFC', border: '1px solid #E2E6EC', borderRadius: 20, padding: '1px 7px', fontFamily: 'DM Mono, monospace' }}>Split {entry.split}/{100 - entry.split}</span>
                    </div>
                  </div>
                  {/* status badge */}
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 20, padding: '2px 8px', whiteSpace: 'nowrap' }}>Published</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </>
  )
}
