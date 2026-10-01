// Tutti i testi e i dati del sito stanno qui: per aggiornare il portfolio
// di solito basta modificare questo file.

export const site = {
  name: 'Gabriele Boffa',
  brand: 'GDB Labs',
  role: 'Sviluppo software & consulenza tecnica',
  // TODO: inserire l'indirizzo reale a cui ricevere le richieste
  email: 'gabriele.boffa@example.com',
  // Lasciare vuoto per nascondere il link
  linkedin: '',
  github: '',
  timezone: 'Europe/Rome',
  location: 'Italia',
};

export const navLinks = [
  { id: 'laboratorio', label: 'Laboratorio' },
  { id: 'competenze', label: 'Competenze' },
  { id: 'casi', label: 'Casi studio' },
  { id: 'chi-sono', label: 'Chi sono' },
];

export const hero = {
  eyebrow: 'Laboratorio di progettazione — software, processi, prototipi',
  lead:
    'Sono Gabriele Boffa e GDB Labs è il mio laboratorio: qui software, processi aziendali e oggetti fisici si progettano sullo stesso banco. Gestionali su misura, web app, automazioni e prototipi 3D — dall’analisi del problema al prodotto finito.',
  rotating: ['Software gestionale', 'Web app', 'Consulenza tecnica', 'Prototipazione 3D', 'Game development'],
};

export const marquee = {
  disciplines: ['Gestionali su misura', 'Web app', 'Automazioni', 'Consulenza tecnica', 'Stampa 3D', 'Videogiochi'],
  stack: ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Next.js', 'Unity', 'C#', 'Fusion 360'],
};

export type Capability = {
  title: string;
  summary: string;
  description: string;
  deliverables: string[];
  tools: string[];
};

export const capabilities: Capability[] = [
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
];

export type Bench = {
  label: string;
  title: string;
  caption: string;
  // foto (URL) oppure illustrazione animata
  image?: string;
  imageAlt?: string;
  visual?: 'dashboard' | 'web' | 'print' | 'game';
};

const unsplash = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

export const lab = {
  hero: {
    image: unsplash('photo-1581092160562-40aa08e78837', 2400),
    alt: 'Progettista al banco di lavoro con disegni tecnici, attrezzi e componenti',
    caption: 'Banco 01 — Progettazione: ogni progetto parte da qui.',
  },
  intro:
    'GDB Labs è un laboratorio nel senso più concreto: un posto dove si prova, si misura e si costruisce. Software, processi e oggetti fisici stanno sullo stesso banco di lavoro — ed è proprio questo misto a generare soluzioni più semplici e più solide.',
  benches: [
    { label: 'Banco 02', title: 'Gestionali', caption: 'Processi aziendali tradotti in software.', visual: 'dashboard' },
    { label: 'Banco 03', title: 'Web app', caption: 'Strumenti web veloci, costruiti su misura.', visual: 'web' },
    { label: 'Banco 04', title: 'Stampa 3D', caption: 'Prototipi da provare sul campo.', visual: 'print' },
    {
      label: 'Il laboratorio',
      title: 'Il misto è il metodo',
      caption: 'Software, hardware, gioco: ogni disciplina insegna qualcosa alle altre.',
      image: unsplash('photo-1550745165-9bc0b252726f'),
      imageAlt: 'Computer, console e cartucce retrò illuminati da luci al neon',
    },
    { label: 'Banco 05', title: 'Videogiochi', caption: 'Sistemi interattivi in tempo reale.', visual: 'game' },
  ] as Bench[],
  verbs: [
    { title: 'Sperimentare', text: 'Ogni idea si verifica con un prototipo, prima di investirci tempo e denaro.' },
    { title: 'Misurare', text: 'Le decisioni nascono da dati e prove sul campo, non da supposizioni.' },
    { title: 'Costruire', text: 'Il risultato è sempre qualcosa che funziona e che si usa ogni giorno.' },
  ],
};

export type CaseStudy = {
  id: string;
  tab: string;
  title: string;
  summary: string;
  // visual animato che cambia a ogni fase (una etichetta breve per fase)
  visual: 'prototype' | 'process' | 'game';
  steps: { phase: string; short: string; text: string }[];
  image?: { src: string; alt: string };
};

// Casi tipo: esempi rappresentativi del metodo. Sostituibili con casi reali.
export const cases: CaseStudy[] = [
  {
    id: 'prototipazione',
    tab: 'Prototipazione',
    title: 'Il ricambio che non esisteva',
    summary: 'Un componente meccanico progettato da zero, provato sul campo e messo in produzione.',
    visual: 'prototype',
    steps: [
      { phase: 'Cliente', short: 'Brief', text: 'Un’azienda manifatturiera con un problema concreto su una linea di produzione.' },
      {
        phase: 'Problema',
        short: 'Guasto',
        text: 'Un supporto si rompe di continuo e a catalogo non esiste un ricambio adatto: ogni guasto significa una macchina ferma e ore di lavoro perse.',
      },
      {
        phase: 'Ricerca e sviluppo',
        short: 'CAD',
        text: 'Rilievo delle misure, analisi delle cause della rottura e dei carichi in gioco, scelta del materiale e studio di una geometria più robusta dell’originale.',
      },
      {
        phase: 'Prototipazione',
        short: 'Stampa',
        text: 'Modello CAD e prototipi stampati in 3D, montati e provati direttamente sulla macchina. Ogni prova suggerisce una modifica, fino al pezzo che regge davvero.',
      },
      {
        phase: 'Prodotto finale',
        short: 'Prodotto',
        text: 'Il componente definitivo nel materiale adatto, più resistente dell’originale, con il file CAD e le indicazioni per riprodurlo quando serve.',
      },
    ],
  },
  {
    id: 'software',
    tab: 'Software su misura',
    title: 'Dal foglio Excel al processo snello',
    summary: 'Un processo aziendale esistente, ripulito dai passaggi inutili e tradotto in un gestionale su misura.',
    visual: 'process',
    image: { src: unsplash('photo-1551288049-bebda4e38f71'), alt: 'Dashboard con grafici e indicatori su uno schermo' },
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
];

export const about = {
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
};

export const contact = {
  lead:
    'Raccontami cosa vuoi costruire o quale processo vuoi migliorare. Ti rispondo con domande concrete e, se ha senso lavorare insieme, con una proposta chiara.',
  topics: ['Gestionale', 'Web app', 'Automazione', 'Consulenza', 'Prototipo 3D', 'Videogioco', 'Altro'],
};
