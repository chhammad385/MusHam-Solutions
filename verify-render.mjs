// Temporary verification harness — deleted after the run.
import { chromium } from 'playwright'

const URL = process.env.VERIFY_URL ?? 'http://localhost:4173/'

const SECTIONS = [
  'home',
  'services',
  'about',
  'process',
  'work',
  'stack',
  'testimonials',
  'faq',
  'contact',
]

const browser = await chromium.launch()
const errors = []
const warnings = []

async function audit(label, { theme = null, width = 1440, height = 900 } = {}) {
  const page = await browser.newPage({ viewport: { width, height } })

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[${label}] console: ${msg.text()}`)
    if (msg.type() === 'warning') warnings.push(`[${label}] warn: ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`[${label}] pageerror: ${err.message}`))

  await page.goto(URL, { waitUntil: 'networkidle' })

  if (theme === 'dark') {
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark'
    })
  }

  // Scroll the full page so every whileInView reveal actually fires, then
  // return to the top. Checking visibility without this only ever measures
  // above-the-fold content and reports false failures.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.75
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 110))
    }
    window.scrollTo(0, 0)
  })

  await page.waitForTimeout(1400)

  const report = await page.evaluate((sectionIds) => {
    const out = { sections: {}, counts: {}, styles: {} }

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      out.sections[id] = el ? Math.round(el.getBoundingClientRect().height) : 0
    }

    const body = getComputedStyle(document.body)
    out.styles.bodyBg = body.backgroundColor
    out.styles.bodyColor = body.color
    out.styles.bodyFont = body.fontFamily.split(',')[0]

    const h1 = document.querySelector('h1')
    out.styles.h1Size = h1 ? getComputedStyle(h1).fontSize : null

    out.counts.headings = document.querySelectorAll('h1,h2,h3').length

    // Regression guard: an unlayered reset in global.css silently beat every
    // Tailwind spacing utility once. Probe live values rather than trusting
    // that the layer assignment is still correct.
    const probe = document.createElement('div')
    probe.className = 'pl-12 mt-6 p-4'
    document.body.appendChild(probe)
    const probeCs = getComputedStyle(probe)
    out.styles.probePl = probeCs.paddingLeft
    out.styles.probeMt = probeCs.marginTop
    probe.remove()
    out.counts.buttons = document.querySelectorAll('button').length
    out.counts.links = document.querySelectorAll('a[href]').length
    out.counts.images = document.querySelectorAll('img').length
    out.counts.cards = document.querySelectorAll('.card').length
    out.counts.glass = document.querySelectorAll('.glass, .glass-strong').length
    out.counts.svg = document.querySelectorAll('svg').length
    out.counts.h1 = document.querySelectorAll('h1').length

    // Elements still invisible after animations should have settled.
    out.counts.invisible = [
      ...document.querySelectorAll('main *'),
    ].filter((el) => {
      const cs = getComputedStyle(el)
      return (
        cs.opacity === '0' &&
        el.getBoundingClientRect().height > 40 &&
        !el.closest('[aria-hidden="true"]')
      )
    }).length

    // Any element wider than the viewport = horizontal overflow bug.
    out.counts.overflowing = [
      ...document.querySelectorAll('body *'),
    ].filter((el) => el.getBoundingClientRect().width > window.innerWidth + 2)
      .length

    out.docScrollWidth = document.documentElement.scrollWidth
    out.winWidth = window.innerWidth
    out.bodyHeight = Math.round(document.body.scrollHeight)

    // Images that resolved to zero natural size failed to load.
    out.counts.brokenImages = [...document.querySelectorAll('img')].filter(
      (img) => img.complete && img.naturalWidth === 0,
    ).length

    // Accessibility spot checks.
    out.a11y = {
      imgsMissingAlt: [...document.querySelectorAll('img')].filter(
        (i) => !i.hasAttribute('alt'),
      ).length,
      btnsNoName: [...document.querySelectorAll('button')].filter(
        (b) =>
          !b.textContent.trim() &&
          !b.getAttribute('aria-label') &&
          !b.getAttribute('title'),
      ).length,
      inputsNoLabel: [...document.querySelectorAll('input,select,textarea')].filter(
        (el) => {
          if (el.getAttribute('aria-label')) return false
          if (el.id && document.querySelector(`label[for="${el.id}"]`)) return false
          return !el.closest('label')
        },
      ).length,
      ariaExpanded: document.querySelectorAll('[aria-expanded]').length,
      ariaControls: document.querySelectorAll('[aria-controls]').length,
      liveRegions: document.querySelectorAll('[aria-live]').length,
    }

    return out
  }, SECTIONS)

  await page.close()
  return report
}

const desktop = await audit('desktop-light')
const dark = await audit('dark', { theme: 'dark' })
const mobile = await audit('mobile', { width: 390, height: 844 })
const tablet = await audit('tablet', { width: 820, height: 1180 })

console.log('=== SECTION HEIGHTS (desktop) ===')
for (const [id, h] of Object.entries(desktop.sections)) {
  console.log(`  ${h > 100 ? 'OK  ' : 'FAIL'} #${id}: ${h}px`)
}

console.log('\n=== COUNTS (desktop) ===')
console.log(JSON.stringify(desktop.counts, null, 2))

console.log('\n=== STYLES ===')
console.log('light:', JSON.stringify(desktop.styles))
console.log('dark: ', JSON.stringify(dark.styles))

console.log('\n=== A11Y (desktop) ===')
console.log(JSON.stringify(desktop.a11y, null, 2))

console.log('\n=== RESPONSIVE ===')
for (const [label, r] of [
  ['desktop-1440', desktop],
  ['tablet-820', tablet],
  ['mobile-390', mobile],
]) {
  const overflow = r.docScrollWidth > r.winWidth + 2
  console.log(
    `  ${overflow ? 'FAIL' : 'OK  '} ${label}: scrollW=${r.docScrollWidth} winW=${r.winWidth} ` +
      `height=${r.bodyHeight} wideEls=${r.counts.overflowing} invisible=${r.counts.invisible}`,
  )
}

console.log('\n=== ERRORS ===')
console.log(errors.length ? errors.join('\n') : '(none)')

const realWarnings = warnings.filter(
  (w) => !/DevTools|Download the React|source map/i.test(w),
)
console.log('\n=== WARNINGS ===')
console.log(realWarnings.length ? realWarnings.slice(0, 15).join('\n') : '(none)')

await browser.close()

const failed =
  errors.length > 0 ||
  Object.values(desktop.sections).some((h) => h < 100) ||
  desktop.counts.brokenImages > 0 ||
  desktop.a11y.btnsNoName > 0 ||
  desktop.a11y.inputsNoLabel > 0 ||
  desktop.a11y.imgsMissingAlt > 0 ||
  desktop.counts.h1 !== 1 ||
  desktop.counts.invisible > 0 ||
  desktop.styles.probePl !== '48px' ||
  desktop.styles.probeMt !== '24px' ||
  mobile.docScrollWidth > mobile.winWidth + 2

console.log(
  `\nspacing utilities: pl-12=${desktop.styles.probePl} (want 48px), ` +
    `mt-6=${desktop.styles.probeMt} (want 24px)`,
)
console.log(`RESULT: ${failed ? 'FAILED' : 'PASSED'}`)
process.exit(failed ? 1 : 0)
