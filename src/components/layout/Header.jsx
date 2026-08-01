// src/components/layout/Header.jsx
import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/cn'

const LINKS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Process', href: '#process', id: 'process' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Contact', href: '#contact', id: 'contact' },
]

const SECTION_IDS = LINKS.map((link) => link.id)

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const activeSection = useActiveSection(SECTION_IDS)
  const reduced = useReducedMotion()

  const panelRef = useRef(null)
  const toggleRef = useRef(null)

  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  // Lock scroll, close on Escape, and keep focus inside the open panel.
  useEffect(() => {
    if (!open) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return

      const focusables = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled])',
      )
      if (!focusables.length) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <motion.header
        initial={reduced ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-[var(--z-sticky)]',
          'transition-[background-color,backdrop-filter,border-color,box-shadow]',
          'duration-300 ease-[var(--ease-smooth)]',
          scrolled
            ? 'glass-bar shadow-[var(--shadow-sm)]'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Main"
          className={cn(
            'container flex items-center justify-between',
            'transition-[height] duration-300 ease-[var(--ease-smooth)]',
            scrolled ? 'h-16' : 'h-20',
          )}
        >
          <a
            href="#home"
            className="flex items-center"
          >
            <img src="/logo.png" alt="MusHam Solutions Logo" className="h-12 md:h-14 w-auto object-contain" />
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => {
              const isActive = activeSection === link.id
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group relative text-[length:var(--text-sm)] font-[var(--weight-medium)]',
                      'transition-colors duration-200',
                      isActive
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]',
                    )}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute -bottom-1 left-0 h-[2px] w-full rounded-full',
                        'origin-left bg-[var(--color-accent)]',
                        'transition-transform duration-300 ease-[var(--ease-smooth)]',
                        isActive
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
              }
              className="btn btn-ghost btn-icon"
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <a href="#contact" className="btn btn-accent btn-sm hidden lg:inline-flex">
              Book a call
            </a>

            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="btn btn-ghost btn-icon lg:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="glass-strong fixed inset-0 z-[var(--z-overlay)] flex flex-col lg:hidden"
            style={{ borderRadius: 0 }}
          >
            <div className="container flex h-20 items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  toggleRef.current?.focus()
                }}
                aria-label="Close menu"
                className="btn btn-ghost btn-icon"
              >
                <X size={22} />
              </button>
            </div>

            <ul className="container flex flex-1 flex-col justify-center gap-2">
              {LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={reduced ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: reduced ? 0 : 0.06 * index,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-[length:var(--text-3xl)] font-[var(--weight-semibold)] text-[var(--color-primary)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <div className="container pb-10">
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="btn btn-accent btn-lg btn-block"
              >
                Book a call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
