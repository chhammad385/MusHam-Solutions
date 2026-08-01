import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * Mounts a Lenis smooth-scroll instance for the lifetime of the component.
 * Call once, near the root. Returns a ref holding the instance so callers can
 * drive it imperatively (lenis.current?.scrollTo('#section')).
 *
 * Respects prefers-reduced-motion by skipping Lenis entirely.
 */
export function useSmoothScroll(options = {}) {
  const lenisRef = useRef(null)

  // Held in a ref so a fresh options object on re-render doesn't tear down and
  // re-create Lenis, which would reset the user's scroll position.
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      ...optionsRef.current,
    })

    lenisRef.current = lenis

    let frameId
    const raf = (time) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }
    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
