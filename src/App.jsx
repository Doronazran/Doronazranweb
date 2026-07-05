import { Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from './Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Work from './pages/Work'
import Tools from './pages/Tools'
import About from './pages/About'
import News from './pages/News'
import Contact from './pages/Contact'
import Accessibility from './pages/Accessibility'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import NewsArticle from './pages/NewsArticle'
import WorkProject from './pages/WorkProject'
import ServiceDetail from './pages/ServiceDetail'
import ToolDetail from './pages/ToolDetail'
import DoronProfile from './pages/DoronProfile'
import AboutOverview from './pages/AboutOverview'
import Vision from './pages/Vision'
import Team from './pages/Team'
import TeamMember from './pages/TeamMember'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  const location = useLocation()

  // Admin runs standalone — no site shell (nav/footer/3D/chat bar)
  if (location.pathname.startsWith('/admin')) {
    return <Admin />
  }

  return (
    <Layout>
      {/*
        Enter-only keyed transition. The instant route swap is masked by
        the RouteCurtain wipe (in Layout); the new page fades/slides in as
        the curtain lifts. Avoids AnimatePresence mode="wait" exit timing
        issues with <Routes> under React 19 StrictMode.
      */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News mode="media" />} />
          <Route path="/blog" element={<News mode="blog" />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/news/:id" element={<NewsArticle />} />
          <Route path="/work/:id" element={<WorkProject />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/tools/:id" element={<ToolDetail />} />
          <Route path="/about/overview" element={<AboutOverview />} />
          <Route path="/about/vision" element={<Vision />} />
          <Route path="/about/doron" element={<DoronProfile />} />
          <Route path="/about/team" element={<Team />} />
          <Route path="/about/team/:id" element={<TeamMember />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </Layout>
  )
}

export default App
