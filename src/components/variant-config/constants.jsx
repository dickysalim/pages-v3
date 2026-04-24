/* ── Variant Config Constants & Helpers ───────────────────── */

export const CONTENT = {
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

export const LOGO = 'https://mganik-assets.pages.dev/img/mh5ow3xakq4lpfmge8dk.webp'

export const PRESETS = [[50, 50], [60, 40], [70, 30], [80, 20]]

export const NAME_LIMIT = 40

/* ── localStorage helpers ─────────────────────────────────── */
const logKey = lpId => `publish_log_${lpId}`
export const loadLog = lpId => { try { return JSON.parse(localStorage.getItem(logKey(lpId)) || '[]') } catch { return [] } }
export const saveLog = (lpId, log) => localStorage.setItem(logKey(lpId), JSON.stringify(log))

/* ── Reusable style helpers ───────────────────────────────── */
export function btnStyle(v) {
  const base = { flex: 1, fontFamily: 'var(--font)', fontSize: 11, padding: '6px 0', borderRadius: 6, cursor: 'pointer', textAlign: 'center', transition: 'all .15s', border: 'none' }
  return v === 'primary'
    ? { ...base, background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' }
    : { ...base, background: '#fff', color: '#6B7280', border: '1px solid #C8D0DC' }
}

export function pillStyle(accent) {
  const base = { fontSize: 11, padding: '4px 8px', borderRadius: 20, border: '1px solid #C8D0DC', background: '#fff', color: '#6B7280', cursor: 'pointer', fontFamily: 'var(--font)' }
  return accent ? { ...base, background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' } : base
}

export const inputNumStyle = {
  width: 42, padding: '3px 4px', fontSize: 15, fontWeight: 700,
  fontFamily: 'DM Mono, monospace', color: '#1A1916',
  border: 'none', borderBottom: '2px solid #C8D0DC', borderRadius: 0,
  background: 'transparent', textAlign: 'center', outline: 'none',
  appearance: 'textfield', lineHeight: 1,
}

/* ── InfoRow ──────────────────────────────────────────────── */
export function InfoRow({ label, value, bold, mono, green }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: bold ? 700 : 400, color: green ? '#2A7D4F' : '#0F172A', fontFamily: mono ? 'DM Mono, monospace' : 'var(--font)', lineHeight: 1.5 }}>{value}</div>
    </div>
  )
}
