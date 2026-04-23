import { useState } from 'react'
import { useToast } from '../components/Toast'

const mockAssets = [
  { id: 1, title: 'Metafiber Hero Jan', sku: 'MTA', tags: ['hero', 'january'], url: 'https://picsum.photos/seed/1/400/600' },
  { id: 2, title: '3Peptide Testimonial', sku: 'M3P', tags: ['testimonial'], url: 'https://picsum.photos/seed/2/400/300' },
  { id: 3, title: 'Metafiber Product Shot', sku: 'MTA', tags: ['product'], url: 'https://picsum.photos/seed/3/400/500' },
  { id: 4, title: '3Peptide Bundle', sku: 'M3P', tags: ['bundle', 'promo'], url: 'https://picsum.photos/seed/4/400/400' },
  { id: 5, title: 'Metafiber Before After', sku: 'MTA', tags: ['testimonial', 'before-after'], url: 'https://picsum.photos/seed/5/400/560' },
  { id: 6, title: '3Peptide Hero Feb', sku: 'M3P', tags: ['hero', 'february'], url: 'https://picsum.photos/seed/6/400/640' },
  { id: 7, title: 'Metafiber CTA Banner', sku: 'MTA', tags: ['cta'], url: 'https://picsum.photos/seed/7/400/280' },
  { id: 8, title: '3Peptide Social Proof', sku: 'M3P', tags: ['social-proof'], url: 'https://picsum.photos/seed/8/400/420' },
]

const SKU_COLORS = {
  MTA: { bg: '#DBEAFE', color: '#1D4ED8' },
  M3P: { bg: '#DCFCE7', color: '#166534' },
}

function SkuBadge({ sku }) {
  const s = SKU_COLORS[sku] || { bg: '#F1F5F9', color: '#475569' }
  return (
    <span style={{ display: 'inline-block', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: s.bg, color: s.color }}>
      {sku}
    </span>
  )
}

function UploadModal({ onClose, onUpload }) {
  const [title, setTitle] = useState('')
  const [sku, setSku] = useState('')
  const [tags, setTags] = useState('')
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const canSubmit = title.trim() && sku && tags.trim() && file

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, color: '#0F172A', outline: 'none', background: '#FFFFFF', boxSizing: 'border-box' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#FFFFFF', borderRadius: 12, padding: 28, width: 448, boxShadow: '0 20px 48px rgba(15,23,42,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#0F172A' }}>Upload Image</div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', cursor: 'pointer', fontSize: 14, color: '#475569', width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]) }}
          onClick={() => document.getElementById('file-input').click()}
          style={{
            border: `2px dashed ${dragging ? '#0D4A80' : '#CBD5E1'}`,
            borderRadius: 8, padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
            background: dragging ? '#EEF5FF' : '#F8FAFC', marginBottom: 16, transition: 'all 0.15s',
          }}>
          <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => { if (e.target.files[0]) setFile(e.target.files[0]) }} />
          <div style={{ fontSize: 24, marginBottom: 6 }}>🖼️</div>
          <div style={{ fontSize: 13, color: file ? '#0F172A' : '#64748B', fontWeight: file ? 500 : 400 }}>
            {file ? file.name : 'Drop image here or click to browse'}
          </div>
          {!file && <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>PNG, JPG, WebP accepted</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#0F172A', display: 'block', marginBottom: 5 }}>Image Title *</label>
            <input id="upload-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Metafiber Hero Jan" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#0F172A', display: 'block', marginBottom: 5 }}>SKU *</label>
            <select id="upload-sku" value={sku} onChange={e => setSku(e.target.value)}
              style={{ ...inputStyle, color: sku ? '#0F172A' : '#94A3B8', cursor: 'pointer' }}>
              <option value="">Select SKU…</option>
              <option value="MTA">MTA</option>
              <option value="M3P">M3P</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#0F172A', display: 'block', marginBottom: 5 }}>
              Tags * <span style={{ fontWeight: 400, color: '#94A3B8' }}>(comma separated)</span>
            </label>
            <input id="upload-tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. hero, january, product" style={inputStyle} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
          <button id="upload-cancel" onClick={onClose}
            style={{ padding: '8px 16px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 6, fontSize: 13, color: '#475569', cursor: 'pointer' }}>
            Cancel
          </button>
          <button id="upload-submit" disabled={!canSubmit} onClick={onUpload}
            style={{ padding: '8px 20px', background: canSubmit ? '#0D4A80' : '#CBD5E1', color: '#FFF', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'background 0.15s' }}>
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AssetLibrary() {
  const showToast = useToast()
  const [showModal, setShowModal] = useState(false)

  const handleUpload = () => {
    setShowModal(false)
    showToast('Image uploaded successfully')
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', flex: 1, margin: 0, letterSpacing: '-0.3px' }}>Asset Library</h1>
        <button id="upload-btn" onClick={() => setShowModal(true)}
          style={{ padding: '8px 16px', background: '#0D4A80', color: '#FFF', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '0.1px' }}
          onMouseEnter={e => e.currentTarget.style.background = '#0A3D6B'}
          onMouseLeave={e => e.currentTarget.style.background = '#0D4A80'}>
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Upload Image
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {mockAssets.map(asset => (
          <div key={asset.id}
            style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s', boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0D4A80'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(13,74,128,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(15,23,42,0.06)' }}>
            <div style={{ aspectRatio: '1 / 1', overflow: 'hidden', background: '#F1F5F9' }}>
              <img src={asset.url} alt={asset.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            </div>
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#0F172A', marginBottom: 6, lineHeight: 1.4 }}>{asset.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                <SkuBadge sku={asset.sku} />
                {asset.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 10, background: '#F1F5F9', color: '#64748B', padding: '1px 6px', borderRadius: 3 }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && <UploadModal onClose={() => setShowModal(false)} onUpload={handleUpload} />}
    </div>
  )
}
