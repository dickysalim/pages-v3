import { useState, useRef, useEffect } from 'react'
import { CONTENT, LOGO } from './constants'

export default function VariantPreviewModal({ variant, publishLog, lpId, isDraft, onClose, onCreateNew, onArchive, onOpenStudio, onDeleteDraft, onPublishDraft }) {
  const scrollRef = useRef(null)
  const imgs = CONTENT[variant.content] || CONTENT.mta
  const [confirmAction, setConfirmAction] = useState(null) // null | 'delete' | 'archive'

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

          {/* ── Footer: actions (draft vs. live) ── */}
          <div style={{ padding: '10px 18px', borderTop: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
            {confirmAction ? (
              /* ── Inline confirm ── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#FCA5A5' }}>
                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3l7 14H3L10 3z" /><path d="M10 9v4" /><circle cx="10" cy="15" r=".5" fill="currentColor" /></svg>
                  {confirmAction === 'delete' ? 'Delete this draft? This cannot be undone.' : 'Archive this variant? This cannot be undone.'}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setConfirmAction(null)}
                    style={{ flex: 1, padding: '7px 0', borderRadius: 7, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { confirmAction === 'delete' ? onDeleteDraft() : onArchive(); setConfirmAction(null) }}
                    style={{ flex: 1, padding: '7px 0', borderRadius: 7, border: 'none', background: '#EF4444', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'opacity .15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {confirmAction === 'delete' ? 'Yes, Delete' : 'Yes, Archive'}
                  </button>
                </div>
              </div>
            ) : isDraft ? (
              /* ── Draft actions: Studio | Publish | Delete ── */
              <div style={{ display: 'flex', gap: 8 }}>
                {/* Studio */}
                <button
                  id={`studio-${variant.id}`}
                  onClick={onOpenStudio}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 7, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'opacity .15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M9 9l6-6M15 3v6M9 3h6" /></svg>
                  Studio
                </button>
                {/* Publish */}
                <button
                  id={`publish-draft-${variant.id}`}
                  onClick={onPublishDraft}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 7, border: 'none', background: '#16A34A', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'opacity .15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5-9 5 9" /><path d="M3 17h14" /></svg>
                  Publish
                </button>
                {/* Delete — rightmost */}
                <button
                  id={`delete-draft-${variant.id}`}
                  onClick={() => setConfirmAction('delete')}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 7, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.8)', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'background .15s, border-color .15s, color .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'; e.currentTarget.style.color = '#EF4444' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = 'rgba(239,68,68,0.8)' }}
                >
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 17 6" /><path d="M16 6l-1 12H5L4 6" /><path d="M8 6V4h4v2" /></svg>
                  Delete
                </button>
              </div>
            ) : (
              /* ── Live variant actions: Create Variant | Archive ── */
              <div style={{ display: 'flex', gap: 8 }}>
                {/* Create Variant */}
                <button
                  id={`create-from-${variant.id}`}
                  onClick={onCreateNew}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 7, border: 'none', background: 'var(--accent)', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'opacity .15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
                  Create Variant
                </button>
                {/* Archive — rightmost, requires confirm */}
                <button
                  id={`archive-${variant.id}`}
                  onClick={() => setConfirmAction('archive')}
                  style={{ flex: 1, padding: '8px 0', borderRadius: 7, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.08)', color: 'rgba(239,68,68,0.8)', fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, transition: 'background .15s, border-color .15s, color .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.16)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'; e.currentTarget.style.color = '#EF4444' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)'; e.currentTarget.style.color = 'rgba(239,68,68,0.8)' }}
                >
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 17 6" /><path d="M16 6l-1 12H5L4 6" /><path d="M8 6V4h4v2" /></svg>
                  Archive
                </button>
              </div>
            )}
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
