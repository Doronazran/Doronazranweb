import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Starfield from './components/Starfield'
import Cursor from './components/Cursor'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'
import RouteCurtain from './components/RouteCurtain'
import AccessibilityWidget from './components/AccessibilityWidget'
import WhatsAppButton from './components/WhatsAppButton'

export default function Layout({ children }) {
  const lenisRef = useRef(null)
  const { pathname } = useLocation()

  // Buttery momentum scrolling (Lenis), disabled under reduced-motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return (
    <>
      <Starfield />
      <Cursor />
      <RouteCurtain />
      <Navigation />
      <main className="app-main">{children}</main>
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
      <AccessibilityWidget />
    </>
  )
}
