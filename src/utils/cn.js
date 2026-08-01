/**
 * Join class names, dropping falsy values so conditionals stay inline:
 * cn('p-4', isActive && 'bg-brand-500')
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
