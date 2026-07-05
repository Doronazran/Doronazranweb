import { useState } from 'react'
import { useLang } from '../i18n/LanguageContext'

// Renders the brand mark. If an admin has set a logo image (media.logo, e.g.
// /logo.png dropped into /public), it shows that; otherwise it falls back to a
// clean microchip mark in the brand box — matching the chip motif of the logo.
export default function Logo({ size = 40 }) {
  const { media } = useLang()
  // Try the admin-set logo first, then the bundled SVG stand-in, then the
  // chip mark. De-duped so we never retry the same src.
  const chain = [media.logo, '/logo.svg'].filter((s, i, a) => s && a.indexOf(s) === i)
  const [idx, setIdx] = useState(0)

  if (idx < chain.length) {
    return (
      <img
        src={chain[idx]}
        alt="Doron Azran"
        onError={() => setIdx((i) => i + 1)}
        style={{ height: size, width: 'auto', maxWidth: size * 2.6, objectFit: 'contain', display: 'block' }}
      />
    )
  }

  return (
    <span
      className="logo-mark"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.22,
        background: 'var(--primary)',
        color: '#fff',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="7" y="7" width="10" height="10" rx="1.6" />
        <rect x="10.4" y="10.4" width="3.2" height="3.2" rx="0.6" />
        <path d="M10 4v3M14 4v3M10 17v3M14 17v3M4 10h3M4 14h3M17 10h3M17 14h3" />
      </svg>
    </span>
  )
}
