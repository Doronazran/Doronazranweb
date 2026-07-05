import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import Logo from './Logo'

const LINK_MAP = {
  // Hebrew services
  'סדנאות': '/services',
  'הרצאות': '/services',
  'ייעוץ': '/contact',
  'כלי AI': '/tools',
  // Hebrew content
  'מאמרים': '/news',
  'אודות': '/about',
  'עבודות': '/work',
  'צור קשר': '/contact',
  // English services
  'Workshops': '/services',
  'Talks': '/services',
  'Consulting': '/contact',
  'AI Tools': '/tools',
  // English content
  'Articles': '/news',
  'About': '/about',
  'Work': '/work',
  'Contact': '/contact',
  // Legal
  'מדיניות פרטיות': '/privacy',
  'תנאי שימוש': '/terms',
  'הצהרת נגישות': '/accessibility',
  'Privacy Policy': '/privacy',
  'Terms of Service': '/terms',
  'Terms of Use': '/terms',
  'Accessibility': '/accessibility',
  'Accessibility Statement': '/accessibility',
}

export default function Footer() {
  const { t, lang } = useLang()
  const f = t.footer

  return (
    <>
      <footer className="footer">
        <div className="footer__container">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <Logo size={38} />
              <span className="footer__logo-text">{lang === 'he' ? 'דורון אזרן' : 'Doron Azran'}</span>
            </Link>
            <p className="footer__tagline">{f.tagline}</p>
          </div>

          <div className="footer__links-group">
            {Object.entries(f.cols).map(([title, links], ci) => (
              <div key={title} className="footer__col">
                <h4 className="footer__col-title">{title}</h4>
                <ul>
                  {links.map((link) => (
                    <li key={link}><Link to={LINK_MAP[link] ?? '/'} className="footer__link">{link}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} {lang === 'he' ? 'דורון אזרן' : 'Doron Azran'}. {f.rights} <Link to="/admin" className="footer__admin-link">· admin</Link></p>
          <div className="footer__socials">
            {f.social?.linkedin && (
              <a href={f.social.linkedin} className="footer__social" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">in</a>
            )}
            {f.social?.twitter && (
              <a href={f.social.twitter} className="footer__social" aria-label="X / Twitter" target="_blank" rel="noopener noreferrer">𝕏</a>
            )}
            {f.social?.instagram && (
              <a href={f.social.instagram} className="footer__social" aria-label="Instagram" target="_blank" rel="noopener noreferrer">◎</a>
            )}
            {!f.social?.linkedin && !f.social?.twitter && !f.social?.instagram && (
              <span className="footer__social-hint">
                {lang === 'he' ? 'הוסף רשתות בלוח הניהול' : 'Add socials in admin panel'}
              </span>
            )}
          </div>
        </div>
      </footer>

      <style>{`
        .footer {
          position: relative;
          z-index: 1;
          background: rgba(5, 6, 13, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          color: var(--ink-muted);
          padding: 80px 56px 120px;
          border-top: 1px solid var(--border);
        }
        .footer__container {
          max-width: 1320px;
          margin: 0 auto;
          display: flex;
          gap: 80px;
          padding-bottom: 56px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }
        .footer__brand { flex: 1; min-width: 220px; }
        .footer__logo { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .footer__logo-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: var(--on-primary);
        }
        .footer__logo-text {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--ink);
        }
        .footer__tagline { font-size: 15px; line-height: 1.6; color: var(--ink-faint); max-width: 280px; }
        .footer__links-group { display: flex; gap: 64px; flex-wrap: wrap; }
        .footer__col-title {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 18px;
        }
        .footer__col ul { display: flex; flex-direction: column; gap: 12px; }
        .footer__link {
          font-size: 14px;
          color: var(--ink-muted);
          transition: color var(--duration-fast) var(--easing);
        }
        .footer__link:hover { color: var(--primary-hover); }
        .footer__bottom {
          max-width: 1320px;
          margin: 0 auto;
          padding: 28px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
          color: var(--ink-faint);
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer__socials { display: flex; gap: 10px; }
        .footer__social {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 1px solid var(--border);
          font-size: 14px;
          font-weight: 600;
          color: var(--ink-muted);
          transition: all var(--duration-base) var(--easing);
        }
        .footer__social:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }
        .footer__social-hint {
          font-size: 11px;
          color: var(--ink-faint);
          opacity: 0.5;
        }
        .footer__admin-link {
          color: rgba(255,255,255,0.12);
          font-size: 11px;
          margin-inline-start: 4px;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer__admin-link:hover { color: rgba(255,255,255,0.35); }
        @media (max-width: 768px) {
          .footer { padding: 56px 24px 0; }
          .footer__container { flex-direction: column; gap: 40px; }
          .footer__links-group { gap: 40px; }
        }
      `}</style>
    </>
  )
}
