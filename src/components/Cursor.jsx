import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [hidden, setHidden] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    // Disable on touch / coarse pointers
    if (window.matchMedia('(pointer: coarse)').matches) {
      setHidden(true)
      return
    }

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: pos.x, y: pos.y }
    let raf

    const move = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }
    }

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16
      ring.y += (pos.y - ring.y) * 0.16
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    const over = (e) => {
      if (e.target.closest('a, button, input, textarea, .magnetic, [data-cursor="hover"]')) {
        setHover(true)
      }
    }
    const out = (e) => {
      if (e.target.closest('a, button, input, textarea, .magnetic, [data-cursor="hover"]')) {
        setHover(false)
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mouseout', out)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mouseout', out)
    }
  }, [])

  if (hidden) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${hover ? 'cursor-ring--hover' : ''}`} />
      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
        .cursor-dot,
        .cursor-ring {
          position: fixed;
          top: 0;
          left: 0;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          will-change: transform;
          margin-left: -4px;
          margin-top: -4px;
          /* Invert against whatever is underneath so the cursor stays
             visible on the green nebula, dark surfaces and light cards alike. */
          mix-blend-mode: difference;
        }
        .cursor-dot {
          width: 10px;
          height: 10px;
          margin-left: -5px;
          margin-top: -5px;
          background: #fff;
        }
        .cursor-ring {
          width: 38px;
          height: 38px;
          margin-left: -19px;
          margin-top: -19px;
          border: 2px solid rgba(255, 255, 255, 0.9);
          transition: width 0.25s ease, height 0.25s ease, margin 0.25s ease,
            background 0.25s ease, border-color 0.25s ease;
        }
        .cursor-ring--hover {
          width: 64px;
          height: 64px;
          margin-left: -32px;
          margin-top: -32px;
          background: rgba(255, 255, 255, 0.18);
          border-color: #fff;
        }
      `}</style>
    </>
  )
}
