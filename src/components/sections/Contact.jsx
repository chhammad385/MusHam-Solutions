// src/components/sections/Contact.jsx
import { useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Check, Loader2, Mail, MapPin, MessageCircle } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utils/cn'

// Placeholder contact details — swap for the real ones.
const EMAIL = 'hello@musham.solutions'
const WHATSAPP_NUMBER = '910000000000' // digits only, country code first
const LOCATION = 'Bengaluru, India'

const BUDGETS = [
  'Under $10k',
  '$10k – $25k',
  '$25k – $50k',
  '$50k – $100k',
  'Over $100k',
  'Not sure yet',
]

const CHANNELS = [
  {
    icon: Mail,
    label: 'Email',
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    external: false,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: 'Message us directly',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    external: true,
  },
  {
    icon: MapPin,
    label: 'Studio',
    value: LOCATION,
    href: null,
    external: false,
  },
]

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = 'Please tell us your name.'
  }

  if (!values.email.trim()) {
    errors.email = 'We need an email to reply to.'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'That email address does not look right.'
  }

  if (values.message.trim().length < 10) {
    errors.message = 'A little more detail helps — at least 10 characters.'
  }

  return errors
}

const EMPTY = { name: '', email: '', company: '', budget: '', message: '' }

const FIELD_CLASSES = cn(
  'w-full rounded-[var(--radius-input)] border border-[var(--color-border)]',
  'bg-[var(--color-bg-secondary)] px-4 py-3',
  'text-[length:var(--text-base)] text-[var(--color-text)]',
  'placeholder:text-[var(--color-text-secondary)]',
  'transition-colors duration-200',
  'focus:border-[var(--color-accent)] focus:outline-none',
  'focus:ring-2 focus:ring-[rgb(var(--accent-rgb)/0.25)]',
)

function Field({ id, label, error, children, optional = false }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[length:var(--text-sm)] font-[var(--weight-medium)] text-[var(--color-primary)]"
      >
        {label}
        {optional && (
          <span className="ml-1 font-[var(--weight-regular)] text-[var(--color-text-secondary)]">
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-[length:var(--text-sm)] text-[var(--color-danger)]"
        >
          {error}
        </p>
      )}
    </div>
  )
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const formRef = useRef(null)

  const setField = (name) => (event) => {
    setValues((current) => ({ ...current, [name]: event.target.value }))
  }

  const handleBlur = (name) => () => {
    const fieldErrors = validate(values)
    setErrors((current) => ({ ...current, [name]: fieldErrors[name] }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const fieldErrors = validate(values)
    setErrors(fieldErrors)

    const firstInvalid = ['name', 'email', 'message'].find(
      (name) => fieldErrors[name],
    )

    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus()
      return
    }

    setStatus('submitting')

    // TODO: POST `values` to a real endpoint here, e.g.
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(values) })
    // Spam protection (rate limiting, verification) belongs on that endpoint,
    // not in this component.
    await new Promise((resolve) => setTimeout(resolve, 1200))

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="card flex flex-col items-center justify-center py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-[var(--radius-pill)] bg-[rgb(var(--success-rgb)/0.12)] text-[var(--color-success)]">
          <Check size={28} aria-hidden="true" />
        </span>
        <h3
          className="mt-6 text-[length:var(--text-2xl)] font-[var(--weight-semibold)] text-[var(--color-primary)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Message sent
        </h3>
        <p className="mt-2 max-w-sm text-[length:var(--text-base)] text-[var(--color-text-secondary)]">
          Thanks for reaching out. We read every message ourselves and will
          reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(EMPTY)
            setErrors({})
            setStatus('idle')
          }}
          className="btn btn-outline mt-8"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="card">
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="name" label="Name" error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={values.name}
              onChange={setField('name')}
              onBlur={handleBlur('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={FIELD_CLASSES}
            />
          </Field>

          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={setField('email')}
              onBlur={handleBlur('email')}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={FIELD_CLASSES}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field id="company" label="Company" optional>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              value={values.company}
              onChange={setField('company')}
              className={FIELD_CLASSES}
            />
          </Field>

          <Field id="budget" label="Project budget" optional>
            <select
              id="budget"
              name="budget"
              value={values.budget}
              onChange={setField('budget')}
              className={FIELD_CLASSES}
            >
              <option value="">Select a range</option>
              {BUDGETS.map((budget) => (
                <option key={budget} value={budget}>
                  {budget}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="message" label="Message" error={errors.message}>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={setField('message')}
            onBlur={handleBlur('message')}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-error' : undefined}
            placeholder="What are you building, and what does success look like?"
            className={cn(FIELD_CLASSES, 'resize-y')}
          />
        </Field>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn btn-accent btn-lg btn-block"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 size={18} aria-hidden="true" className="animate-spin" />
              Sending…
            </>
          ) : (
            'Send message'
          )}
        </button>

        {/* Screen readers get told the outcome, not just sighted users. */}
        <p aria-live="polite" className="sr-only">
          {status === 'submitting' ? 'Sending your message.' : ''}
        </p>
      </div>
    </form>
  )
}

export function Contact() {
  const reduced = useReducedMotion()

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Get in touch"
          title="Tell us what you're building"
          subtitle="A short description is enough to start. We'll reply with questions, a rough shape, and next steps."
        />

        <div className="grid grid-cols-1 gap-[var(--gap-grid)] lg:grid-cols-5">
          <Reveal className="lg:col-span-3">
            <ContactForm />
          </Reveal>

          <div className="flex flex-col gap-5 lg:col-span-2">
            {CHANNELS.map((channel, index) => {
              const Icon = channel.icon
              const body = (
                <>
                  <span className="card-icon shrink-0">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[length:var(--text-sm)] text-[var(--color-text-secondary)]">
                      {channel.label}
                    </span>
                    <span className="block truncate text-[length:var(--text-base)] font-[var(--weight-medium)] text-[var(--color-primary)]">
                      {channel.value}
                    </span>
                  </span>
                </>
              )

              return (
                <Reveal key={channel.label} delay={index * 80}>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className={cn(
                        'glass flex items-center gap-4 rounded-[var(--radius-card)] p-5',
                        'transition-transform duration-300 ease-[var(--ease-smooth)]',
                        !reduced && 'hover:-translate-y-1',
                      )}
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="glass flex items-center gap-4 rounded-[var(--radius-card)] p-5">
                      {body}
                    </div>
                  )}
                </Reveal>
              )
            })}

            {/* Map placeholder. Drop an <iframe> embed in here when you have
                consent handling in place — a live third-party map loads
                trackers before the user has agreed to anything. */}
            <Reveal delay={240}>
              <div className="bg-grid relative flex aspect-video items-center justify-center overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <div className="relative z-[1] text-center">
                  <MapPin
                    size={28}
                    aria-hidden="true"
                    className="mx-auto text-[var(--color-accent)]"
                  />
                  <p className="mt-3 text-[length:var(--text-sm)] font-[var(--weight-medium)] text-[var(--color-primary)]">
                    {LOCATION}
                  </p>
                  <p className="text-[length:var(--text-xs)] text-[var(--color-text-secondary)]">
                    Remote-first, working across 12 time zones
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
