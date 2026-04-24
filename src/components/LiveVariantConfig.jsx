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

/* ── InfoRow ─────────────────────────────────────────────────── */
function InfoRow({ label, value, bold, mono, green }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: bold ? 700 : 400, color: green ? '#2A7D4F' : '#0F172A', fontFamily: mono ? 'DM Mono, monospace' : 'var(--font)', lineHeight: 1.5 }}>{value}</div>
    </div>
  )
}

/* ── VariantPreviewModal ─────────────────────────────────────── */
function VariantPreviewModal({ variant, publishLog, lpId, onClose, onCreateNew, onArchive }) {
  const scrollRef = useRef(null)
  const imgs = CONTENT[variant.content] || CONTENT.mta

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // close on Escape
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // find most recent publish entry for this variant
  const publishEntry = publishLog.find(e => e.slotA?.id === variant.id || e.slotB?.id === variant.id)
  const publishDate = publishEntry
    ? new Date(publishEntry.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : null
  const lp2l = (variant.pageViews ?? 0) > 0
    ? (((variant.conversions ?? 0) / variant.pageViews) * 100).toFixed(1) + '%'
    : '—'

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9800,
        background: 'rgba(15,23,42,0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 32,
      }}
    >
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', animation: 'varModalIn .22s cubic-bezier(.22,1,.36,1)' }}>

        {/* ── Info Panel (left) ── dark glass, fixed height = phone */}
        <div style={{
          background: 'rgba(10,18,36,0.68)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          width: 300, height: 572,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,.5)',
          marginTop: 24,
        }}>

          {/* ── Header: title + close ── */}
          <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>Variant Details</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{variant.title}</div>
              </div>
              <button
                onClick={onClose}
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '4px 5px', lineHeight: 0, flexShrink: 0 }}
                aria-label="Close"
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M2 2l10 10M12 2L2 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '14px 18px', gap: 14, minHeight: 0 }}>

            {/* Publisher + Publish Date row */}
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>Publisher</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{variant.publisher || 'Dicky'}</div>
              </div>
              {publishDate && (
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>Published</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{publishDate}</div>
                </div>
              )}
            </div>

            {/* Stats row: Views | Conversions | LP2L */}
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
              {[
                { label: 'Page Views', value: (variant.pageViews ?? 0).toLocaleString() },
                { label: 'Conv.', value: (variant.conversions ?? 0).toLocaleString() },
                { label: 'LP2L', value: lp2l, green: lp2l !== '—' },
              ].map((stat, idx, arr) => (
                <div key={stat.label} style={{ flex: 1, padding: '10px 0', textAlign: 'center', borderRight: idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', background: 'rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{stat.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'DM Mono, monospace', color: stat.green ? '#4ADE80' : 'rgba(255,255,255,0.85)' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Description — fills remaining height, scrollable */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>Description</div>
              <div style={{
                flex: 1, minHeight: 0, overflowY: 'auto',
                background: 'rgba(0,0,0,0.2)', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '10px 12px',
                scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent',
              }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
                  {variant.description || 'No description provided.'}
                </div>
              </div>
            </div>

          </div>

          {/* ── Footer: actions ── */}
          <div style={{ padding: '12px 18px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              id={`create-from-${variant.id}`}
              onClick={onCreateNew}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
                background: 'var(--accent)', color: '#fff',
                fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
              Create Variant
            </button>
            <button
              id={`archive-${variant.id}`}
              onClick={onArchive}
              style={{
                flex: 1, padding: '8px 0', borderRadius: 7,
                border: '1px solid rgba(239,68,68,0.4)',
                background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.8)',
                fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                transition: 'background .15s, border-color .15s, color .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.16)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'; e.currentTarget.style.color = '#EF4444' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = 'rgba(239,68,68,0.8)' }}
            >
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 17 6" /><path d="M16 6l-1 12H5L4 6" /><path d="M8 6V4h4v2" /></svg>
              Archive
            </button>
          </div>
        </div>

        {/* ── Phone (right) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>Preview</div>
          <div style={{
            width: 280, height: 572, borderRadius: 38,
            border: '2.5px solid #333',
            background: '#fff', overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,.7)',
            position: 'relative',
          }}>
            {/* notch */}
            <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 80, height: 24, background: '#222', borderRadius: '0 0 14px 14px', zIndex: 10 }} />
            {/* scrollable content */}
            <div ref={scrollRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
              <style>{`@keyframes varModalIn{from{opacity:0;transform:scale(.94) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
              <div style={{ background: '#683b11', height: 56, display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                <img src={LOGO} alt="logo" style={{ height: 28, objectFit: 'contain' }} />
              </div>
              {imgs.map((src, i) => <img key={i} src={src} alt="" style={{ width: '100%', display: 'block' }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── PublishModal ────────────────────────────────────────────── */
const NAME_LIMIT = 40

function PublishModal({ onConfirm, onCancel, existingNames }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [nameError, setNameError] = useState('')
  const nameRef = useRef(null)
  useEffect(() => { nameRef.current?.focus() }, [])

  const isDuplicate = name.trim() && existingNames.includes(name.trim().toLowerCase())
  const canSubmit = name.trim() && !isDuplicate
  const charsLeft = NAME_LIMIT - name.length
  const counterColor = charsLeft <= 0 ? '#DC2626' : charsLeft <= 5 ? '#F59E0B' : '#9CA3AF'

  const handleSubmit = () => {
    if (!name.trim()) return
    if (isDuplicate) { setNameError('This publish name is already used. Please choose a unique name.'); return }
    onConfirm(name.trim(), desc.trim())
  }

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
            value={name}
            maxLength={NAME_LIMIT}
            onChange={e => { setName(e.target.value); setNameError('') }}
            placeholder="e.g. Launch A/B Test v2"
            style={{ ...inputBase, borderColor: isDuplicate ? '#FCA5A5' : charsLeft <= 0 ? '#FCA5A5' : '#D1D5DB', background: isDuplicate ? '#FFF5F5' : '#F9FAFB' }}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            {isDuplicate ? (
              <span style={{ fontSize: 11, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span>⚠</span> Name already exists — use a unique name.
              </span>
            ) : (
              <span />
            )}
            <span style={{ fontSize: 10, fontWeight: 600, color: counterColor, fontFamily: 'DM Mono, monospace', transition: 'color .15s' }}>
              {name.length}/{NAME_LIMIT}
            </span>
          </div>
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
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none', cursor: canSubmit ? 'pointer' : 'default', background: canSubmit ? 'var(--accent)' : '#E2E6EC', color: canSubmit ? '#fff' : '#94A3B8' }}>
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
  const [expandedLogId, setExpandedLogId] = useState(null)
  const [expandedVariantId, setExpandedVariantId] = useState(null)
  const [publishLog, setPublishLog] = useState(() => loadLog(lpId))
  const existingNames = publishLog.map(e => e.name.toLowerCase())

  const [previewModalVariant, setPreviewModalVariant] = useState(null)

  // snapshot of last-published state for dirty detection
  const publishedRef = useRef({ split: 60, slotAId: variants[0]?.id ?? null, slotBId: null })
  const isDirty = (
    split !== publishedRef.current.split ||
    (slotA?.id ?? null) !== publishedRef.current.slotAId ||
    (slotB?.id ?? null) !== publishedRef.current.slotBId
  )

  const assignedIds = [slotA?.id, slotB?.id].filter(Boolean)

  // variants that were live on last publish but have since been removed from their slot
  const pendingRemovalIds = [
    publishedRef.current.slotAId && (slotA?.id ?? null) !== publishedRef.current.slotAId ? publishedRef.current.slotAId : null,
    publishedRef.current.slotBId && (slotB?.id ?? null) !== publishedRef.current.slotBId ? publishedRef.current.slotBId : null,
  ].filter(Boolean)

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
    const ver = publishLog.length + 1
    const entry = {
      id: Date.now(),
      ver,
      name,
      desc,
      timestamp: new Date().toISOString(),
      publisher: 'Dicky',
      split,
      slotA: slotA ? { id: slotA.id, title: slotA.title } : null,
      slotB: slotB ? { id: slotB.id, title: slotB.title } : null,
      pageViews: 0,
      conversions: 0,
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
      {showModal && <PublishModal onConfirm={confirmPublish} onCancel={() => setShowModal(false)} existingNames={existingNames} />}
      {previewModalVariant && (
        <VariantPreviewModal
          variant={previewModalVariant}
          publishLog={publishLog}
          lpId={lpId}
          onClose={() => setPreviewModalVariant(null)}
          onCreateNew={() => { setPreviewModalVariant(null); navigate(`/landing-pages/${lpId}/studio/${previewModalVariant.id}`) }}
          onArchive={() => { setPreviewModalVariant(null); showToast(`"${previewModalVariant.title}" archived`) }}
        />
      )}
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
          {/* panel header */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid #E2E6EC', fontSize: 13, fontWeight: 600, color: '#0F172A', background: '#EEF2F8', flexShrink: 0 }}>
            Variants
            <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 500, color: '#6B7280' }}>hover to preview · drag to place</span>
          </div>

          {/* single table: sticky thead + scrollable tbody */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: 28 }} />
                <col style={{ width: 44 }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 72 }} />
                <col style={{ width: 82 }} />
                <col style={{ width: 82 }} />
                <col style={{ width: 58 }} />
                <col style={{ width: 108 }} />
              </colgroup>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E6EC' }}>
                  {['', 'Ver', 'Variant', 'Publisher', 'Views', 'Conv.', 'LP2L', 'Status'].map(h => (
                    <th key={h} style={{ padding: '7px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94A3B8', position: 'sticky', top: 0, background: '#F8FAFC', zIndex: 1, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...variants].sort((a, b) => (b.ver ?? 0) - (a.ver ?? 0)).map((v, i) => {
                  const isSlotA = slotA?.id === v.id
                  const isSlotB = slotB?.id === v.id
                  const inSlot = isSlotA || isSlotB
                  const isDraft = !inSlot && (v.pageViews ?? 0) === 0
                  const isPendingRemoval = pendingRemovalIds.includes(v.id)
                  const canDrag = !inSlot && !isDraft

                  const statusLabel = isSlotA ? 'Position A' : isSlotB ? 'Position B' : isDraft ? 'Draft' : 'Inactive'
                  const statusStyle = isSlotA
                    ? { color: 'var(--accent)', background: '#EBF4FF', border: '1px solid #BFDBFE' }
                    : isSlotB
                    ? { color: '#475569', background: '#F1F5F9', border: '1px solid #CBD5E1' }
                    : isDraft
                    ? { color: '#92400E', background: '#FEF3C7', border: '1px solid #FDE68A' }
                    : { color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB' }

                  // Row background: highlight in-slot rows; dim pending-removal rows
                  const rowBg = isPendingRemoval
                    ? '#F9FAFB'
                    : isSlotA ? '#EFF6FF'
                    : isSlotB ? '#F8FAFC'
                    : i % 2 === 0 ? '#fff' : '#FAFAFA'

                  const isExpanded = expandedVariantId === v.id
                  const lp2lColor = v.lp2l !== '—' ? '#2A7D4F' : '#C8D0DC'

                  return (
                    <tr
                      key={v.id}
                      id={`row-${v.id}`}
                      draggable={canDrag}
                      onDragStart={e => {
                        if (!canDrag) return
                        draggingRef.current = { ...v }
                        e.dataTransfer.effectAllowed = 'move'
                        setPreviewVariant(null)
                      }}
                      onDragEnd={() => { draggingRef.current = null }}
                      onMouseEnter={e => {
                        if (!canDrag) return
                        e.currentTarget.style.background = '#E6F1FB'
                        setPreviewVariant(v)
                        setPreviewAnchor(e.currentTarget.getBoundingClientRect())
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = rowBg
                        setPreviewVariant(null)
                        setPreviewAnchor(null)
                      }}
                      style={{
                        borderTop: i === 0 ? 'none' : '1px solid #F1F5F9',
                        borderLeft: isSlotA ? '3px solid var(--accent)'
                          : isSlotB ? '3px solid #94A3B8'
                          : isPendingRemoval ? '3px dashed #D1D5DB'
                          : '3px solid transparent',
                        background: rowBg,
                        opacity: isPendingRemoval ? 0.45 : 1,
                        cursor: canDrag ? 'grab' : 'default',
                        transition: 'background .1s, opacity .2s',
                      }}
                    >
                      {/* Drag handle */}
                      <td style={{ padding: '10px 6px 10px 8px', verticalAlign: 'top', paddingTop: 12 }}>
                        <div style={{
                          color: canDrag ? '#94A3B8' : '#D1D5DB',
                          cursor: canDrag ? 'grab' : 'default',
                          display: 'flex', alignItems: 'center',
                        }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <circle cx="4.5" cy="3.5" r="1.2" /><circle cx="9.5" cy="3.5" r="1.2" />
                            <circle cx="4.5" cy="7" r="1.2" /><circle cx="9.5" cy="7" r="1.2" />
                            <circle cx="4.5" cy="10.5" r="1.2" /><circle cx="9.5" cy="10.5" r="1.2" />
                          </svg>
                        </div>
                      </td>

                      {/* Ver */}
                      <td style={{ padding: '10px 8px', fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 11, color: '#0F172A', verticalAlign: 'top', paddingTop: 12 }}>
                        {String(v.ver ?? i + 1).padStart(3, '0')}
                      </td>

                      {/* Variant: title (clickable → preview modal) + description */}
                      <td style={{ padding: '10px 10px' }}>
                        <div
                          onClick={e => { e.stopPropagation(); setPreviewModalVariant(v) }}
                          onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--accent)'
                            e.currentTarget.style.textDecoration = 'underline'
                            e.currentTarget.style.textUnderlineOffset = '3px'
                            e.currentTarget.style.textDecorationThickness = '1.5px'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = '#0F172A'
                            e.currentTarget.style.textDecoration = 'none'
                          }}
                          style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', marginBottom: 3, cursor: 'pointer', display: 'inline-block', transition: 'color .12s' }}
                        >
                          {v.title}
                        </div>
                        {v.description && (
                          <>
                            <div style={{
                              fontSize: 11, color: '#6B7280', lineHeight: 1.45,
                              display: '-webkit-box', WebkitLineClamp: isExpanded ? 'unset' : 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                              {v.description}
                            </div>
                            <button
                              onClick={e => { e.stopPropagation(); setExpandedVariantId(isExpanded ? null : v.id) }}
                              style={{ fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', padding: '2px 0 0', cursor: 'pointer', fontWeight: 600 }}
                            >
                              {isExpanded ? 'Show less ↑' : 'Show more ↓'}
                            </button>
                          </>
                        )}
                      </td>

                      {/* Publisher */}
                      <td style={{ padding: '10px 8px', fontSize: 11, color: '#374151', fontWeight: 500, verticalAlign: 'top', paddingTop: 12, whiteSpace: 'nowrap' }}>
                        {v.publisher || 'Dicky'}
                      </td>

                      {/* Page Views */}
                      <td style={{ padding: '10px 8px', fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#374151', textAlign: 'right', verticalAlign: 'top', paddingTop: 12 }}>
                        {(v.pageViews ?? 0).toLocaleString()}
                      </td>

                      {/* Conversions */}
                      <td style={{ padding: '10px 8px', fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#374151', textAlign: 'right', verticalAlign: 'top', paddingTop: 12 }}>
                        {(v.conversions ?? 0).toLocaleString()}
                      </td>

                      {/* LP2L */}
                      <td style={{ padding: '10px 8px', fontFamily: 'DM Mono, monospace', fontWeight: 700, fontSize: 11, color: lp2lColor, textAlign: 'right', verticalAlign: 'top', paddingTop: 12 }}>
                        {v.lp2l}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '10px 10px', verticalAlign: 'top', paddingTop: 11 }}>
                        {isPendingRemoval ? (
                          <span style={{ fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '2px 9px', whiteSpace: 'nowrap', display: 'inline-block', color: '#9CA3AF', background: '#F3F4F6', border: '1px dashed #D1D5DB' }}>
                            Removing…
                          </span>
                        ) : (
                          <span style={{ ...statusStyle, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '2px 9px', whiteSpace: 'nowrap', display: 'inline-block' }}>
                            {statusLabel}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ── Publish Log table ───────────────────────────── */}
      <div style={{ marginTop: 14, background: '#fff', border: '1px solid #E2E6EC', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,.06)' }}>

        {/* panel header */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #E2E6EC', background: '#EEF2F8', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="14" height="14" rx="2" /><path d="M7 7h6M7 10h6M7 13h4" />
          </svg>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Publish Log</span>
          <span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 2 }}>{publishLog.length} {publishLog.length === 1 ? 'entry' : 'entries'}</span>
        </div>

        {publishLog.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 11, color: '#C8D0DC' }}>No publishes yet — click Publish to create the first entry.</div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: 432 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: 56 }} />
                <col style={{ width: 110 }} />
                <col style={{ width: 'auto' }} />
                <col style={{ width: 200 }} />
                <col style={{ width: 80 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 100 }} />
                <col style={{ width: 64 }} />
                <col style={{ width: 100 }} />
              </colgroup>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E6EC' }}>
                  {['Ver', 'Date', 'Publish Detail', 'Variant', 'Publisher', 'Page Views', 'Conversions', 'LP2L', ''].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#94A3B8', whiteSpace: 'nowrap', position: 'sticky', top: 0, background: '#F8FAFC', zIndex: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {publishLog.map((entry, i) => {
                  const d = new Date(entry.timestamp)
                  const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                  const ver = entry.ver ?? (publishLog.length - i)
                  const lp2l = entry.pageViews > 0 ? ((entry.conversions / entry.pageViews) * 100).toFixed(1) + '%' : '—'
                  return (
                    <tr key={entry.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>

                      {/* Ver */}
                      <td style={{ padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                        {String(ver).padStart(3, '0')}
                      </td>

                      {/* Date */}
                      <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600, color: '#374151' }}>{dateStr}</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>{timeStr}</div>
                      </td>

                      {/* Publish Detail */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: entry.desc ? 2 : 0 }}>{entry.name}</div>
                        {entry.desc && (
                          <>
                            <div style={{
                              fontSize: 11, color: '#6B7280', lineHeight: 1.5,
                              display: '-webkit-box', WebkitLineClamp: expandedLogId === entry.id ? 'unset' : 2,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                              {entry.desc}
                            </div>
                            <button
                              onClick={() => setExpandedLogId(expandedLogId === entry.id ? null : entry.id)}
                              style={{ fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', padding: '2px 0 0', cursor: 'pointer', fontWeight: 600 }}
                            >
                              {expandedLogId === entry.id ? 'Show less ↑' : 'Show more ↓'}
                            </button>
                          </>
                        )}
                      </td>

                      {/* Variant */}
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {entry.slotA && (
                            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--accent)', background: '#EBF4FF', border: '1px solid #BFDBFE', borderRadius: 20, padding: '1px 8px', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                              A·{entry.split}% {entry.slotA.title}
                            </span>
                          )}
                          {entry.slotB && (
                            <span style={{ fontSize: 10, fontWeight: 600, color: '#475569', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 20, padding: '1px 8px', display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                              B·{100 - entry.split}% {entry.slotB.title}
                            </span>
                          )}
                          {!entry.slotB && entry.slotA && (
                            <span style={{ fontSize: 10, color: '#CBD5E1', fontFamily: 'DM Mono, monospace' }}>B —</span>
                          )}
                        </div>
                      </td>

                      {/* Publisher */}
                      <td style={{ padding: '10px 14px', color: '#374151', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {entry.publisher || 'Dicky'}
                      </td>

                      {/* Page Views */}
                      <td style={{ padding: '10px 14px', fontFamily: 'DM Mono, monospace', color: '#374151', textAlign: 'right' }}>
                        {entry.pageViews?.toLocaleString() ?? 0}
                      </td>

                      {/* Conversions */}
                      <td style={{ padding: '10px 14px', fontFamily: 'DM Mono, monospace', color: '#374151', textAlign: 'right' }}>
                        {entry.conversions?.toLocaleString() ?? 0}
                      </td>

                      {/* LP2L */}
                      <td style={{ padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: entry.pageViews > 0 ? '#2A7D4F' : '#C8D0DC', textAlign: 'right' }}>
                        {lp2l}
                      </td>

                      {/* Status — only the newest entry is live */}
                      <td style={{ padding: '10px 14px' }}>
                        {i === 0 && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: '#D1FAE5', border: '1px solid #A7F3D0', borderRadius: 20, padding: '2px 10px', whiteSpace: 'nowrap' }}>Published</span>
                        )}
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </>
  )
}
