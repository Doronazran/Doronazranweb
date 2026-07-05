import { useLang } from '../i18n/LanguageContext'

export default function ClientsMarquee() {
  const { t } = useLang()
  const data = t.clients
  if (!data || !data.items?.length) return null

  // duplicate enough times for a seamless loop
  const loop = [...data.items, ...data.items, ...data.items]

  return (
    <>
      <section className="clients">
        {data.label && <p className="clients__label">{data.label}</p>}
        <div className="clients__track-wrap">
          <div className="clients__track">
            {loop.map((c, i) => (
              <div key={i} className="clients__item" title={c.name}>
                {c.logo ? (
                  <img className="clients__logo" src={c.logo} alt={c.name} />
                ) : (
                  <span className="clients__wordmark">{c.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .clients {
          position: relative;
          z-index: 1;
          padding: 44px 0;
          border-block: 1px solid var(--border);
          background: rgba(7, 9, 16, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          overflow: hidden;
        }
        .clients__label {
          text-align: center;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--ink-faint);
          margin-bottom: 28px;
        }
        .clients__track-wrap {
          position: relative;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        }
        .clients__track {
          display: flex;
          align-items: center;
          gap: 72px;
          width: max-content;
          animation: clientsScroll 38s linear infinite;
        }
        :root[dir="rtl"] .clients__track { animation-direction: reverse; }
        .clients:hover .clients__track { animation-play-state: paused; }
        .clients__item {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 148px;
          height: 44px;
          flex-shrink: 0;
          opacity: 0.55;
          /* Force every logo to pure white regardless of original colors */
          filter: brightness(0) invert(1);
          transition: opacity var(--duration-base) var(--easing);
        }
        .clients__item:hover { opacity: 1; }
        .clients__logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }
        .clients__wordmark {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #fff;
          white-space: nowrap;
        }
        @keyframes clientsScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .clients__track { animation: none; flex-wrap: wrap; justify-content: center; }
        }
        @media (max-width: 640px) {
          .clients__track { gap: 48px; }
          .clients__wordmark { font-size: 22px; }
        }
      `}</style>
    </>
  )
}
