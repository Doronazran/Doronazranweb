import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n/LanguageContext'
import { sendChatMessage } from '../lib/chatApi'

const LEAD_AFTER = 3 // show lead form after this many AI replies
const FORMSUBMIT = 'https://formsubmit.co/ajax/doronazran@gmail.com'

export default function ChatWidget() {
  const { t, lang } = useLang()
  const c = t.chat
  const isRtl = t.dir === 'rtl'

  // animated typing in collapsed bar
  const [typed, setTyped] = useState('')
  const idx = useRef(0)
  const char = useRef(0)
  const phase = useRef('typing')

  // chat state
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([]) // {role, content}
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiReplies, setAiReplies] = useState(0)
  const [leadSent, setLeadSent] = useState(false)
  const [leadData, setLeadData] = useState({ name: '', email: '' })
  const [leadError, setLeadError] = useState('')

  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // focus input when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 280)
  }, [open])

  // typing animation for closed bar
  useEffect(() => {
    if (open) return
    idx.current = 0; char.current = 0; phase.current = 'typing'; setTyped('')
    let timeout
    const tick = () => {
      const questions = c.questions
      const current = questions[idx.current % questions.length]
      if (phase.current === 'typing') {
        char.current += 1
        setTyped(current.slice(0, char.current))
        if (char.current >= current.length) { phase.current = 'pausing'; timeout = setTimeout(tick, 2200); return }
        timeout = setTimeout(tick, 45 + Math.random() * 45)
      } else if (phase.current === 'pausing') {
        phase.current = 'deleting'; timeout = setTimeout(tick, 30)
      } else {
        char.current -= 2
        if (char.current <= 0) { char.current = 0; idx.current += 1; phase.current = 'typing'; timeout = setTimeout(tick, 260); return }
        setTyped(current.slice(0, char.current))
        timeout = setTimeout(tick, 22)
      }
    }
    timeout = setTimeout(tick, 600)
    return () => clearTimeout(timeout)
  }, [c, lang, open])

  const openChat = () => {
    setOpen(true)
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: isRtl
          ? 'שלום! אני כאן לענות על שאלות על דורון, השירותים והסדנאות שלו. במה אוכל לעזור?'
          : "Hi! I'm here to answer questions about Doron, his services and workshops. How can I help?"
      }])
    }
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setLoading(true)

    try {
      // send only role+content pairs to API
      const apiMessages = next.map(m => ({ role: m.role, content: m.content }))
      const reply = await sendChatMessage(apiMessages)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      setAiReplies(prev => prev + 1)
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isRtl
          ? 'מצטער, לא הצלחתי להתחבר כרגע. נסה שוב עוד רגע.'
          : 'Sorry, I could not connect right now. Please try again in a moment.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const submitLead = async (e) => {
    e.preventDefault()
    if (!leadData.name || !leadData.email) { setLeadError(isRtl ? 'נא למלא שם ומייל' : 'Please fill in name and email'); return }
    setLeadError('')
    const summary = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' | ')

    try {
      await fetch(FORMSUBMIT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          email: leadData.email,
          message: summary || '(from chat widget)',
          _subject: `[Chat Lead] ${leadData.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
    } catch { /* silent — still show success */ }
    setLeadSent(true)
  }

  const showLeadForm = aiReplies >= LEAD_AFTER && !leadSent

  return (
    <>
      {/* ── collapsed bar ── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            className="chatbar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chatbar__inner">
              <button className="chatbar__field magnetic" onClick={openChat} aria-label="Open chat">
                <span className="chatbar__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <span className="chatbar__label">{c.label}</span>
                <span className="chatbar__typed">
                  {typed}
                  <span className="chatbar__caret" />
                </span>
                <span className="chatbar__send" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
              <button className="chatbar__cta magnetic" onClick={openChat}>{c.cta}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── chat popup ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="chatpop"
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* header */}
            <div className="chatpop__header">
              <div className="chatpop__avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="chatpop__header-text">
                <span className="chatpop__name">{isRtl ? 'עוזר דורון אזרן' : "Doron Azran's Assistant"}</span>
                <span className="chatpop__status">
                  <span className="chatpop__dot" />
                  {isRtl ? 'זמין עכשיו' : 'Online now'}
                </span>
              </div>
              <button className="chatpop__close" onClick={() => setOpen(false)} aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* messages */}
            <div className="chatpop__messages" dir={isRtl ? 'rtl' : 'ltr'}>
              {messages.map((msg, i) => (
                <div key={i} className={`chatpop__msg chatpop__msg--${msg.role}`}>
                  <div className="chatpop__bubble">{msg.content}</div>
                </div>
              ))}

              {loading && (
                <div className="chatpop__msg chatpop__msg--assistant">
                  <div className="chatpop__bubble chatpop__bubble--loading">
                    <span /><span /><span />
                  </div>
                </div>
              )}

              {/* lead form */}
              {showLeadForm && (
                <div className="chatpop__lead">
                  <p className="chatpop__lead-title">
                    {isRtl ? 'רוצה שדורון יחזור אליך?' : 'Want Doron to follow up?'}
                  </p>
                  <form onSubmit={submitLead} className="chatpop__lead-form">
                    <input
                      className="chatpop__lead-input"
                      placeholder={isRtl ? 'שם מלא' : 'Full name'}
                      value={leadData.name}
                      onChange={e => setLeadData(p => ({ ...p, name: e.target.value }))}
                    />
                    <input
                      className="chatpop__lead-input"
                      type="email"
                      placeholder="Email"
                      dir="ltr"
                      value={leadData.email}
                      onChange={e => setLeadData(p => ({ ...p, email: e.target.value }))}
                    />
                    {leadError && <p className="chatpop__lead-err">{leadError}</p>}
                    <button type="submit" className="chatpop__lead-btn">
                      {isRtl ? 'שלח' : 'Send'}
                    </button>
                  </form>
                </div>
              )}

              {leadSent && (
                <div className="chatpop__msg chatpop__msg--assistant">
                  <div className="chatpop__bubble chatpop__bubble--success">
                    {isRtl ? 'תודה! דורון יצור איתך קשר בהקדם.' : 'Thanks! Doron will be in touch soon.'}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* input */}
            <div className="chatpop__footer">
              <textarea
                ref={inputRef}
                className="chatpop__input"
                rows="1"
                placeholder={isRtl ? 'כתוב שאלה...' : 'Type a question...'}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
              <button
                className="chatpop__send-btn"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* ── collapsed bar ── */
        .chatbar {
          position: fixed; bottom: 20px; inset-inline: 0; z-index: 90;
          display: flex; justify-content: center; padding: 0 16px; pointer-events: none;
        }
        .chatbar__inner {
          display: flex; align-items: center; gap: 10px;
          width: min(820px, 100%); pointer-events: auto;
        }
        .chatbar__field {
          flex: 1; display: flex; align-items: center; gap: 12px;
          padding: 12px 12px 12px 20px;
          background: rgba(10,12,20,0.72);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.14); border-radius: var(--radius-pill);
          box-shadow: 0 12px 40px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.02);
          min-width: 0; cursor: pointer; text-align: start;
        }
        :root[dir="ltr"] .chatbar__field { padding: 12px 20px 12px 12px; }
        .chatbar__icon { display: flex; color: var(--highlight); flex-shrink: 0; }
        .chatbar__label { font-weight: 700; font-size: 14px; color: #fff; flex-shrink: 0; }
        .chatbar__typed {
          font-size: 14px; color: rgba(255,255,255,0.62); white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis; flex: 1; min-width: 0; font-style: italic;
        }
        .chatbar__caret {
          display: inline-block; width: 2px; height: 1em; background: var(--highlight);
          margin-inline-start: 2px; vertical-align: text-bottom;
          animation: caretBlink 1s step-end infinite;
        }
        .chatbar__send {
          width: 38px; height: 38px; flex-shrink: 0; display: flex;
          align-items: center; justify-content: center;
          border-radius: 50%; background: rgba(255,255,255,0.1); color: #fff;
        }
        :root[dir="rtl"] .chatbar__send svg { transform: scaleX(-1); }
        .chatbar__cta {
          flex-shrink: 0; padding: 14px 22px; font-size: 14px; font-weight: 700;
          color: #06131a; background: linear-gradient(135deg, var(--highlight), #8ee6ef);
          border-radius: var(--radius-pill); white-space: nowrap;
          box-shadow: 0 8px 24px rgba(91,205,218,0.3); transition: all 0.2s ease;
          border: none; cursor: pointer;
        }
        .chatbar__cta:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(91,205,218,0.5); }

        /* ── chat popup ── */
        .chatpop {
          position: fixed; bottom: 24px; inset-inline-end: 24px; z-index: 1850;
          width: min(400px, calc(100vw - 32px));
          display: flex; flex-direction: column;
          background: rgba(10,12,22,0.96);
          backdrop-filter: blur(32px) saturate(1.4);
          -webkit-backdrop-filter: blur(32px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 20px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
          overflow: hidden;
          max-height: min(560px, calc(100vh - 48px));
        }

        .chatpop__header {
          display: flex; align-items: center; gap: 12px; padding: 16px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03); flex-shrink: 0;
        }
        .chatpop__avatar {
          width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, var(--primary), var(--neon-cyan));
          display: flex; align-items: center; justify-content: center; color: #fff;
        }
        .chatpop__header-text { flex: 1; display: flex; flex-direction: column; gap: 3px; }
        .chatpop__name { font-size: 14px; font-weight: 700; color: #fff; }
        .chatpop__status { display: flex; align-items: center; gap: 5px; font-size: 12px; color: rgba(255,255,255,0.5); }
        .chatpop__dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; flex-shrink: 0; }
        .chatpop__close {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.4); padding: 4px; border-radius: 6px;
          display: flex; transition: color 0.15s;
        }
        .chatpop__close:hover { color: #fff; background: rgba(255,255,255,0.06); }

        .chatpop__messages {
          flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px;
          scroll-behavior: smooth;
        }
        .chatpop__messages::-webkit-scrollbar { width: 4px; }
        .chatpop__messages::-webkit-scrollbar-track { background: transparent; }
        .chatpop__messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .chatpop__msg { display: flex; }
        .chatpop__msg--user { justify-content: flex-end; }
        .chatpop__msg--assistant { justify-content: flex-start; }

        .chatpop__bubble {
          max-width: 82%; padding: 11px 15px; border-radius: 16px;
          font-size: 14px; line-height: 1.6;
        }
        .chatpop__msg--user .chatpop__bubble {
          background: var(--primary); color: #fff; border-bottom-inline-end-radius: 4px;
        }
        .chatpop__msg--assistant .chatpop__bubble {
          background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.88);
          border-bottom-inline-start-radius: 4px; border: 1px solid rgba(255,255,255,0.08);
        }

        /* loading dots */
        .chatpop__bubble--loading {
          display: flex; gap: 5px; align-items: center; padding: 14px 16px;
        }
        .chatpop__bubble--loading span {
          width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.4);
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        .chatpop__bubble--loading span:nth-child(2) { animation-delay: 0.2s; }
        .chatpop__bubble--loading span:nth-child(3) { animation-delay: 0.4s; }

        .chatpop__bubble--success {
          background: rgba(0,164,124,0.15); border-color: rgba(0,164,124,0.3); color: #4fffba;
        }

        /* lead form */
        .chatpop__lead {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px;
        }
        .chatpop__lead-title {
          font-size: 14px; font-weight: 700; color: #fff;
        }
        .chatpop__lead-form { display: flex; flex-direction: column; gap: 8px; }
        .chatpop__lead-input {
          padding: 10px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: #fff; font-family: inherit; font-size: 14px; outline: none;
          transition: border-color 0.2s;
        }
        .chatpop__lead-input:focus { border-color: var(--primary); }
        .chatpop__lead-input::placeholder { color: rgba(255,255,255,0.3); }
        .chatpop__lead-err { font-size: 12px; color: #ff8080; }
        .chatpop__lead-btn {
          padding: 10px; border-radius: 10px; background: var(--primary); border: none;
          color: #fff; font-family: inherit; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: background 0.2s;
        }
        .chatpop__lead-btn:hover { background: var(--primary-hover); }

        /* input area */
        .chatpop__footer {
          display: flex; align-items: flex-end; gap: 8px; padding: 12px 14px;
          border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0;
        }
        .chatpop__input {
          flex: 1; padding: 10px 14px; border-radius: 12px; resize: none;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          color: #fff; font-family: inherit; font-size: 14px; line-height: 1.5;
          max-height: 100px; overflow-y: auto; outline: none; transition: border-color 0.2s;
        }
        .chatpop__input:focus { border-color: var(--primary); }
        .chatpop__input::placeholder { color: rgba(255,255,255,0.3); }
        .chatpop__send-btn {
          width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; border: none;
          background: var(--primary); color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease;
        }
        .chatpop__send-btn:hover:not(:disabled) { background: var(--primary-hover); transform: scale(1.05); }
        .chatpop__send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        :root[dir="rtl"] .chatpop__send-btn svg { transform: scaleX(-1); }

        @keyframes caretBlink { 50% { opacity: 0; } }
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Whenever the nav collapses to a hamburger (<=960px), collapse the
           full-width chat bar into a clean circular FAB so it stops occluding
           content and stacks with the WhatsApp / accessibility FABs. */
        @media (max-width: 960px) {
          .chatbar {
            bottom: calc(16px + env(safe-area-inset-bottom, 0px));
            inset-inline: auto;
            inset-inline-end: 16px;
            padding: 0;
            justify-content: flex-end;
          }
          .chatbar__inner { width: auto; gap: 0; }
          .chatbar__field {
            flex: 0 0 auto;
            width: 56px; height: 56px; padding: 0;
            justify-content: center; gap: 0;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), var(--neon-cyan));
            box-shadow: 0 8px 26px rgba(0,128,96,0.45);
          }
          :root[dir="ltr"] .chatbar__field { padding: 0; }
          .chatbar__icon { color: #fff; }
          .chatbar__label,
          .chatbar__typed,
          .chatbar__send,
          .chatbar__cta { display: none; }
        }

        /* On phones the popup goes (near) full-width and full-height. */
        @media (max-width: 640px) {
          .chatpop {
            bottom: calc(16px + env(safe-area-inset-bottom, 0px));
            inset-inline-end: 16px;
            width: calc(100vw - 32px);
            max-height: min(78vh, calc(100dvh - 90px));
          }
        }
        @media (prefers-reduced-motion: reduce) { .chatbar__caret { animation: none; } }
      `}</style>
    </>
  )
}
