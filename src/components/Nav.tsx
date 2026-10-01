import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { navLinks, site } from '../content';
import { useActiveSection } from '../lib/hooks';
import { lockScroll, scrollToTarget } from '../lib/scroll';
import { Button, LogoMark, Magnetic, ease } from './ui';

const sectionIds = ['top', ...navLinks.map((l) => l.id), 'contatti'];

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 240);
    setScrolled(v > 24);
  });

  useEffect(() => {
    lockScroll(menuOpen);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const goTo = (id: string) => {
    setMenuOpen(false);
    // lascia chiudere il menu prima di scorrere
    setTimeout(() => scrollToTarget(`#${id}`), menuOpen ? 350 : 0);
  };

  return (
    <>
      <motion.div className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent" style={{ scaleX: progress }} />

      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
        animate={{ y: hidden && !menuOpen ? '-120%' : '0%' }}
        transition={{ duration: 0.5, ease }}
      >
        <nav
          className={`mx-auto flex max-w-[1440px] items-center justify-between rounded-full py-2 pl-3 pr-2 transition-all duration-500 ${
            scrolled && !menuOpen ? 'border border-line bg-paper/75 shadow-[0_8px_30px_-12px_rgba(18,18,20,0.18)] backdrop-blur-xl' : 'border border-transparent'
          }`}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              goTo('top');
            }}
            className={`flex items-center gap-2.5 rounded-full pr-2 transition-colors ${menuOpen ? 'text-paper' : 'text-ink'}`}
          >
            <LogoMark className="h-8 w-8" inverted={menuOpen} />
            <span className="text-[0.98rem] font-semibold tracking-tight">{site.brand}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(link.id);
                  }}
                  className={`relative isolate rounded-full px-4 py-2 text-[0.92rem] transition-colors ${active === link.id ? 'text-ink' : 'text-muted hover:text-ink'}`}
                >
                  {active === link.id && (
                    <motion.span layoutId="nav-active" className="absolute inset-0 -z-10 rounded-full bg-paper-2" transition={{ duration: 0.5, ease }} />
                  )}
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <Magnetic className="hidden md:inline-block">
              <Button
                href="#contatti"
                onClick={() => goTo('contatti')}
                variant="ink"
                className="!py-2.5 !text-[0.9rem]"
              >
                Parliamo
              </Button>
            </Magnetic>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
              className={`relative grid h-11 w-11 place-items-center rounded-full md:hidden ${menuOpen ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}
            >
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ease-out-expo ${menuOpen ? 'rotate-45' : '-translate-y-[3px]'}`} />
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-500 ease-out-expo ${menuOpen ? '-rotate-45' : 'translate-y-[3px]'}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pb-10 pt-28 text-paper md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
          >
            <ul className="space-y-1">
              {[...navLinks, { id: 'contatti', label: 'Contatti' }].map((link, i) => (
                <li key={link.id} className="overflow-hidden">
                  <motion.a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(link.id);
                    }}
                    className="flex items-baseline gap-4 py-1 text-[clamp(2.4rem,11vw,4rem)] font-medium leading-[1.05] tracking-[-0.04em]"
                    initial={{ y: '100%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.06 }}
                  >
                    <span className="text-sm tabular-nums tracking-normal text-accent">0{i + 1}</span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="space-y-1 text-muted-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="eyebrow">Scrivimi</p>
              <a href={`mailto:${site.email}`} className="text-lg text-paper underline decoration-line-dark underline-offset-4">
                {site.email}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
