import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Page from '../components/Page'
import Seo from '../components/Seo'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import { useLang } from '../i18n/LanguageContext'
import { IMAGES } from '../data/images'

const GRADS = [
  'linear-gradient(135deg, #00A47C, #043a2b)',
  'linear-gradient(135deg, #5BCDDA, #0e3a44)',
  'linear-gradient(135deg, #8b5cf6, #2a0f3a)',
  'linear-gradient(135deg, #e056b1, #3a0f24)',
]

// mode: 'blog' = blog-only (no tabs), 'media' = media-only (no tabs), undefined = both tabs
export default function NewsPage({ defaultTab = 'blog', mode }) {
  const { t } = useLang()
  const n = t.news
  const m = t.media
  const isRtl = t.dir === 'rtl'

  const [tab, setTab] = useState(defaultTab)

  const tabLabel = {
    blog: isRtl ? 'חדשות ותובנות' : 'News & Insights',
    media: isRtl ? 'מדיה ופרסומים' : 'Media Coverage',
  }

  const heroTitle = mode === 'media'
    ? (isRtl ? 'מדיה ופרסומים' : 'Media Coverage')
    : mode === 'blog'
    ? (isRtl ? 'בלוג ותובנות' : 'Blog & Insights')
    : (isRtl ? 'חדשות ועדכונים' : 'News & Updates')

  const seoDesc = mode === 'media'
    ? (isRtl ? 'ראיונות, כתבות ופרסומים בתקשורת על דורון אזרן, AI ושרשרת אספקה.' : 'Interviews, features and press coverage of Doron Azran, AI and supply chain.')
    : (isRtl ? 'מאמרים ותובנות על בינה מלאכותית, שרשרת אספקה, אוטומציה וחדשנות.' : 'Articles and insights on AI, supply chain, automation and innovation.')

  // Blog listing schema — helps search engines and LLMs discover every article.
  const blogJsonLd = mode === 'blog'
    ? {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: heroTitle,
        url: 'https://doronazran.com/blog',
        inLanguage: isRtl ? 'he' : 'en',
        blogPost: (n.items || []).map((it, i) => ({
          '@type': 'BlogPosting',
          headline: it.title,
          description: it.excerpt,
          articleSection: it.tag,
          author: { '@type': 'Person', name: it.author || 'Doron Azran' },
          url: it.sourceUrl && !it.body ? it.sourceUrl : `https://doronazran.com/news/${i}`,
        })),
      }
    : undefined

  return (
    <Page>
      <Seo
        title={heroTitle}
        description={seoDesc}
        path={mode === 'media' ? '/news' : '/blog'}
        jsonLd={blogJsonLd}
        breadcrumbs={[
          { name: isRtl ? 'בית' : 'Home', path: '/' },
          { name: heroTitle, path: mode === 'media' ? '/news' : '/blog' },
        ]}
      />
      <PageHero
        kicker={mode === 'media' ? (isRtl ? 'פרסומים' : 'Press') : mode === 'blog' ? (isRtl ? 'בלוג' : 'Blog') : (isRtl ? 'חדשות' : 'News')}
        title={heroTitle}
        desc={mode === 'media'
          ? (isRtl ? 'ראיונות, כתבות ופרסומים בתקשורת.' : 'Interviews, features and press coverage.')
          : mode === 'blog'
          ? (isRtl ? 'מאמרים, תובנות ורעיונות מהשטח.' : 'Articles, insights and ideas from the field.')
          : (isRtl ? 'חדשות ומדיה.' : 'News and media.')}
        accent="#4f86ff"
      />

      {/* Tab switcher — only shown when no mode is set */}
      {!mode && (
        <div className="news-tabs__wrap">
          <div className="news-tabs">
            {['blog', 'media'].map((key) => (
              <button
                key={key}
                className={`news-tab ${tab === key ? 'news-tab--active' : ''}`}
                onClick={() => setTab(key)}
              >
                {tabLabel[key]}
                {tab === key && (
                  <motion.div className="news-tab__underline" layoutId="news-tab-line" transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'media' ? (
        <motion.div key="media-only" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <MediaSection m={m} isRtl={isRtl} />
        </motion.div>
      ) : mode === 'blog' ? (
        <motion.div key="blog-only" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <BlogSection n={n} isRtl={isRtl} />
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {tab === 'blog' && (
            <motion.div key="blog" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <BlogSection n={n} isRtl={isRtl} />
            </motion.div>
          )}
          {tab === 'media' && (
            <motion.div key="media" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              <MediaSection m={m} isRtl={isRtl} />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <CTA />

      <style>{`
        .news-tabs__wrap {
          max-width: 1320px;
          margin: 0 auto 48px;
          padding: 0 40px;
        }
        .news-tabs {
          display: inline-flex;
          gap: 4px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-pill);
          padding: 6px;
        }
        .news-tab {
          position: relative;
          padding: 12px 28px;
          border-radius: var(--radius-pill);
          border: none;
          background: none;
          color: rgba(255,255,255,0.55);
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: color 0.2s;
        }
        .news-tab--active { color: #fff; }
        .news-tab__underline {
          position: absolute;
          inset: 0;
          border-radius: var(--radius-pill);
          background: rgba(0,128,96,0.25);
          border: 1px solid var(--primary);
          z-index: -1;
        }

        /* ── blog grid ── */
        .news__grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px 80px;
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
        .news-card:hover { transform: translateY(-6px); border-color: rgba(91,205,218,0.5); box-shadow: 0 24px 60px rgba(0,0,0,0.4); }
        .news-card__link { display: block; }
        .news-card__visual { position: relative; height: 230px; overflow: hidden; }
        .news-card__photo { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.7s var(--easing); }
        .news-card:hover .news-card__photo { transform: scale(1.07); }
        .news-card__duotone { position: absolute; inset: 0; mix-blend-mode: color; opacity: 0.8; }
        .news-card__tag { position: absolute; top: 18px; inset-inline-start: 18px; z-index: 2; padding: 6px 14px; font-size: 12px; font-weight: 700; color: #fff; background: rgba(0,0,0,0.35); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.2); border-radius: var(--radius-pill); }
        .news-card__li-badge { position: absolute; top: 18px; inset-inline-end: 18px; z-index: 2; padding: 5px 10px; font-size: 11px; font-weight: 700; color: #fff; background: #0a66c2; border-radius: var(--radius-pill); display: flex; align-items: center; gap: 4px; }
        .news-card__body { padding: 28px; }
        .news-card__top-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .news-card__date { font-size: 13px; color: var(--ink-faint); font-weight: 500; }
        .news-card__author { font-size: 12px; font-weight: 600; color: var(--primary-hover); }
        .news-card__title { font-family: var(--font-display); font-size: 22px; font-weight: 700; line-height: 1.25; color: var(--ink); margin: 10px 0 12px; }
        .news-card__excerpt { font-size: 15px; line-height: 1.7; color: var(--ink-muted); margin-bottom: 20px; }
        .news-card__more { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: var(--neon-cyan); transition: gap var(--duration-fast) var(--easing); }
        .news-card:hover .news-card__more { gap: 12px; }
        :root[dir="rtl"] .news-card__more svg { transform: scaleX(-1); }

        /* ── media grid ── */
        .media__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px 80px;
        }
        .media-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--duration-base) var(--easing);
          display: flex;
          flex-direction: column;
        }
        .media-card:hover { transform: translateY(-4px); border-color: rgba(91,205,218,0.5); box-shadow: 0 20px 50px rgba(0,0,0,0.35); }
        .media-card__image {
          height: 180px;
          background-size: cover;
          background-position: center;
          position: relative;
          flex-shrink: 0;
        }
        .media-card__image-placeholder {
          height: 180px;
          background: linear-gradient(135deg, rgba(0,128,96,0.15), rgba(91,205,218,0.08));
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .media-card__source-logo {
          max-height: 40px;
          max-width: 140px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.6;
        }
        .media-card__source-name {
          font-size: 20px;
          font-weight: 800;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.05em;
        }
        .media-card__body { padding: 22px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .media-card__meta { display: flex; align-items: center; justify-content: space-between; }
        .media-card__src-badge { font-size: 11px; font-weight: 700; color: var(--neon-cyan); text-transform: uppercase; letter-spacing: 0.06em; }
        .media-card__date { font-size: 12px; color: var(--ink-faint); }
        .media-card__title { font-family: var(--font-display); font-size: 17px; font-weight: 700; line-height: 1.3; color: var(--ink); }
        .media-card__excerpt { font-size: 14px; line-height: 1.65; color: var(--ink-muted); flex: 1; }
        .media-card__link {
          display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600;
          color: rgba(255,255,255,0.5); margin-top: auto; padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.07);
          transition: color 0.2s;
        }
        .media-card__link:hover { color: var(--neon-cyan); }
        .media-card--empty {
          border-style: dashed;
          opacity: 0.5;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          font-size: 14px;
          color: var(--ink-faint);
          text-align: center;
          padding: 24px;
        }

        @media (max-width: 1000px) { .media__grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 760px) {
          .news__grid { grid-template-columns: 1fr; padding: 0 24px 60px; }
          .media__grid { grid-template-columns: 1fr; padding: 0 24px 60px; }
          .news-tabs__wrap { padding: 0 24px; }
        }
      `}</style>
    </Page>
  )
}

function BlogSection({ n, isRtl }) {
  return (
    <div className="news__grid">
      {n.items.map((item, i) => {
        const isLinkedIn = item.sourceUrl && item.sourceUrl.includes('linkedin')
        const cardContent = (
          <>
            <div className="news-card__visual">
              <div className="news-card__photo" style={{ backgroundImage: `url(${item.image || IMAGES.news[i % IMAGES.news.length]})` }} />
              <div className="news-card__duotone" style={{ background: GRADS[i % GRADS.length] }} />
              <span className="news-card__tag">{item.tag}</span>
              {isLinkedIn && <span className="news-card__li-badge">in LinkedIn</span>}
            </div>
            <div className="news-card__body">
              <div className="news-card__top-meta">
                <span className="news-card__date">{item.date}</span>
                {item.author && <span className="news-card__author">{item.author}</span>}
              </div>
              <h3 className="news-card__title">{item.title}</h3>
              <p className="news-card__excerpt">{item.excerpt}</p>
              <span className="news-card__more">
                {isLinkedIn ? (isRtl ? 'קרא בלינקדין ↗' : 'Read on LinkedIn ↗') : (n.readMore)}
                {!isLinkedIn && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </span>
            </div>
          </>
        )

        return (
          <Reveal key={i} variant="up" delay={(i % 2) * 0.08} className="news-card magnetic">
            {item.sourceUrl && !item.body ? (
              // LinkedIn-only: external link
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="news-card__link" lang={item.lang || undefined}>
                {cardContent}
              </a>
            ) : (
              // Has local body: internal article page
              <Link to={`/news/${i}`} className="news-card__link" lang={item.lang || undefined}>
                {cardContent}
              </Link>
            )}
          </Reveal>
        )
      })}
    </div>
  )
}

function MediaSection({ m, isRtl }) {
  const items = m?.items || []
  const hasItems = items.some((it) => it.title && it.title !== 'כותרת כתבה לדוגמה' && it.title !== 'Sample Press Article')

  if (!hasItems) {
    return (
      <div className="media__grid">
        <div className="media-card media-card--empty">
          {isRtl
            ? 'כתבות מדיה יופיעו כאן. הוסף אותן דרך לוח הניהול.'
            : 'Media coverage will appear here. Add them via the admin panel.'}
        </div>
      </div>
    )
  }

  return (
    <div className="media__grid">
      {items.map((item, i) => (
        <Reveal key={i} variant="up" delay={(i % 3) * 0.08} className="media-card">
          {item.image ? (
            <div className="media-card__image" style={{ backgroundImage: `url(${item.image})` }} />
          ) : (
            <div className="media-card__image-placeholder">
              {item.sourceLogo ? (
                <img src={item.sourceLogo} alt={item.source} className="media-card__source-logo" />
              ) : (
                <span className="media-card__source-name">{item.source}</span>
              )}
            </div>
          )}
          <div className="media-card__body">
            <div className="media-card__meta">
              <span className="media-card__src-badge">{item.source}</span>
              <span className="media-card__date">{item.date}</span>
            </div>
            <h3 className="media-card__title">{item.title}</h3>
            <p className="media-card__excerpt">{item.excerpt}</p>
            {item.sourceUrl && (
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="media-card__link">
                {isRtl ? 'קרא את הכתבה המלאה ↗' : 'Read full article ↗'}
              </a>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  )
}
