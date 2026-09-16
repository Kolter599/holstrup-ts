/**
 * PRISER — ét sted.
 *
 * ⚠️ FINN SKAL BEKRÆFTE HVER ENESTE TAL HER INDEN SIDERNE GÅR LIVE.
 * Tallene er sat efter markedsniveau i Nordsjælland 2026 og efter hvad de
 * konkurrenter der i dag ligger nr. 1 på "velux montering pris" skriver.
 * De er kvalificerede gæt, ikke Holstrups egne kalkulationer.
 *
 * Grunden til at de står i kroner og ikke som interval: den side der i dag
 * vinder søgningen er 1.300 ord lang og har fire faste priser. Intervaller
 * taber. Men en fast pris der ikke holder, koster mere end den henter —
 * så hellere rette tallet her end at bløde det op til "fra ... til".
 *
 * Ret et tal her, og det slår igennem på alle sider på én gang.
 */

/** 19.500 → "19.500 kr". Ingen ICU-afhængighed, så outputtet er ens overalt. */
export function kr(n: number): string {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} kr`;
}

export type PriceRow = {
  label: string;
  detail?: string;
  /** Færdigformateret, fordi nogle rækker er m²-priser og nogle er stykpriser. */
  price: string;
};

/**
 * Fast pris pr. vindue, alt inklusive: nedtagning, nyt vindue, inddækning
 * tilpasset tagtypen, undertagskrave, dampspærre, indvendig lysning,
 * oprydning og bortkørsel.
 */
export const VELUX_PRICES = {
  udskiftningStandard: 19500,
  udskiftningStort: 27500,
  nytHul: 29500,
  fladtTag: 39500,
} as const;

/**
 * Enkelttal der nævnes i brødteksten. Står her så de ikke driver fra
 * pristabellen når et af dem rettes. ⚠️ Skal også bekræftes af Finn.
 */
export const VELUX_EKSTRA = {
  /** Ny rude i en karm der stadig er god. */
  rudeUdskiftning: 6500,
  /** Stillads, når tagfladen ikke kan nås forsvarligt fra en stige. */
  stillads: 4500,
  /** Merpris for at flytte et ovenlys til et bedre sted frem for at skifte det hvor det sidder. */
  flytVindue: 10000,
} as const;

/** Tillæg der kan komme oveni. Intervaller her — de afhænger reelt af huset. */
export const VELUX_TILLAEG: PriceRow[] = [
  {
    label: "Stillads",
    detail: "Ved stejl tagflade, høj facade eller når vinduet ikke kan nås fra en stige forsvarligt.",
    price: `fra ${kr(VELUX_EKSTRA.stillads)}`,
  },
  {
    label: "Nyt undertag omkring vinduet",
    detail: "Er undertaget en gammel banevare der smuldrer når man rører den, skal der nyt i — ellers er tætningen fiktion.",
    price: "2.500–6.000 kr",
  },
  {
    label: "Elektrisk betjening i stedet for manuel",
    detail: "Giver mening når vinduet sidder over 2,5 m oppe eller i et badeværelse.",
    price: "4.500 kr",
  },
  {
    label: "Udvendig markise eller indvendigt mørklægningsgardin",
    detail: "Pr. vindue. Udvendig markise virker mod varme, indvendigt gardin gør ikke.",
    price: "1.400–3.200 kr",
  },
  {
    label: "Malerbehandling af ny lysning",
    detail: "Vi afleverer lysningen spartlet og klar til maler. Skal vi også male, koster det pr. vindue.",
    price: "1.800 kr",
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
