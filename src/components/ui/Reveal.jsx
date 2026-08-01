// src/components/ui/Reveal.jsx
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Fades and lifts children into view on scroll.
 * Under reduced motion the children render immediately with no transform —
 * animating opacity there would leave content invisible if the observer
 * never fires.
 */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  once = true,
  as = 'div',
  className,
  ...props
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as] ?? motion.div

  if (reduced) {
    const Tag = as
    return (
      <Tag className={className} {...props}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal
