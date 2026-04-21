import type { Area } from "./site";

export type CityContent = {
  slug: string;
  h1: string;
  intro: string;
  pitch: string;
  sections: { heading: string; body: string }[];
  popularServices: string[];
  travelTime: string;
};

const CORE_SERVICES = ["tagrenovering", "tilbygning", "renovering", "gipsvaeg", "traeterrasse", "doere-og-vinduer"];
const COAST_SERVICES = ["sommerhus", "traeterrasse", "tagrenovering", "doere-og-vinduer", "renovering", "byggeraadgivning"];

// Pseudo-random men deterministisk variation baseret på slug så hver by får
// en unik kombi af opening-sætning, headings og bullet-rækkefølge.
function pickByHash<T>(slug: string, items: T[]): T {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return items[h % items.length];
}

const COAST_PITCH_OPENERS = [
  (n: string) => `Salt, sand, vind og frost-tø-cyklus — ${n} stiller andre krav end et hus i indlandet. Vi vælger materialer og detaljer der holder.`,
  (n: string) => `Et sommerhus i ${n} udsættes for langt mere end et almindeligt hus. Det er hverken vejret eller materialerne der er problemet — det er kombinationen, og dem kender vi.`,
  (n: string) => `Vi har bygget og renoveret langs den nordsjællandske kyst i over to årtier. ${n} har sine egne mønstre, og vi planlægger altid efter dem.`,
];

const CORE_PITCH_OPENERS = [
  (n: string) => `${n} ligger indenfor 30 minutters kørsel fra vores kontor. Det betyder hurtig opstart, kort kommunikationsvej, og opgaver vi kan starte allerede ugen efter besigtigelsen.`,
  (n: string) => `Vi har løst opgaver i ${n} de sidste mange år, og kender de typiske husstørrelser, lokalplaner og bygnings-årgange. Det sparer dig tid, og os fejl.`,
  (n: string) => `Holstrup TS har en stor del af sine kunder netop i området omkring ${n}. Det er den slags genkøb og anbefalinger vi lever af.`,
];

const SECOND_HEADINGS = [
  "Det vi typisk bliver kaldt ud til",
  "Klassiske opgaver i området",
  "Hvad vi laver mest her",
  "De opgaver der går igen",
];

const PROCESS_HEADINGS = [
  "Sådan kommer vi i gang",
  "Fra første samtale til afleveringen",
  "Vores proces — uden mystik",
  "Tre skridt fra besigtigelse til opgave",
];

const ADVISORY_HEADINGS = [
  "Også når du blot mangler en uvildig fagmand",
  "Rådgivning når du ikke selv vil hyre håndværkerne",
  "Når du har brug for en second opinion",
];

export function buildCityContent(area: Area): CityContent {
  const isCoast = area.tier === "coast";
  const pitchFn = pickByHash(area.slug, isCoast ? COAST_PITCH_OPENERS : CORE_PITCH_OPENERS);
  const pitch = pitchFn(area.name);
  const secondHeading = pickByHash(area.slug, SECOND_HEADINGS);
  const processHeading = pickByHash(area.slug + "p", PROCESS_HEADINGS);
  const advisoryHeading = pickByHash(area.slug + "a", ADVISORY_HEADINGS);

  const sections = [
    {
      heading: `Lokal forankring i ${area.name}`,
      body: area.localFlavor
        ? area.localFlavor
        : isCoast
          ? `${area.name} stiller særlige krav til byggeri: salt, sand, vind og temperaturskift. Materialevalg og detaljer skal være i orden — ellers holder arbejdet ikke. Vi kender området fra mange års konkrete opgaver.`
          : `Vi kører til ${area.name} stort set ugentligt. Mindre end 30 minutter væk, og vi kender de fleste villakvarterer indefra.`,
    },
    {
      heading: secondHeading,
      body: isCoast
        ? `Sommerhusrenovering, nye terrasser i hårdtræ, tagudskiftning på helårsboliger, Velux-ovenlys, tilbygninger og byggerådgivning til ejere der ikke selv vil være projektleder. Vi bringer altid eget netværk af lokale murere, VVS'ere og malere ind når opgaven er bredere end ren tømrer.`
        : `Tagrenovering, tilbygning, indretning af tagetage, gipsvægge til nye rumopdelinger, udskiftning af vinduer og døre, ny terrasse — og hovedentrepriser når en villa eller lejlighed skal renoveres fra grunden af. Vi kan også styre hele projektet som totalentreprenør, så du kun har én kontaktperson gennem hele forløbet.`,
    },
    {
      heading: processHeading,
      body: `Du ringer eller skriver. Inden for et døgn ringer vi tilbage og aftaler en gratis besigtigelse i ${area.name}. Vi kommer ud, ser opgaven, taler løsninger igennem, og vender tilbage med skriftligt tilbud — fast pris, klar tidsplan, alle materialer specificeret. Hvis du siger ja, planlægger vi opstart sammen. En erfaren tømrer er enten selv på pladsen eller tæt på hele vejen, og vi afleverer formelt med mangelgennemgang.`,
    },
    {
      heading: advisoryHeading,
      body: area.buildingStyle
        ? `Mange opgaver i ${area.name} kommer fra ejere af ${area.buildingStyle.toLowerCase()}. Hvis du ikke selv ønsker at hyre håndværkere men har brug for en uvildig fagmand til at gennemgå tilbud, byggeri eller 1-års eftersyn, så ring til os. 30+ års praktisk erfaring fra rigtige byggepladser ser ting som ingeniør-rådgivere overser.`
        : `Hvis du ikke selv ønsker at hyre håndværkere men har brug for en uvildig fagmand til at gennemgå tilbud, byggeri eller 1-års eftersyn i ${area.name}, så ring. 30+ års praktisk erfaring fra rigtige byggepladser ser ting som ingeniør-rådgivere overser.`,
    },
  ];

  return {
    slug: area.slug,
    h1: `Tømrer ${area.name}`,
    intro: area.description,
    pitch,
    sections,
    popularServices: isCoast ? COAST_SERVICES : CORE_SERVICES,
    travelTime: isCoast ? "30-60 min fra Frederikssund" : "10-30 min fra Frederikssund",
  };
}
