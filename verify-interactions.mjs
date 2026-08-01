// Temporary interaction test — deleted after the run.
import { chromium } from 'playwright'

const browser = await chromium.launch()
const results = []
const errors = []

function check(name, pass, detail = '') {
  results.push({ name, pass, detail })
}

// ---------------------------------------------------------------- mobile menu
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  page.on('pageerror', (e) => errors.push(`menu: ${e.message}`))
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })

  const toggle = page.locator('button[aria-controls="mobile-menu"]')
  check('menu toggle exists', (await toggle.count()) === 1)
  check(
    'menu starts collapsed',
    (await toggle.getAttribute('aria-expanded')) === 'false',
  )

  await toggle.click()
  await page.waitForTimeout(450)
  check('menu opens', (await toggle.getAttribute('aria-expanded')) === 'true')
  check(
    'body scroll locked while open',
    (await page.evaluate(() => getComputedStyle(document.body).overflow)) ===
      'hidden',
  )
  check('menu panel visible', await page.locator('#mobile-menu').isVisible())

  await page.keyboard.press('Escape')
  await page.waitForTimeout(450)
  check(
    'Escape closes menu',
    (await toggle.getAttribute('aria-expanded')) === 'false',
  )
  check(
    'body scroll restored',
    (await page.evaluate(() => getComputedStyle(document.body).overflow)) !==
      'hidden',
  )
  await page.close()
}

// ------------------------------------------------------------------------ FAQ
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (e) => errors.push(`faq: ${e.message}`))
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })

  const buttons = page.locator('#faq button[aria-controls]')
  const count = await buttons.count()
  check('faq has 6 items', count === 6, `found ${count}`)

  const first = buttons.nth(0)
  const second = buttons.nth(1)
  check(
    'first item open by default',
    (await first.getAttribute('aria-expanded')) === 'true',
  )

  await second.click()
  await page.waitForTimeout(500)
  check('clicked item opens', (await second.getAttribute('aria-expanded')) === 'true')
  check(
    'single-open: previous closed',
    (await first.getAttribute('aria-expanded')) === 'false',
  )

  // Panel/button wiring must actually resolve to a real element.
  const wired = await page.evaluate(() => {
    const btn = document.querySelector('#faq button[aria-controls]')
    const panelId = btn.getAttribute('aria-controls')
    const panel = document.getElementById(panelId)
    return Boolean(panel) && panel.getAttribute('aria-labelledby') === btn.id
  })
  check('aria-controls/labelledby resolve', wired)
  await page.close()
}

// ---------------------------------------------------------------- theme toggle
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (e) => errors.push(`theme: ${e.message}`))
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })

  const before = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  )
  await page.locator('header button[aria-label*="theme"]').first().click()
  await page.waitForTimeout(500)
  const after = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  )
  check('theme toggle changes bg', before !== after, `${before} -> ${after}`)
  check(
    'data-theme attribute set',
    ['dark', undefined].includes(
      await page.evaluate(() => document.documentElement.dataset.theme),
    ),
  )

  // Survives reload via localStorage.
  await page.reload({ waitUntil: 'networkidle' })
  const persisted = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  )
  check('theme persists across reload', persisted === after, persisted)
  await page.close()
}

// -------------------------------------------------------------- contact form
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (e) => errors.push(`form: ${e.message}`))
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })

  await page.locator('#contact').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)

  // Empty submit must block and surface errors.
  await page.locator('#contact button[type="submit"]').click()
  await page.waitForTimeout(400)

  const invalidCount = await page
    .locator('#contact [aria-invalid="true"]')
    .count()
  check('empty submit blocked with errors', invalidCount >= 3, `${invalidCount} invalid`)

  const focused = await page.evaluate(() => document.activeElement?.id)
  check('focus moved to first invalid', focused === 'name', `focused=${focused}`)

  // Bad email specifically.
  await page.fill('#name', 'Test User')
  await page.fill('#email', 'not-an-email')
  await page.fill('#message', 'This is a long enough message body.')
  await page.locator('#contact button[type="submit"]').click()
  await page.waitForTimeout(400)
  check(
    'invalid email rejected',
    (await page.locator('#email[aria-invalid="true"]').count()) === 1,
  )

  // Valid submission reaches the success state.
  await page.fill('#email', 'test@example.com')
  await page.locator('#contact button[type="submit"]').click()
  await page.waitForTimeout(2000)
  const success = await page.locator('#contact', { hasText: 'Message sent' }).count()
  check('valid submit shows success', success === 1)
  await page.close()
}

// ------------------------------------------------------------------- carousel
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.on('pageerror', (e) => errors.push(`carousel: ${e.message}`))
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await page.locator('#testimonials').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  const prev = page.locator('#testimonials button[aria-label="Previous testimonial"]')
  const next = page.locator('#testimonials button[aria-label="Next testimonial"]')

  check('prev disabled at start', await prev.isDisabled())
  check('next enabled at start', await next.isEnabled())

  const startX = await page.evaluate(
    () => document.querySelector('#testimonials [aria-roledescription]').scrollLeft,
  )
  await next.click()
  await page.waitForTimeout(900)
  const afterX = await page.evaluate(
    () => document.querySelector('#testimonials [aria-roledescription]').scrollLeft,
  )
  check('next scrolls track', afterX > startX, `${startX} -> ${afterX}`)
  check('prev enabled after scroll', await prev.isEnabled())
  await page.close()
}

// ------------------------------------------------------------ reduced motion
{
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
  })
  page.on('pageerror', (e) => errors.push(`reduced: ${e.message}`))
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)

  // Nothing may be stranded invisible when animation is disabled.
  const stranded = await page.evaluate(
    () =>
      [...document.querySelectorAll('main *')].filter((el) => {
        const cs = getComputedStyle(el)
        return (
          cs.opacity === '0' &&
          el.getBoundingClientRect().height > 40 &&
          !el.closest('[aria-hidden="true"]')
        )
      }).length,
  )
  check('reduced-motion: nothing stranded invisible', stranded === 0, `${stranded}`)

  const secs = await page.evaluate(() =>
    ['home', 'services', 'work', 'contact'].map((id) => ({
      id,
      h: Math.round(document.getElementById(id)?.getBoundingClientRect().height ?? 0),
    })),
  )
  check(
    'reduced-motion: sections render',
    secs.every((s) => s.h > 100),
    JSON.stringify(secs),
  )
  await page.close()
}

console.log('=== INTERACTION TESTS ===')
let failures = 0
for (const r of results) {
  if (!r.pass) failures++
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? `  (${r.detail})` : ''}`)
}
console.log('\n=== PAGE ERRORS ===')
console.log(errors.length ? errors.join('\n') : '(none)')
console.log(`\n${results.length - failures}/${results.length} passed`)
console.log(`RESULT: ${failures === 0 && errors.length === 0 ? 'PASSED' : 'FAILED'}`)

await browser.close()
process.exit(failures === 0 && errors.length === 0 ? 0 : 1)
