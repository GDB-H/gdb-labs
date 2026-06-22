import React from 'react';

export const SvgDefs = () => (
  <svg style={{ display: 'none' }}>
    <defs>
            {/* Pattern Griglia */}
            <pattern id="cadGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <rect width="50" height="50" fill="none" />
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                {/* Sottogriglia */}
                <path d="M 10 0 L 10 50 M 20 0 L 20 50 M 30 0 L 30 50 M 40 0 L 40 50 M 0 10 L 50 10 M 0 20 L 50 20 M 0 30 L 50 30 M 0 40 L 50 40" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
            </pattern>

            {/* Tratteggi Tecnici */}
            <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#64748b" strokeWidth="1" />
            </pattern>
            <pattern id="crossHatch" width="10" height="10" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="10" y2="10" stroke="#94a3b8" strokeWidth="0.5" />
                <line x1="10" y1="0" x2="0" y2="10" stroke="#94a3b8" strokeWidth="0.5" />
            </pattern>
            <pattern id="groundHatch" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="20" stroke="#0f172a" strokeWidth="2" />
                <line x1="6" y1="0" x2="6" y2="20" stroke="#475569" strokeWidth="0.5" />
                <line x1="12" y1="0" x2="12" y2="20" stroke="#475569" strokeWidth="0.5" />
            </pattern>

            {/* Frecce per quote dimensionali */}
            <marker id="arrowStart" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
                <path d="M 6 0 L 0 3 L 6 6 Z" fill="#475569" />
            </marker>
            <marker id="arrowEnd" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                <path d="M 0 0 L 6 3 L 0 6 Z" fill="#475569" />
            </marker>

            {/* Simbolo Quadro Elettrico (QGE) */}
            <g id="sym-qge">
                <rect x="-15" y="-20" width="30" height="40" className="bp-med" fill="#050507"/>
                <line x1="-15" y1="-20" x2="15" y2="20" className="bp-thin"/>
                <line x1="15" y1="-20" x2="-15" y2="20" className="bp-thin"/>
                <circle cx="0" cy="0" r="4" fill="#050507" className="bp-med"/>
            </g>

            {/* Simbolo Valvola */}
            <g id="sym-valve">
                <path d="M -10 -10 L 10 10 L 10 -10 L -10 10 Z" className="bp-med" fill="#050507"/>
                <line x1="0" y1="0" x2="0" y2="-15" className="bp-med"/>
                <line x1="-5" y1="-15" x2="5" y2="-15" className="bp-thick"/>
            </g>
        </defs>
  </svg>
);

export const SvgLevelProg = () => (
  <svg className="svg-blueprint" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1000" height="1000" className="bp-grid" />
                    
                    {/* Titolo Tavola */}
                    <text x="30" y="50" className="bp-text-title">LIVELLO 5 - CORE SOFTWARE & DEPLOYMENT</text>
                    <line x1="30" y1="60" x2="400" y2="60" className="bp-med"/>

                    {/* Struttura Principale */}
                    <rect x="250" y="300" width="180" height="700" className="bp-thick bp-crosshatch" />
                    <path d="M 250 400 Q 200 400 200 500 L 200 1000 L 250 1000 Z" className="bp-thick bp-hatch" />
                    
                    {/* Traliccio Antenna / Server Gateway */}
                    <line x1="340" y1="300" x2="340" y2="80" className="bp-thick" />
                    <line x1="320" y1="80" x2="360" y2="80" className="bp-med" />
                    <line x1="330" y1="120" x2="350" y2="120" className="bp-med" />
                    <line x1="310" y1="160" x2="370" y2="160" className="bp-med" />
                    <circle cx="340" cy="80" r="6" className="bp-fill" />
                    {/* Onde Radio (API Calls) */}
                    <path d="M 320 60 A 30 30 0 0 0 360 60" className="bp-med" fill="none"/>
                    <path d="M 300 40 A 50 50 0 0 0 380 40" className="bp-dashed" fill="none"/>
                    
                    {/* Rampa di lancio / Pipeline CI/CD */}
                    <path d="M 430 400 L 750 400 L 780 430 L 880 430 L 880 460 L 430 460 Z" className="bp-thick" fill="#050507"/>
                    <path d="M 450 400 L 480 460 M 480 400 L 510 460 M 510 400 L 540 460 M 540 400 L 570 460 M 570 400 L 600 460 M 600 400 L 630 460 M 630 400 L 660 460" className="bp-thin" />
                    <use href="#sym-qge" x="700" y="380" transform="scale(0.8)"/>
                    <use href="#sym-qge" x="740" y="380" transform="scale(0.8)"/>
                    
                    {/* Parabolica / Sensori Neurali */}
                    <path d="M 600 350 Q 650 300 700 350 A 50 50 0 0 0 700 400 Z" className="bp-med" fill="#050507"/>
                    <line x1="650" y1="350" x2="680" y2="330" className="bp-thin"/>
                    <circle cx="680" cy="330" r="4" className="bp-fill"/>

                    {/* Quote e Dettagli Elettrici */}
                    <line x1="230" y1="300" x2="200" y2="300" className="bp-dim-ext"/>
                    <line x1="230" y1="1000" x2="200" y2="1000" className="bp-dim-ext"/>
                    <line x1="215" y1="300" x2="215" y2="1000" className="dim-line"/>
                    <text x="205" y="650" className="bp-dim" transform="rotate(-90 205 650)">H = 125.00 mm (SEZ. A-A)</text>
                    
                    {/* Finestra ispezione logica */}
                    <rect x="280" y="500" width="80" height="150" rx="40" className="bp-thick" fill="#0f172a"/>
                    <line x1="260" y1="550" x2="380" y2="550" className="bp-thin" />
                    <line x1="260" y1="600" x2="380" y2="600" className="bp-thin" />

                    {/* CALLOUTS DETTAGLIATI */}
                    <circle cx="150" cy="200" r="18" className="bp-thick" fill="#050507"/>
                    <text x="150" y="204" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>1</text>
                    <polyline points="168,200 240,200 310,140" className="leader-line" />
                    <circle cx="310" cy="140" r="4" className="leader-dot" />
                    <text x="35" y="235" className="bp-text">ANTENNA TRASMISSIONE DATI / API GATEWAY</text>
                    <text x="35" y="250" className="bp-text-small">SISTEMA DI COMUNICAZIONE GLOBALE E ROUTING.</text>
                    <text x="35" y="260" className="bp-text-small">ARCHITETTURA BACKEND PYTHON/JS. ALTA AFFIDABILITA'.</text>

                    <circle cx="850" cy="280" r="18" className="bp-thick" fill="#050507"/>
                    <text x="850" y="284" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>2</text>
                    <polyline points="832,280 780,280 720,350" className="leader-line" />
                    <circle cx="720" cy="350" r="4" className="leader-dot" />
                    <text x="680" y="230" className="bp-text">PIATTAFORMA DI DEPLOYMENT CONTINUO</text>
                    <text x="680" y="245" className="bp-text-small">RAMPA DI LANCIO DEL CODICE IN PRODUZIONE.</text>
                    <text x="680" y="255" className="bp-text-small">CONTROLLO ATTRAVERSO QGE LOCALIZZATI (IP67).</text>
                </svg>
);

export const SvgLevelGest = () => (
  <svg className="svg-blueprint" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1000" height="1000" className="bp-grid" />
                    <text x="30" y="50" className="bp-text-title">LIVELLO 4 - DATA CENTER OMEGA E GESTIONALI</text>
                    <line x1="30" y1="60" x2="480" y2="60" className="bp-med"/>

                    {/* Struttura Centrale Continua */}
                    <rect x="250" y="0" width="180" height="1000" className="bp-thick fill-white" />
                    
                    {/* Dettagli Cablaggio Strutturato */}
                    <rect x="270" y="0" width="140" height="1000" className="bp-thin bp-crosshatch" />
                    <line x1="340" y1="0" x2="340" y2="1000" className="bp-dashed" />
                    <line x1="360" y1="0" x2="360" y2="1000" className="bp-thin" />
                    {/* Scatole di derivazione */}
                    <rect x="330" y="200" width="40" height="60" className="bp-med" fill="#050507"/>
                    <rect x="330" y="500" width="40" height="60" className="bp-med" fill="#050507"/>
                    <rect x="330" y="800" width="40" height="60" className="bp-med" fill="#050507"/>

                    {/* LASTRONI OVALIZZATI -> SERVER RACK CORAZZATI */}
                    <g id="server-tank">
                        <ellipse cx="0" cy="0" rx="80" ry="45" className="bp-thick bp-hatch" fill="#050507"/>
                        {/* Rack slots */}
                        <line x1="-50" y1="-10" x2="50" y2="-10" className="bp-thin"/>
                        <line x1="-50" y1="0" x2="50" y2="0" className="bp-thin"/>
                        <line x1="-50" y1="10" x2="50" y2="10" className="bp-thin"/>
                        <circle cx="30" cy="-5" r="2" className="bp-fill"/>
                        <circle cx="30" cy="5" r="2" className="bp-fill"/>
                    </g>
                    
                    <use href="#server-tank" x="550" y="200" />
                    <use href="#server-tank" x="550" y="320" />
                    <use href="#server-tank" x="550" y="440" />
                    
                    <use href="#server-tank" x="550" y="680" />
                    <use href="#server-tank" x="550" y="800" />

                    {/* Sistema Desmo / Tubature automazione raffreddamento */}
                    <path d="M 430 200 L 470 200 L 470 800 L 430 800" className="bp-thick" fill="none"/>
                    {/* Diramazioni ai server */}
                    <path d="M 470 200 L 510 200 M 470 320 L 510 320 M 470 440 L 510 440 M 470 680 L 510 680 M 470 800 L 510 800" className="bp-med" />
                    {/* Valvole */}
                    <use href="#sym-valve" x="490" y="200" transform="scale(0.7)"/>
                    <use href="#sym-valve" x="490" y="320" transform="scale(0.7)"/>
                    <use href="#sym-valve" x="490" y="440" transform="scale(0.7)"/>

                    {/* Condotti HVAC Sinistra */}
                    <rect x="150" y="250" width="80" height="500" className="bp-thick" fill="#050507"/>
                    <path d="M 150 300 L 230 300 M 150 400 L 230 400 M 150 500 L 230 500 M 150 600 L 230 600 M 150 700 L 230 700" className="bp-med" />
                    <text x="130" y="500" className="bp-text" transform="rotate(-90 130 500)">CONDOTTI HVAC - EX(d) ZONA 1</text>

                    {/* Quote */}
                    <line x1="650" y1="200" x2="680" y2="200" className="bp-dim-ext"/>
                    <line x1="650" y1="440" x2="680" y2="440" className="bp-dim-ext"/>
                    <line x1="665" y1="200" x2="665" y2="440" className="dim-line"/>
                    <text x="675" y="325" className="bp-dim">240.0</text>

                    {/* CALLOUTS DETTAGLIATI */}
                    <circle cx="850" cy="150" r="18" className="bp-thick" fill="#050507"/>
                    <text x="850" y="154" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>3</text>
                    <polyline points="832,150 720,150 600,180" className="leader-line" />
                    <circle cx="600" cy="180" r="4" className="leader-dot" />
                    <text x="650" y="95" className="bp-text">CLUSTER DATABASE ERP (SALA OMEGA)</text>
                    <text x="650" y="110" className="bp-text-small">LASTRONI OVALIZZATI CON CORAZZATURA IN MOLIBDENO.</text>
                    <text x="650" y="120" className="bp-text-small">ARCHIVIAZIONE FLUSSI AZIENDALI E DATI STRUTTURATI.</text>

                    <circle cx="850" cy="550" r="18" className="bp-thick" fill="#050507"/>
                    <text x="850" y="554" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>4</text>
                    <polyline points="832,550 700,550 490,440" className="leader-line" />
                    <circle cx="490" cy="440" r="4" className="leader-dot" />
                    <text x="590" y="510" className="bp-text">SISTEMA DI RAFFREDDAMENTO DESMO</text>
                    <text x="590" y="525" className="bp-text-small">LIQUIDO DIELETTRICO IN TUBI Ø500MM.</text>
                    <text x="590" y="535" className="bp-text-small">DISSIPAZIONE TERMICA PER CARICHI APPLICATIVI ELEVATI.</text>
                </svg>
);

export const SvgLevelCons = () => (
  <svg className="svg-blueprint" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1000" height="1000" className="bp-grid" />
                    <text x="30" y="50" className="bp-text-title">LIVELLO 3 - GROUND ZERO E LABIRINTO ANALITICO</text>
                    <line x1="30" y1="60" x2="520" y2="60" className="bp-med"/>

                    {/* Base / Radici Architettoniche */}
                    <rect x="250" y="0" width="180" height="700" className="bp-thick fill-white" />
                    <path d="M 250 200 Q 150 500 50 700 L 250 700 Z" className="bp-thick bp-crosshatch" />
                    <path d="M 430 400 Q 550 600 750 700 L 430 700 Z" className="bp-thick bp-crosshatch" />
                    
                    {/* Linea di Terra e Terreno */}
                    <line x1="0" y1="700" x2="1000" y2="700" className="bp-thick" strokeWidth="6"/>
                    <rect x="0" y="700" width="1000" height="300" className="bp-ground" />
                    
                    {/* Struttura Labirintoide / Diagramma di Flusso logico */}
                    <path d="M 340 700 L 340 850 L 500 850 L 500 1000" className="bp-thick" fill="#050507" />
                    <path d="M 360 700 L 360 830 L 480 830 L 480 1000" className="bp-thin" fill="#050507" />
                    <rect x="380" y="750" width="40" height="40" className="bp-med" fill="#0f172a" transform="rotate(45 400 770)"/> {/* Simbolo Rombo / Decisione */}
                    
                    <path d="M 280 700 L 280 800 L 150 800 L 150 950 L 100 950" className="bp-thick" fill="#050507" />
                    {/* Falsa entrata sbarrata */}
                    <line x1="90" y1="920" x2="110" y2="980" className="bp-thick"/>
                    <line x1="110" y1="920" x2="90" y2="980" className="bp-thick"/>

                    <rect x="200" y="780" width="40" height="40" className="bp-med" fill="#050507"/> {/* Simbolo processo */}
                    
                    {/* Alberi stilizzati (Sezione paesaggistica in pianta) */}
                    <g className="bp-thin" fill="#1e293b">
                        <circle cx="100" cy="650" r="40"/>
                        <circle cx="120" cy="670" r="30"/>
                        <circle cx="80" cy="680" r="20"/>
                        <line x1="100" y1="650" x2="100" y2="700" className="bp-thick"/>
                    </g>
                    <g className="bp-thin" fill="#1e293b">
                        <circle cx="820" cy="630" r="50"/>
                        <circle cx="860" cy="660" r="30"/>
                        <line x1="830" y1="630" x2="830" y2="700" className="bp-thick"/>
                    </g>

                    {/* Quote */}
                    <line x1="30" y1="700" x2="60" y2="700" className="bp-dim-ext"/>
                    <text x="30" y="690" className="bp-dim font-bold">QUOTA 0.00 (GROUND)</text>

                    {/* CALLOUTS DETTAGLIATI */}
                    <circle cx="850" cy="200" r="18" className="bp-thick" fill="#050507"/>
                    <text x="850" y="204" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>5</text>
                    <polyline points="832,200 650,200 550,550" className="leader-line" />
                    <circle cx="550" cy="550" r="4" className="leader-dot" />
                    <text x="590" y="140" className="bp-text">BASE CUNICOLARE LABIRINTOIDE</text>
                    <text x="590" y="155" className="bp-text-small">FILTRO RICHIESTE E ANALISI DEI REQUISITI CLIENTE.</text>
                    <text x="590" y="165" className="bp-text-small">SNODI MULTIPLI PER VALUTAZIONE FATTIBILITA'. ENTRATE FALSE.</text>

                    <circle cx="200" cy="850" r="18" className="bp-thick" fill="#050507"/>
                    <text x="200" y="854" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>6</text>
                    <polyline points="218,850 300,850 380,770" className="leader-line" />
                    <rect x="50" y="880" width="280" height="45" fill="#050507" stroke="#0f172a" strokeWidth="2" />
                    <text x="60" y="900" className="bp-text">NODO DECISIONALE TRASVERSALE</text>
                    <text x="60" y="915" className="bp-text-small">VERIFICA NORMATIVA (DIRETTIVA MACCHINE/ATEX)</text>
                </svg>
);

export const SvgLevelStampa3D = () => (
  <svg className="svg-blueprint" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1000" height="1000" className="bp-ground" />
                    
                    <rect x="20" y="20" width="400" height="35" fill="#050507" className="bp-thick"/>
                    <text x="30" y="42" className="bp-text-title">LIVELLO 2 - BAIA PROTOTIPAZIONE SOTTERRANEA</text>

                    {/* Pozzo principale */}
                    <rect x="480" y="0" width="120" height="1000" fill="#050507" className="bp-thick" />
                    <line x1="500" y1="0" x2="500" y2="1000" className="bp-thin" />
                    <line x1="580" y1="0" x2="580" y2="1000" className="bp-thin" />
                    
                    {/* Ascensore/Montacarichi */}
                    <g id="elevator" transform="translate(0, 300)">
                        <rect x="505" y="0" width="70" height="100" className="bp-med" fill="#0f172a" />
                        <line x1="505" y1="20" x2="575" y2="20" className="bp-thin" />
                        <line x1="505" y1="80" x2="575" y2="80" className="bp-thin" />
                        <circle cx="540" cy="50" r="15" className="bp-thick" fill="#050507"/>
                        <circle cx="540" cy="50" r="5" className="bp-fill"/>
                    </g>
                    {/* Cavi sospensione */}
                    <line x1="540" y1="0" x2="540" y2="300" className="bp-dashed" />
                    <line x1="520" y1="0" x2="520" y2="300" className="bp-thin" />
                    <line x1="560" y1="0" x2="560" y2="300" className="bp-thin" />

                    {/* Stanza laterale: Laboratorio 3D */}
                    <rect x="150" y="550" width="330" height="250" fill="#050507" className="bp-thick" />
                    <rect x="160" y="560" width="310" height="230" fill="#0f172a" className="bp-thin" />
                    
                    {/* CNC / Stampante 3D Industrial */}
                    <g transform="translate(180, 650)">
                        <rect x="0" y="0" width="150" height="40" className="bp-med" fill="#334155"/>
                        <rect x="10" y="-80" width="20" height="80" className="bp-thick" fill="#050507"/>
                        <rect x="120" y="-80" width="20" height="80" className="bp-thick" fill="#050507"/>
                        <line x1="30" y1="-70" x2="120" y2="-70" className="bp-med"/>
                        <rect x="60" y="-75" width="30" height="50" className="bp-thick" fill="#050507"/> {/* Testina estrusore */}
                        <line x1="75" y1="-25" x2="75" y2="0" className="bp-dashed-thin" stroke="red"/> {/* Filamento/Laser */}
                        <path d="M 60 0 L 90 0 L 80 -10 L 70 -10 Z" fill="#0f172a"/> {/* Pezzo in stampa */}
                    </g>
                    
                    <text x="180" y="630" className="bp-text-small font-bold">SISTEMA DI ESTRUSIONE POLIMERICA (EX-ROTTAMAIO)</text>

                    {/* Cunicoli scarico */}
                    <path d="M 150 700 L 50 700" className="bp-thick" fill="#050507" />
                    <path d="M 600 800 L 800 800 L 800 1000" className="bp-thick" fill="#050507" />
                    <text x="650" y="790" className="bp-text-small">CUNICOLO 2: VERSO STOCCAGGIO FILAMENTI</text>
                    
                    {/* Quote Lab */}
                    <line x1="150" y1="520" x2="150" y2="540" className="bp-dim-ext"/>
                    <line x1="480" y1="520" x2="480" y2="540" className="bp-dim-ext"/>
                    <line x1="150" y1="530" x2="480" y2="530" className="dim-line"/>
                    <text x="315" y="525" className="bp-dim" textAnchor="middle">L = 12000.0</text>

                    {/* CALLOUTS DETTAGLIATI */}
                    <circle cx="780" cy="250" r="18" className="bp-thick" fill="#050507"/>
                    <text x="780" y="254" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>7</text>
                    <polyline points="762,250 650,250 560,350" className="leader-line" stroke="white"/>
                    <circle cx="560" cy="350" r="4" fill="#050507" />
                    <rect x="700" y="280" width="250" height="70" fill="#050507" className="bp-med" />
                    <text x="710" y="300" className="bp-text">POZZO ESTRATTIVO / MONTACARICHI</text>
                    <text x="710" y="315" className="bp-text-small">COLLEGAMENTO RAPIDO CON LA SUPERFICIE.</text>
                    <text x="710" y="330" className="bp-text-small">PORTATA MAX: 5000 KG.</text>
                    
                    <rect x="150" y="350" width="280" height="70" fill="#050507" className="bp-med" />
                    <circle cx="180" cy="385" r="18" className="bp-thick" />
                    <text x="180" y="389" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>8</text>
                    <text x="210" y="375" className="bp-text">BAIA DI PROTOTIPAZIONE RAPIDA</text>
                    <text x="210" y="390" className="bp-text-small">RICONVERSIONE AREA ROTTAMAIO.</text>
                    <text x="210" y="405" className="bp-text-small">MACCHINARI STAMPA 3D E MODELLAZIONE CAD/CAM.</text>
                    <polyline points="300,420 300,550" className="leader-line" stroke="white" />
                    <circle cx="300" cy="550" r="4" fill="#050507" />

                </svg>
);

export const SvgLevelGames = () => (
  <svg className="svg-blueprint" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <rect width="1000" height="1000" className="bp-ground" />
                    <rect x="20" y="20" width="380" height="35" fill="#050507" className="bp-thick"/>
                    <text x="30" y="42" className="bp-text-title">LIVELLO 1 - ZONA DELTA: NUCLEO CREATIVO</text>

                    {/* Pozzo principale d'arrivo */}
                    <rect x="480" y="0" width="120" height="300" fill="#050507" className="bp-thick" />
                    
                    {/* STANZA DELTA (Bunker Massimo Isolamento) */}
                    <rect x="200" y="300" width="600" height="450" fill="#050507" className="bp-thick" strokeWidth="12" />
                    <rect x="220" y="320" width="560" height="410" fill="#1e293b" className="bp-med" />
                    <rect x="230" y="330" width="540" height="390" fill="#050507" className="bp-thin bp-crosshatch" />
                    
                    {/* Sigilli corazzati e pistoni idraulici */}
                    <g stroke="white" strokeWidth="4">
                        <line x1="200" y1="380" x2="160" y2="380" className="bp-thick"/>
                        <line x1="200" y1="670" x2="160" y2="670" className="bp-thick"/>
                        <line x1="800" y1="380" x2="840" y2="380" className="bp-thick"/>
                        <line x1="800" y1="670" x2="840" y2="670" className="bp-thick"/>
                    </g>
                    
                    {/* NUCLEO CENTRALE: Il Motore Grafico in "Sonno" */}
                    <g transform="translate(500, 525)">
                        <circle cx="0" cy="0" r="120" className="bp-thick bp-hatch" fill="#050507"/>
                        <circle cx="0" cy="0" r="80" className="bp-med" fill="#0f172a"/>
                        {/* Geometrie interne / Low poly wireframe */}
                        <path d="M 0 -60 L 50 -20 L 30 50 L -30 50 L -50 -20 Z" className="bp-thick" fill="none"/>
                        <path d="M 0 -60 L 0 0 M 50 -20 L 0 0 M 30 50 L 0 0 M -30 50 L 0 0 M -50 -20 L 0 0" className="bp-thin"/>
                        <circle cx="0" cy="0" r="10" className="bp-fill"/>
                    </g>
                    
                    {/* Cavi dati giganti in uscita dal nucleo */}
                    <path d="M 380 525 L 220 525" className="bp-thick" strokeDasharray="15,10"/>
                    <path d="M 620 525 L 780 525" className="bp-thick" strokeDasharray="15,10"/>
                    
                    {/* Simbolo Pericolo Alta Tensione / Accesso Riservato */}
                    <path d="M 250 400 L 280 350 L 310 400 Z" className="bp-thick" fill="none"/>
                    <text x="280" y="390" textAnchor="middle" className="bp-text-title" style={{fontSize: '24px'}}>!</text>

                    {/* CALLOUTS DETTAGLIATI */}
                    <rect x="40" y="450" width="280" height="120" fill="#050507" className="bp-med" />
                    <circle cx="70" cy="480" r="18" className="bp-thick" />
                    <text x="70" y="484" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>9</text>
                    <text x="100" y="475" className="bp-text">STANZA DELTA: TOP SECRET</text>
                    <text x="50" y="510" className="bp-text-small">QUI GIACE IN SONNO IPERBARICO IL MOTORE GRAFICO.</text>
                    <text x="50" y="525" className="bp-text-small">IL CORE CREATIVO E' SIGILLATO STAGNO.</text>
                    <text x="50" y="540" className="bp-text-small font-bold">SOLO G. BOFFA IN PERSONA PUO' APRIRLO.</text>
                    <polyline points="320,510 380,510" className="leader-line" stroke="white" />
                    
                    <rect x="740" y="700" width="220" height="80" fill="#050507" className="bp-med" />
                    <circle cx="770" cy="730" r="18" className="bp-thick" />
                    <text x="770" y="734" textAnchor="middle" className="bp-text-title" style={{fontSize: '14px'}}>10</text>
                    <text x="800" y="725" className="bp-text">CUNICOLO 1 (BAIA)</text>
                    <text x="750" y="755" className="bp-text-small">GENERAZIONE PROCEDURALE DI</text>
                    <text x="750" y="765" className="bp-text-small">MONDI INTERATTIVI E LORE.</text>
                    <polyline points="650,650 740,700" className="leader-line" stroke="white" />
                </svg>
);
