/**
 * PRISER — ét sted.
 *
 * ⚠️ FINN SKAL BEKRÆFTE HVERT ENESTE SPÆND HER INDEN SIDERNE GÅR LIVE.
 * Tallene er sat efter markedsniveau i Nordsjælland 2026 og efter hvad de
 * konkurrenter der i dag ligger nr. 1 på "velux montering pris" skriver.
 * De er kvalificerede gæt, ikke Holstrups egne kalkulationer.
 *
 * Hvorfor spænd og ikke faste tal: sitet må ikke udgive priser der læses som
 * et tilbud. Men en side der kun siger "kontakt os for pris" konverterer
 * dårligere end en der rammer niveauet — hele grunden til at de her sider kan
 * slå portalerne er at de overhovedet taler om penge. Så: behold pris-
 * sektionerne, skru ned for præcisionen. Spændene skal være brede nok til at
 * være sande på rigtige opgaver.
 *
 * Ret et spænd her, og det slår igennem på alle sider på én gang.
 */

export type PriceSpan = { from: number; to: number };

/** 19500 → "19.500". Ingen ICU-afhængighed, så outputtet er ens overalt. */
function tal(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** {17000, 23000} → "17.000–23.000 kr". */
export function kr(span: PriceSpan): string {
  return `${tal(span.from)}–${tal(span.to)} kr`;
}

/**
 * Linjen der skal stå under hver eneste pristabel. `set` er det Finn skal se
 * — "taget", "terrassen". Peger videre til handelsbetingelserne, så ingen
 * bliver overrasket over at et tal kan flytte sig.
 */
export function prisForbehold(set: string): string {
  return `Alle priser er vejledende spænd, ikke et tilbud. Vi regner altid din opgave igennem ud fra dit materialevalg og dine ønsker, og det endelige tal får du når Finn har stået og set ${set} med egne øjne — stand, adgang og det der ligger under overfladen påvirker også prisen, og det kan man ikke se hjemmefra. Dukker der noget uventet op undervejs, stopper vi og aftaler det med dig først; se handelsbetingelserne.`;
}

export type PriceRow = {
  label: string;
  detail?: string;
  /** Færdigformateret, fordi nogle rækker er m²-priser og nogle er stykpriser. */
  price: string;
};

/**
 * Pris pr. vindue, alt inklusive: nedtagning, nyt vindue, inddækning
 * tilpasset tagtypen, undertagskrave, dampspærre, indvendig lysning,
 * oprydning og bortkørsel. Spændet dækker forskellen på tagtype, adgang og
 * hvor meget lysningen indvendigt skal bygges om.
 */
export const VELUX_PRICES = {
  udskiftningStandard: { from: 17000, to: 23000 },
  udskiftningStort: { from: 24000, to: 33000 },
  nytHul: { from: 26000, to: 36000 },
  fladtTag: { from: 34000, to: 48000 },
} as const satisfies Record<string, PriceSpan>;

/**
 * Enkeltspænd der nævnes i brødteksten. Står her så de ikke driver fra
 * pristabellen når et af dem rettes. ⚠️ Skal også bekræftes af Finn.
 */
export const VELUX_EKSTRA = {
  /** Ny rude i en karm der stadig er god. */
  rudeUdskiftning: { from: 5500, to: 8500 },
  /** Stillads, når tagfladen ikke kan nås forsvarligt fra en stige. */
  stillads: { from: 4500, to: 9000 },
  /** Merpris for at flytte et ovenlys til et bedre sted frem for at skifte det hvor det sidder. */
  flytVindue: { from: 8000, to: 15000 },
} as const satisfies Record<string, PriceSpan>;

/** Tillæg der kan komme oveni. Intervaller her — de afhænger reelt af huset. */
export const VELUX_TILLAEG: PriceRow[] = [
  {
    label: "Stillads",
    detail: "Ved stejl tagflade, høj facade eller når vinduet ikke kan nås fra en stige forsvarligt.",
    price: kr(VELUX_EKSTRA.stillads),
  },
  {
    label: "Nyt undertag omkring vinduet",
    detail: "Er undertaget en gammel banevare der smuldrer når man rører den, skal der nyt i — ellers er tætningen fiktion.",
    price: "2.500–6.000 kr",
  },
  {
    label: "Elektrisk betjening i stedet for manuel",
    detail: "Giver mening når vinduet sidder over 2,5 m oppe eller i et badeværelse.",
    price: "3.500–5.500 kr",
  },
  {
    label: "Udvendig markise eller indvendigt mørklægningsgardin",
    detail: "Pr. vindue. Udvendig markise virker mod varme, indvendigt gardin gør ikke.",
    price: "1.400–3.200 kr",
  },
  {
    label: "Malerbehandling af ny lysning",
    detail: "Vi afleverer lysningen spartlet og klar til maler. Skal vi også male, koster det pr. vindue.",
    price: "1.500–2.500 kr",
  },
];

/**
 * Terrasse, pris pr. m² inkl. materiale, fundament og montage.
 * Ydelsessiden bærer 1.800–3.500 kr/m² — tallene her ligger indenfor det
 * interval og gør det brugbart ved at dele det op på træsort.
 */
export const TERRASSE_PRICES: PriceRow[] = [
  {
    label: "Trykimprægneret fyr",
    detail: "Billigst i indkøb. Skal olies hvert andet år, og holder 15–20 år når fundamentet er i orden.",
    price: "1.800–2.200 kr/m²",
  },
  {
    label: "Lærk eller termobehandlet fyr",
    detail: "Gråner smukt og kan stå ubehandlet. Mellemvejen mellem fyr og hårdtræ.",
    price: "2.200–2.700 kr/m²",
  },
  {
    label: "Komposit (WPC)",
    detail: "Vedligeholdelsesfri. Bliver varm i direkte sol og har et andet udtryk end træ.",
    price: "2.600–3.100 kr/m²",
  },
  {
    label: "Hårdtræ — bangkirai, ipe eller kebony",
    detail: "Dyrest, og det eneste der holder 30+ år uden behandling. Det vi anbefaler tæt på fjorden.",
    price: "2.900–3.500 kr/m²",
  },
];

/** Hævet terrasse koster mere end en i terræn — bæring, værn og trappe kommer oveni. */
export const HAEVET_PRICES: PriceRow[] = [
  {
    label: "Hævet terrassedæk",
    detail: "Pr. m² inkl. punktfundament under frostfri dybde, bærende konstruktion og brædder.",
    price: "2.600–4.200 kr/m²",
  },
  {
    label: "Værn",
    detail: "Pr. løbende meter. Kravet træder ind ved et niveauspring på mere end 0,5 m.",
    price: "1.400–2.400 kr/lbm",
  },
  {
    label: "Trappe ned til haven",
    detail: "Afhænger af højde og bredde. En bred trappe i fuld terrassebredde koster mere.",
    price: "6.000–12.000 kr",
  },
  {
    label: "Tegninger til byggeansøgning",
    detail: "Situationsplan, snit med koter og facadetegning. Vi laver dem og sender ansøgningen.",
    price: "4.000–8.000 kr",
  },
];

/**
 * Nyt tag, pris pr. m² tagflade inkl. nedtagning, nyt undertag, lægter,
 * inddækninger, montage og bortskaffelse. ⚠️ Markedsniveau, ikke Holstrups
 * egne kalkulationer — Finn skal bekræfte. En typisk villa har 150–180 m²
 * tagflade, så tegl-rækken rammer de 250–350.000 kr ydelsessidens FAQ nævner.
 */
export const TAG_PRICES: PriceRow[] = [
  {
    label: "Betontagsten",
    detail: "Billigst af stenene. Tung, så spærene skal kunne bære den.",
    price: "1.100–1.600 kr/m²",
  },
  {
    label: "Fibercementskifer (eternit uden asbest)",
    detail: "Let og ens i udtrykket. Klassikeren på 70'er-villaer.",
    price: "1.200–1.800 kr/m²",
  },
  {
    label: "Teglsten",
    detail: "Holder længst af de almindelige stentage og klæder de ældre huse.",
    price: "1.400–2.100 kr/m²",
  },
  {
    label: "Tagpap på fladt tag, to lag",
    detail: "Inkl. nyt underlag. Kræver fald og korrekt afvanding for at holde.",
    price: "800–1.300 kr/m²",
  },
  {
    label: "Naturskifer",
    detail: "Dyrest, og den der holder allerlængst. Kræver en tækker med rutine i skifer.",
    price: "2.200–3.500 kr/m²",
  },
];

/** Tillæg der ofte følger med et nyt tag. ⚠️ Finn skal bekræfte. */
export const TAG_TILLAEG: PriceRow[] = [
  {
    label: "Nedtagning af asbestholdigt tag",
    detail: "Kun tage fra før ca. 1988. Udføres af en virksomhed med asbestautorisation.",
    price: "250–450 kr/m²",
  },
  {
    label: "Efterisolering af loftet",
    detail: "Når taget alligevel er åbent. Arbejdslønnen kan give grønt håndværkerfradrag.",
    price: "250–450 kr/m²",
  },
  {
    label: "Nye tagrender og nedløb",
    detail: "Pr. løbende meter, zink eller stål.",
    price: "450–800 kr/lbm",
  },
];

/**
 * Tilbygning. Ydelsessidens FAQ bærer 18.000–28.000 kr/m² for en simpel
 * tilbygning og 26.000–38.000 med køkken eller bad; rækkerne her deler det op.
 * ⚠️ Finn skal bekræfte.
 */
export const TILBYGNING_PRICES: PriceRow[] = [
  {
    label: "Tilbygning i ét plan, stue eller værelse",
    detail: "Nøglefærdig pr. m² inkl. fundament, tag, vinduer og indvendig afslutning.",
    price: "18.000–28.000 kr/m²",
  },
  {
    label: "Tilbygning med køkken eller bad",
    detail: "VVS, el og vådrum trækker m²-prisen op.",
    price: "26.000–38.000 kr/m²",
  },
  {
    label: "Isoleret helårsudestue",
    detail: "Store glaspartier, isoleret tag og gulv, så den kan bruges hele året.",
    price: "16.000–26.000 kr/m²",
  },
  {
    label: "Kvist på eksisterende tag",
    detail: "Pr. kvist inkl. åbning af taget, konstruktion, vindue og inddækning.",
    price: "90.000–180.000 kr",
  },
  {
    label: "Tegninger og byggeansøgning",
    detail: "Situationsplan, facader, snit og energiberegning. Afhænger af projektets størrelse.",
    price: "15.000–40.000 kr",
  },
];
