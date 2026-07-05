import { useParams, Link, Navigate } from 'react-router-dom'
import Page from '../components/Page'
import CTA from '../components/CTA'
import { useLang } from '../i18n/LanguageContext'

export default function TeamMember() {
  const { id } = useParams()
  const { t } = useLang()
  const isRtl = t.dir === 'rtl'
  const tm = t.team || { items: [] }
  const idx = Number(id)
  const member = tm.items[idx]

  if (!member) return <Navigate to="/about/team" replace />
  if (member.isDoron) return <Navigate to="/about/doron" replace />

  return (
    <Page>
      <div className="tmd__breadcrumb">
        <Link to="/about" className="tmd__bc-link">{isRtl ? 'אודות' : 'About'}</Link>
        <span className="tmd__sep">/</span>
        <Link to="/about/team" className="tmd__bc-link">{isRtl ? 'הצוות' : 'Team'}</Link>
        <span className="tmd__sep">/</span>
        <span className="tmd__current">{member.name}</span>
      </div>

      <article className="tmd__article">
        <div className="tmd__hero">
          <div className="tmd__photo-wrap">
            {member.avatar
              ? <div className="tmd__photo" style={{ backgroundImage: `url(${member.avatar})` }} />
              : <div className="tmd__initial">{member.name.charAt(0)}</div>
            }
          </div>
          <div className="tmd__intro">
            <span className="tmd__role">{member.role}</span>
            <h1 className="tmd__name">{member.name}</h1>
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="tmd__linkedin">
                LinkedIn
              </a>
            )}
          </div>
        </div>

        <div className="tmd__body">
          {(member.bio || '').split('\n').map((para, i) =>
            para.trim() ? <p key={i} className="tmd__para">{para}</p> : null
          )}
        </div>
      </article>

      <CTA />

      <style>{`
        .tmd__breadcrumb {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 900px;
          margin: 140px auto 0;
          padding: 0 40px 48px;
          font-size: 14px;
          color: var(--ink-faint);
        }
        .tmd__bc-link { color: var(--neon-cyan); font-weight: 600; transition: opacity 0.2s; }
        .tmd__bc-link:hover { opacity: 0.7; }
        .tmd__sep { opacity: 0.35; }
        .tmd__current { color: var(--ink-faint); }
        .tmd__article {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 40px 80px;
        }
        .tmd__hero {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 56px;
          align-items: start;
          margin-bottom: 60px;
        }
        .tmd__photo-wrap {
          aspect-ratio: 4/5;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
          background: linear-gradient(145deg, rgba(139,92,246,0.12), rgba(91,205,218,0.06));
        }
        .tmd__photo { width: 100%; height: 100%; background-size: cover; background-position: center top; }
        .tmd__initial {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 100px; font-weight: 900;
          color: rgba(255,255,255,0.07);
        }
        .tmd__intro {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding-top: 16px;
        }
        .tmd__role {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--neon-cyan);
        }
        .tmd__name {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 58px);
          font-weight: 900;
          letter-spacing: -0.025em;
          color: var(--ink);
          line-height: 1.05;
        }
        .tmd__linkedin {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #0a66c2;
          border: 1px solid #0a66c2;
          padding: 8px 18px;
          border-radius: var(--radius-pill);
          transition: background 0.2s;
          width: fit-content;
        }
        .tmd__linkedin:hover { background: rgba(10,102,194,0.12); }
        .tmd__body {
          display: flex;
          flex-direction: column;
          gap: 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 40px;
        }
        .tmd__para {
          font-size: 17px;
          line-height: 1.85;
          color: var(--ink-muted);
        }
        @media (max-width: 700px) {
          .tmd__hero { grid-template-columns: 1fr; gap: 28px; }
          .tmd__photo-wrap { max-width: 240px; }
          .tmd__breadcrumb, .tmd__article { padding-inline: 24px; }
          .tmd__breadcrumb { margin-top: 120px; }
        }
      `}</style>
    </Page>
  )
}
