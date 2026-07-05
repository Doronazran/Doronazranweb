import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let w, h, dpr
    let stars = []
    let scrollY = window.scrollY
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const init = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.width = window.innerWidth * dpr
      h = canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      const count = Math.min(260, Math.floor((window.innerWidth * window.innerHeight) / 7000))
      stars = Array.from({ length: count }, () => {
        const depth = Math.random()
        return {
          x: Math.random() * w,
          y: Math.random() * h * 2, // taller field for scroll parallax
          z: depth,
          r: (depth * 1.6 + 0.3) * dpr,
          tw: Math.random() * Math.PI * 2,
          tws: 0.6 + Math.random() * 1.4,
          hue: Math.random() < 0.5 ? 175 : Math.random() < 0.5 ? 265 : 320,
        }
      })
    }

    const onScroll = () => { scrollY = window.scrollY }

    let t = 0
    const render = () => {
      t += 0.016
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        // drift + scroll parallax by depth
        const parY = (s.y - scrollY * dpr * (0.15 + s.z * 0.5)) % (h * 2)
        const y = parY < 0 ? parY + h * 2 : parY
        const x = (s.x + t * (4 + s.z * 10) * dpr) % w
        const twinkle = reduce ? 0.7 : 0.45 + 0.55 * Math.abs(Math.sin(s.tw + t * s.tws))
        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${s.hue}, 80%, ${70 + s.z * 25}%, ${twinkle * (0.4 + s.z * 0.6)})`
        ctx.fill()
        if (s.z > 0.75 && !reduce) {
          ctx.beginPath()
          ctx.arc(x, y, s.r * 3.5, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${s.hue}, 90%, 75%, ${twinkle * 0.08})`
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(render)
    }

    init()
    render()
    window.addEventListener('resize', init)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
