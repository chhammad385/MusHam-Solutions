// Temporary diagnostic — deleted after the run.
import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' })

// Does an unlayered global reset beat Tailwind's layered utilities?
const cascade = await page.evaluate(() => {
  const probe = document.createElement('div')
  probe.className = 'pl-12 mt-6 p-4'
  document.body.appendChild(probe)
  const cs = getComputedStyle(probe)
  const result = {
    paddingLeft: cs.paddingLeft,
    marginTop: cs.marginTop,
    padding: cs.padding,
  }
  probe.remove()

  const ol = document.querySelector('#about ol')
  const olCs = ol ? getComputedStyle(ol) : null

  return {
    probe: result,
    olPaddingLeft: olCs?.paddingLeft ?? null,
    olClass: ol?.className ?? null,
  }
})

console.log('=== CASCADE TEST (expect pl-12=48px, mt-6=24px, p-4=16px) ===')
console.log(JSON.stringify(cascade, null, 2))

// Scroll the whole page, then recount what is still invisible.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.8
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 120))
  }
  window.scrollTo(0, 0)
})
await page.waitForTimeout(1500)

const after = await page.evaluate(() => {
  const invisible = [...document.querySelectorAll('main *')].filter((el) => {
    const cs = getComputedStyle(el)
    return (
      cs.opacity === '0' &&
      el.getBoundingClientRect().height > 40 &&
      !el.closest('[aria-hidden="true"]')
    )
  })
  return {
    count: invisible.length,
    samples: invisible.slice(0, 5).map((el) => ({
      tag: el.tagName.toLowerCase(),
      cls: (el.className?.toString() || '').slice(0, 70),
    })),
  }
})

console.log('\n=== INVISIBLE AFTER FULL SCROLL ===')
console.log(JSON.stringify(after, null, 2))

await browser.close()
