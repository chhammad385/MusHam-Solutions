// src/hooks/useActiveSection.js
import { useEffect, useState } from 'react'

/**
 * Tracks which section id is currently in view.
 * The rootMargin biases toward the upper third of the viewport so the nav
 * highlight flips when a section reaches reading position, not when its
 * bottom edge grazes the fold.
 */
export function useActiveSection(ids, { rootMargin = '-45% 0px -50% 0px' } = {}) {
  const [active, setActive] = useState(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin, threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids, rootMargin])

  return active
}
