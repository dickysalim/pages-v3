import { CONTENT, LOGO } from './constants'

export default function MiniPhonePreview({ variant, anchorRect }) {
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
    </div>
  )
}
