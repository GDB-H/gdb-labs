import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { initSmoothScroll, prefersReducedMotion } from './lib/scroll';
import Nav from './components/Nav';
import Intro, { INTRO_DURATION } from './components/Intro';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Lab from './components/Lab';
import Capabilities from './components/Capabilities';
import ModelShowcase from './components/ModelShowcase';
import Cases from './components/Cases';
import About from './components/About';
import Contact from './components/Contact';

const INTRO_KEY = 'gdb-intro-seen';

function shouldShowIntro() {
  try {
    return !prefersReducedMotion() && !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return false;
  }
}

export default function App() {
  const [intro, setIntro] = useState(shouldShowIntro);
  const [heroDelay] = useState(() => (intro ? INTRO_DURATION + 0.3 : 0));

  useEffect(() => initSmoothScroll(), []);

  const endIntro = useCallback(() => {
    setIntro(false);
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* storage non disponibile: l'intro si rivedrà, nessun problema */
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{intro && <Intro onDone={endIntro} />}</AnimatePresence>
      <Nav />
      <main>
        <Hero startDelay={heroDelay} />
        <Marquee />
        <Lab />
        <Capabilities />
        <ModelShowcase />
        <Cases />
        <About />
        <Contact />
      </main>
    </MotionConfig>
  );
}
