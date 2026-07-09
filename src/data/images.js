// ────────────────────────────────────────────────────────────
// Placeholder imagery. Reliable (Lorem Picsum, never 404s) and
// grayscale so the brand duotone overlay unifies everything.
// Swap these URLs for your own photos later — keep the same keys.
// ────────────────────────────────────────────────────────────
const pic = (seed, w = 1200, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`

export const IMAGES = {
  hero: pic('doron-ai-supplychain-hero', 1920, 1280),
  // Branded placeholder (not a stock stranger). Swap for a real photo via admin.
  heroPortrait: '/portrait-placeholder.svg',

  services: [
    pic('svc-ai-workshop'),
    pic('svc-keynote'),
    pic('svc-strategy'),
    pic('svc-supplychain'),
    pic('svc-tools'),
    pic('svc-consulting'),
  ],

  work: [
    pic('work-robert-ai', 1200, 800),
    pic('work-contract', 1200, 800),
    pic('work-cost', 1200, 800),
    pic('work-shipment', 1200, 800),
  ],

  news: [
    pic('news-supplychain-2026', 1200, 800),
    pic('news-automation', 1200, 800),
    pic('news-deploy-ai', 1200, 800),
    pic('news-leadership', 1200, 800),
  ],

  portrait: '/portrait-placeholder.svg',

  // Distinct atmospheric background per inner page (heavily overlaid).
  pageHero: {
    services: pic('page-ai-services-tech', 1920, 900),
    work: pic('page-results-data', 1920, 900),
    about: pic('page-about-story', 1920, 900),
    tools: pic('page-ai-toolbox', 1920, 900),
    news: pic('page-media-press', 1920, 900),
    contact: pic('page-contact-connect', 1920, 900),
  },
}
