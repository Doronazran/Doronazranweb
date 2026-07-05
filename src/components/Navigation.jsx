import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import Logo from './Logo'

const MEGA_ROUTES = {
  'ייעוץ AI': '/services/0', 'אסטרטגיה דיגיטלית': '/services/1',
  'מפת דרכים': '/services/2', 'ניהול שינוי': '/services/3',
  'סדנאות AI': '/services/4', 'הרצאות': '/services/5',
  'קורסים': '/services/6', 'הכשרת צוותים': '/services/7',
  'כלי AI מותאמים': '/services/8', 'אוטומציה': '/services/9',
  'ניתוח נתונים': '/services/10', 'אינטגרציות': '/services/11',
  'AI Consulting': '/services/0', 'Digital Strategy': '/services/1',
  'Roadmapping': '/services/2', 'Change Management': '/services/3',
  'AI Workshops': '/services/4', 'Keynote Talks': '/services/5',
  'Courses': '/services/6', 'Team Enablement': '/services/7',
  'Custom AI Tools': '/services/8', 'Automation': '/services/9',
  'Data Analytics': '/services/10', 'Integrations': '/services/11',
}

const ABOUT_LINKS_HE = [
  { label: 'אודותינו', sub: 'איך הכל התחיל', to: '/about/overview' },
  { label: 'חזון', sub: 'לאן אנחנו הולכים', to: '/about/vision' },
  { label: 'הצוות', sub: 'האנשים שמאחורי העבודה', to: '/about/team' },
  { label: 'תכירו את דורון אזרן', sub: 'הסיפור האישי', to: '/about/doron' },
]
const ABOUT_LINKS_EN = [
  { label: 'About Us', sub: 'How it all started', to: '/about/overview' },
  { label: 'Vision', sub: 'Where we are headed', to: '/about/vision' },
  { label: 'The Team', sub: 'The people behind the work', to: '/about/team' },
  { label: 'Meet Doron Azran', sub: 'The personal story', to: '/about/doron' },
]

export default function Navigation() {
  const { t, lang, toggle } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const megaTimer = useRef(null)
  const aboutTimer = useRef(null)
  const { pathname } = useLocation()

  const isRtl = t.dir === 'rtl'
  const aboutLinks = isRtl ? ABOUT_LINKS_HE : ABOUT_LINKS_EN

  const links = [
    { label: t.nav.news, to: '/news' },
    { label: t.nav.blog || (isRtl ? 'בלוג' : 'Blog'), to: '/blog' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => { setMenuOpen(false); setMegaOpen(false); setAboutOpen(false) }, [pathname])

  const openMega = () => { clearTimeout(megaTimer.current); setMegaOpen(true) }
  const closeMega = () => { megaTimer.current = setTimeout(() => setMegaOpen(false), 120) }
  const openAbout = () => { clearTimeout(aboutTimer.current); setAboutOpen(true) }
  const closeAbout = () => { aboutTimer.current = setTimeout(() => setAboutOpen(false), 120) }

  const LangToggle = ({ className = '' }) => (
    <button className={`lang-toggle ${className}`} onClick={toggle}
      aria-label={lang === 'he' ? 'Switch to English' : 'עבור לעברית'}>
      <span className={lang === 'he' ? 'lang-toggle__active' : ''}>עב</span>
      <span className="lang-toggle__divider" />
      <span className={lang === 'en' ? 'lang-toggle__active' : ''}>EN</span>
    </button>
  )

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <Link to="/" className="nav__logo magnetic">
            <Logo size={40} />
            <span className="nav__logo-text">{lang === 'he' ? 'דורון אזרן' : 'Doron Azran'}</span>
          </Link>

          <ul className="nav__links">
            {/* Services mega */}
            <li className="nav__has-mega" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <NavLink to="/services" className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
                {t.nav.services}
                <svg className="nav__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </NavLink>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    className="mega"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={openMega} onMouseLeave={closeMega}
                  >
                    <div className="mega__inner">
                      <div className="mega__groups">
                        {t.mega.groups.map((g) => (
                          <div key={g.heading} className="mega__group">
                            <h4 className="mega__heading">{g.heading}</h4>
                            <ul>
                              {g.items.map((item) => (
                                <li key={item}>
                                  <Link to={MEGA_ROUTES[item] ?? '/services'} className="mega__item">{item}</Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <Link to="/services" className="mega__cta">
                        {t.mega.cta}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* About mega */}
            <li className="nav__has-mega" onMouseEnter={openAbout} onMouseLeave={closeAbout}>
              <NavLink to="/about" className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
                {t.nav.about}
                <svg className="nav__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </NavLink>

              <AnimatePresence>
                {aboutOpen && (
                  <motion.div
                    className="mega mega--about"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    onMouseEnter={openAbout} onMouseLeave={closeAbout}
                  >
                    <div className="mega__inner mega__inner--about">
                      {aboutLinks.map((link) => (
                        <Link key={link.to} to={link.to} className="about-mega__item">
                          <span className="about-mega__label">{link.label}</span>
                          <span className="about-mega__sub">{link.sub}</span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Work + Media + Blog */}
            <li>
              <NavLink to="/work" className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
                {t.nav.work}
              </NavLink>
            </li>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => `nav__link ${isActive ? 'nav__link--active' : ''}`}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav__right">
            <LangToggle />
            <Link to="/contact" className="nav__cta magnetic">{t.nav.cta}</Link>
          </div>

          <button className={`nav__burger ${menuOpen ? 'nav__burger--open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu" aria-expanded={menuOpen}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu" onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="mobile-menu__panel" onClick={(e) => e.stopPropagation()}
              initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
              <ul>
                <li><NavLink to="/services" className="mobile-menu__link">{t.nav.services}</NavLink></li>
                <li>
                  <div className="mobile-menu__group-label">{t.nav.about}</div>
                  <ul className="mobile-menu__sub">
                    {aboutLinks.map((l) => (
                      <li key={l.to}>
                        <NavLink to={l.to} className="mobile-menu__sub-link">{l.label}</NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li><NavLink to="/work" className="mobile-menu__link">{t.nav.work}</NavLink></li>
                {links.map((link) => (
                  <li key={link.to}><NavLink to={link.to} className="mobile-menu__link">{link.label}</NavLink></li>
                ))}
              </ul>
              <div className="mobile-menu__footer">
                <LangToggle className="lang-toggle--mobile" />
                <Link to="/contact" className="mobile-menu__cta">{t.nav.cta}</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav { position: fixed; top: 0; inset-inline: 0; z-index: 1000; padding: 16px 32px;
          transition: padding var(--duration-base) var(--easing); }
        .nav--scrolled { padding: 10px 32px; }
        .nav__inner { max-width: 1320px; margin: 0 auto; display: flex; align-items: center; gap: 24px;
          padding: 12px 24px; border-radius: var(--radius-pill); background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px) saturate(1.5); -webkit-backdrop-filter: blur(20px) saturate(1.5);
          border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          transition: all var(--duration-base) var(--easing); }
        .nav--scrolled .nav__inner { background: rgba(8,9,16,0.75); border-color: rgba(255,255,255,0.08); }
        .nav__logo { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 17px; color: #fff; flex-shrink: 0; }
        .nav__links { display: flex; gap: 2px; margin-inline-start: auto; }
        .nav__has-mega { position: relative; }
        .nav__link { display: inline-flex; align-items: center; gap: 5px; padding: 8px 16px; font-size: 15px;
          font-weight: 500; color: rgba(255,255,255,0.75); border-radius: var(--radius-md);
          transition: all var(--duration-fast) var(--easing); }
        .nav__link:hover, .nav__link--active { color: #fff; background: rgba(255,255,255,0.08); }
        .nav__chev { opacity: 0.7; transition: transform var(--duration-base) var(--easing); }
        .nav__has-mega:hover .nav__chev { transform: rotate(180deg); }
        .nav__right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .nav__cta { padding: 10px 22px; font-size: 15px; font-weight: 600; color: var(--on-primary);
          background: var(--primary); border-radius: var(--radius-pill); transition: all var(--duration-base) var(--easing); }
        .nav__cta:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,128,96,0.45); }

        /* Services mega */
        .mega { position: absolute; top: calc(100% + 14px); left: 50%; right: auto;
          width: 720px; max-width: calc(100vw - 32px); z-index: 1001; }
        :root[dir="rtl"] .mega { left: auto; right: 50%; }
        .mega__inner { background: rgba(12,14,24,0.92); backdrop-filter: blur(28px) saturate(1.4);
          -webkit-backdrop-filter: blur(28px) saturate(1.4); border: 1px solid rgba(255,255,255,0.12);
          border-radius: var(--radius-lg); padding: 28px; box-shadow: 0 30px 80px rgba(0,0,0,0.55);
          display: flex; flex-direction: column; gap: 22px; }
        .mega__groups { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .mega__heading { font-family: var(--font-display); font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--neon-cyan); margin-bottom: 14px; }
        .mega__group ul { display: flex; flex-direction: column; gap: 4px; }
        .mega__item { display: block; padding: 8px 10px; margin: 0 -10px; font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.8); border-radius: var(--radius-sm); transition: all var(--duration-fast) var(--easing); }
        .mega__item:hover { color: #fff; background: rgba(255,255,255,0.07); transform: translateX(var(--shift, 4px)); }
        :root[dir="rtl"] .mega__item:hover { --shift: -4px; }
        .mega__cta { display: inline-flex; align-items: center; gap: 8px; align-self: flex-start; padding: 12px 24px;
          font-size: 14px; font-weight: 600; color: var(--on-primary); background: var(--primary);
          border-radius: var(--radius-pill); transition: all var(--duration-base) var(--easing); }
        .mega__cta:hover { background: var(--primary-hover); }
        :root[dir="rtl"] .mega__cta svg { transform: scaleX(-1); }

        /* About mega */
        .mega--about { width: 340px; }
        :root[dir="rtl"] .mega--about { right: 50%; left: auto; }
        .mega__inner--about {
          display: flex; flex-direction: column; gap: 4px; padding: 16px;
        }
        .about-mega__item {
          display: flex; flex-direction: column; gap: 3px;
          padding: 14px 16px; border-radius: var(--radius-md);
          transition: background 0.18s ease;
        }
        .about-mega__item:hover { background: rgba(255,255,255,0.07); }
        .about-mega__label {
          font-size: 15px; font-weight: 600; color: rgba(255,255,255,0.9);
        }
        .about-mega__sub {
          font-size: 12px; color: rgba(255,255,255,0.4);
        }

        .lang-toggle { display: inline-flex; align-items: center; gap: 8px; padding: 7px 14px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: var(--radius-pill);
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.45);
          transition: all var(--duration-fast) var(--easing); }
        .lang-toggle:hover { border-color: rgba(255,255,255,0.25); }
        .lang-toggle__active { color: #fff; }
        .lang-toggle__divider { width: 1px; height: 12px; background: rgba(255,255,255,0.2); }

        .nav__burger { display: none; flex-direction: column; gap: 5px; background: none; border: none; padding: 8px;
          margin-inline-start: auto; z-index: 1100; }
        .nav__burger span { display: block; width: 24px; height: 2px; background: #fff; border-radius: 2px;
          transition: all var(--duration-base) var(--easing); }
        .nav__burger--open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .nav__burger--open span:nth-child(2) { opacity: 0; }
        .nav__burger--open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        @media (max-width: 960px) {
          .nav { padding: 12px 16px; }
          .nav--scrolled { padding: 8px 16px; }
          .nav__inner { padding: 10px 18px; }
          .nav__links, .nav__right { display: none; }
          .nav__burger { display: flex; }
        }

        .mobile-menu { position: fixed; inset: 0; z-index: 1900; background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
        .mobile-menu__panel { position: absolute; top: 80px; inset-inline: 16px; background: rgba(12,12,18,0.97);
          backdrop-filter: blur(32px); -webkit-backdrop-filter: blur(32px); border: 1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-xl); padding: 24px; overflow-y: auto; max-height: calc(100vh - 120px); }
        .mobile-menu__panel ul { display: flex; flex-direction: column; gap: 4px; }
        .mobile-menu__link { display: block; padding: 14px 16px; font-size: 18px; font-weight: 500;
          color: rgba(255,255,255,0.85); border-radius: var(--radius-md); }
        .mobile-menu__link:hover, .mobile-menu__link.active { background: rgba(255,255,255,0.08); color: #fff; }
        .mobile-menu__group-label {
          display: block; padding: 14px 16px 6px; font-size: 13px; font-weight: 700;
          color: var(--neon-cyan); letter-spacing: 0.06em; text-transform: uppercase;
        }
        .mobile-menu__sub { padding-inline-start: 8px; margin-bottom: 8px; }
        .mobile-menu__sub-link {
          display: block; padding: 10px 16px; font-size: 16px; font-weight: 500;
          color: rgba(255,255,255,0.7); border-radius: var(--radius-md);
        }
        .mobile-menu__sub-link:hover, .mobile-menu__sub-link.active { background: rgba(255,255,255,0.06); color: #fff; }
        .mobile-menu__footer { display: flex; align-items: center; gap: 12px; margin-top: 20px; }
        .mobile-menu__cta { flex: 1; text-align: center; padding: 14px; font-size: 16px; font-weight: 600;
          color: var(--on-primary); background: var(--primary); border-radius: var(--radius-pill); }

        @media (max-width: 760px) {
          .mega { width: calc(100vw - 32px); }
          .mega__groups { grid-template-columns: 1fr; gap: 16px; }
          .mega--about { width: calc(100vw - 32px); }
        }
      `}</style>
    </>
  )
}
