import { useParams, Link, Navigate } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { IMAGES } from '../data/images'
import Page from '../components/Page'
import Seo from '../components/Seo'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'

const GRADIENTS = [
  'linear-gradient(135deg, #00A47C 0%, #043a2b 100%)',
  'linear-gradient(135deg, #5BCDDA 0%, #0e3a44 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #2a0f3a 100%)',
  'linear-gradient(135deg, #e056b1 0%, #3a0f24 100%)',
]

export default function WorkProject() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const idx = Number(id)
  const items = t.work?.items || []
  const project = items[idx]

  if (!project) return <Navigate to="/work" replace />

  const photo = project.image || IMAGES.work[idx % IMAGES.work.length]
  const backLabel = lang === 'he' ? '← עבודות' : '← Work'

  return (
    <Page>
      <Seo
        title={project.name}
        description={`${project.metric ? project.metric + ' · ' : ''}${project.cat || ''}`.trim() || project.name}
        path={`/work/${idx}`}
        image={photo}
        type="article"
        breadcrumbs={[
          { name: lang === 'he' ? 'בית' : 'Home', path: '/' },
          { name: lang === 'he' ? 'עבודות' : 'Work', path: '/work' },
          { name: project.name, path: `/work/${idx}` },
        ]}
      />
      <article className="project">
        <div className="project__hero" style={{ backgroundImage: `url(${photo})` }}>
          <div className="project__hero-grad" style={{ background: GRADIENTS[idx % GRADIENTS.length] }} />
          <div className="project__hero-vignette" />
          <div className="project__hero-inner">
            <Link to="/work" className="project__back">{backLabel}</Link>
            <span className="project__cat">{project.cat}</span>
            <h1 className="project__title">{project.name}</h1>
            <div className="project__metric-badge">{project.metric}</div>
          </div>
        </div>

        {(project.client || project.industry) && (
          <div className="project__meta-bar">
            {project.client && (
              <div className="project__meta-item">
                <span className="project__meta-label">{lang === 'he' ? 'לקוח' : 'Client'}</span>
                <span className="project__meta-value">{project.client}</span>
              </div>
            )}
            {project.industry && (
              <div className="project__meta-item">
                <span className="project__meta-label">{lang === 'he' ? 'תחום' : 'Industry'}</span>
                <span className="project__meta-value">{project.industry}</span>
              </div>
            )}
            <div className="project__meta-item">
              <span className="project__meta-label">{lang === 'he' ? 'תוצאה' : 'Result'}</span>
              <span className="project__meta-value project__meta-value--metric">{project.metric}</span>
            </div>
          </div>
        )}

        <div className="project__body-wrap">
          {project.body
            ? project.body.split('\n').map((para, i) =>
                para.trim() ? <p key={i} className="project__para">{para}</p> : null
              )
            : (
              <p className="project__para project__placeholder">
                {lang === 'he'
                  ? 'תיאור הפרויקט יתעדכן בקרוב. ניתן לערוך מלוח הניהול.'
                  : 'Project description coming soon. Edit via the admin panel.'}
              </p>
            )}
        </div>

        <div className="project__nav">
          {items[idx - 1] && (
            <Link to={`/work/${idx - 1}`} className="project__nav-link project__nav-link--prev">
              ‹ {items[idx - 1].name}
            </Link>
          )}
          {items[idx + 1] && (
            <Link to={`/work/${idx + 1}`} className="project__nav-link project__nav-link--next">
              {items[idx + 1].name} ›
            </Link>
          )}
        </div>
      </article>

      <Testimonials />
      <CTA />

      <style>{`
        .project {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }
        .project__hero {
          position: relative;
          height: clamp(300px, 42vw, 520px);
          background-size: cover;
          background-position: center;
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-top: 140px;
          margin-bottom: 56px;
        }
        .project__hero-grad {
          position: absolute;
          inset: 0;
          mix-blend-mode: color;
          opacity: 0.8;
        }
        .project__hero-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 20%, rgba(5,6,13,0.8) 100%);
        }
        .project__hero-inner {
          position: absolute;
          inset: 0;
          padding: 36px 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 12px;
        }
        .project__back {
          position: absolute;
          top: 28px;
          inset-inline-start: 40px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          transition: color 0.2s;
        }
        .project__back:hover { color: #fff; }
        .project__cat {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }
        .project__title {
          font-family: var(--font-display);
          font-size: clamp(30px, 5vw, 58px);
          font-weight: 900;
          line-height: 1.05;
          color: #fff;
          letter-spacing: -0.03em;
        }
        .project__metric-badge {
          display: inline-block;
          padding: 8px 20px;
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: var(--radius-pill);
          width: max-content;
        }
        .project__meta-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 40px;
          padding: 24px 28px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
        }
        .project__meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 120px;
        }
        .project__meta-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-faint);
        }
        .project__meta-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink);
        }
        .project__meta-value--metric {
          color: var(--primary-hover);
          font-size: 17px;
        }
        .project__body-wrap {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }
        .project__para {
          font-size: 18px;
          line-height: 1.85;
          color: var(--ink-muted);
        }
        .project__placeholder {
          color: var(--ink-faint);
          font-style: italic;
        }
        .project__nav {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 72px;
          padding-top: 32px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .project__nav-link {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink-muted);
          max-width: 45%;
          transition: color 0.2s;
        }
        .project__nav-link:hover { color: var(--primary-hover); }
        .project__nav-link--next { text-align: end; margin-inline-start: auto; }
        @media (max-width: 600px) {
          .project__hero { margin-top: 120px; }
          .project__hero-inner { padding: 20px 24px; }
          .project__back { top: 16px; inset-inline-start: 24px; }
        }
      `}</style>
    </Page>
  )
}
