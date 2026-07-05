// ────────────────────────────────────────────────────────────
// Placeholder imagery. Reliable (Lorem Picsum, never 404s) and
// grayscale so the brand duotone overlay unifies everything.
// Swap these URLs for your own photos later — keep the same keys.
// ────────────────────────────────────────────────────────────
const pic = (seed, w = 1200, h = 900) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`

export const IMAGES = {
  hero: pic('doron-ai-supplychain-hero', 1920, 1280),
  heroPortrait: pic('doron-keynote-stage', 1100, 1400),

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

  portrait: pic('doron-portrait', 1000, 1250),
}
