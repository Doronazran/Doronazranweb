import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'
import { IMAGES } from '../data/images'

const GRADS = [
  'linear-gradient(135deg, #00A47C, #043a2b)',
  'linear-gradient(135deg, #5BCDDA, #0e3a44)',
  'linear-gradient(135deg, #8b5cf6, #2a0f3a)',
  'linear-gradient(135deg, #e056b1, #3a0f24)',
]

export default function NewsGrid() {
  const { t } = useLang()
  const n = t.news

  return (
    <>
      <section className="section news">
        <div className="section__inner">
          <div className="news__grid">
            {n.items.map((item, i) => (
              <Reveal key={item.title} variant="up" delay={(i % 2) * 0.08} className="news-card magnetic">
                <Link to={`/news/${i}`} className="news-card__link">
                  <div className="news-card__visual">
                    <div className="news-card__photo" style={{ backgroundImage: `url(${item.image || IMAGES.news[i % IMAGES.news.length]})` }} />
                    <div className="news-card__duotone" style={{ background: GRADS[i % GRADS.length] }} />
                    <span className="news-card__tag">{item.tag}</span>
                    <div className="news-card__shine" />
                  </div>
                  <div className="news-card__body">
                    <span className="news-card__date">{item.date}</span>
                    <h3 className="news-card__title">{item.title}</h3>
                    <p className="news-card__excerpt">{item.excerpt}</p>
                    <span className="news-card__more">
                      {n.readMore}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .news__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
        }
        .news-card {
          border-radius: var(--radius-xl);
          overflow: hidden;
          background: var(--surface);
          backdrop-filter: blur(14px) saturate(1.3);
          -webkit-backdrop-filter: blur(14px) saturate(1.3);
          border: 1px solid var(--border);
          transition: transform var(--duration-base) var(--easing),
            border-color var(--duration-base) var(--easing),
            box-shadow var(--duration-base) var(--easing);
        }
        .news-card:hover {
          transform: translateY(-6px);
          border-color: rgba(91,205,218,0.5);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 50px rgba(91,205,218,0.12);
        }
        .news-card__link { display: block; }
        .news-card__visual {
          position: relative;
          height: 230px;
          overflow: hidden;
        }
        .news-card__photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.7s var(--easing);
        }
        .news-card:hover .news-card__photo { transform: scale(1.07); }
        .news-card__duotone {
          position: absolute;
          inset: 0;
          mix-blend-mode: color;
          opacity: 0.8;
        }
        .news-card__tag {
          position: absolute;
          top: 18px;
          inset-inline-start: 18px;
          z-index: 2;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: var(--radius-pill);
        }
        .news-card__shine {
          position: absolute;
          top: -50%;
          inset-inline-start: -60%;
          width: 50%;
          height: 200%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.22), transparent);
          transform: rotate(8deg);
          animation: newsShine 7s ease-in-out infinite;
        }
        @keyframes newsShine {
          0% { inset-inline-start: -60%; }
          55%, 100% { inset-inline-start: 160%; }
        }
        .news-card__body { padding: 28px; }
        .news-card__date {
          font-size: 13px;
          color: var(--ink-faint);
          font-weight: 500;
        }
        .news-card__title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          line-height: 1.25;
          color: var(--ink);
          margin: 10px 0 12px;
        }
        .news-card__excerpt {
          font-size: 15px;
          line-height: 1.7;
          color: var(--ink-muted);
          margin-bottom: 20px;
        }
        .news-card__more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
          color: var(--neon-cyan);
          transition: gap var(--duration-fast) var(--easing);
        }
        .news-card:hover .news-card__more { gap: 12px; }
        :root[dir="rtl"] .news-card__more svg { transform: scaleX(-1); }
        @media (prefers-reduced-motion: reduce) {
          .news-card__shine { animation: none; opacity: 0; }
        }
        @media (max-width: 760px) {
          .news__grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}
