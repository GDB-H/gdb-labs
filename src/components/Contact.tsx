import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { site } from '../content';
import { useT } from '../i18n';
import { scrollToTarget } from '../lib/scroll';
import { Button, FadeUp, LogoMark, Magnetic, RevealLines, RollText, SectionLabel, ease } from './ui';

function Field({
  label,
  type = 'text',
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const cls =
    'peer w-full resize-none border-b border-line-dark bg-transparent pb-3 pt-7 text-lg text-paper outline-none transition-colors placeholder:text-transparent focus:border-paper';
  return (
    <label className="relative block">
      {textarea ? (
        <textarea required rows={4} placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input required type={type} placeholder={label} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      <span className="pointer-events-none absolute left-0 top-1 text-[0.8rem] text-muted-dark transition-all duration-300 peer-placeholder-shown:top-7 peer-placeholder-shown:text-lg peer-focus:top-1 peer-focus:text-[0.8rem]">
        {label}
      </span>
    </label>
  );
}

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  // si salvano gli indici, così la scelta sopravvive al cambio lingua
  const [picked, setPicked] = useState<number[]>([]);
  const { contact } = useT();

  const toggle = (i: number) => setPicked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const topics = picked.map((i) => contact.topics[i]);
    const subject = `${contact.subject} — ${name}`;
    const body = `${message}\n\n${topics.length ? `${contact.scope}: ${topics.join(', ')}\n` : ''}${name} · ${email}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={submit} className="rounded-[1.6rem] bg-ink-2 p-6 sm:p-8 md:p-10">
      <fieldset>
        <legend className="eyebrow mb-4 text-muted-dark">{contact.need}</legend>
        <div className="flex flex-wrap gap-2">
          {contact.topics.map((t, i) => {
            const on = picked.includes(i);
            return (
              <button
                key={i}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(i)}
                className={`rounded-full border px-4 py-2 text-[0.92rem] transition-all duration-300 ${
                  on ? 'border-accent bg-accent text-white' : 'border-line-dark text-paper/80 hover:border-paper hover:text-paper'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field label={contact.name} value={name} onChange={setName} />
        <Field label={contact.email} type="email" value={email} onChange={setEmail} />
      </div>
      <div className="mt-6">
        <Field label={contact.message} value={message} onChange={setMessage} textarea />
      </div>

      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[16rem] text-sm leading-snug text-muted-dark">{contact.mailNote}</p>
        <Magnetic>
          <Button type="submit" variant="accent">
            {contact.submit}
          </Button>
        </Magnetic>
      </div>
    </form>
  );
}

function useClock(timeZone: string) {
  const format = () => new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', timeZone }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function Contact() {
  const t = useT();
  const { contact } = t;
  const [copied, setCopied] = useState(false);
  const time = useClock(site.timezone);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wordmarkRef, offset: ['start end', 'end end'] });
  const wordmarkY = useTransform(scrollYProgress, [0, 1], ['55%', '0%']);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const socials = [
    { label: 'LinkedIn', href: site.linkedin },
    { label: 'GitHub', href: site.github },
  ].filter((s) => s.href);

  return (
    <section id="contatti" className="relative overflow-hidden rounded-t-[2rem] bg-ink text-paper md:rounded-t-[3rem]">
      <div className="container-x pb-16 pt-28 md:pt-40">
        <SectionLabel index="06" dark>
          {contact.label}
        </SectionLabel>

        <RevealLines
          className="mt-10 text-display-1 font-medium"
          lines={[
            contact.title[0],
            <>
              <em className="accent-serif text-accent">{contact.title[1]}</em>
            </>,
          ]}
        />

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <FadeUp>
              <p className="max-w-md text-lg leading-relaxed text-paper/70 md:text-xl">{contact.lead}</p>
            </FadeUp>

            <FadeUp delay={0.1} className="mt-12">
              <p className="eyebrow mb-3 text-muted-dark">{contact.direct}</p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${site.email}`}
                  className="group relative text-[clamp(1.25rem,2.2vw,1.9rem)] font-medium tracking-[-0.02em]"
                >
                  {site.email}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-line-dark" />
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-hover:scale-x-100" />
                </a>
                <button
                  type="button"
                  onClick={copy}
                  aria-label={contact.copyAria}
                  className="relative grid h-10 w-10 place-items-center rounded-full border border-line-dark transition-colors hover:border-paper"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'ok' : 'copy'}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                    </motion.span>
                  </AnimatePresence>
                  <AnimatePresence>
                    {copied && (
                      <motion.span
                        className="absolute -top-10 left-1/2 whitespace-nowrap rounded-full bg-paper px-3 py-1 text-xs font-medium text-ink"
                        initial={{ opacity: 0, y: 6, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 6, x: '-50%' }}
                        transition={{ duration: 0.3, ease }}
                      >
                        {contact.copied}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {socials.length > 0 && (
                <ul className="mt-8 flex gap-6">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noreferrer" className="group text-paper/70 transition-colors hover:text-paper">
                        <RollText>{s.label}</RollText>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </FadeUp>
          </div>

          <FadeUp delay={0.15} className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </FadeUp>
        </div>

        <footer className="mt-28 grid grid-cols-2 items-center gap-y-4 border-t border-line-dark pt-6 text-sm text-muted-dark md:mt-40 md:grid-cols-3">
          <p className="flex items-center gap-3">
            <LogoMark bare className="h-7 w-7" />
            <span>
              © {new Date().getFullYear()} {site.name} — {site.brand}
            </span>
          </p>
          <p className="hidden text-center tabular-nums md:block">
            {t.location} · {time}
          </p>
          <button type="button" onClick={() => scrollToTarget(0)} className="group justify-self-end text-paper/80 hover:text-paper">
            <RollText>{contact.top}</RollText>
          </button>
        </footer>
      </div>

      <div ref={wordmarkRef} className="overflow-hidden" aria-hidden>
        <motion.div
          className="container-x select-none whitespace-nowrap text-center text-[clamp(4rem,21vw,22rem)] font-semibold leading-[0.78] tracking-[-0.065em] text-paper/[0.06]"
          style={{ y: wordmarkY }}
        >
          {site.brand}
        </motion.div>
      </div>
    </section>
  );
}
