// src/components/sections/Projects.jsx
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utils/cn'

// PLACEHOLDER IMAGERY — swap these Unsplash URLs for real case-study assets.
// Keep the explicit width/height attributes when you do, or you reintroduce
// layout shift.
const PROJECTS = [
  {
    title: 'Atlas Analytics',
    category: 'AI Platform',
    description:
      'A natural-language analytics layer over a 40-table warehouse. Query in plain English, get an auditable SQL trail.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    tags: ['Next.js', 'Python', 'LLM'],
    href: '#work',
    span: 'lg:col-span-7',
  },
  {
    title: 'Northwind Health',
    category: 'Mobile App',
    description:
      'Patient companion app for a clinic network, shipped to both stores in eleven weeks.',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    tags: ['Flutter', 'Supabase'],
    href: '#work',
    span: 'lg:col-span-5',
  },
  {
    title: 'Meridian Freight',
    category: 'Automation',
    description:
      'Replaced a spreadsheet dispatch process with an event-driven pipeline. Six hours of manual work per day, gone.',
    image:
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Node', 'AWS', 'Docker'],
    href: '#work',
    span: 'lg:col-span-5',
  },
  {
    title: 'Cobalt Design System',
    category: 'Design System',
    description:
      'A 60-component library and token pipeline adopted by four product teams.',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    tags: ['React', 'Tailwind', 'Storybook'],
    href: '#work',
    span: 'lg:col-span-7',
  },
]

export function Projects() {
  const reduced = useReducedMotion()

  return (
    <section id="work" className="section">
      <div className="container">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            title="Recent projects"
            subtitle="A few things we have shipped lately."
            className="!mb-0"
          />
          <a
            href="#contact"
            className="link inline-flex items-center gap-1 self-start text-[length:var(--text-sm)] md:mb-2"
          >
            View all projects
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-[var(--gap-grid)] lg:grid-cols-12">
          {PROJECTS.map((project, index) => (
            <motion.article
              key={project.title}
              initial={
                reduced
                  ? false
                  : { opacity: 0, x: index % 2 === 0 ? -24 : 24 }
              }
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'card card-flush group relative isolate',
                project.span,
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={project.image}
                  alt={`${project.title} — ${project.category} case study`}
                  width={1200}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className={cn(
                    'h-full w-full object-cover',
                    'transition-transform duration-[600ms] ease-[var(--ease-smooth)]',
                    !reduced && 'group-hover:scale-[1.08]',
                  )}
                />

                {/* Scrim keeps the overlaid tag legible on light photos. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent"
                />

                <span className="glass absolute top-4 left-4 rounded-full px-3 py-1 text-[length:var(--text-xs)] font-[var(--weight-medium)] text-[var(--color-primary)]">
                  {project.category}
                </span>
              </div>

              <div className="p-6">
                <h3
                  className="text-[length:var(--text-xl)] font-[var(--weight-semibold)] text-[var(--color-primary)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  <a href={project.href} className="after:absolute after:inset-0">
                    {project.title}
                  </a>
                </h3>

                <p className="mt-2 text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                  {project.description}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-[var(--color-border)] px-2.5 py-1 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>

                {/* Present for screen readers and keyboard users at all times;
                    only the visual slide-up is conditional. */}
                <span
                  className={cn(
                    'mt-5 inline-flex items-center gap-1.5 text-[length:var(--text-sm)] font-[var(--weight-semibold)] text-[var(--color-accent)]',
                    'transition-all duration-300 ease-[var(--ease-smooth)]',
                    !reduced &&
                      'md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100',
                  )}
                >
                  View case study
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
