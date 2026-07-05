import { useParams, Link, Navigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { IMAGES } from '../data/images'
import Seo from '../components/Seo'
import CTA from '../components/CTA'
import Testimonials from '../components/Testimonials'
import Stats from '../components/Stats'

export default function ServiceDetail() {
  const { id } = useParams()
  const { t } = useLang()
  const items = t.services?.items || []
  const idx = parseInt(id, 10)
  const service = items[idx]
  const isRtl = t.dir === 'rtl'

  if (!service) return <Navigate to="/services" replace />

  const prev = idx > 0 ? idx - 1 : null
  const next = idx < items.length - 1 ? idx + 1 : null
  const heroImg = service.image || IMAGES.work[idx % IMAGES.work.length]

  const bodyParagraphs = service.body
    ? service.body.split('\n').filter(Boolean)
    : []

  const bookLabel = isRtl ? 'קבעו פגישה' : 'Book a Meeting'
  const audienceLabel = isRtl ? 'קהל יעד' : 'Audience'
  const durationLabel = isRtl ? 'משך' : 'Duration'
  const featuresLabel = isRtl ? 'מה כולל השירות' : 'What is included'
  const ctaLabel = isRtl ? 'מעוניינים?' : 'Interested?'
  const ctaSubLabel = isRtl ? 'שלחו פנייה ואחזור אליכם בהקדם.' : "Send an inquiry and I'll get back to you shortly."

  return (
    <>
      <Seo
        title={service.title}
        description={service.short || service.desc}
        path={`/services/${idx}`}
        type="article"
        breadcrumbs={[
          { name: isRtl ? 'בית' : 'Home', path: '/' },
          { name: isRtl ? 'שירותים' : 'Services', path: '/services' },
          { name: service.title, path: `/services/${idx}` },
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.title,
          description: service.desc,
          serviceType: service.title,
          provider: { '@type': 'Person', name: 'Doron Azran', url: 'https://doronazran.com/' },
          areaServed: { '@type': 'Country', name: 'Israel' },
          url: `https://doronazran.com/services/${idx}`,
        }}
      />
      <article className="svc-detail">
        {/* hero */}
        <div className="svc-detail__hero" style={{ backgroundImage: `url(${heroImg})` }}>
          <div className="svc-detail__hero-overlay" />
          <div className="svc-detail__hero-inner">
            <Link to="/services" className="svc-detail__back">
              {isRtl ? '→' : '←'} {t.nav?.services || 'שירותים'}
            </Link>
            <span className="svc-detail__num">{service.num}</span>
            <h1 className="svc-detail__title">{service.title}</h1>
            <p className="svc-detail__desc">{service.desc}</p>
          </div>
        </div>

        {/* meta row */}
        {(service.audience || service.duration) && (
          <div className="svc-detail__meta-bar">
            {service.audience && (
              <div className="svc-detail__meta-item">
                <span className="svc-detail__meta-label">{audienceLabel}</span>
                <span className="svc-detail__meta-val">{service.audience}</span>
              </div>
            )}
            {service.duration && (
              <div className="svc-detail__meta-item">
                <span className="svc-detail__meta-label">{durationLabel}</span>
                <span className="svc-detail__meta-val">{service.duration}</span>
              </div>
            )}
          </div>
        )}

        {/* main content grid */}
        <div className="svc-detail__content">
          {/* left: body text */}
          <div className="svc-detail__body">
            {bodyParagraphs.length > 0 ? (
              bodyParagraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="svc-detail__placeholder">
                {isRtl
                  ? 'תוכן מפורט לשירות זה יופיע כאן. ניתן לעדכן אותו דרך לוח הניהול.'
                  : 'Detailed content for this service will appear here. Update it via the admin panel.'}
              </p>
            )}
          </div>

          {/* right: features + CTA card */}
          <aside className="svc-detail__sidebar">
            {service.features && service.features.length > 0 && (
              <div className="svc-detail__features">
                <h3 className="svc-detail__features-title">{featuresLabel}</h3>
                <ul className="svc-detail__features-list">
                  {service.features.map((f, i) => (
                    <li key={i} className="svc-detail__feature-item">
                      <svg className="svc-detail__check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Book CTA card */}
            <div className="svc-detail__book-card">
              <p className="svc-detail__book-label">{ctaLabel}</p>
              <p className="svc-detail__book-sub">{ctaSubLabel}</p>
              <Link
                to={`/contact${service.inquiry ? `?inquiry=${service.inquiry}` : ''}`}
                className="svc-detail__book-btn"
              >
                {bookLabel}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </aside>
        </div>

        {/* prev / next */}
        <nav className="svc-detail__nav">
          {prev !== null ? (
            <Link to={`/services/${prev}`} className="svc-detail__nav-btn">
              {isRtl ? '→' : '←'} {items[prev]?.title}
            </Link>
          ) : <span />}
          {next !== null ? (
            <Link to={`/services/${next}`} className="svc-detail__nav-btn">
              {items[next]?.title} {isRtl ? '←' : '→'}
            </Link>
          ) : <span />}
        </nav>
      </article>

      <Stats />
      <Testimonials />
      <CTA />

      <style>{`
        .svc-detail { padding-top: 80px; }
        .svc-detail__hero {
          position: relative; min-height: 460px; display: flex; align-items: flex-end;
          background-size: cover; background-position: center;
        }
        .svc-detail__hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(7,9,15,0.97) 30%, rgba(7,9,15,0.55) 70%, rgba(7,9,15,0.3));
        }
        .svc-detail__hero-inner {
          position: relative; max-width: 960px; margin: 0 auto; padding: 56px 40px;
          display: flex; flex-direction: column; gap: 14px; width: 100%;
        }
        .svc-detail__back {
          display: inline-flex; align-items: center; gap: 6px; font-size: 14px;
          color: var(--neon-cyan); font-weight: 600; margin-bottom: 8px;
        }
        .svc-detail__back:hover { color: #fff; }
        .svc-detail__num {
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700;
          color: var(--primary-hover); letter-spacing: 0.08em;
        }
        .svc-detail__title {
          font-family: var(--font-display); font-size: clamp(28px, 5vw, 48px);
          font-weight: 800; color: #fff; line-height: 1.15;
        }
        .svc-detail__desc {
          font-size: 18px; line-height: 1.65; color: rgba(255,255,255,0.75); max-width: 640px;
        }

        .svc-detail__meta-bar {
          display: flex; gap: 0; max-width: 960px; margin: 0 auto;
          padding: 0 40px; border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .svc-detail__meta-item {
          display: flex; flex-direction: column; gap: 4px;
          padding: 24px 48px 24px 0;
          border-inline-end: 1px solid rgba(255,255,255,0.07);
          margin-inline-end: 48px;
        }
        .svc-detail__meta-item:last-child { border-inline-end: none; }
        .svc-detail__meta-label {
          font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--neon-cyan);
        }
        .svc-detail__meta-val { font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.85); }

        .svc-detail__content {
          display: grid; grid-template-columns: 1fr 340px; gap: 60px;
          max-width: 960px; margin: 0 auto; padding: 60px 40px; align-items: start;
        }
        .svc-detail__body {
          font-size: 17px; line-height: 1.8; color: rgba(255,255,255,0.78);
          display: flex; flex-direction: column; gap: 24px;
        }
        .svc-detail__placeholder { color: rgba(255,255,255,0.4); font-style: italic; }

        .svc-detail__sidebar { display: flex; flex-direction: column; gap: 20px; }

        .svc-detail__features {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-lg); padding: 28px;
        }
        .svc-detail__features-title {
          font-family: var(--font-display); font-size: 16px; font-weight: 700;
          color: #fff; margin-bottom: 18px;
        }
        .svc-detail__features-list {
          list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px;
        }
        .svc-detail__feature-item {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 14px; line-height: 1.55; color: rgba(255,255,255,0.78);
        }
        .svc-detail__check { color: var(--primary-hover); flex-shrink: 0; margin-top: 2px; }

        .svc-detail__book-card {
          background: linear-gradient(135deg, rgba(0,128,96,0.18), rgba(91,205,218,0.08));
          border: 1px solid rgba(0,128,96,0.35);
          border-radius: var(--radius-lg); padding: 28px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .svc-detail__book-label {
          font-family: var(--font-display); font-size: 20px; font-weight: 800; color: #fff;
        }
        .svc-detail__book-sub { font-size: 14px; line-height: 1.55; color: rgba(255,255,255,0.6); }
        .svc-detail__book-btn {
          display: inline-flex; align-items: center; gap: 8px; margin-top: 10px;
          padding: 13px 24px; font-size: 15px; font-weight: 600;
          color: var(--on-primary); background: var(--primary);
          border-radius: var(--radius-pill); transition: all 0.2s ease; align-self: flex-start;
        }
        .svc-detail__book-btn:hover {
          background: var(--primary-hover); transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,128,96,0.4);
        }
        :root[dir="rtl"] .svc-detail__book-btn svg { transform: scaleX(-1); }

        .svc-detail__nav {
          max-width: 960px; margin: 0 auto; padding: 32px 40px 80px;
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .svc-detail__nav-btn {
          display: inline-flex; align-items: center; gap: 8px; font-size: 15px;
          font-weight: 600; color: rgba(255,255,255,0.6); padding: 12px 20px;
          border-radius: var(--radius-pill); border: 1px solid rgba(255,255,255,0.12);
          transition: all 0.2s ease;
        }
        .svc-detail__nav-btn:hover { color: #fff; background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.25); }

        @media (max-width: 760px) {
          .svc-detail__hero-inner { padding: 40px 24px; }
          .svc-detail__meta-bar { padding: 0 24px; flex-direction: column; }
          .svc-detail__meta-item { padding: 16px 0; border-inline-end: none; border-bottom: 1px solid rgba(255,255,255,0.07); margin: 0; }
          .svc-detail__content { grid-template-columns: 1fr; padding: 40px 24px; gap: 40px; }
          .svc-detail__nav { padding: 24px 24px 60px; flex-direction: column; gap: 12px; }
        }
      `}</style>
    </>
  )
}
