// src/components/ui/Badge.jsx
import { cn } from '@/utils/cn'

export function Badge({ children, icon: Icon, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1',
        'text-[length:var(--text-sm)] font-[var(--weight-medium)]',
        'bg-[rgb(var(--accent-rgb)/0.1)] text-[var(--color-accent)]',
        className,
      )}
    >
      {Icon && <Icon size={14} aria-hidden="true" />}
      {children}
    </span>
  )
}

export default Badge
