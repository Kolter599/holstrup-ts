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

const SECOND_HEADINGS = (n: string) => [
  `Tømreropgaver vi typisk løser i ${n}`,
  `Klassiske tømrer- og entrepriseopgaver i ${n}`,
  `Hvad vi laver mest af i ${n}`,
  `De opgaver der går igen i ${n}`,
];

const PROCESS_HEADINGS = (n: string) => [
  `Sådan kommer vi i gang i ${n}`,
  `Fra første samtale til aflevering i ${n}`,
  `Vores proces når du ringer fra ${n}`,
  `Tre skridt fra besigtigelse til opgave i ${n}`,
];

const ADVISORY_HEADINGS = (n: string) => [
  `Byggerådgivning til bygherrer i ${n}`,
  `Uvildig rådgivning til boligejere i ${n}`,
  `Second opinion eller 1-års eftersyn i ${n}`,
];

export function buildCityContent(area: Area): CityContent {
  const isCoast = area.tier === "coast";
  const pitchFn = pickByHash(area.slug, isCoast ? COAST_PITCH_OPENERS : CORE_PITCH_OPENERS);
  const pitch = pitchFn(area.name);
  const secondHeading = pickByHash(area.slug, SECOND_HEADINGS(area.name));
  const processHeading = pickByHash(area.slug + "p", PROCESS_HEADINGS(area.name));
  const advisoryHeading = pickByHash(area.slug + "a", ADVISORY_HEADINGS(area.name));

  const sections = [
    {
      heading: `Lokal tømrer i ${area.name}`,
      body: area.localFlavor
        ? `${area.localFlavor} Som tømrer i ${area.name} har vi løst både små og store opgaver i området, og vi tilpasser altid løsninger til den lokale byggestil og de typiske husstørrelser.`
        : isCoast
          ? `${area.name} stiller særlige krav til byggeri: salt, sand, vind og temperaturskift. Materialevalg og detaljer skal være i orden — ellers holder arbejdet ikke. Vi har bygget og renoveret som tømrer i ${area.name} i mange år, og kender lokalområdet indgående.`
          : `Vi kører til ${area.name} stort set ugentligt og kender området indefra. Som tømrer i ${area.name} har vi løst alt fra mindre snedkeropgaver til hele entrepriser for både private bygherrer, ejerforeninger og større entreprenører.`,
    },
    {
      heading: secondHeading,
      body: isCoast
        ? `I ${area.name} bliver vi typisk kaldt ud til sommerhusrenovering, nye træterrasser i hårdtræ, tagudskiftning på helårsboliger, Velux-ovenlys, tilbygninger og byggerådgivning. Vi bringer altid eget netværk af lokale murere, VVS'ere og malere ind når opgaven kræver flere fag end ren tømrer.`
        : `I ${area.name} laver vi mest tagrenovering, tilbygninger, indretning af tagetage, gipsvægge til nye rumopdelinger, udskiftning af vinduer og døre, og nye træterrasser. På større opgaver tager vi gerne hovedentreprisen eller totalentreprisen, så du kun har én kontaktperson gennem hele forløbet.`,
    },
    {
      heading: processHeading,
      body: `Du ringer eller skriver. Inden for et døgn ringer vi tilbage og aftaler en gratis besigtigelse i ${area.name}. Vi kommer ud, ser opgaven, taler løsninger igennem, og vender tilbage med skriftligt tilbud — fast pris, klar tidsplan, alle materialer specificeret. Når du siger ja, planlægger vi opstart sammen. En erfaren tømrer er enten selv på pladsen i ${area.name} eller tæt på hele vejen, og vi afleverer formelt med mangelgennemgang.`,
    },
    {
      heading: advisoryHeading,
      body: area.buildingStyle
        ? `Mange byggerådgivnings-opgaver i ${area.name} kommer fra ejere af ${area.buildingStyle.toLowerCase()}. Hvis du ikke selv ønsker at hyre håndværkere men har brug for en uvildig fagmand til at gennemgå tilbud, byggeri eller 1-års eftersyn i ${area.name}, så ring til Holstrup TS. 30+ års praktisk byggeerfaring ser detaljer som teoretiske byggesagkyndige overser.`
        : `Hvis du ikke selv ønsker at hyre håndværkere men har brug for en uvildig fagmand til byggerådgivning, tilbudsgennemgang eller 1-års eftersyn i ${area.name}, så ring. 30+ års praktisk byggeerfaring ser detaljer som teoretiske byggesagkyndige overser — særligt ved tag, undertag, ventilation og fugtproblemer.`,
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
