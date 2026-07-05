import { Link } from 'react-router-dom'
import Page from '../components/Page'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import CTA from '../components/CTA'
import { useLang } from '../i18n/LanguageContext'

export default function TeamPage() {
  const { t } = useLang()
  const isRtl = t.dir === 'rtl'
  const tm = t.team || { tag: '', title: '', subtitle: '', items: [] }

  return (
    <Page>
      <PageHero
        kicker={tm.tag}
        title={tm.title}
        desc={tm.subtitle}
        accent="#8b5cf6"
      />

      <div className="team__grid-wrap">
        <div className="team__grid">
          {tm.items.map((member, i) => (
            <Reveal key={i} variant="up" delay={i * 0.07}>
              <MemberCard member={member} idx={i} isRtl={isRtl} />
            </Reveal>
          ))}
        </div>
      </div>

      <CTA />

      <style>{`
        .team__grid-wrap {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 40px 100px;
        }
        .team__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        .tm-card {
          background: var(--surface);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: transform 0.25s var(--easing), border-color 0.25s, box-shadow 0.25s;
          display: block;
          text-decoration: none;
          color: inherit;
        }
        .tm-card:hover { transform: translateY(-6px); border-color: rgba(139,92,246,0.4); box-shadow: 0 20px 50px rgba(0,0,0,0.35); }
        .tm-card__photo-wrap {
          height: 260px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, rgba(139,92,246,0.12), rgba(91,205,218,0.06));
        }
        .tm-card__photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center top;
          transition: transform 0.6s var(--easing);
        }
        .tm-card:hover .tm-card__photo { transform: scale(1.05); }
        .tm-card__initial {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 80px;
          font-weight: 900;
          color: rgba(255,255,255,0.06);
          letter-spacing: -0.03em;
        }
        .tm-card__doron-badge {
          position: absolute;
          top: 16px;
          inset-inline-start: 16px;
          padding: 5px 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #fff;
          background: var(--primary);
          border-radius: var(--radius-pill);
        }
        .tm-card__body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .tm-card__name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 800;
          color: var(--ink);
          letter-spacing: -0.01em;
        }
        .tm-card__role {
          font-size: 13px;
          font-weight: 600;
          color: var(--neon-cyan);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .tm-card__bio {
          font-size: 14px;
          line-height: 1.7;
          color: var(--ink-muted);
          margin-top: 8px;
        }
        .tm-card__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          margin-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .tm-card__detail {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .tm-card:hover .tm-card__detail { color: var(--neon-cyan); }
        .tm-card__linkedin {
          font-size: 12px;
          color: rgba(255,255,255,0.3);
          transition: color 0.2s;
        }
        .tm-card__linkedin:hover { color: #0a66c2; }

        @media (max-width: 900px) { .team__grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) {
          .team__grid { grid-template-columns: 1fr; }
          .team__grid-wrap { padding: 0 24px 60px; }
        }
      `}</style>
    </Page>
  )
}

function MemberCard({ member, idx, isRtl }) {
  const to = member.isDoron ? '/about/doron' : `/about/team/${idx}`
  const detailLabel = isRtl ? 'קרא עוד' : 'Read more'

  return (
    <Link to={to} className="tm-card magnetic">
      <div className="tm-card__photo-wrap">
        {member.avatar
          ? <div className="tm-card__photo" style={{ backgroundImage: `url(${member.avatar})` }} />
          : <div className="tm-card__initial">{member.name.charAt(0)}</div>
        }
        {member.isDoron && (
          <span className="tm-card__doron-badge">{isRtl ? 'מייסד' : 'Founder'}</span>
        )}
      </div>
      <div className="tm-card__body">
        <h3 className="tm-card__name">{member.name}</h3>
        <span className="tm-card__role">{member.role}</span>
        <p className="tm-card__bio">{member.bio}</p>
        <div className="tm-card__footer">
          <span className="tm-card__detail">{detailLabel}</span>
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="tm-card__linkedin"
              onClick={(e) => e.stopPropagation()}
            >
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </Link>
  )
}
