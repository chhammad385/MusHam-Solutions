// src/hooks/useTheme.js
import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'musham-theme'

/**
 * Reads the initial theme from localStorage, falling back to the OS
 * preference. global.css switches on [data-theme="dark"], so all this does is
 * keep that attribute and localStorage in sync.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'dark' || stored === 'light') return stored

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.dataset.theme = 'dark'
    } else {
      delete root.dataset.theme
    }

    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // Follow the OS only while the user hasn't made an explicit choice.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const onChange = (event) => {
      if (window.localStorage.getItem(STORAGE_KEY)) return
      setTheme(event.matches ? 'dark' : 'light')
    }

    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme }
}
