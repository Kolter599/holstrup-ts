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

export function buildCityContent(area: Area): CityContent {
  const isCoast = area.tier === "coast";
  return {
    slug: area.slug,
    h1: `Tømrer ${area.name}`,
    intro: area.description,
    pitch: isCoast
      ? `Holstrup TS er fast base for sommerhus- og villaopgaver i ${area.name} og resten af kyststrækningen. 30+ års erfaring, kystmaterialer der tåler salt og vind, og én fast kontaktperson fra tilbud til aflevering.`
      : `Holstrup TS har 30+ års erfaring med tømrer-, snedker- og entrepriseopgaver i ${area.name} og omegn. Fra enkel gipsvæg til hele hovedentrepriser — én fast kontaktperson gennem hele forløbet.`,
    sections: [
      {
        heading: `Lokal tømrer i ${area.name}`,
        body: isCoast
          ? `${area.name} stiller særlige krav til byggeri: salt, sand, vind og temperaturskift. Materialevalg og detaljer skal være i orden, ellers holder arbejdet ikke. Holstrup TS kender området, kender husene og har renoveret og bygget langs hele kysten i årtier.`
          : `Holstrup TS er baseret i Frederikssund, og hele Nordsjælland er vores hjemmebane. I ${area.name} har vi løst opgaver i mange år — både klassiske tømreropgaver og hele entrepriser for private bygherrer og boligforeninger. Kort afstand, kort responstid og faste aftaler.`,
      },
      {
        heading: `De opgaver vi laver mest i ${area.name}`,
        body: isCoast
          ? `Sommerhusrenovering, nye terrasser i hårdtræ, tagudskiftning på helårsboliger, nye Velux-vinduer, tilbygninger og byggerådgivning til boligejere der ikke selv vil være projektleder. Vi samarbejder med et netværk af lokale murere, VVS'ere og malere — så hele opgaven kan løses ét sted.`
          : `Tagrenovering, tilbygning og indretning af tagetage, gipsvægge til nye rumopdelinger, udskiftning af vinduer og døre, ny terrasse, og hovedentrepriser når villa eller lejlighed skal renoveres fra top til bund. Vi kan også styre hele projektet som totalentreprenør.`,
      },
      {
        heading: "Fra tilbud til aflevering — sådan foregår det",
        body: `Du ringer eller skriver. Holstrup TS kommer personligt ud i ${area.name} og ser på opgaven — det er gratis og uforpligtende. Vi vender tilbage med et skriftligt tilbud med klar pris og tidsplan. Hvis du siger ja, går vi i gang — og en erfaren tømrer er selv på pladsen eller tæt på hele vejen. Når arbejdet er færdigt, afleverer vi med gennemgang og dokumentation.`,
      },
      {
        heading: "Byggerådgivning og 1-års gennemgang",
        body: `Ud over at udføre tømrer- og entrepriseopgaver tilbyder Holstrup TS uvildig rådgivning til bygherrer i ${area.name}. Tilbudsgennemgang, fejlsøgning, 1- og 5-års bygningseftersyn. Det er en meget billigere investering end at opdage fejlene senere — og 30+ års erfaring fra rigtige byggepladser ser ting som teoretiske byggesagkyndige overser.`,
      },
    ],
    popularServices: isCoast ? COAST_SERVICES : CORE_SERVICES,
    travelTime: isCoast ? "30-60 min fra Frederikssund" : "10-40 min fra Frederikssund",
  };
}
