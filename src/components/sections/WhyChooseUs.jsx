// src/components/sections/WhyChooseUs.jsx
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const POINTS = [
  {
    title: 'Senior engineers only',
    description: 'The people who scope your project are the ones who build it.',
  },
  {
    title: 'Fixed-scope sprints',
    description: 'Two-week increments with a demo at the end of each one.',
  },
  {
    title: 'You own everything',
    description: 'Source, infrastructure, and documentation are yours from day one.',
  },
  {
    title: 'Accessibility is not an upsell',
    description: 'WCAG-informed from the first component, not retrofitted.',
  },
  {
    title: 'We stay after launch',
    description: 'Ongoing support with a named engineer who knows your codebase.',
  },
]

const COMPARISON = [
  { us: 'Senior engineers write the code', them: 'Juniors staffed after signing' },
  { us: 'Demo every two weeks', them: 'Radio silence until delivery' },
  { us: 'Fixed scope, fixed price', them: 'Open-ended hourly billing' },
  { us: 'Full handover, no lock-in', them: 'Proprietary platform lock-in' },
  { us: 'Accessibility included', them: 'Accessibility as a change request' },
]

export function WhyChooseUs() {
  const timelineRef = useRef(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 75%', 'end 60%'],
  })

  // Spring smooths the scrub so the line doesn't jitter with the wheel.
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section id="about" className="section section-alt">
      <div className="container">
        <SectionHeading
          eyebrow="Why MusHam"
          title="A studio built to be easy to work with"
          subtitle="The things below are not perks. They are how we run every engagement."
        />

        <div className="grid grid-cols-1 gap-[var(--gap-grid)] lg:grid-cols-2 lg:gap-16">
          {/* ---------------------------------------------- timeline (left) */}
          <ol ref={timelineRef} className="relative pl-12">
            {/* Track */}
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[15px] w-px bg-[var(--color-border)]"
            />
            {/* Progress fill. Fully drawn under reduced motion so the section
                never reads as broken when animation is off. */}
            <motion.span
              aria-hidden="true"
              style={{
                scaleY: reduced ? 1 : lineScale,
                transformOrigin: 'top',
              }}
              className="absolute top-2 bottom-2 left-[15px] w-px bg-[var(--color-accent)]"
            />

            {POINTS.map((point, index) => (
              <li key={point.title} className="relative pb-10 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute top-1 left-[-45px] flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-accent)]"
                >
                  <Check size={14} />
                </span>

                <Reveal delay={index * 70}>
                  <h3
                    className="text-[length:var(--text-lg)] font-[var(--weight-semibold)] text-[var(--color-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {point.title}
                  </h3>
                  <p className="mt-1 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                    {point.description}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* -------------------------------------------- comparison (right) */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="card card-static overflow-hidden !p-0">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Comparison of working with MusHam Solutions versus a typical
                  agency
                </caption>
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th
                      scope="col"
                      className="bg-[rgb(var(--accent-rgb)/0.06)] p-4 text-[length:var(--text-sm)] font-[var(--weight-semibold)] text-[var(--color-primary)]"
                    >
                      With MusHam
                    </th>
                    <th
                      scope="col"
                      className="p-4 text-[length:var(--text-sm)] font-[var(--weight-medium)] text-[var(--color-text-secondary)]"
                    >
                      Typical agency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, index) => (
                    <motion.tr
                      key={row.us}
                      initial={reduced ? false : { opacity: 0, x: 24 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{
                        delay: reduced ? 0 : index * 0.07,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="border-b border-[var(--color-border)] last:border-0"
                    >
                      <td className="bg-[rgb(var(--accent-rgb)/0.06)] p-4 align-top">
                        <span className="flex gap-2 text-[length:var(--text-sm)] text-[var(--color-text)]">
                          <Check
                            size={16}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-[var(--color-success)]"
                          />
                          {row.us}
                        </span>
                      </td>
                      <td className="p-4 align-top">
                        <span className="flex gap-2 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                          <X
                            size={16}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 opacity-60"
                          />
                          {row.them}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
