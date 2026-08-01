// src/components/layout/Footer.jsx
import { useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowUp, Send } from 'lucide-react'
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from '@/components/icons/brands'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

const COLUMNS = [
  {
    heading: 'Services',
    links: [
      { label: 'AI & Machine Learning', href: '#services' },
      { label: 'Web Development', href: '#services' },
      { label: 'Mobile Apps', href: '#services' },
      { label: 'Cloud & DevOps', href: '#services' },
      { label: 'UI/UX Design', href: '#services' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Process', href: '#process' },
      { label: 'Work', href: '#work' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'FAQ', href: '#faq' },
      { label: 'Tech stack', href: '#stack' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy policy', href: '#' },
      { label: 'Terms of service', href: '#' },
      { label: 'Cookie policy', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
  },
]

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com', Icon: GithubIcon },
  { label: 'X', href: 'https://x.com', Icon: XIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedinIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
]

function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) return

    // TODO: send to a real list provider from a server endpoint.
    setSubscribed(true)
    setEmail('')
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">
          Email address for our newsletter
        </label>
        <div
          className={cn(
            'flex items-center gap-2 rounded-[var(--radius-input)]',
            'border border-[var(--color-border)] bg-[var(--color-card)] p-1.5',
            'transition-colors duration-200',
            'focus-within:border-[var(--color-accent)]',
          )}
        >
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-[length:var(--text-sm)] text-[var(--color-text)] placeholder:text-[var(--color-text-secondary)] focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Subscribe to the newsletter"
            className="btn btn-accent btn-sm shrink-0"
          >
            <Send size={15} aria-hidden="true" />
          </button>
        </div>
      </form>

      <p
        aria-live="polite"
        className="mt-2 min-h-[1.25rem] text-[length:var(--text-xs)] text-[var(--color-text-secondary)]"
      >
        {subscribed
          ? 'Subscribed — thanks. One short email a month, no more.'
          : 'Occasional notes on what we are building. No spam.'}
      </p>
    </div>
  )
}

export function Footer({ onScrollTop }) {
  const reduced = useReducedMotion()

  const handleScrollTop = () => {
    // Lenis owns scrolling. App.jsx should pass its scrollTo so the two do not
    // fight; the native fallback only runs when no handler is provided.
    if (onScrollTop) {
      onScrollTop()
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-noise relative bg-[var(--color-bg-secondary)] pt-20 pb-10">
      {/* Animated top border: static hairline with a travelling accent beam. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px overflow-hidden bg-[var(--color-border)]"
      >
        {!reduced && (
          <span className="block h-px w-1/4 animate-[border-sweep_6s_linear_infinite] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
        )}
      </div>

      <div className="container">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div
              className="flex items-center"
            >
              <img src="/logo.png" alt="MusHam Solutions Logo" className="h-12 md:h-14 w-auto object-contain" />
            </div>
            <p className="mt-3 max-w-[40ch] text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
              An AI-first product studio building software teams actually enjoy
              using.
            </p>
          </div>

          <Newsletter />
        </Reveal>

        <Reveal
          delay={80}
          className="mt-16 grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 md:grid-cols-4"
        >
          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h3 className="text-[length:var(--text-sm)] font-[var(--weight-semibold)] tracking-[var(--tracking-wider)] uppercase text-[var(--color-primary)]">
                {column.heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={cn(
                        'inline-block text-[length:var(--text-sm)] text-[var(--color-text-secondary)]',
                        'transition-all duration-200 hover:text-[var(--color-text)]',
                        !reduced && 'hover:translate-x-0.5',
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-[var(--color-border)] pt-8 sm:flex-row">
          <p className="text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
            &copy; {new Date().getFullYear()} MusHam Solutions. All rights
            reserved.
          </p>

          <div className="flex items-center gap-3">
            <ul className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full',
                      'border border-[var(--color-border)] text-[var(--color-text-secondary)]',
                      'transition-all duration-300 ease-[var(--ease-smooth)]',
                      'hover:border-[rgb(var(--accent-rgb)/0.4)] hover:bg-[rgb(var(--accent-rgb)/0.08)] hover:text-[var(--color-accent)]',
                      !reduced && 'hover:-translate-y-[3px]',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleScrollTop}
              className="btn btn-ghost btn-sm"
            >
              <ArrowUp size={15} aria-hidden="true" />
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
