// src/components/sections/Services.jsx
import { useCallback } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Brain,
  Cloud,
  Code2,
  Palette,
  Smartphone,
  Workflow,
} from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utils/cn'

// Spans are declared as class strings so the bento layout stays declarative.
// 6-col grid on desktop: the AI card is the 4x2 feature, the rest are 2x1.
const SERVICES = [
  {
    icon: Brain,
    title: 'AI & Machine Learning',
    description:
      'LLM applications, RAG pipelines, and custom model work — evaluated properly, shipped with guardrails, and instrumented so you can see what it costs.',
    tags: ['LLMs', 'RAG', 'Evals', 'Fine-tuning'],
    span: 'lg:col-span-4 lg:row-span-2',
    feature: true,
  },
  {
    icon: Code2,
    title: 'Web Development',
    description: 'Fast, accessible interfaces built on modern React.',
    tags: ['React', 'Next.js', 'TypeScript'],
    span: 'lg:col-span-2',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'One codebase, both stores, native feel.',
    tags: ['Flutter', 'React Native'],
    span: 'lg:col-span-2',
  },
  {
    icon: Cloud,
    title: 'Cloud & DevOps',
    description: 'Infrastructure that scales without drama.',
    tags: ['AWS', 'Docker', 'CI/CD'],
    span: 'lg:col-span-2',
  },
  {
    icon: Workflow,
    title: 'Automation',
    description: 'Retire the manual steps that slow your team down.',
    tags: ['Pipelines', 'Integrations'],
    span: 'lg:col-span-2',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Design systems that survive the next redesign.',
    tags: ['Design systems', 'Prototyping'],
    span: 'lg:col-span-2',
  },
]

function ServiceCard({ service, index, reduced }) {
  const Icon = service.icon

  // Cursor-follow glow. Skipped under reduced motion and on coarse pointers,
  // where there is no cursor to follow.
  const onPointerMove = useCallback(
    (event) => {
      if (reduced) return
      if (!window.matchMedia('(pointer: fine)').matches) return

      const rect = event.currentTarget.getBoundingClientRect()
      event.currentTarget.style.setProperty(
        '--glow-x',
        `${event.clientX - rect.left}px`,
      )
      event.currentTarget.style.setProperty(
        '--glow-y',
        `${event.clientY - rect.top}px`,
      )
    },
    [reduced],
  )

  return (
    <Reveal
      as="article"
      delay={index * 80}
      className={cn(
        'card group relative isolate overflow-hidden',
        service.span,
      )}
      onPointerMove={onPointerMove}
    >
      {/* Cursor glow. Inert by default: --glow-x/y are unset until hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(220px circle at var(--glow-x, 50%) var(--glow-y, 0%), rgb(var(--accent-rgb) / 0.1), transparent 70%)',
        }}
      />

      {service.feature && (
        <span
          aria-hidden="true"
          className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 -z-10"
        />
      )}

      <span
        className={cn(
          'card-icon transition-transform duration-500 ease-[var(--ease-smooth)]',
          !reduced && 'group-hover:scale-110 group-hover:-rotate-6',
        )}
      >
        <Icon size={service.feature ? 24 : 20} aria-hidden="true" />
      </span>

      <h3
        className={cn(
          'mt-5 font-[var(--weight-semibold)] text-[var(--color-primary)]',
          service.feature
            ? 'text-[length:var(--text-2xl)]'
            : 'text-[length:var(--text-lg)]',
        )}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {/* Stretched link: the whole card is clickable, named by the title. */}
        <a href="#contact" className="after:absolute after:inset-0">
          {service.title}
        </a>
      </h3>

      <p
        className={cn(
          'mt-3 text-[var(--color-text-secondary)]',
          service.feature
            ? 'text-[length:var(--text-base)] max-w-[52ch]'
            : 'text-[length:var(--text-sm)]',
        )}
      >
        {service.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
          >
            {tag}
          </li>
        ))}
      </ul>

      <ArrowUpRight
        size={18}
        aria-hidden="true"
        className={cn(
          'absolute top-6 right-6 text-[var(--color-text-secondary)]',
          'transition-all duration-300 ease-[var(--ease-smooth)]',
          'group-hover:text-[var(--color-accent)]',
          !reduced && 'group-hover:translate-x-1 group-hover:-translate-y-1',
        )}
      />
    </Reveal>
  )
}

export function Services() {
  const reduced = useReducedMotion()

  return (
    <section id="services" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="What we do"
          title="Six ways we help you ship"
          subtitle="One team across strategy, design, and engineering — so nothing gets lost in the handoff."
          align="center"
        />

        <div className="grid grid-cols-1 gap-[var(--gap-grid)] md:grid-cols-2 lg:grid-cols-6">
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
