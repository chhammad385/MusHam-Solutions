// src/components/ui/WelcomePopup.jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/utils/cn'

// Same number the Contact section dials — digits only, country code first.
const WHATSAPP_NUMBER = '923056432815'
const WHATSAPP_MESSAGE =
  'Hey, Can you just acknowledge me about Musham Solution Services?'

const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`

// Long enough for the hero to paint and settle, short enough that it still
// reads as part of the page load.
const OPEN_DELAY_MS = 1400

/**
 * Welcome prompt that fades in shortly after the site loads and hands the
 * visitor straight to WhatsApp with the message pre-written.
 *
 * Pass the Lenis ref from App so smooth scrolling is paused while the overlay
 * is up — otherwise the wheel keeps driving the page behind the dialog.
 */
export function WelcomePopup({ lenis }) {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  const closeButtonRef = useRef(null)
  const ctaRef = useRef(null)

  const close = useCallback(() => setOpen(false), [])

  // Deliberately ungated: every page load re-opens the prompt. Dismissing it
  // only lasts for that load, so a refresh brings it back.
  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [])

  // Lock the page behind the overlay: Lenis first (it owns the wheel), then
  // body overflow for the native scrollbar and touch scrolling.
  useEffect(() => {
    if (!open) return

    // Held locally so the cleanup restarts the instance this effect paused,
    // not whatever the ref happens to point at by teardown time.
    const instance = lenis?.current
    instance?.stop()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
      instance?.start()
    }
  }, [open, lenis])

  // Escape closes; Tab is trapped between the close button and the CTA so
  // keyboard users cannot wander into the inert page underneath.
  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement
    ctaRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab') return

      const first = closeButtonRef.current
      const last = ctaRef.current
      if (!first || !last) return

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
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [open, close])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4"
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Backdrop — clicking it dismisses, same as Escape. */}
          <div
            className="absolute inset-0 bg-[rgb(var(--shadow-rgb)/0.55)] backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-popup-title"
            className={cn(
              'relative w-full max-w-md overflow-hidden text-center',
              'rounded-[var(--radius-card)] border border-[var(--color-border)]',
              'bg-[var(--color-card)] px-6 py-10 sm:px-10',
              'shadow-[0_24px_60px_-12px_rgb(var(--shadow-rgb)/0.35)]',
            )}
            initial={reduced ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Accent wash so the card does not read as a plain alert box. */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[rgb(var(--accent-rgb)/0.12)] to-transparent"
              aria-hidden="true"
            />

            <button
              ref={closeButtonRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className={cn(
                'absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center',
                'rounded-full text-[var(--color-text-secondary)]',
                'transition-colors duration-200',
                'hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text)]',
                'focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-[rgb(var(--accent-rgb)/0.4)]',
              )}
            >
              <X size={18} aria-hidden="true" />
            </button>

            <div className="relative">
              <span
                className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[rgb(var(--accent-rgb)/0.12)] text-[var(--color-accent)]"
                aria-hidden="true"
              >
                <MessageCircle size={26} />
              </span>

              <h2
                id="welcome-popup-title"
                className={cn(
                  'mt-6 font-[var(--font-heading)]',
                  'text-[length:var(--text-2xl)] font-[var(--weight-bold)]',
                  'leading-[var(--leading-snug)] tracking-[var(--tracking-tight)]',
                  'text-[var(--color-text)]',
                )}
              >
                Click here to know about us
              </h2>

              <p className="mx-auto mt-3 max-w-xs text-[length:var(--text-base)] leading-[var(--leading-normal)] text-[var(--color-text-secondary)]">
                One tap and you are talking to the MusHam Solutions team on
                WhatsApp — the message is already written for you.
              </p>

              <a
                ref={ctaRef}
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="btn btn-accent btn-lg mt-8 w-full"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Chat on WhatsApp
              </a>

              <button
                type="button"
                onClick={close}
                className="mt-4 text-[length:var(--text-sm)] text-[var(--color-text-secondary)] underline-offset-4 transition-colors duration-200 hover:text-[var(--color-text)] hover:underline"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WelcomePopup
