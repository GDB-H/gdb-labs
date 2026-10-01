import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { initSmoothScroll } from './lib/scroll';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Capabilities from './components/Capabilities';
import Lab from './components/Lab';
import Cases from './components/Cases';
import About from './components/About';
import Contact from './components/Contact';

export default function App() {
  useEffect(() => initSmoothScroll(), []);

  return (
    <MotionConfig reducedMotion="user">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Lab />
        <Capabilities />
        <Cases />
        <About />
        <Contact />
      </main>
    </MotionConfig>
  );
}
