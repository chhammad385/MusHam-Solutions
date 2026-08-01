// src/pages/Home.jsx
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { Process } from '@/components/sections/Process'
import { Projects } from '@/components/sections/Projects'
import { TechStack } from '@/components/sections/TechStack'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'
import { Contact } from '@/components/sections/Contact'

/**
 * Section order is the narrative: hook, what we do, why us, how we work,
 * proof, tools, social proof, objections, then the ask.
 */
export function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WhyChooseUs />
      <Process />
      <Projects />
      <TechStack />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  )
}

export default Home
