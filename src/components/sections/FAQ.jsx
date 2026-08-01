// src/components/sections/FAQ.jsx
import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utils/cn'

const ITEMS = [
  {
    question: 'How do engagements usually start?',
    answer:
      'With a paid discovery sprint — usually one to two weeks. You end up with a scoped backlog, a technical approach, and a fixed quote. If you take that and build it elsewhere, that is a fine outcome for us.',
  },
  {
    question: 'What does a typical timeline look like?',
    answer:
      'Most projects run eight to sixteen weeks from kickoff to production. We work in two-week sprints with a live demo at the end of each one, so you see real progress rather than status reports.',
  },
  {
    question: 'How is pricing structured?',
    answer:
      'Fixed price per sprint, agreed before work starts. No hourly billing and no surprise invoices. If scope changes mid-project we re-quote the affected sprint before doing the work.',
  },
  {
    question: 'Who chooses the tech stack?',
    answer:
      'We recommend, you decide. Our defaults are React, TypeScript, and a managed database, chosen because they are boring, mature, and easy to hire for. If you have an existing stack, we work in it.',
  },
  {
    question: 'What happens after launch?',
    answer:
      'You get a full handover: source, infrastructure, runbooks, and a walkthrough with your team. Ongoing support is optional and month-to-month — we do not lock support behind a long contract.',
  },
  {
    question: 'Can you sign an NDA?',
    answer:
      'Yes, before any detailed discussion. We can work from your paper or provide ours, whichever moves faster.',
  },
]

function FAQItem({ item, index, isOpen, onToggle, reduced }) {
  const uid = useId()
  const buttonId = `faq-button-${uid}`
  const panelId = `faq-panel-${uid}`

  return (
    <div className="border-b border-[var(--color-border)]">
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={() => onToggle(index)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className={cn(
            'flex w-full items-center justify-between gap-6 py-5 text-left',
            'transition-colors duration-200',
            'hover:bg-[rgb(var(--accent-rgb)/0.04)]',
            isOpen
              ? 'text-[var(--color-accent)]'
              : 'text-[var(--color-primary)]',
          )}
        >
          <span
            className="text-[length:var(--text-lg)] font-[var(--weight-semibold)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {item.question}
          </span>
          <Plus
            size={20}
            aria-hidden="true"
            className={cn(
              'shrink-0 transition-transform duration-300 ease-[var(--ease-smooth)]',
              isOpen && 'rotate-45',
            )}
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[length:var(--text-base)] leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ({ allowMultiple = false }) {
  const [openIndexes, setOpenIndexes] = useState([0])
  const reduced = useReducedMotion()

  const toggle = (index) => {
    setOpenIndexes((current) => {
      const isOpen = current.includes(index)

      if (allowMultiple) {
        return isOpen
          ? current.filter((value) => value !== index)
          : [...current, index]
      }

      return isOpen ? [] : [index]
    })
  }

  return (
    <section id="faq" className="section section-alt">
      <div className="container">
        <div className="grid grid-cols-1 gap-[var(--gap-grid)] lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="FAQ"
              title="Questions we get asked"
              subtitle="If yours is not here, ask us directly."
            />

            <div className="card card-static">
              <h3
                className="text-[length:var(--text-lg)] font-[var(--weight-semibold)] text-[var(--color-primary)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Still have questions?
              </h3>
              <p className="mt-2 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                We answer every message ourselves, usually within a day.
              </p>
              <a href="#contact" className="btn btn-accent btn-sm mt-5">
                Get in touch
              </a>
            </div>
          </div>

          <div>
            {ITEMS.map((item, index) => (
              <FAQItem
                key={item.question}
                item={item}
                index={index}
                isOpen={openIndexes.includes(index)}
                onToggle={toggle}
                reduced={reduced}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
