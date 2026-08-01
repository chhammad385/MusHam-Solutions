// Temporary diagnostic — deleted after the run.
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const diag = await page.evaluate(() => {
  const describe = (el) => {
    const r = el.getBoundingClientRect()
    return {
      tag: el.tagName.toLowerCase(),
      cls: (el.className?.toString() || '').slice(0, 90),
      section: el.closest('section')?.id || el.closest('footer') ? 'footer' : '?',
      left: Math.round(r.left),
      right: Math.round(r.right),
      width: Math.round(r.width),
    }
  }

  // What actually sticks out past the viewport?
  const wide = [...document.querySelectorAll('body *')]
    .filter((el) => {
      const r = el.getBoundingClientRect()
      return r.right > window.innerWidth + 1 || r.left < -1
    })
    .map(describe)
    .slice(0, 20)

  // What stays at opacity 0?
  const invisible = [...document.querySelectorAll('main *')]
    .filter((el) => {
      const cs = getComputedStyle(el)
      return (
        cs.opacity === '0' &&
        el.getBoundingClientRect().height > 40 &&
        !el.closest('[aria-hidden="true"]')
      )
    })
    .map((el) => ({
      ...describe(el),
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform.slice(0, 40),
    }))
    .slice(0, 20)

  return { wide, invisible, winWidth: window.innerWidth, scrollW: document.documentElement.scrollWidth }
})

console.log('viewport:', diag.winWidth, 'scrollWidth:', diag.scrollW)
console.log('\n=== OVERFLOWING ELEMENTS ===')
console.log(JSON.stringify(diag.wide, null, 2))
console.log('\n=== INVISIBLE ELEMENTS (first 20) ===')
console.log(JSON.stringify(diag.invisible, null, 2))

await browser.close()
