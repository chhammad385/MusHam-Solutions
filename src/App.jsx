// src/App.jsx
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { Process } from '@/components/sections/Process'
import { Projects } from '@/components/sections/Projects'
import { TechStack } from '@/components/sections/TechStack'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'
import { Contact } from '@/components/sections/Contact'
import { WelcomePopup } from '@/components/ui/WelcomePopup'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

/**
 * Page transition variants.
 *
 * There is no router here yet, so this is a mount transition rather than a
 * route transition. It is wired through AnimatePresence with a `key` so that
 * adding react-router later means changing one line — pass the current
 * pathname as the key and the exit animation starts working with no other
 * edits.
 */
const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
}

function App() {
  // Lenis is mounted exactly once here. Components must never construct their
  // own instance — two instances fight over the same scroll container.
  const lenis = useSmoothScroll()
  const reduced = useReducedMotion()

  // Current "page". Swap for useLocation().pathname when a router is added.
  const [pageKey] = useState('home')

  // A fade-in that starts before fonts resolve causes a visible reflow mid
  // animation, so hold the transition until the webfonts are ready (capped,
  // so a blocked font CDN can never leave the page hidden).
  const [fontsReady, setFontsReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const done = () => {
      if (!cancelled) setFontsReady(true)
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(done)
    }

    const timeout = window.setTimeout(done, 1200)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [])

  // Deep links land at the top because Lenis initialises at 0; honour the hash
  // once it is running.
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash.length < 2) return

    const target = document.querySelector(hash)
    if (!target) return

    const id = window.setTimeout(() => {
      if (lenis.current) {
        lenis.current.scrollTo(target, { offset: -80 })
      } else {
        target.scrollIntoView()
      }
    }, 400)

    return () => window.clearTimeout(id)
  }, [lenis])

  const scrollToTop = () => {
    if (lenis.current) {
      lenis.current.scrollTo(0)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <AnimatePresence mode="wait">
        <motion.main
          key={pageKey}
          id="main"
          className="flex-1"
          variants={pageVariants}
          initial={reduced ? false : 'initial'}
          // Hold at the initial state until fonts resolve, then play. Under
          // reduced motion we skip straight to the final state.
          animate={reduced || fontsReady ? 'animate' : 'initial'}
          exit={reduced ? undefined : 'exit'}
        >
          <Hero />
          <Services />
          <WhyChooseUs />
          <Process />
          <Projects />
          <TechStack />
          <Testimonials />
          <FAQ />
          <Contact />
        </motion.main>
      </AnimatePresence>

      <Footer onScrollTop={scrollToTop} />

      <WelcomePopup lenis={lenis} />
    </div>
  )
}

export default App
