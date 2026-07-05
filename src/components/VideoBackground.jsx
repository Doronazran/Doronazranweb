import { useEffect, useRef } from 'react'
import Hls from 'hls.js'
import { useLang } from '../i18n/LanguageContext'

// Optional ambient video. If these URLs don't resolve, the cinematic
// image base below shows through — the hero always looks finished.
const HLS_URL = ''
const FALLBACK_MP4 = ''

export default function VideoBackground() {
  const videoRef = useRef(null)
  const { media } = useLang()

  useEffect(() => {
    const video = videoRef.current
    if (!video || !HLS_URL) return

    let hls
    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, maxBufferLength: 30, startLevel: -1 })
      hls.loadSource(HLS_URL)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}))
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal && FALLBACK_MP4) {
          video.src = FALLBACK_MP4
          video.play().catch(() => {})
        }
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_URL
      video.addEventListener('loadedmetadata', () => video.play().catch(() => {}))
    } else if (FALLBACK_MP4) {
      video.src = FALLBACK_MP4
      video.play().catch(() => {})
    }

    return () => { if (hls) hls.destroy() }
  }, [])

  return (
    <div className="hero-media" aria-hidden="true">
      <div className="hero-media__img" style={{ backgroundImage: `url(${media.heroImage})` }} />
      <div className="hero-media__duotone" />
      <video ref={videoRef} muted loop playsInline preload="auto" className="hero-media__video" />
      <div className="hero-media__scrim" />
      <div className="hero-media__grain" />
      <style>{`
        .hero-media { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
        .hero-media__img,
        .hero-media__video {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          background-size: cover;
          background-position: center;
          transform: scale(1.06);
          animation: heroKenBurns 24s ease-in-out infinite alternate;
        }
        .hero-media__video { opacity: 0.45; mix-blend-mode: screen; }
        .hero-media__duotone {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #04122a 0%, #0a3a30 50%, #2a0f3a 100%);
          mix-blend-mode: color;
          opacity: 0.78;
        }
        .hero-media__scrim {
          position: absolute; inset: 0;
          background:
            linear-gradient(180deg, rgba(5,6,13,0.55) 0%, rgba(5,6,13,0.25) 35%, rgba(5,6,13,0.65) 72%, var(--bg) 100%),
            radial-gradient(120% 80% at 78% 12%, rgba(0,164,124,0.22) 0%, transparent 55%),
            radial-gradient(90% 80% at 8% 90%, rgba(91,205,218,0.14) 0%, transparent 55%);
        }
        .hero-media__grain {
          position: absolute; inset: 0;
          opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
        @keyframes heroKenBurns {
          from { transform: scale(1.06) translate(0, 0); }
          to { transform: scale(1.14) translate(-1.5%, -1.5%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-media__img, .hero-media__video { animation: none; transform: scale(1.04); }
        }
      `}</style>
    </div>
  )
}
