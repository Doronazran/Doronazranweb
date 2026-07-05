import { useState } from 'react'
import Reveal from './Reveal'
import { useLang } from '../i18n/LanguageContext'

const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/doronazran@gmail.com'

export default function Contact({ preselect }) {
  const { t } = useLang()
  const c = t.contact
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [inquiry, setInquiry] = useState(preselect || '')
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) return
    setStatus('sending')

    const inquiryLabel = inquiry
      ? (c.inquiryOptions.find((o) => o.value === inquiry)?.label || inquiry)
      : ''

    const subject = inquiryLabel
      ? `[${inquiryLabel}] ${formData.name}`
      : `Contact from ${formData.name}`

    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          inquiry: inquiryLabel,
          _subject: subject,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const data = await res.json()
      if (data.success === 'true' || data.success === true) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setInquiry('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <section id="contact" className="section contact">
        <div className="section__inner contact__grid">
          <div className="contact__info">
            <Reveal variant="fade"><span className="section__tag">{c.tag}</span></Reveal>
            <Reveal variant="up" delay={0.05}><h2 className="section__title">{c.title}</h2></Reveal>
            <Reveal variant="up" delay={0.12}><p className="section__subtitle">{c.desc}</p></Reveal>

            <Reveal variant="up" delay={0.2} className="contact__details">
              <div className="contact__detail">
                <div className="contact__detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className="contact__detail-label">{c.emailLabel}</div>
                  <a href={`mailto:${c.emailAddress}`} className="contact__detail-val">{c.emailAddress}</a>
                </div>
              </div>
              <div className="contact__detail">
                <div className="contact__detail-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="contact__detail-label">{c.locationLabel}</div>
                  <div className="contact__detail-val">{c.location}</div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal variant="up" delay={0.15} as="form" className="contact__form" onSubmit={handleSubmit}>

            {/* Inquiry type selector */}
            <div className="contact__field">
              <label className="contact__label">{c.inquiryLabel}</label>
              <div className="contact__inquiry-chips">
                {c.inquiryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`contact__chip ${inquiry === opt.value ? 'contact__chip--active' : ''}`}
                    onClick={() => setInquiry(inquiry === opt.value ? '' : opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="contact__field">
              <label htmlFor="name" className="contact__label">{c.name}</label>
              <input id="name" name="name" type="text" className="contact__input"
                placeholder={c.namePh} value={formData.name} onChange={handleChange} required />
            </div>
            <div className="contact__field">
              <label htmlFor="email" className="contact__label">{c.email}</label>
              <input id="email" name="email" type="email" className="contact__input"
                placeholder="your@email.com" dir="ltr" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="contact__field">
              <label htmlFor="message" className="contact__label">{c.message}</label>
              <textarea id="message" name="message" className="contact__textarea" rows="5"
                placeholder={c.messagePh} value={formData.message} onChange={handleChange} required />
            </div>

            {status === 'success' && (
              <div className="contact__status contact__status--success">{c.success}</div>
            )}
            {status === 'error' && (
              <div className="contact__status contact__status--error">{c.error}</div>
            )}

            <button
              type="submit"
              className="contact__submit magnetic"
              disabled={status === 'sending' || status === 'success'}
            >
              {status === 'sending' ? c.sending : c.submit}
              {status !== 'sending' && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </Reveal>
        </div>
      </section>

      <style>{`
        .contact__grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start;
        }
        .contact__details { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; }
        .contact__detail { display: flex; align-items: center; gap: 16px; }
        .contact__detail-icon {
          width: 48px; height: 48px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0, 128, 96, 0.12); border-radius: var(--radius-md); color: var(--primary-hover);
        }
        .contact__detail-label { font-size: 13px; color: var(--ink-muted); margin-bottom: 3px; }
        .contact__detail-val { font-size: 16px; font-weight: 600; color: var(--ink); }

        .contact__form {
          background: var(--surface); backdrop-filter: blur(16px) saturate(1.3);
          -webkit-backdrop-filter: blur(16px) saturate(1.3); border: 1px solid var(--border);
          border-radius: var(--radius-xl); padding: 40px; display: flex; flex-direction: column; gap: 20px;
        }
        .contact__field { display: flex; flex-direction: column; gap: 8px; }
        .contact__label { font-size: 14px; font-weight: 600; color: var(--ink); }

        .contact__inquiry-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .contact__chip {
          padding: 8px 18px; border-radius: var(--radius-pill);
          border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.65); font-family: inherit; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.18s ease;
        }
        .contact__chip:hover { border-color: var(--primary); color: #fff; background: rgba(0,128,96,0.1); }
        .contact__chip--active { background: var(--primary); border-color: var(--primary); color: #fff; font-weight: 600; }

        .contact__input, .contact__textarea {
          font-family: var(--font-body); font-size: 15px; padding: 14px 16px;
          border: 1px solid var(--border-strong); border-radius: var(--radius-md);
          background: rgba(5, 6, 13, 0.5); color: var(--ink); outline: none;
          transition: border-color var(--duration-fast) var(--easing), box-shadow var(--duration-fast) var(--easing);
        }
        .contact__input::placeholder, .contact__textarea::placeholder { color: var(--ink-faint); }
        .contact__input:focus, .contact__textarea:focus {
          border-color: var(--primary); box-shadow: 0 0 0 3px rgba(0, 128, 96, 0.18);
        }
        .contact__textarea { resize: vertical; min-height: 120px; }

        .contact__status {
          padding: 14px 18px; border-radius: var(--radius-md);
          font-size: 14px; font-weight: 600; line-height: 1.5;
        }
        .contact__status--success {
          background: rgba(0,164,124,0.15); border: 1px solid rgba(0,164,124,0.4); color: #4fffba;
        }
        .contact__status--error {
          background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); color: #ff8080;
        }

        .contact__submit {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 8px; padding: 15px 32px; font-size: 16px; font-weight: 600;
          color: var(--on-primary); background: var(--primary); border: none;
          border-radius: var(--radius-pill); transition: all var(--duration-base) var(--easing);
          align-self: flex-start;
        }
        .contact__submit:hover:not(:disabled) {
          background: var(--primary-hover); transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 128, 96, 0.4);
        }
        .contact__submit:disabled { opacity: 0.6; cursor: not-allowed; }
        :root[dir="rtl"] .contact__submit svg { transform: scaleX(-1); }

        @media (max-width: 900px) {
          .contact__grid { grid-template-columns: 1fr; gap: 48px; }
          .contact__form { padding: 28px; }
        }
      `}</style>
    </>
  )
}
