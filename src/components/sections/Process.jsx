// src/components/sections/Process.jsx
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code2, PenTool, Rocket, Search, TrendingUp } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Workshops to pin down the problem, users, and success metrics.',
  },
  {
    icon: PenTool,
    title: 'Design',
    description: 'Flows, prototypes, and a design system you can build against.',
  },
  {
    icon: Code2,
    title: 'Develop',
    description: 'Two-week sprints, demoed live, with tests written as we go.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'Staged rollout, monitoring, and a rehearsed rollback plan.',
  },
  {
    icon: TrendingUp,
    title: 'Scale',
    description: 'Measure, iterate, and grow the platform on real usage data.',
  },
]

export function Process() {
  const rootRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    // Under reduced motion the line and medallions render in their final
    // state via CSS defaults below — no ScrollTrigger at all.
    if (reduced) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // gsap.matchMedia builds each layout independently and reverts the
      // other on resize, so the horizontal and vertical timelines never
      // both apply to the same elements.
      mm.add('(min-width: 1024px)', () => {
        gsap.fromTo(
          '[data-line-h]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: true,
            },
          },
        )

        gsap.utils.toArray('[data-medallion]').forEach((el, index) => {
          gsap.fromTo(
            el,
            { scale: 0.6, opacity: 0.35 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: rootRef.current,
                start: `top ${70 - index * 6}%`,
                toggleActions: 'play none none reverse',
              },
            },
          )
        })
      })

      mm.add('(max-width: 1023px)', () => {
        gsap.fromTo(
          '[data-line-v]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: true,
            },
          },
        )

        gsap.utils.toArray('[data-medallion]').forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 0.7, opacity: 0.4 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        })
      })
    }, rootRef)

    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="process" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="How we work"
          title="Five steps, no surprises"
          subtitle="Every engagement runs through the same sequence, so you always know what happens next."
          align="center"
        />

        <div ref={rootRef} className="relative">
          {/* ---- desktop horizontal connector ---- */}
          <div
            aria-hidden="true"
            className="absolute top-8 right-0 left-0 hidden h-px bg-[var(--color-border)] lg:block"
          >
            <span
              data-line-h
              className="block h-px w-full origin-left bg-[var(--color-accent)]"
            />
          </div>

          {/* ---- mobile vertical connector ---- */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-8 w-px bg-[var(--color-border)] lg:hidden"
          >
            <span
              data-line-v
              className="block h-full w-px origin-top bg-[var(--color-accent)]"
            />
          </div>

          <ol className="relative grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <li
                  key={step.title}
                  className="relative flex gap-6 lg:flex-col lg:gap-0 lg:text-center"
                >
                  <div className="relative shrink-0 lg:mx-auto">
                    <span
                      data-medallion
                      className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent)] shadow-[var(--shadow-sm)]"
                    >
                      <Icon size={22} aria-hidden="true" />
                      <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-accent)] text-[length:var(--text-xs)] font-[var(--weight-semibold)] text-white">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                  </div>

                  <div className="lg:mt-6">
                    <h3
                      className="text-[length:var(--text-lg)] font-[var(--weight-semibold)] text-[var(--color-primary)]"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                      {step.description}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}

export default Process
