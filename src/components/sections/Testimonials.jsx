// src/components/sections/Testimonials.jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Star } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utils/cn'

// Avatar PLACEHOLDERS via pravatar — swap for real client photos with consent.
const TESTIMONIALS = [
  {
    quote:
      'They scoped the work honestly, including the parts they told us not to build. That conversation saved us a quarter.',
    name: 'Amara Okafor',
    role: 'VP Product',
    company: 'Northwind Health',
    avatar: 'https://i.pravatar.cc/128?img=45',
    rating: 5,
  },
  {
    quote:
      'The demo cadence meant we never wondered where things stood. Every two weeks, something real to click through.',
    name: 'Daniel Reyes',
    role: 'CTO',
    company: 'Meridian Freight',
    avatar: 'https://i.pravatar.cc/128?img=12',
    rating: 5,
  },
  {
    quote:
      'Handover was genuinely complete. Our team was productive in the codebase within days, not months.',
    name: 'Priya Raman',
    role: 'Head of Engineering',
    company: 'Atlas Analytics',
    avatar: 'https://i.pravatar.cc/128?img=32',
    rating: 5,
  },
  {
    quote:
      'Accessibility came up in the first design review, not after our audit. That is rare and it mattered.',
    name: 'Tom Bergström',
    role: 'Design Director',
    company: 'Cobalt',
    avatar: 'https://i.pravatar.cc/128?img=60',
    rating: 4,
  },
  {
    quote:
      'We came in with a vague AI ambition and left with a shipped feature our users actually rely on.',
    name: 'Sofia Almeida',
    role: 'Founder',
    company: 'Vertex Labs',
    avatar: 'https://i.pravatar.cc/128?img=25',
    rating: 5,
  },
]

function Rating({ value }) {
  return (
    <p className="flex items-center gap-0.5">
      <span className="sr-only">{value} out of 5 stars</span>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={14}
          aria-hidden="true"
          className={cn(
            index < value
              ? 'fill-[var(--color-accent)] text-[var(--color-accent)]'
              : 'text-[var(--color-border)]',
          )}
        />
      ))}
    </p>
  )
}

export function Testimonials() {
  const trackRef = useRef(null)
  const reduced = useReducedMotion()

  const [active, setActive] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [playing, setPlaying] = useState(!reduced)
  const [hovered, setHovered] = useState(false)

  // Derive edge state from real scroll position rather than index maths, so
  // it stays correct at any card count or viewport width.
  const syncEdges = useCallback(() => {
    const el = trackRef.current
    if (!el) return

    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    syncEdges()
    el.addEventListener('scroll', syncEdges, { passive: true })
    window.addEventListener('resize', syncEdges)

    return () => {
      el.removeEventListener('scroll', syncEdges)
      window.removeEventListener('resize', syncEdges)
    }
  }, [syncEdges])

  // Track the centred card for the dot indicators.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index))
          }
        })
      },
      { root: el, threshold: 0.6 },
    )

    el.querySelectorAll('[data-index]').forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const scrollToIndex = useCallback((index) => {
    const el = trackRef.current
    if (!el) return

    const card = el.querySelector(`[data-index="${index}"]`)
    if (!card) return

    el.scrollTo({
      left: card.offsetLeft - el.offsetLeft,
      behavior: 'smooth',
    })
  }, [])

  const step = useCallback((direction) => {
    const el = trackRef.current
    if (!el) return

    const card = el.querySelector('[data-index]')
    const amount = card ? card.clientWidth + 24 : el.clientWidth

    el.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }, [])

  // Autoplay pauses on hover, on focus within, when the tab is hidden, and
  // whenever the user has asked for reduced motion.
  useEffect(() => {
    if (!playing || reduced || hovered) return

    const id = window.setInterval(() => {
      const el = trackRef.current
      if (!el || document.hidden) return

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        step(1)
      }
    }, 6000)

    return () => window.clearInterval(id)
  }, [playing, reduced, hovered, step])

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Clients"
          title="What teams say afterwards"
          subtitle="Five engagements, in their words."
          align="center"
        />

        {/* Reveal wraps the whole slider, not each card: cards scrolled
            outside the track are clipped, so a per-card whileInView never
            fires for them and they stay at opacity 0 forever. */}
        <Reveal
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setHovered(true)}
          onBlurCapture={() => setHovered(false)}
        >
          <div
            ref={trackRef}
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            tabIndex={0}
            className={cn(
              'flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4',
              '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            )}
          >
            {TESTIMONIALS.map((item, index) => (
              <figure
                key={item.name}
                data-index={index}
                aria-label={`${index + 1} of ${TESTIMONIALS.length}`}
                className={cn(
                  'glass relative flex w-[85%] shrink-0 snap-center flex-col p-7',
                  'md:w-[calc(50%-0.75rem)] xl:w-[calc(33.333%-1rem)]',
                  'transition-[transform,box-shadow] duration-500 ease-[var(--ease-smooth)]',
                  active === index && !reduced
                    ? 'scale-[1.02] shadow-[var(--shadow-lg)]'
                    : 'scale-100',
                )}
              >
                <Quote
                  size={64}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-4 right-4 text-[var(--color-accent)] opacity-[0.07]"
                />

                <Rating value={item.rating} />

                <blockquote className="mt-4 flex-1 text-[length:var(--text-lg)] leading-[var(--leading-relaxed)] text-[var(--color-text)]">
                  {item.quote}
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                  <img
                    src={item.avatar}
                    alt=""
                    width={44}
                    height={44}
                    loading="lazy"
                    decoding="async"
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <span>
                    <span className="block text-[length:var(--text-sm)] font-[var(--weight-semibold)] text-[var(--color-primary)]">
                      {item.name}
                    </span>
                    <span className="block text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
                      {item.role}, {item.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={atStart}
              aria-label="Previous testimonial"
              className="btn btn-outline btn-icon"
            >
              <ChevronLeft size={18} />
            </button>

            <ul className="flex items-center gap-2">
              {TESTIMONIALS.map((item, index) => (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => scrollToIndex(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                    aria-current={active === index ? 'true' : undefined}
                    className={cn(
                      'block h-2 rounded-full transition-all duration-300',
                      active === index
                        ? 'w-6 bg-[var(--color-accent)]'
                        : 'w-2 bg-[var(--color-border)] hover:bg-[var(--color-text-secondary)]',
                    )}
                  />
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => step(1)}
              disabled={atEnd}
              aria-label="Next testimonial"
              className="btn btn-outline btn-icon"
            >
              <ChevronRight size={18} />
            </button>

            {!reduced && (
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                aria-label={playing ? 'Pause autoplay' : 'Resume autoplay'}
                className="btn btn-ghost btn-icon ml-2"
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Testimonials
