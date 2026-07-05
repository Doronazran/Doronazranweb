import { useLang } from '../i18n/LanguageContext'

// TODO: Replace with Doron's actual WhatsApp number (country code + number, digits only)
const WHATSAPP_NUMBER = '972548023633'

export default function WhatsAppButton() {
  const { lang } = useLang()
  const label = lang === 'he' ? 'שלח הודעה ב-WhatsApp' : 'Chat on WhatsApp'

  return (
    <>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label={label}
        title={label}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.001 2C6.477 2 2 6.477 2 12c0 1.89.518 3.66 1.42 5.18L2 22l4.95-1.3A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.524 2 12.001 2zm.001 18c-1.57 0-3.03-.43-4.28-1.17l-.31-.18-3.2.84.85-3.12-.2-.32A7.967 7.967 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.39-5.89c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.46-.4-.4-.54-.41-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
        </svg>
        <span className="wa-float__pulse" aria-hidden="true" />
      </a>

      <style>{`
        .wa-float {
          position: fixed;
          bottom: 90px;
          right: 20px;
          z-index: 1800;
          width: 52px; height: 52px; border-radius: 50%;
          background: #25D366; color: #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(37,211,102,.5);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .wa-float:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 30px rgba(37,211,102,.65);
        }
        .wa-float:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }

        .wa-float__pulse {
          position: absolute; inset: -5px; border-radius: 50%;
          border: 2px solid rgba(37,211,102,.5);
          animation: waPulse 2.5s ease-out infinite;
          pointer-events: none;
        }
        @keyframes waPulse {
          0%   { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        /* Stacks above the chat FAB (56px @ 16px) whenever the chat is a FAB.
           Uses logical inset so the whole tower flips to the
           reading-start side together with the chat FAB. */
        @media (max-width: 960px) {
          .wa-float {
            bottom: calc(84px + env(safe-area-inset-bottom, 0px));
            right: auto; inset-inline-end: 18px;
            width: 52px; height: 52px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .wa-float__pulse { animation: none; }
        }
      `}</style>
    </>
  )
}
