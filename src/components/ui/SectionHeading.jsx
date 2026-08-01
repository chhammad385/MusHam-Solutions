// src/components/ui/SectionHeading.jsx
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/utils/cn'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  as: Tag = 'h2',
  className,
}) {
  const centered = align === 'center'

  return (
    <div
      className={cn(
        'section-header',
        centered && 'is-centered',
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      )}

      {title && (
        <Reveal delay={80}>
          <Tag
            className="text-[length:var(--text-4xl)] font-[var(--weight-bold)] tracking-[var(--tracking-tight)] text-[var(--color-primary)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {title}
          </Tag>
        </Reveal>
      )}

      {subtitle && (
        <Reveal delay={160}>
          <p className="lead">{subtitle}</p>
        </Reveal>
      )}
    </div>
  )
}

export default SectionHeading
