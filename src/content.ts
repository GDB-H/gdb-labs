// Tutti i testi del sito, in italiano e in inglese: per aggiornare il
// portfolio di solito basta modificare questo file. Le due lingue hanno
// la stessa struttura (l'inglese è tipizzato su quella italiana).

export type Locale = 'it' | 'en';
export const LOCALES: Locale[] = ['it', 'en'];

export const site = {
  name: 'Gabriele Boffa',
  brand: 'GDB Labs',
  // TODO: inserire l'indirizzo reale a cui ricevere le richieste
  email: 'gabriele.boffa@example.com',
  // Lasciare vuoto per nascondere il link
  linkedin: '',
  github: '',
  timezone: 'Europe/Rome',
};

export type Capability = {
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  tools: string[];
};

export type Bench = {
  label: string;
  title: string;
  caption: string;
  // foto (URL) oppure illustrazione animata
  image?: string;
  imageAlt?: string;
  visual?: 'dashboard' | 'web' | 'print' | 'game';
};

export type CaseStudy = {
  id: string;
  tab: string;
  title: string;
  summary: string;
  // visual animato che cambia a ogni fase (una etichetta breve per fase)
  visual: 'consult' | 'process' | 'game';
  steps: { phase: string; short: string; text: string }[];
  image?: { src: string; alt: string };
};

const unsplash = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

const images = {
  workbench: unsplash('photo-1581092160562-40aa08e78837', 2400),
  warehouse: unsplash('photo-1553413077-190dd305871c'),
  retro: unsplash('photo-1550745165-9bc0b252726f'),
  dashboard: unsplash('photo-1551288049-bebda4e38f71'),
};

const stack = ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Next.js', 'Unity', 'C#', 'Fusion 360'];

// =====================================================================
// ITALIANO
// =====================================================================
const it = {
  meta: {
    title: 'GDB Labs — Laboratorio di Gabriele Boffa · Software, processi, prototipi',
    description:
      'GDB Labs è il laboratorio di Gabriele Boffa: software su misura, gestionali, snellimento dei processi aziendali, consulenza tecnica e prototipazione 3D — dal problema al prodotto.',
  },
  location: 'Italia',
  intro: 'GDB Labs — Laboratorio',

  nav: {
    links: [
      { id: 'laboratorio', label: 'Laboratorio' },
      { id: 'competenze', label: 'Competenze' },
      { id: 'casi', label: 'Casi studio' },
      { id: 'chi-sono', label: 'Chi sono' },
    ],
    contact: 'Contatti',
    cta: 'Parliamo',
    writeMe: 'Scrivimi',
    openMenu: 'Apri menu',
    closeMenu: 'Chiudi menu',
    language: 'Lingua',
  },

  hero: {
    eyebrow: 'Laboratorio di progettazione — software, processi, prototipi',
    title: ['Dal problema', 'al', 'prodotto.'],
    lead: 'Sono Gabriele Boffa e GDB Labs è il mio laboratorio: qui software, processi aziendali e oggetti fisici si progettano sullo stesso banco. Gestionali su misura, web app, automazioni e prototipi 3D — dall’analisi del problema al prodotto finito.',
    ctaPrimary: 'Parliamo del tuo progetto',
    ctaSecondary: 'Entra nel laboratorio',
    available: 'Disponibile per nuovi progetti',
    focus: 'Sul banco —',
    scroll: 'Scorri',
    badge: 'Parliamo del tuo progetto · GDB Labs · ',
    badgeAria: 'Vai ai contatti',
    rotating: ['Software gestionale', 'Web app', 'Consulenza tecnica', 'Prototipazione 3D', 'Game development'],
  },

  marquee: {
    label: 'Discipline e tecnologie',
    disciplines: ['Gestionali su misura', 'Web app', 'Automazioni', 'Consulenza tecnica', 'Stampa 3D', 'Videogiochi'],
    stack,
  },

  lab: {
    label: 'Il laboratorio',
    title: ['Un laboratorio,', 'non un’agenzia.'],
    hero: {
      image: images.workbench,
      alt: 'Progettista al banco di lavoro con disegni tecnici, attrezzi e componenti',
      caption: 'Il banco di progettazione: ogni progetto parte da qui.',
    },
    intro:
      'GDB Labs è un laboratorio nel senso più concreto: un posto dove si prova, si misura e si costruisce. Software, processi e oggetti fisici stanno sullo stesso banco di lavoro — ed è proprio questo misto a generare soluzioni più semplici e più solide.',
    benchesLabel: 'I banchi di lavoro',
    benchesTitle: ['Discipline diverse, sullo stesso banco.', 'Ognuna rende migliori le altre.'],
    benches: [
      {
        label: 'Banco 01',
        title: 'Gestionali',
        caption: 'Magazzino, ordini, produzione: processi reali tradotti in software.',
        image: images.warehouse,
        imageAlt: 'Corridoio di un grande magazzino con scaffalature piene di scatole',
      },
      { label: 'Banco 02', title: 'Web app', caption: 'Strumenti web veloci, costruiti su misura.', visual: 'web' },
      { label: 'Banco 03', title: 'Stampa 3D', caption: 'Prototipi da provare sul campo.', visual: 'print' },
      {
        label: 'Il laboratorio',
        title: 'Il misto è il metodo',
        caption: 'Software, hardware, gioco: ogni disciplina insegna qualcosa alle altre.',
        image: images.retro,
        imageAlt: 'Computer, console e cartucce retrò illuminati da luci al neon',
      },
      { label: 'Banco 04', title: 'Videogiochi', caption: 'Sistemi interattivi in tempo reale.', visual: 'game' },
    ] as Bench[],
    verbs: [
      { title: 'Sperimentare', text: 'Ogni idea si verifica con un prototipo, prima di investirci tempo e denaro.' },
      { title: 'Misurare', text: 'Le decisioni nascono da dati e prove sul campo, non da supposizioni.' },
      { title: 'Costruire', text: 'Il risultato è sempre qualcosa che funziona e che si usa ogni giorno.' },
    ],
  },

  capabilities: {
    label: 'Competenze',
    title: ['Cinque discipline,', 'un solo metodo.'],
    scroll: 'Scorri',
    drag: 'Trascina',
    outro: ['Il profilo trasversale è una scelta: vedere il problema per intero porta a soluzioni', 'più semplici.'],
    outroLink: 'Guarda come lavoro',
    items: [
      {
        title: 'Sviluppo software & web app',
        summary: 'Applicazioni web, API e strumenti interni costruiti per durare.',
        description:
          'Progetto applicazioni con un’architettura chiara e un codice leggibile, pensato per essere mantenuto ed esteso nel tempo. Scelgo la tecnologia in base al problema, non alla moda, e porto il progetto fino alla messa in produzione.',
        deliverables: ['Web app e portali riservati', 'API e integrazioni tra sistemi', 'Automazioni e script', 'Manutenzione evolutiva'],
        tools: ['TypeScript', 'React', 'Node.js', 'Python', 'Docker'],
      },
      {
        title: 'Gestionali e processi',
        summary: 'Il software si adatta al tuo modo di lavorare — snellito.',
        description:
          'Non impongo un nuovo modo di lavorare: parto dai processi che già esistono in azienda, li analizzo con chi li usa ogni giorno, elimino i passaggi superflui e traduco il risultato in un gestionale su misura — ordini, produzione, magazzino, clienti. Meno lavoro manuale, dati più affidabili.',
        deliverables: ['Mappatura dei processi esistenti', 'Snellimento dei flussi di lavoro', 'Gestionale su misura', 'Migrazione da Excel e sistemi esistenti'],
        tools: ['PostgreSQL', 'SQL', 'Node.js', 'React'],
      },
      {
        title: 'Consulenza tecnica',
        summary: 'Capire cosa costruire, prima di costruirlo.',
        description:
          'Analizzo esigenze, vincoli e fattibilità per trovare la strada più solida e sostenibile — inclusi gli aspetti normativi, come la conformità ATEX. Il risultato è una decisione informata: cosa conviene fare, cosa no, e perché.',
        deliverables: ['Analisi dei requisiti', 'Studi di fattibilità', 'Architettura di sistema', 'Supporto normativo (es. ATEX)'],
        tools: ['Problem solving', 'Documentazione tecnica', 'Design di sistema'],
      },
      {
        title: 'Prototipazione & stampa 3D',
        summary: 'Quando la soluzione deve esistere anche fuori dallo schermo.',
        description:
          'Dal problema al prodotto finale: ricerca delle cause, modellazione CAD, prototipi stampati in 3D e provati sul campo, fino al pezzo definitivo. Ottimizzo geometrie e materiali iterando finché il componente non fa esattamente quello che deve.',
        deliverables: ['Modellazione CAD', 'Prototipi funzionali', 'Supporti e ricambi su misura', 'Ottimizzazione per la stampa'],
        tools: ['Fusion 360', 'FDM / SLA', 'PLA / PETG'],
      },
      {
        title: 'Game development',
        summary: 'Sistemi complessi che devono funzionare in tempo reale.',
        description:
          'Il videogioco è il banco di prova più severo: regole, fisica e interfaccia devono reggere insieme, sessanta volte al secondo, ed essere piacevoli da usare. Progetto meccaniche e logica di gioco con la stessa cura che metto nel software gestionale.',
        deliverables: ['Game design', 'Programmazione gameplay', 'Prototipi giocabili', 'Strumenti di sviluppo'],
        tools: ['Unity', 'C#', 'Unreal Engine'],
      },
    ] as Capability[],
  },

  showcase: {
    label: 'Modellazione 3D',
    title: ['Dal concept', 'al modello definitivo.'],
    objectLabel: 'Oggetto',
    model: 'Modello 3D',
    phaseWord: 'fase',
    failed: 'Il modello 3D non è disponibile su questo dispositivo.',
    phases: ['Concept', 'Wireframe', 'Low poly', 'Mesh', 'Definitivo'],
    objects: {
      proto: {
        tab: 'Prototipazione',
        name: 'Staffa di supporto',
        notes: [
          'Schizzi e misure: la forma nasce dai vincoli reali del pezzo da sostituire.',
          'La struttura del modello CAD, quota dopo quota.',
          'Una geometria essenziale per verificare ingombri e montaggio.',
          'Superfici, raccordi e fori definiti: il pezzo è pronto per la stampa.',
          'Stampato, provato e montato. Il ricambio che non esisteva.',
        ],
      },
      game: {
        tab: 'Videogiochi',
        name: 'Lanterna — asset di gioco',
        notes: [
          'Dalla prima idea: una lanterna che porta luce nel buio.',
          'La struttura del modello, pensata per restare leggera in tempo reale.',
          'Forme essenziali, subito provate dentro il gioco.',
          'Proporzioni, dettagli e una topologia pulita.',
          'Materiali, luce e atmosfera: l’oggetto vive nel mondo di gioco.',
        ],
      },
    },
  },

  cases: {
    label: 'Casi studio',
    title: ['Come lavora', 'il laboratorio.'],
    intro:
      'Tre percorsi tipici: una consulenza che diventa software, un gestionale su misura, un videogioco. Cambiano gli strumenti, il metodo resta lo stesso — capire il problema, sperimentare, arrivare a qualcosa che funziona.',
    note: 'Esempi rappresentativi del metodo di lavoro.',
    tag: 'Caso tipo',
    phase: 'Fase',
    // Casi tipo: esempi rappresentativi del metodo. Sostituibili con casi reali.
    items: [
      {
        id: 'consulenza',
        tab: 'Consulenza & software',
        title: 'Dalla norma al software',
        summary: 'Una competenza tecnica trasformata in uno strumento che chiunque in azienda può usare. Il risultato finale è qui accanto: provalo.',
        visual: 'consult',
        steps: [
          {
            phase: 'Cliente',
            short: 'Brief',
            text: 'Un’azienda che lavora in aree con atmosfere potenzialmente esplosive deve verificare, per ogni installazione, quali apparecchiature sono ammesse. Oggi lo fa consultando norme e tabelle.',
          },
          {
            phase: 'Consulenza',
            short: 'Norme',
            text: 'Studio le direttive ATEX e il modo in cui l’azienda lavora davvero, insieme a chi è sul campo. Le regole sparse tra i documenti diventano poche regole chiare, senza ambiguità.',
          },
          {
            phase: 'Architettura',
            short: 'Modello',
            text: 'Le regole diventano dati: un modello semplice, leggibile anche da chi non programma, che descrive zone e categorie ammesse.',
          },
          {
            phase: 'Sviluppo',
            short: 'Codice',
            text: 'Ogni regola ha la sua funzione, e ogni funzione i suoi test. Il codice è piccolo, verificabile e facile da aggiornare quando cambia la norma.',
          },
          {
            phase: 'Software',
            short: 'App',
            text: 'Uno strumento immediato: scegli la zona, scegli l’apparecchio e la risposta arriva subito, con il motivo. Provalo qui accanto.',
          },
        ],
      },
      {
        id: 'software',
        tab: 'Software su misura',
        title: 'Dal foglio Excel al processo snello',
        summary: 'Un processo aziendale esistente, ripulito dai passaggi inutili e tradotto in un gestionale su misura.',
        visual: 'process',
        image: { src: images.dashboard, alt: 'Dashboard con grafici e indicatori su uno schermo' },
        steps: [
          { phase: 'Cliente', short: 'Oggi', text: 'Una PMI che gestisce ordini e commesse tra fogli Excel, email e moduli cartacei.' },
          {
            phase: 'Problema',
            short: 'Problema',
            text: 'Gli stessi dati vengono inseriti più volte, le informazioni si perdono tra un passaggio e l’altro e nessuno ha una visione chiara dello stato del lavoro.',
          },
          {
            phase: 'Analisi del processo',
            short: 'Mappa',
            text: 'Mappo il processo così com’è, insieme a chi lo vive ogni giorno: dove nascono i dati, chi li usa, quali passaggi non servono più.',
          },
          {
            phase: 'Snellimento e sviluppo',
            short: 'Snellito',
            text: 'Il software si adatta al modo di lavorare dell’azienda, non il contrario — ma prima il processo viene ripulito. Poi sviluppo il gestionale per rilasci graduali e migro i dati esistenti.',
          },
          {
            phase: 'Prodotto finale',
            short: 'Gestionale',
            text: 'Un unico strumento condiviso: dati inseriti una sola volta, stato del lavoro sempre visibile, meno errori e meno tempo perso.',
          },
        ],
      },
      {
        id: 'videogiochi',
        tab: 'Videogiochi',
        title: 'Da un’idea a una demo giocabile',
        summary: 'Un concept di gioco portato, fase dopo fase, fino a una demo da mostrare a pubblico, publisher e investitori.',
        visual: 'game',
        steps: [
          {
            phase: 'L’idea del cliente',
            short: 'Idea',
            text: 'Il cliente arriva con un’idea: un’atmosfera, un personaggio, una meccanica che lo entusiasma. Insieme la mettiamo su carta e capiamo cosa la rende davvero divertente.',
          },
          {
            phase: 'Pre-alpha',
            short: 'Pre-alpha',
            text: 'Forme grigie, nessuna grafica: solo la meccanica principale, da provare e riprovare. Se il gioco non diverte così, non lo farà nemmeno con la grafica sopra.',
          },
          {
            phase: 'Alpha',
            short: 'Alpha',
            text: 'Il gioco diventa giocabile dall’inizio alla fine: livelli, regole, prime risorse grafiche. Tutto può ancora cambiare, ed è il momento giusto per farlo.',
          },
          {
            phase: 'Beta',
            short: 'Beta',
            text: 'Contenuti completi, grafica, luci e suono. Si gioca, si raccolgono feedback e si limano bilanciamento, prestazioni e bug.',
          },
          {
            phase: 'Demo',
            short: 'Demo',
            text: 'Una demo curata e stabile, pronta da mostrare a pubblico, publisher o investitori: il primo passo per far vivere il gioco fuori dal laboratorio.',
          },
        ],
      },
    ] as CaseStudy[],
  },

  // testi dentro le illustrazioni animate
  visuals: {
    consult: {
      docs: ['Direttiva 2014/34/UE', 'Direttiva 1999/92/CE', 'Tabella zone'],
      rules: [
        ['Zona 0 · 20', 'Cat. 1'],
        ['Zona 1 · 21', 'Cat. 1–2'],
        ['Zona 2 · 22', 'Cat. 1–3'],
      ],
      legend: 'G = gas · D = polveri',
      modelComment: '// regole estratte dalle direttive ATEX',
      fnComment: '// una regola, una funzione: testabile',
      tests: '4 test superati',
      appTitle: 'Verifica ATEX',
      zone: 'Zona',
      device: 'Apparecchio',
      ok: 'Idoneo',
      ko: 'Non idoneo',
      gas: 'gas',
      dust: 'polveri',
      or: 'o',
      reasonOk: (device: string, zone: number) => `La categoria ${device} è ammessa in zona ${zone}.`,
      reasonCat: (zone: number, allowed: string) => `In zona ${zone} servono apparecchi di categoria ${allowed}.`,
      reasonAtm: (deviceAtm: string, zone: number, zoneAtm: string) => `Apparecchio per ${deviceAtm}, ma la zona ${zone} è per ${zoneAtm}.`,
      disclaimer: 'Demo semplificata: non sostituisce la valutazione del rischio.',
    },
    docs: ['Ordine', 'Email', 'Produzione', 'Magazzino', 'Ricopia', 'Consegna'],
    oneTool: 'UN SOLO STRUMENTO',
    duplicated: 'STESSI DATI, INSERITI TRE VOLTE',
    game: {
      title: 'Lanterna',
      idea: '— idea di gioco',
      jump: 'salto!',
      moon: 'luna enorme, luce calda',
      light: 'lei porta la luce',
      demo: 'DEMO GIOCABILE',
      start: 'PREMI START',
    },
  },

  about: {
    label: 'Chi sono',
    principlesLabel: 'Principi',
    statement:
      'Ho scelto di non specializzarmi in un solo strumento, ma in un modo di ragionare: scomporre i problemi, capire i vincoli reali e costruire soluzioni che durano.',
    bio: [
      'Sono Gabriele Boffa, progettista. GDB Labs è il mio laboratorio: piccolo e diretto, dove parli sempre con chi progetta, costruisce e scrive il codice.',
      'Lavoro con piccole e medie imprese e professionisti che hanno bisogno di strumenti digitali cuciti sui propri processi. Affianco allo sviluppo un’attività di consulenza tecnica, che comprende anche l’analisi di vincoli normativi come quelli ATEX.',
      'Fuori dal software lavoro con le mani: modello e stampo in 3D componenti e prototipi, e sviluppo videogiochi. Sono mondi che si alimentano a vicenda — il rigore dei sistemi gestionali, la reattività dei videogiochi, la concretezza di un pezzo che si può toccare.',
    ],
    principles: [
      {
        title: 'Chiarezza prima del codice',
        text: 'Una buona analisi fa risparmiare più di qualsiasi ottimizzazione. Prima capisco, poi costruisco.',
      },
      {
        title: 'Soluzioni proporzionate',
        text: 'Niente architetture sovradimensionate: lo strumento giusto per il problema e per il budget a disposizione.',
      },
      {
        title: 'Un solo interlocutore',
        text: 'Meno passaggi, meno malintesi, decisioni più rapide. Chi ti ascolta è anche chi realizza.',
      },
    ],
  },

  contact: {
    label: 'Contatti',
    title: ['Hai un progetto', 'in mente?'],
    lead: 'Raccontami cosa vuoi costruire o quale processo vuoi migliorare. Ti rispondo con domande concrete e, se ha senso lavorare insieme, con una proposta chiara.',
    direct: 'Scrivimi direttamente',
    copyAria: 'Copia indirizzo email',
    copied: 'Copiato',
    need: 'Di cosa hai bisogno?',
    topics: ['Gestionale', 'Web app', 'Automazione', 'Consulenza', 'Prototipo 3D', 'Videogioco', 'Altro'],
    name: 'Nome',
    email: 'Email',
    message: 'Raccontami il progetto',
    mailNote: 'Si aprirà il tuo programma di posta con il messaggio già compilato.',
    submit: 'Invia richiesta',
    subject: 'Nuovo progetto',
    scope: 'Ambito',
    top: 'Torna su ↑',
  },
};

export type Content = typeof it;

// =====================================================================
// ENGLISH
// =====================================================================
const en: Content = {
  meta: {
    title: 'GDB Labs — Gabriele Boffa’s lab · Software, processes, prototypes',
    description:
      'GDB Labs is Gabriele Boffa’s lab: custom software, management systems, business process streamlining, technical consulting and 3D prototyping — from problem to product.',
  },
  location: 'Italy',
  intro: 'GDB Labs — The lab',

  nav: {
    links: [
      { id: 'laboratorio', label: 'The lab' },
      { id: 'competenze', label: 'Skills' },
      { id: 'casi', label: 'Case studies' },
      { id: 'chi-sono', label: 'About' },
    ],
    contact: 'Contact',
    cta: 'Let’s talk',
    writeMe: 'Write to me',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
  },

  hero: {
    eyebrow: 'Design lab — software, processes, prototypes',
    title: ['From problem', 'to', 'product.'],
    lead: 'I’m Gabriele Boffa, and GDB Labs is my lab: a place where software, business processes and physical objects are designed on the same bench. Custom management software, web apps, automations and 3D prototypes — from the first analysis to the finished product.',
    ctaPrimary: 'Let’s talk about your project',
    ctaSecondary: 'Step into the lab',
    available: 'Available for new projects',
    focus: 'On the bench —',
    scroll: 'Scroll',
    badge: 'Let’s build something · GDB Labs · ',
    badgeAria: 'Go to contact',
    rotating: ['Management software', 'Web apps', 'Technical consulting', '3D prototyping', 'Game development'],
  },

  marquee: {
    label: 'Disciplines and technologies',
    disciplines: ['Custom management software', 'Web apps', 'Automation', 'Technical consulting', '3D printing', 'Video games'],
    stack,
  },

  lab: {
    label: 'The lab',
    title: ['A lab,', 'not an agency.'],
    hero: {
      image: images.workbench,
      alt: 'Designer at a workbench with technical drawings, tools and parts',
      caption: 'The design bench: every project starts here.',
    },
    intro:
      'GDB Labs is a lab in the most concrete sense: a place where things get tested, measured and built. Software, processes and physical objects share the same workbench — and it’s exactly this mix that leads to simpler, sturdier solutions.',
    benchesLabel: 'The workbenches',
    benchesTitle: ['Different disciplines, one bench.', 'Each one makes the others better.'],
    benches: [
      {
        label: 'Bench 01',
        title: 'Management software',
        caption: 'Warehouse, orders, production: real processes turned into software.',
        image: images.warehouse,
        imageAlt: 'Aisle of a large warehouse with shelves full of boxes',
      },
      { label: 'Bench 02', title: 'Web apps', caption: 'Fast web tools, built to measure.', visual: 'web' },
      { label: 'Bench 03', title: '3D printing', caption: 'Prototypes to test in the field.', visual: 'print' },
      {
        label: 'The lab',
        title: 'The mix is the method',
        caption: 'Software, hardware, games: each discipline teaches the others something.',
        image: images.retro,
        imageAlt: 'Retro computers, consoles and cartridges lit by neon lights',
      },
      { label: 'Bench 04', title: 'Video games', caption: 'Interactive systems in real time.', visual: 'game' },
    ],
    verbs: [
      { title: 'Experiment', text: 'Every idea is tested with a prototype before investing time and money in it.' },
      { title: 'Measure', text: 'Decisions come from data and field tests, not assumptions.' },
      { title: 'Build', text: 'The result is always something that works and gets used every day.' },
    ],
  },

  capabilities: {
    label: 'Skills',
    title: ['Five disciplines,', 'one method.'],
    scroll: 'Scroll',
    drag: 'Drag',
    outro: ['A cross-disciplinary profile is a choice: seeing the whole problem leads to', 'simpler solutions.'],
    outroLink: 'See how I work',
    items: [
      {
        title: 'Software & web app development',
        summary: 'Web apps, APIs and internal tools built to last.',
        description:
          'I design applications with a clear architecture and readable code, meant to be maintained and extended over time. I choose the technology for the problem, not for the trend, and I see the project through to production.',
        deliverables: ['Web apps and private portals', 'APIs and system integrations', 'Automations and scripts', 'Ongoing development'],
        tools: ['TypeScript', 'React', 'Node.js', 'Python', 'Docker'],
      },
      {
        title: 'Management software & processes',
        summary: 'Software that adapts to the way you work — streamlined.',
        description:
          'I don’t impose a new way of working: I start from the processes your company already has, analyse them with the people who use them every day, cut the unnecessary steps and turn the result into custom management software — orders, production, warehouse, customers. Less manual work, more reliable data.',
        deliverables: ['Mapping existing processes', 'Streamlining workflows', 'Custom management software', 'Migration from Excel and legacy systems'],
        tools: ['PostgreSQL', 'SQL', 'Node.js', 'React'],
      },
      {
        title: 'Technical consulting',
        summary: 'Understanding what to build, before building it.',
        description:
          'I analyse needs, constraints and feasibility to find the soundest, most sustainable path — including regulatory aspects such as ATEX compliance. The result is an informed decision: what’s worth doing, what isn’t, and why.',
        deliverables: ['Requirements analysis', 'Feasibility studies', 'System architecture', 'Regulatory support (e.g. ATEX)'],
        tools: ['Problem solving', 'Technical documentation', 'System design'],
      },
      {
        title: 'Prototyping & 3D printing',
        summary: 'When the solution has to exist beyond the screen.',
        description:
          'From problem to final product: root-cause analysis, CAD modelling, 3D-printed prototypes tested in the field, all the way to the final part. I refine geometry and materials, iterating until the component does exactly what it has to.',
        deliverables: ['CAD modelling', 'Functional prototypes', 'Custom brackets and spare parts', 'Print optimisation'],
        tools: ['Fusion 360', 'FDM / SLA', 'PLA / PETG'],
      },
      {
        title: 'Game development',
        summary: 'Complex systems that have to work in real time.',
        description:
          'Video games are the toughest testing ground: rules, physics and interface must hold together sixty times a second — and still be a joy to use. I design game mechanics and logic with the same care I put into business software.',
        deliverables: ['Game design', 'Gameplay programming', 'Playable prototypes', 'Development tools'],
        tools: ['Unity', 'C#', 'Unreal Engine'],
      },
    ],
  },

  showcase: {
    label: '3D modelling',
    title: ['From concept', 'to final model.'],
    objectLabel: 'Object',
    model: '3D model',
    phaseWord: 'phase',
    failed: 'The 3D model isn’t available on this device.',
    phases: ['Concept', 'Wireframe', 'Low poly', 'Mesh', 'Final'],
    objects: {
      proto: {
        tab: 'Prototyping',
        name: 'Support bracket',
        notes: [
          'Sketches and measurements: the shape comes from the real constraints of the part to replace.',
          'The structure of the CAD model, dimension by dimension.',
          'A basic geometry to check clearances and fit.',
          'Surfaces, fillets and holes defined: the part is ready to print.',
          'Printed, tested and fitted. The spare part that didn’t exist.',
        ],
      },
      game: {
        tab: 'Video games',
        name: 'Lantern — game asset',
        notes: [
          'From the very first idea: a lantern that brings light into the dark.',
          'The model’s structure, designed to stay light in real time.',
          'Essential shapes, tested in-game straight away.',
          'Proportions, detail and clean topology.',
          'Materials, light and atmosphere: the object comes alive in the game world.',
        ],
      },
    },
  },

  cases: {
    label: 'Case studies',
    title: ['How the lab', 'works.'],
    intro:
      'Three typical journeys: consulting that becomes software, custom management software and a video game. The tools change, the method stays the same — understand the problem, experiment, get to something that works.',
    note: 'Representative examples of how I work.',
    tag: 'Sample case',
    phase: 'Phase',
    items: [
      {
        id: 'consulenza',
        tab: 'Consulting & software',
        title: 'From regulation to software',
        summary: 'Technical expertise turned into a tool anyone in the company can use. The finished tool is right here: try it.',
        visual: 'consult',
        steps: [
          {
            phase: 'Client',
            short: 'Brief',
            text: 'A company working in areas with potentially explosive atmospheres has to check, for every installation, which equipment is allowed. Today it does so by digging through regulations and tables.',
          },
          {
            phase: 'Consulting',
            short: 'Rules',
            text: 'I study the ATEX directives and the way the company really works, together with the people in the field. Rules scattered across documents become a few clear, unambiguous ones.',
          },
          {
            phase: 'Architecture',
            short: 'Model',
            text: 'The rules become data: a simple model, readable even by non-programmers, describing zones and permitted equipment categories.',
          },
          {
            phase: 'Development',
            short: 'Code',
            text: 'Each rule gets its own function, and each function its own tests. The code is small, verifiable and easy to update when the regulation changes.',
          },
          {
            phase: 'Software',
            short: 'App',
            text: 'An instant tool: pick the zone, pick the equipment, and the answer comes right away — with the reason why. Try it right here.',
          },
        ],
      },
      {
        id: 'software',
        tab: 'Custom software',
        title: 'From spreadsheets to a lean process',
        summary: 'An existing business process, stripped of unnecessary steps and turned into custom management software.',
        visual: 'process',
        image: { src: images.dashboard, alt: 'Dashboard with charts and indicators on a screen' },
        steps: [
          { phase: 'Client', short: 'Today', text: 'An SME managing orders and jobs across Excel sheets, emails and paper forms.' },
          {
            phase: 'Problem',
            short: 'Problem',
            text: 'The same data is entered several times, information gets lost between steps and nobody has a clear view of where the work stands.',
          },
          {
            phase: 'Process analysis',
            short: 'Map',
            text: 'I map the process as it is, together with the people who live it every day: where data originates, who uses it, which steps are no longer needed.',
          },
          {
            phase: 'Streamlining & development',
            short: 'Lean',
            text: 'The software adapts to the way the company works, not the other way round — but first the process gets cleaned up. Then I build the system in gradual releases and migrate the existing data.',
          },
          {
            phase: 'Final product',
            short: 'System',
            text: 'A single shared tool: data entered once, work status always visible, fewer errors and less time wasted.',
          },
        ],
      },
      {
        id: 'videogiochi',
        tab: 'Video games',
        title: 'From an idea to a playable demo',
        summary: 'A game concept taken, phase by phase, to a demo ready to show to players, publishers and investors.',
        visual: 'game',
        steps: [
          {
            phase: 'The client’s idea',
            short: 'Idea',
            text: 'The client arrives with an idea: a mood, a character, a mechanic that excites them. Together we put it on paper and figure out what makes it genuinely fun.',
          },
          {
            phase: 'Pre-alpha',
            short: 'Pre-alpha',
            text: 'Grey boxes, no art: just the core mechanic, tested over and over. If the game isn’t fun like this, it won’t be with graphics on top.',
          },
          {
            phase: 'Alpha',
            short: 'Alpha',
            text: 'The game becomes playable from start to finish: levels, rules, first art assets. Everything can still change — and this is the right moment to change it.',
          },
          {
            phase: 'Beta',
            short: 'Beta',
            text: 'Complete content, art, lighting and sound. People play, feedback comes in, and balance, performance and bugs get polished.',
          },
          {
            phase: 'Demo',
            short: 'Demo',
            text: 'A polished, stable demo ready to show to players, publishers or investors: the first step for the game to live outside the lab.',
          },
        ],
      },
    ],
  },

  visuals: {
    consult: {
      docs: ['Directive 2014/34/EU', 'Directive 1999/92/EC', 'Zone table'],
      rules: [
        ['Zone 0 · 20', 'Cat. 1'],
        ['Zone 1 · 21', 'Cat. 1–2'],
        ['Zone 2 · 22', 'Cat. 1–3'],
      ],
      legend: 'G = gas · D = dust',
      modelComment: '// rules extracted from the ATEX directives',
      fnComment: '// one rule, one function: testable',
      tests: '4 tests passed',
      appTitle: 'ATEX check',
      zone: 'Zone',
      device: 'Equipment',
      ok: 'Suitable',
      ko: 'Not suitable',
      gas: 'gas',
      dust: 'dust',
      or: 'or',
      reasonOk: (device: string, zone: number) => `Category ${device} is allowed in zone ${zone}.`,
      reasonCat: (zone: number, allowed: string) => `Zone ${zone} requires category ${allowed} equipment.`,
      reasonAtm: (deviceAtm: string, zone: number, zoneAtm: string) => `Equipment rated for ${deviceAtm}, but zone ${zone} is a ${zoneAtm} zone.`,
      disclaimer: 'Simplified demo — not a substitute for a risk assessment.',
    },
    docs: ['Order', 'Email', 'Production', 'Warehouse', 'Re-entry', 'Delivery'],
    oneTool: 'ONE SINGLE TOOL',
    duplicated: 'SAME DATA, ENTERED THREE TIMES',
    game: {
      title: 'Lantern',
      idea: '— game idea',
      jump: 'jump!',
      moon: 'huge moon, warm light',
      light: 'she carries the light',
      demo: 'PLAYABLE DEMO',
      start: 'PRESS START',
    },
  },

  about: {
    label: 'About',
    principlesLabel: 'Principles',
    statement:
      'I chose not to specialise in a single tool, but in a way of thinking: breaking problems down, understanding real constraints and building solutions that last.',
    bio: [
      'I’m Gabriele Boffa, a designer by trade. GDB Labs is my lab: small and direct, where you always talk to the person who designs, builds and writes the code.',
      'I work with small and medium-sized businesses and professionals who need digital tools tailored to their own processes. Alongside development I offer technical consulting, including the analysis of regulatory constraints such as ATEX.',
      'Away from software I work with my hands: I model and 3D-print parts and prototypes, and I develop video games. These worlds feed each other — the rigour of business systems, the responsiveness of games, the tangibility of a part you can hold.',
    ],
    principles: [
      {
        title: 'Clarity before code',
        text: 'Good analysis saves more than any optimisation. First I understand, then I build.',
      },
      {
        title: 'Right-sized solutions',
        text: 'No oversized architectures: the right tool for the problem and for the budget available.',
      },
      {
        title: 'One point of contact',
        text: 'Fewer hand-offs, fewer misunderstandings, faster decisions. The person who listens is the person who builds.',
      },
    ],
  },

  contact: {
    label: 'Contact',
    title: ['Got a project', 'in mind?'],
    lead: 'Tell me what you want to build or which process you want to improve. I’ll reply with concrete questions and — if it makes sense to work together — a clear proposal.',
    direct: 'Write to me directly',
    copyAria: 'Copy email address',
    copied: 'Copied',
    need: 'What do you need?',
    topics: ['Management software', 'Web app', 'Automation', 'Consulting', '3D prototype', 'Video game', 'Other'],
    name: 'Name',
    email: 'Email',
    message: 'Tell me about the project',
    mailNote: 'Your email app will open with the message already filled in.',
    submit: 'Send request',
    subject: 'New project',
    scope: 'Area',
    top: 'Back to top ↑',
  },
};

export const dictionaries: Record<Locale, Content> = { it, en };
