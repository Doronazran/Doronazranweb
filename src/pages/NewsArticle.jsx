import { useParams, Link, Navigate, useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { IMAGES } from '../data/images'
import Page from '../components/Page'
import Seo from '../components/Seo'
import CTA from '../components/CTA'

const GRADS = [
  'linear-gradient(135deg, #00A47C, #043a2b)',
  'linear-gradient(135deg, #5BCDDA, #0e3a44)',
  'linear-gradient(135deg, #8b5cf6, #2a0f3a)',
  'linear-gradient(135deg, #e056b1, #3a0f24)',
]

export default function NewsArticle() {
  const { id } = useParams()
  const { t, lang } = useLang()
  const location = useLocation()
  const idx = Number(id)
  const items = t.news?.items || []
  const article = items[idx]

  if (!article) return <Navigate to="/blog" replace />

  const photo = article.image || IMAGES.news[idx % IMAGES.news.length]
  const fromBlog = location.state?.from === 'blog'
  const backLabel = lang === 'he' ? '← בלוג' : '← Blog'

  return (
    <Page>
      <Seo
        title={article.title}
        description={article.excerpt}
        path={`/news/${idx}`}
        image={photo}
        type="article"
        breadcrumbs={[
          { name: lang === 'he' ? 'בית' : 'Home', path: '/' },
          { name: lang === 'he' ? 'בלוג' : 'Blog', path: '/blog' },
          { name: article.title, path: `/news/${idx}` },
        ]}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.title,
          description: article.excerpt,
          articleSection: article.tag,
          author: { '@type': 'Person', name: article.author || 'Doron Azran' },
          publisher: { '@type': 'Person', name: 'Doron Azran', url: 'https://doronazran.com/' },
          inLanguage: article.lang || lang,
          mainEntityOfPage: `https://doronazran.com/news/${idx}`,
        }}
      />
      <article className="article">
        <div className="article__hero" style={{ backgroundImage: `url(${photo})` }}>
          <div className="article__hero-grad" style={{ background: GRADS[idx % GRADS.length] }} />
          <div className="article__hero-vignette" />
          <div className="article__hero-inner">
            <Link to="/blog" className="article__back">{backLabel}</Link>
            <span className="article__tag">{article.tag}</span>
            <h1 className="article__title">{article.title}</h1>
            <div className="article__meta">
              <span className="article__date">{article.date}</span>
              {article.author && (
                <span className="article__author-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  {article.author}
                  {article.authorRole && <span className="article__author-role"> · {article.authorRole}</span>}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="article__body-wrap" lang={article.lang || undefined}>
          <p className="article__excerpt">{article.excerpt}</p>
          {article.body
            ? article.body.split('\n').map((para, i) =>
                para.trim() ? <p key={i} className="article__para">{para}</p> : null
              )
            : (
              <p className="article__para article__placeholder">
                {lang === 'he'
                  ? 'תוכן המאמר יתעדכן בקרוב. ניתן לערוך מלוח הניהול.'
                  : 'Full article content coming soon. Edit via the admin panel.'}
              </p>
            )}
          {article.sourceUrl && (
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="article__source-link">
              {lang === 'he' ? '↗ קרא את המאמר המקורי ב-LinkedIn' : '↗ Read original article on LinkedIn'}
            </a>
          )}
        </div>

        <div className="article__nav">
          {items[idx - 1] && (
            <Link to={`/news/${idx - 1}`} className="article__nav-link article__nav-link--prev">
              ‹ {items[idx - 1].title}
            </Link>
          )}
          {items[idx + 1] && (
            <Link to={`/news/${idx + 1}`} className="article__nav-link article__nav-link--next">
              {items[idx + 1].title} ›
            </Link>
          )}
        </div>
      </article>

      <CTA />

      <style>{`
        .article {
          max-width: 840px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }
        .article__hero {
          position: relative;
          height: clamp(280px, 40vw, 480px);
          background-size: cover;
          background-position: center;
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-top: 140px;
          margin-bottom: 48px;
        }
        .article__hero-grad {
          position: absolute;
          inset: 0;
          mix-blend-mode: color;
          opacity: 0.8;
        }
        .article__hero-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 20%, rgba(5,6,13,0.75) 100%);
        }
        .article__hero-inner {
          position: absolute;
          inset: 0;
          padding: 32px 36px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 10px;
        }
        .article__back {
          position: absolute;
          top: 24px;
          inset-inline-start: 36px;
          font-size: 14px;
          font-weight: 600;
          color: rgba(255,255,255,0.8);
          transition: color 0.2s;
        }
        .article__back:hover { color: #fff; }
        .article__tag {
          display: inline-block;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: var(--radius-pill);
          width: max-content;
        }
        .article__title {
          font-family: var(--font-display);
          font-size: clamp(24px, 4vw, 42px);
          font-weight: 900;
          line-height: 1.1;
          color: #fff;
          letter-spacing: -0.02em;
        }
        .article__meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .article__date {
          font-size: 13px;
          color: rgba(255,255,255,0.65);
        }
        .article__author-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 4px 12px;
          border-radius: var(--radius-pill);
          width: max-content;
        }
        .article__author-role {
          color: rgba(255,255,255,0.55);
          font-weight: 400;
        }
        .article__body-wrap {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .article__excerpt {
          font-size: 20px;
          line-height: 1.7;
          color: var(--ink);
          font-weight: 500;
          border-inline-start: 3px solid var(--primary);
          padding-inline-start: 20px;
          margin-bottom: 8px;
        }
        .article__para {
          font-size: 17px;
          line-height: 1.85;
          color: var(--ink-muted);
        }
        .article__placeholder {
          color: var(--ink-faint);
          font-style: italic;
        }
        .article__source-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 12px 22px;
          background: #0a66c2;
          color: #fff;
          border-radius: var(--radius-pill);
          font-size: 14px;
          font-weight: 600;
          transition: opacity 0.2s;
        }
        .article__source-link:hover { opacity: 0.85; }
        .article__nav {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: 64px;
          padding-top: 32px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .article__nav-link {
          font-size: 15px;
          font-weight: 600;
          color: var(--ink-muted);
          max-width: 45%;
          transition: color 0.2s;
        }
        .article__nav-link:hover { color: var(--primary-hover); }
        .article__nav-link--next { text-align: end; margin-inline-start: auto; }
        @media (max-width: 600px) {
          .article__hero { margin-top: 120px; }
          .article__hero-inner { padding: 20px; }
          .article__back { top: 16px; inset-inline-start: 20px; }
        }
      `}</style>
    </Page>
  )
}
