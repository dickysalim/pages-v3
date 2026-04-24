/* ── Mock Data ───────────────────────────────────────────────
   Single source of truth for all demo/mock data.
   When real API integration happens, swap this one file.
   ──────────────────────────────────────────────────────────── */

export const mockLPs = [
  { id: 'owt32', title: 'Metafiber Main Sales Letter', url: '/routing-system-test', sku: 'MTA', lp2l: 8.4, trend: 'up' },
  { id: 'bx9m2', title: 'Metafiber Promo Ramadan', url: '/metafiber-promo', sku: 'MTA', lp2l: 6.1, trend: 'down' },
  { id: 'cz7k8', title: '3Peptide Main Sales Letter', url: '/3peptide-main', sku: 'M3P', lp2l: 11.2, trend: 'up' },
  { id: 'dq4p1', title: '3Peptide Bundle Offer', url: '/3peptide-bundle', sku: 'M3P', lp2l: 9.7, trend: 'up' },
  { id: 'ex5r3', title: 'Metafiber Cold Traffic', url: '/metafiber-cold', sku: 'MTA', lp2l: 4.3, trend: 'down' },
  { id: 'fy6s9', title: '3Peptide Retargeting', url: '/3peptide-retarget', sku: 'M3P', lp2l: 14.1, trend: 'up' },
]

// Derived lookup for PageDetail breadcrumb/title
export const LP_TITLES = Object.fromEntries(mockLPs.map(lp => [lp.id, lp.title]))

export const mockVariants = [
  // Inactive — oldest variants
  { id: 'v001', ver: 1, title: 'Pricing First', description: 'Moving pricing above fold to increase purchase intent and reduce drop-off on first scroll. Hypothesis: visitors who see price early self-qualify faster.', lp2l: '5.2%', content: 'mta', publisher: 'Dicky', pageViews: 3820, conversions: 199 },
  { id: 'v002', ver: 2, title: 'Social Proof Heavy', description: 'Leading with testimonials and trust signals before introducing the product and price. Builds credibility upfront.', lp2l: '6.1%', content: 'fallback', publisher: 'Dicky', pageViews: 4100, conversions: 250 },
  { id: 'v003', ver: 3, title: 'Benefit Led', description: 'Opening with key product benefits before price reveal to frame value first. Works best with warm traffic.', lp2l: '7.8%', content: 'mta', publisher: 'Dicky', pageViews: 2980, conversions: 232 },
  { id: 'v004', ver: 4, title: 'Urgency + Scarcity', description: 'Countdown timer and low-stock messaging above fold. Designed for retargeting audiences already familiar with the product.', lp2l: '9.2%', content: 'fallback', publisher: 'Dicky', pageViews: 5640, conversions: 519 },
  { id: 'v005', ver: 5, title: 'Video Hero', description: 'Auto-playing muted video loop replacing the static hero image. Strong for cold traffic as it provides product context without requiring reading.', lp2l: '8.4%', content: 'mta', publisher: 'Dicky', pageViews: 3210, conversions: 269 },
  // Live variants (slotA and slotB initial)
  { id: 'v006', ver: 6, title: 'Minimalist CTA', description: 'Stripped-down layout focusing attention on a single CTA with minimal distractions. Proven to increase click-through on first scroll.', lp2l: '11.3%', content: 'fallback', publisher: 'Dicky', pageViews: 6720, conversions: 759 },
  { id: 'v007', ver: 7, title: 'Before & After', description: 'Side-by-side comparison of results before and after using the product. High trust-building format for skeptical audiences.', lp2l: '10.1%', content: 'mta', publisher: 'Dicky', pageViews: 4890, conversions: 494 },
  // Draft — newest, never published
  { id: 'v008', ver: 8, title: 'Community Led', description: '', lp2l: '—', content: 'fallback', publisher: 'Dicky', pageViews: 0, conversions: 0 },
]

export const mockBlocks = [
  { id: 'block003', title: 'Product Pitch Long — MTA', sku: 'MTA', useCount: 12 },
  { id: 'block004', title: 'Product Pitch Long — M3P', sku: 'M3P', useCount: 8 },
]

export const mockAssets = [
  { id: 1, title: 'Metafiber Hero Jan', sku: 'MTA', tags: ['hero', 'january'], url: 'https://picsum.photos/seed/1/400/600' },
  { id: 2, title: '3Peptide Testimonial', sku: 'M3P', tags: ['testimonial'], url: 'https://picsum.photos/seed/2/400/300' },
  { id: 3, title: 'Metafiber Product Shot', sku: 'MTA', tags: ['product'], url: 'https://picsum.photos/seed/3/400/500' },
  { id: 4, title: '3Peptide Bundle', sku: 'M3P', tags: ['bundle', 'promo'], url: 'https://picsum.photos/seed/4/400/400' },
  { id: 5, title: 'Metafiber Before After', sku: 'MTA', tags: ['testimonial', 'before-after'], url: 'https://picsum.photos/seed/5/400/560' },
  { id: 6, title: '3Peptide Hero Feb', sku: 'M3P', tags: ['hero', 'february'], url: 'https://picsum.photos/seed/6/400/640' },
  { id: 7, title: 'Metafiber CTA Banner', sku: 'MTA', tags: ['cta'], url: 'https://picsum.photos/seed/7/400/280' },
  { id: 8, title: '3Peptide Social Proof', sku: 'M3P', tags: ['social-proof'], url: 'https://picsum.photos/seed/8/400/420' },
]
