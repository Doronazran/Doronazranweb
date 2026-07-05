export default function Marquee({ items }) {
  const loop = [...items, ...items, ...items, ...items]

  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {loop.map((item, i) => (
            <span key={i} className="marquee__item">
              {item}
              <span className="marquee__sep">✦</span>
            </span>
          ))}
        </div>
      </div>
      <style>{`
        .marquee {
          overflow: hidden;
          white-space: nowrap;
          padding: 26px 0;
          background: linear-gradient(90deg, #00A47C 0%, #5BCDDA 35%, #8b5cf6 68%, #e056b1 100%);
          background-size: 200% 100%;
          animation: marqueeHue 18s linear infinite;
          border-block: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 0 60px rgba(91,205,218,0.25);
        }
        @keyframes marqueeHue {
          to { background-position: 200% 0; }
        }
        .marquee__track {
          display: inline-flex;
          align-items: center;
          animation: marquee-scroll 32s linear infinite;
        }
        :root[dir="rtl"] .marquee__track {
          animation-direction: reverse;
        }
        .marquee:hover .marquee__track {
          animation-play-state: paused;
        }
        .marquee__item {
          display: inline-flex;
          align-items: center;
          font-family: var(--font-display);
          font-size: clamp(20px, 3vw, 34px);
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #fff;
          text-transform: uppercase;
        }
        .marquee__sep {
          margin: 0 28px;
          font-size: 0.6em;
          color: rgba(255,255,255,0.6);
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee__track { animation: none; }
        }
      `}</style>
    </>
  )
}
