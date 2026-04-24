import { useState, useRef, useEffect } from 'react'

export default function NewVariantModal({ defaultTitle, fromLabel, onConfirm, onCancel }) {
  const [title, setTitle] = useState(defaultTitle)
  const inputRef = useRef(null)
  useEffect(() => { inputRef.current?.select() }, [])

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.5)', zIndex: 9100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div style={{ background: '#fff', borderRadius: 12, width: 400, boxShadow: '0 8px 32px rgba(0,0,0,.2)', overflow: 'hidden', animation: 'varModalIn .18s cubic-bezier(.22,1,.36,1)' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E6EC', background: '#EEF2F8' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>New Variant</div>
          {fromLabel && <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Branching from "{fromLabel}"</div>}
        </div>
        <div style={{ padding: '20px' }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Variant Name</label>
          <input
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && title.trim()) onConfirm(title.trim()); if (e.key === 'Escape') onCancel() }}
            style={{ width: '100%', padding: '9px 11px', fontSize: 13, fontFamily: 'var(--font)', border: '1px solid #D1D5DB', borderRadius: 7, outline: 'none', background: '#F9FAFB', color: '#0F172A', boxSizing: 'border-box' }}
          />
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 5 }}>Description can be added later when you publish in Studio.</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
            <button onClick={onCancel} style={{ flex: 1, padding: '8px 0', borderRadius: 7, border: '1px solid #D1D5DB', background: '#fff', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Cancel</button>
            <button
              onClick={() => title.trim() && onConfirm(title.trim())}
              disabled={!title.trim()}
              style={{ flex: 1, padding: '8px 0', borderRadius: 7, border: 'none', background: title.trim() ? 'var(--accent)' : '#E2E6EC', fontSize: 12, fontWeight: 600, color: title.trim() ? '#fff' : '#9CA3AF', cursor: title.trim() ? 'pointer' : 'default', transition: 'background .15s, color .15s' }}
            >
              Create Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
