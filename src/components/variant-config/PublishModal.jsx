import { useState, useRef, useEffect } from 'react'
import { NAME_LIMIT } from './constants'

export default function PublishModal({ onConfirm, onCancel, existingNames }) {
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
    if (isDuplicate) { setNameError('Name already used'); return }
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
          <input ref={nameRef} value={name} maxLength={NAME_LIMIT}
            onChange={e => { setName(e.target.value); setNameError('') }}
            placeholder="e.g. Launch A/B Test v2"
            style={{ ...inputBase, borderColor: isDuplicate ? '#FCA5A5' : '#D1D5DB', background: isDuplicate ? '#FFF5F5' : '#F9FAFB' }}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit() }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            {isDuplicate ? (
              <span style={{ fontSize: 11, color: '#DC2626' }}>⚠ Name already exists</span>
            ) : <span />}
            <span style={{ fontSize: 10, fontWeight: 600, color: counterColor, fontFamily: 'DM Mono, monospace' }}>
              {name.length}/{NAME_LIMIT}
            </span>
          </div>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#374151', display: 'block', marginTop: 14, marginBottom: 5 }}>Description <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></label>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What changed in this publish?" rows={3}
            style={{ ...inputBase, resize: 'vertical', lineHeight: 1.5 }} />
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid #E2E6EC', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onCancel} style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: '1px solid #D1D5DB', background: '#fff', color: '#374151', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={!canSubmit}
            style={{ padding: '7px 16px', fontSize: 12, fontWeight: 600, borderRadius: 6, border: 'none', cursor: canSubmit ? 'pointer' : 'default', background: canSubmit ? 'var(--accent)' : '#E2E6EC', color: canSubmit ? '#fff' : '#94A3B8' }}>
            Publish
          </button>
        </div>
      </div>
    </div>
  )
}
