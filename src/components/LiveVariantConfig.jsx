import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from './Toast'
import { loadLog, saveLog } from './variant-config/constants.jsx'
import PhoneFrame from './variant-config/PhoneFrame'
import HorizontalSplitSlider from './variant-config/HorizontalSplitSlider'
import MiniPhonePreview from './variant-config/MiniPhonePreview'
import VariantPreviewModal from './variant-config/VariantPreviewModal'
import PublishModal from './variant-config/PublishModal'
import NewVariantModal from './variant-config/NewVariantModal'



/* ── main export ─────────────────────────────────────────────── */
export default function LiveVariantConfig({ variants, lpId, onPublish }) {
  const navigate = useNavigate()
  const showToast = useToast()

  const [variantList, setVariantList] = useState(variants)

  const [split, setSplit] = useState(60)
  // seed with v006 in A, v007 in B so the initial view shows both slots filled
  const [slotA, setSlotA] = useState(() => { const v = variants.find(x => x.id === 'v006') ?? variants[0]; return v ? { ...v } : null })
  const [slotB, setSlotB] = useState(() => { const v = variants.find(x => x.id === 'v007'); return v ? { ...v } : null })
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
  const [showNewVariantModal, setShowNewVariantModal] = useState(false)
  const [newVariantBase, setNewVariantBase] = useState(null) // null = scratch | variant obj = from this

  // next version number — max existing ver + 1
  const nextVer = Math.max(...variantList.map(v => v.ver ?? 0)) + 1

  const handleCreateVariant = (title) => {
    const newVariant = {
      id: `draft-${Date.now()}`,
      ver: nextVer,
      title,
      description: '',
      lp2l: '—',
      content: newVariantBase?.content ?? 'mta',
      publisher: 'Dicky',
      pageViews: 0,
      conversions: 0,
    }
    setVariantList(prev => [...prev, newVariant])
    setShowNewVariantModal(false)
    setNewVariantBase(null)
    showToast(`Draft “${title}” created`)
  }

  // snapshot of last-published state — seed to match initial slot state
  const publishedRef = useRef({
    split: 60,
    slotAId: variants.find(x => x.id === 'v006')?.id ?? variants[0]?.id ?? null,
    slotBId: variants.find(x => x.id === 'v007')?.id ?? null,
  })
  const isDirty = (
    split !== publishedRef.current.split ||
    (slotA?.id ?? null) !== publishedRef.current.slotAId ||
    (slotB?.id ?? null) !== publishedRef.current.slotBId
  )

  const assignedIds = [slotA?.id, slotB?.id].filter(Boolean)

  // IDs that WERE live but are no longer in their slot (pending removal)
  const pendingRemovalAId = publishedRef.current.slotAId && (slotA?.id ?? null) !== publishedRef.current.slotAId ? publishedRef.current.slotAId : null
  const pendingRemovalBId = publishedRef.current.slotBId && (slotB?.id ?? null) !== publishedRef.current.slotBId ? publishedRef.current.slotBId : null
  const pendingRemovalIds = [pendingRemovalAId, pendingRemovalBId].filter(Boolean)

  // IDs that are newly assigned to a slot but weren't there on last publish (pending → live)
  const pendingAddAId = slotA && slotA.id !== publishedRef.current.slotAId ? slotA.id : null
  const pendingAddBId = slotB && slotB.id !== publishedRef.current.slotBId ? slotB.id : null

  const handleDrop = (slot, e) => {
    e.preventDefault()
    const v = draggingRef.current
    if (!v) return
    // No-op: dropping back onto the same slot it was published in
    if (slot === 'A' && v.id === publishedRef.current.slotAId) { setDragOverA(false); draggingRef.current = null; return }
    if (slot === 'B' && v.id === publishedRef.current.slotBId) { setDragOverB(false); draggingRef.current = null; return }
    if (slot === 'A') {
      setSlotA(v)
      if (slotB?.id === v.id) setSlotB(null)  // clear from other slot if same variant
      setDragOverA(false)
    } else {
      setSlotB(v)
      if (slotA?.id === v.id) setSlotA(null)  // clear from other slot if same variant
      setDragOverB(false)
    }
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
      {showNewVariantModal && (
        <NewVariantModal
          defaultTitle={newVariantBase ? `Variant #${String(nextVer).padStart(3, '0')} (from ${newVariantBase.title})` : `Variant #${String(nextVer).padStart(3, '0')}`}
          fromLabel={newVariantBase?.title ?? null}
          onConfirm={handleCreateVariant}
          onCancel={() => { setShowNewVariantModal(false); setNewVariantBase(null) }}
        />
      )}
      {previewModalVariant && (() => {
        const v = previewModalVariant
        const isPreviewDraft = !assignedIds.includes(v.id) && (v.pageViews ?? 0) === 0
        return (
          <VariantPreviewModal
            variant={v}
            publishLog={publishLog}
            lpId={lpId}
            isDraft={isPreviewDraft}
            onClose={() => setPreviewModalVariant(null)}
            onCreateNew={() => {
              setPreviewModalVariant(null)
              setNewVariantBase(v)
              setShowNewVariantModal(true)
            }}
            onArchive={() => { setPreviewModalVariant(null); showToast(`“${v.title}” archived`) }}
            onOpenStudio={() => { setPreviewModalVariant(null); navigate(`/landing-pages/${lpId}/studio/${v.id}`) }}
            onDeleteDraft={() => {
              setVariantList(prev => prev.filter(x => x.id !== v.id))
              setPreviewModalVariant(null)
              showToast(`Draft “${v.title}” deleted`)
            }}
            onPublishDraft={() => { setPreviewModalVariant(null); handlePublish() }}
          />
        )
      })()}
      <MiniPhonePreview variant={previewVariant} anchorRect={previewAnchor} />

      {/* two-column — left panel is fixed to phone width, right panel takes remaining space */}
      <div style={{ display: 'grid', gridTemplateColumns: '482px 1fr', gap: 14, alignItems: 'stretch', minWidth: 960 }}>

        {/* ── LEFT: phone config card — fixed width and height ── */}
        <div style={{ width: 482, height: 640, background: '#fff', border: isDirty ? '1px solid var(--accent)' : '1px solid #E2E6EC', borderRadius: 10, overflow: 'hidden', boxShadow: isDirty ? '0 0 0 3px rgba(37,99,235,.1)' : '0 1px 3px rgba(15,23,42,.06)', display: 'flex', flexDirection: 'column', transition: 'border-color .2s, box-shadow .2s' }}>
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

        {/* ── RIGHT: variant panel — same fixed height as left panel, inner scrolls ── */}
        <div style={{ background: '#fff', border: '1px solid #E2E6EC', borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 3px rgba(15,23,42,.06)', display: 'flex', flexDirection: 'column', height: 640 }}>
          {/* panel header */}
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #E2E6EC', background: '#EEF2F8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Variants</span>
              <span style={{ fontSize: 10, fontWeight: 500, color: '#6B7280' }}>hover to preview · drag to place</span>
            </div>
            <button
              id="create-new-variant-btn"
              onClick={() => { setNewVariantBase(null); setShowNewVariantModal(true) }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 6, border: 'none',
                background: 'var(--accent)', color: '#fff',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                transition: 'opacity .12s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10 4v12M4 10h12" /></svg>
              Create New Variant
            </button>
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
                {/* pulsing animation for pending badges */}
                {[...variantList].sort((a, b) => {
                  const wasA = a.id === publishedRef.current.slotAId
                  const wasB = a.id === publishedRef.current.slotBId
                  const wasAb = b.id === publishedRef.current.slotAId
                  const wasBb = b.id === publishedRef.current.slotBId
                  // Tier 0=Draft, 1=Was-published (stable/leaving/swapped), 2=Brand-new entering, 4=Inactive
                  const tierOf = (v, wasSlotA, wasSlotB) => {
                    if (wasSlotA || wasSlotB) return 1                          // was ever live → stays near top
                    const inSlot = v.id === slotA?.id || v.id === slotB?.id
                    if (inSlot) return 2                                         // new entrant
                    if ((v.pageViews ?? 0) === 0) return 0                      // draft
                    return 4                                                     // inactive
                  }
                  const ta = tierOf(a, wasA, wasB), tb = tierOf(b, wasAb, wasBb)
                  if (ta !== tb) return ta - tb
                  return (b.ver ?? 0) - (a.ver ?? 0)
                }).map((v, i) => {
                  const isSlotA = slotA?.id === v.id
                  const isSlotB = slotB?.id === v.id
                  const inSlot = isSlotA || isSlotB
                  const wasSlotA = v.id === publishedRef.current.slotAId
                  const wasSlotB = v.id === publishedRef.current.slotBId

                  // ── Derive the 8 possible states ──────────────────────────
                  const stableA    = wasSlotA && isSlotA                  // committed live in A
                  const stableB    = wasSlotB && isSlotB                  // committed live in B
                  const swappedToB = wasSlotA && isSlotB                  // was A, now dragged to B
                  const swappedToA = wasSlotB && isSlotA                  // was B, now dragged to A
                  const leavingA   = wasSlotA && !isSlotA && !isSlotB    // was A, removed
                  const leavingB   = wasSlotB && !isSlotA && !isSlotB    // was B, removed
                  const enteringA  = !wasSlotA && !wasSlotB && isSlotA   // new to A
                  const enteringB  = !wasSlotA && !wasSlotB && isSlotB   // new to B

                  const isDraft = !inSlot && !wasSlotA && !wasSlotB && (v.pageViews ?? 0) === 0
                  const isPending = swappedToB || swappedToA || leavingA || leavingB || enteringA || enteringB

                  // Stable published variants CAN be dragged (to swap slots or leave)
                  // handleDrop already ignores same-slot drops silently
                  const canDrag = !inSlot || stableA || stableB

                  // ── Status label + style ──────────────────────────────────
                  // Stable: bold filled blue | Leaving: soft red + right arrow | Entering: soft green + left arrow
                  let statusLabel, statusStyle, statusPending = false
                  if (stableA) {
                    statusLabel = '● Position A'
                    statusStyle = { color: '#fff', background: '#2563EB', border: '1px solid #1D4ED8' }
                  } else if (stableB) {
                    statusLabel = '● Position B'
                    statusStyle = { color: '#fff', background: '#1D4ED8', border: '1px solid #1E3A8A' }
                  } else if (swappedToB) {
                    statusLabel = '← Entering B'
                    statusStyle = { color: '#16A34A', background: '#F0FDF4', border: '1px dashed #86EFAC' }
                    statusPending = true
                  } else if (swappedToA) {
                    statusLabel = '← Entering A'
                    statusStyle = { color: '#16A34A', background: '#F0FDF4', border: '1px dashed #86EFAC' }
                    statusPending = true
                  } else if (leavingA) {
                    statusLabel = 'Leaving A →'
                    statusStyle = { color: '#DC2626', background: '#FEF2F2', border: '1px dashed #FCA5A5' }
                    statusPending = true
                  } else if (leavingB) {
                    statusLabel = 'Leaving B →'
                    statusStyle = { color: '#DC2626', background: '#FEF2F2', border: '1px dashed #FCA5A5' }
                    statusPending = true
                  } else if (enteringA) {
                    statusLabel = '← Entering A'
                    statusStyle = { color: '#16A34A', background: '#F0FDF4', border: '1px dashed #86EFAC' }
                    statusPending = true
                  } else if (enteringB) {
                    statusLabel = '← Entering B'
                    statusStyle = { color: '#16A34A', background: '#F0FDF4', border: '1px dashed #86EFAC' }
                    statusPending = true
                  } else if (isDraft) {
                    statusLabel = 'Draft'
                    statusStyle = { color: '#92400E', background: '#FEF3C7', border: '1px solid #FDE68A' }
                  } else {
                    statusLabel = 'Inactive'
                    statusStyle = { color: '#6B7280', background: '#F3F4F6', border: '1px solid #E5E7EB' }
                  }

                  // ── Row tint ──────────────────────────────────────────────
                  const rowBg = stableA    ? '#DBEAFE'
                    : stableB     ? '#DBEAFE'
                    : swappedToB  ? '#DBEAFE'
                    : swappedToA  ? '#DBEAFE'
                    : leavingA    ? '#DBEAFE'
                    : leavingB    ? '#DBEAFE'
                    : enteringA   ? '#EFF6FF'
                    : enteringB   ? '#EFF6FF'
                    : isDraft     ? '#FFFDE7'
                    : i % 2 === 0 ? '#fff' : '#FAFAFA'

                  // ── Left border ───────────────────────────────────────────
                  // Solid bold blue = active; Dashed red = leaving; Dashed soft blue = entering
                  const leftBorder = stableA    ? '3px solid #1D4ED8'
                    : stableB     ? '3px solid #1D4ED8'
                    : swappedToB  ? '3px dashed #93C5FD'
                    : swappedToA  ? '3px dashed #93C5FD'
                    : leavingA    ? '3px dashed #1D4ED8'
                    : leavingB    ? '3px dashed #1D4ED8'
                    : enteringA   ? '3px dashed #93C5FD'
                    : enteringB   ? '3px dashed #93C5FD'
                    : isDraft     ? '3px solid #F59E0B'
                    : '3px solid transparent'

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
                        borderLeft: leftBorder,
                        background: rowBg,
                        cursor: canDrag ? 'grab' : 'default',
                        transition: 'background .1s',
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
                        <span
                           className={statusPending ? 'badge-pending' : undefined}
                           style={{ ...statusStyle, fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '2px 9px', whiteSpace: 'nowrap', display: 'inline-block' }}
                         >
                           {statusLabel}
                         </span>
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
