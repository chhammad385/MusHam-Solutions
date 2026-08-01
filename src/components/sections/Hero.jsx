// src/components/sections/Hero.jsx
import { useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowRight, Gauge, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

const HEADLINE_A = 'Software that feels'
const HEADLINE_B = 'effortless to use.'

const STATS = [
  { value: 60, suffix: '+', label: 'Projects shipped' },
  { value: 12, suffix: '', label: 'Countries served' },
  { value: 8, suffix: ' yrs', label: 'Average team tenure' },
  { value: 99, suffix: '%', label: 'Client retention' },
]

const FLOATING = [
  {
    icon: Gauge,
    title: '98 Lighthouse',
    caption: 'Performance budget',
    className: 'left-[-2rem] top-[18%]',
    duration: 5,
    parallax: 60,
  },
  {
    icon: ShieldCheck,
    title: 'SOC 2 ready',
    caption: 'Security baked in',
    className: 'right-[-1rem] top-[8%]',
    duration: 6.5,
    parallax: -40,
  },
  {
    icon: Sparkles,
    title: 'AI-native',
    caption: 'From day one',
    className: 'right-[2rem] bottom-[12%]',
    duration: 4.2,
    parallax: 90,
  },
]

function CountUp({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(reduced ? value : 0)

  useEffect(() => {
    if (!inView || reduced) return

    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })

    return () => controls.stop()
  }, [inView, reduced, value])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

function FloatingCard({ item, scrollYProgress, reduced }) {
  const y = useTransform(scrollYProgress, [0, 1], [0, item.parallax])
  const Icon = item.icon

  return (
    <motion.div
      style={reduced ? undefined : { y }}
      animate={reduced ? undefined : { y: [0, -12, 0] }}
      transition={
        reduced
          ? undefined
          : {
              duration: item.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }
      }
      className={`glass absolute hidden w-max items-center gap-3 px-4 py-3 lg:flex ${item.className}`}
    >
      <span className="card-icon !h-9 !w-9">
        <Icon size={16} />
      </span>
      <span className="block">
        <span className="block text-[length:var(--text-sm)] font-[var(--weight-semibold)] text-[var(--color-primary)]">
          {item.title}
        </span>
        <span className="block text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
          {item.caption}
        </span>
      </span>
    </motion.div>
  )
}

export function Hero() {
  const sectionRef = useRef(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const gridY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40])
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0])

  const words = [
    ...HEADLINE_A.split(' ').map((word) => ({ word, accent: false })),
    ...HEADLINE_B.split(' ').map((word) => ({ word, accent: true })),
  ]

  return (
    <section
      id="home"
      ref={sectionRef}
      className="bg-noise relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16"
    >
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: gridY }}
        className="bg-grid bg-grid-fade pointer-events-none absolute inset-0 -z-10"
      />
      <div
        aria-hidden="true"
        className="bg-glow pointer-events-none absolute inset-0 -z-10"
      />

      <motion.div
        style={reduced ? undefined : { y: contentY }}
        className="container relative"
      >
        <div className="relative mx-auto max-w-3xl text-center">
          {FLOATING.map((item) => (
            <FloatingCard
              key={item.title}
              item={item}
              scrollYProgress={scrollYProgress}
              reduced={reduced}
            />
          ))}

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <Badge icon={Sparkles}>AI-first product studio</Badge>
          </motion.div>

          <h1
            className="mt-6 text-[length:var(--text-6xl)] font-[var(--weight-extrabold)] leading-[var(--leading-none)] tracking-[var(--tracking-tighter)] text-[var(--color-primary)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="sr-only">
              {HEADLINE_A} {HEADLINE_B}
            </span>
            <span aria-hidden="true">
              {words.map((entry, index) => (
                <motion.span
                  key={`${entry.word}-${index}`}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduced ? 0 : 0.15 + index * 0.04,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={
                    entry.accent
                      ? 'mr-[0.25em] inline-block bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] bg-clip-text text-transparent'
                      : 'mr-[0.25em] inline-block'
                  }
                >
                  {entry.word}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.5, duration: 0.6 }}
            className="lead mx-auto mt-6 max-w-[60ch]"
          >
            We design and build AI-powered products for teams who care about
            craft — from first prototype to production scale.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.62, duration: 0.6 }}
            className="btn-stack-mobile mt-10 flex flex-wrap justify-center gap-3"
          >
            <a href="#contact" className="btn btn-accent btn-lg">
              Start a project
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#work" className="btn btn-outline btn-lg">
              View our work
            </a>
          </motion.div>
        </div>

        <motion.dl
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduced ? 0 : 0.75, duration: 0.6 }}
          className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-y-8 lg:grid-cols-4"
        >
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={
                index === 0
                  ? 'px-4 text-center'
                  : 'px-4 text-center lg:border-l lg:border-[var(--color-border)]'
              }
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span
                  className="block text-[length:var(--text-4xl)] font-[var(--weight-bold)] text-[var(--color-primary)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </span>
                <span className="mt-1 block text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      <motion.a
        href="#services"
        style={reduced ? undefined : { opacity: indicatorOpacity }}
        className="absolute inset-x-0 bottom-8 mx-auto flex w-max flex-col items-center gap-2 text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-5 items-start justify-center rounded-full border border-[var(--color-border)] p-1"
        >
          <motion.span
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={
              reduced
                ? undefined
                : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
            }
            className="block h-1.5 w-1 rounded-full bg-[var(--color-accent)]"
          />
        </span>
        Scroll
      </motion.a>
    </section>
  )
}

export default Hero
