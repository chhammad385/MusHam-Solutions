// src/components/sections/TechStack.jsx
import { motion, useReducedMotion } from 'framer-motion'
import {
  AwsIcon,
  DockerIcon,
  FlutterIcon,
  NextIcon,
  NodeIcon,
  PostgresIcon,
  PythonIcon,
  ReactIcon,
  SpringIcon,
  SupabaseIcon,
  TailwindIcon,
  TypeScriptIcon,
} from '@/components/icons/brands'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utils/cn'

const STACK = [
  { name: 'React', Icon: ReactIcon },
  { name: 'Next.js', Icon: NextIcon },
  { name: 'TypeScript', Icon: TypeScriptIcon },
  { name: 'Node.js', Icon: NodeIcon },
  { name: 'Spring Boot', Icon: SpringIcon },
  { name: 'Python', Icon: PythonIcon },
  { name: 'Flutter', Icon: FlutterIcon },
  { name: 'Docker', Icon: DockerIcon },
  { name: 'AWS', Icon: AwsIcon },
  { name: 'Supabase', Icon: SupabaseIcon },
  { name: 'PostgreSQL', Icon: PostgresIcon },
  { name: 'Tailwind', Icon: TailwindIcon },
]

function MarqueeRow({ reduced }) {
  // Under reduced motion, render a static wrapped row instead of a loop.
  if (reduced) {
    return (
      <ul className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-4">
        {STACK.map(({ name, Icon }) => (
          <li
            key={name}
            className="flex items-center gap-2 text-[var(--color-text-secondary)]"
          >
            <Icon className="h-5 w-5" />
            <span className="text-[length:var(--text-sm)]">{name}</span>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="group mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
    >
      <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-12 group-hover:[animation-play-state:paused]">
        {/* Duplicated once so translateX(-50%) loops seamlessly. */}
        {[...STACK, ...STACK].map(({ name, Icon }, index) => (
          <span
            key={`${name}-${index}`}
            className="flex shrink-0 items-center gap-2 text-[var(--color-text-secondary)]"
          >
            <Icon className="h-5 w-5" />
            <span className="text-[length:var(--text-sm)] whitespace-nowrap">
              {name}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function TechStack() {
  const reduced = useReducedMotion()

  return (
    <section id="stack" className="section section-alt">
      <div className="container">
        <SectionHeading
          eyebrow="Our toolkit"
          title="Tools we reach for"
          subtitle="Chosen for maturity and hiring pool, not novelty."
          align="center"
        />

        <h3 className="sr-only">Technologies we work with</h3>
        <ul className="grid grid-cols-2 gap-[var(--gap-grid)] min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {STACK.map(({ name, Icon }, index) => (
            <motion.li
              key={name}
              initial={reduced ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                delay: reduced ? 0 : index * 0.04,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                'card card-static group flex aspect-[4/3] flex-col items-center justify-center gap-3 !p-4',
                'transition-all duration-300 ease-[var(--ease-smooth)]',
                'hover:-translate-y-1 hover:border-[rgb(var(--accent-rgb)/0.3)] hover:shadow-[var(--shadow-accent)]',
              )}
            >
              <Icon
                className={cn(
                  'h-8 w-8 text-[var(--color-text-secondary)] opacity-55 grayscale',
                  'transition-all duration-300 ease-[var(--ease-smooth)]',
                  'group-hover:text-[var(--color-accent)] group-hover:opacity-100 group-hover:grayscale-0',
                )}
              />
              <span className="text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
                {name}
              </span>
            </motion.li>
          ))}
        </ul>

        <MarqueeRow reduced={reduced} />
      </div>
    </section>
  )
}

export default TechStack
