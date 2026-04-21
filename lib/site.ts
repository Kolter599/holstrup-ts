export const SITE = {
  url: "https://www.holstrup-ts.dk",
  name: "Holstrup TS",
  fullName: "Holstrup Tømrer & Snedker Entreprise",
  owner: "Finn Holm Pedersen",
  phone: "+4540173893",
  phoneDisplay: "+45 40 17 38 93",
  email: "finn@holstrup-ts.dk",
  cvr: "16056839",
  address: {
    street: "Sundbylillevej 48",
    postal: "3600",
    city: "Frederikssund",
    country: "Danmark",
  },
  foundedYear: 1992,
  experienceYears: 30,
} as const;

// Firmaer Holstrup TS har udført arbejde for — som hustømrer, underentreprenør eller direkte kunde.
// `inRow` = vis i den statiske logorække i hero (kun logoer der ser pæne ud i lille format).
// Logoer uden inRow vises stadig i den rullende marquee (med wordmark-fallback hvis filen mangler).
export type Partner = { name: string; logo?: string; inRow?: boolean };

export const PARTNERS: Partner[] = [
  { name: "PwC", logo: "/images/partners/pwc.svg", inRow: true },
  { name: "NCC", logo: "/images/partners/ncc.svg", inRow: true },
  { name: "MT Højgaard", logo: "/images/partners/mthojgaard.svg", inRow: true },
  { name: "Rambøll", logo: "/images/partners/ramboll.svg", inRow: true },
  { name: "SWECO", logo: "/images/partners/sweco.png", inRow: true },
  { name: "ISS", inRow: true },
  { name: "Tscherning", logo: "/images/partners/tscherning.svg", inRow: true },
  { name: "CG Jensen", logo: "/images/partners/cgjensen.jpg", inRow: true },
];

export type Area = {
  slug: string;
  name: string;
  postal?: string;
  description: string;
  tier: "core" | "coast";
};

export const AREAS: Area[] = [
  { slug: "frederikssund", name: "Frederikssund", postal: "3600", description: "Holstrup TS er baseret i Frederikssund. Kort responstid og fast base for alle byggeopgaver — fra mindre snedkeropgaver til hele entrepriser.", tier: "core" },
  { slug: "hilleroed", name: "Hillerød", postal: "3400", description: "Tømrer- og entrepriseopgaver i Hillerød og omegn. Renovering, tag, tilbygninger og rådgivning for både private og ejendomsbesiddere.", tier: "core" },
  { slug: "alleroed", name: "Allerød", postal: "3450", description: "Fast tømrer og byggerådgiver i Allerød — både hustømrer for større entreprenører og selvstændige opgaver for private bygherrer.", tier: "core" },
  { slug: "birkeroed", name: "Birkerød", postal: "3460", description: "30+ års erfaring med renovering af villaer og rækkehuse i Birkerød og Hovedstadens nordlige forstæder.", tier: "core" },
  { slug: "farum", name: "Farum", postal: "3520", description: "Tømrer i Farum med 30+ års erfaring — tag, terrasse, tilbygning og totalentreprise til privat og erhverv.", tier: "core" },
  { slug: "oelstykke", name: "Ølstykke", postal: "3650", description: "Tømrer- og snedkeropgaver i Ølstykke, Stenløse og Egedal Kommune. Både små reparationer og hele renoveringer.", tier: "core" },
  { slug: "stenloese", name: "Stenløse", postal: "3660", description: "Erfaren tømrer i Stenløse — gipsvægge, indretning af tagetage, nye vinduer og døre, og hele hovedentrepriser på villarenoveringer.", tier: "core" },
  { slug: "jyllinge", name: "Jyllinge", postal: "4040", description: "Tømreropgaver i Jyllinge og langs Roskilde Fjord. Særligt erfaren med kystbyggerier og vedligehold af fjord-huse.", tier: "core" },
  { slug: "slangerup", name: "Slangerup", postal: "3550", description: "Lokal tømrer i Slangerup. Kort udrykningstid, fast pris på opgaven, og 30+ års erfaring bag hver beslutning.", tier: "core" },
  { slug: "joerlunde", name: "Jørlunde", postal: "3550", description: "Lokalområdet omkring Jørlunde. Holstrup TS kender området, de lokale håndværkere, tilladelsesregler og byggestil.", tier: "core" },
  { slug: "lynge", name: "Lynge", postal: "3540", description: "Holstrup TS har rødder i Lynge-området, hvor Finn tidligere havde kontor. Stadig aktiv med opgaver her.", tier: "core" },
  { slug: "vaerloese", name: "Værløse", postal: "3500", description: "Tømreropgaver og byggerådgivning i Værløse og omegn. Både klassiske villarenoveringer og moderne nybyg.", tier: "core" },
  { slug: "hornbaek", name: "Hornbæk", postal: "3100", description: "Sommerhus- og villaopgaver i Hornbæk. Særlig erfaring med kystbyggeri — valg af materialer der tåler salt, sand og vind.", tier: "coast" },
  { slug: "humlebaek", name: "Humlebæk", postal: "3050", description: "Tømreropgaver og hovedentrepriser i Humlebæk. Erfaring med liebhaveri-ejendomme og strandboliger langs kysten.", tier: "coast" },
  { slug: "vedbaek", name: "Vedbæk", postal: "2950", description: "Erfaren tømrer og byggerådgiver i Vedbæk — strandvillaer, renoveringsopgaver og totalentrepriser.", tier: "coast" },
  { slug: "rungsted", name: "Rungsted Kyst", postal: "2960", description: "Diskrete og fagligt stærke løsninger til liebhaverboliger i Rungsted Kyst. Både renovering og nyt byggeri.", tier: "coast" },
  { slug: "skodsborg", name: "Skodsborg", postal: "2942", description: "Tømrerarbejde og byggerådgivning i Skodsborg — perfekt til boligejere der ønsker håndværk af høj kvalitet.", tier: "coast" },
  { slug: "gilleleje", name: "Gilleleje", postal: "3250", description: "Sommerhusbygger i Gilleleje. Renoveringer, tilbygninger og nye sommerhuse — tilpasset kystens vejr.", tier: "coast" },
  { slug: "tisvildeleje", name: "Tisvildeleje", postal: "3220", description: "Sommerhus-tømrer i Tisvildeleje. Udskiftning af tag, nye terrasser, isolering og totalrenovering.", tier: "coast" },
  { slug: "helsingoer", name: "Helsingør", postal: "3000", description: "Tømrer og byggerådgiver i Helsingør og langs Kattegat-kysten. Både private og erhverv.", tier: "coast" },
];

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
};

export const SERVICES: Service[] = [
  {
    slug: "tagrenovering",
    title: "Tagrenovering og tagudskiftning",
    shortTitle: "Tag",
    excerpt: "Udskiftning, reparation og isolering af tag — tegltag, stråtag, skifer og tagpap. Vi kan stå for hele processen eller samarbejde med dit eget firma.",
    metaTitle: "Tagrenovering i Nordsjælland | Holstrup TS — 30+ års erfaring",
    metaDescription: "Udskiftning og renovering af tag i Frederikssund, Hillerød og resten af Nordsjælland. Fast pris, BYG-garanti-lignende standard og 30+ års erfaring.",
  },
  {
    slug: "traeterrasse",
    title: "Træterrasser og udendørs anlæg",
    shortTitle: "Terrasse",
    excerpt: "Nye terrasser i hårdtræ, trykimprægneret fyr eller komposit. Vi leverer både design, tegning og udførelse — også med overdækning og integrerede plantekasser.",
    metaTitle: "Træterrasse i Nordsjælland | Holstrup TS",
    metaDescription: "Nye træterrasser i hårdtræ, fyr eller komposit. Design, tegning og udførelse i Frederikssund, Hillerød og resten af Nordsjælland.",
  },
  {
    slug: "tilbygning",
    title: "Tilbygning, udestue og kvist",
    shortTitle: "Tilbygning",
    excerpt: "Tilbygning til villa, udestuer, kviste og indretning af tagetage. Vi tager hånd om tegning, byggetilladelse, tømrerarbejde og koordinering af øvrige fag.",
    metaTitle: "Tilbygning og kvist i Nordsjælland | Holstrup TS",
    metaDescription: "Tilbygning, udestue, kvist og indretning af tagetage. Fuld pakke fra tegning til færdigt resultat — 30+ års erfaring med bygningsmyndigheder.",
  },
  {
    slug: "totalentreprise",
    title: "Totalentreprise",
    shortTitle: "Totalentreprise",
    excerpt: "Ét ansvar. Ét tilbud. Én kontaktperson. Holstrup TS står i spidsen for hele projektet og koordinerer alle fag — fra nedrivning til afleveringsforretning.",
    metaTitle: "Totalentreprise på villa og sommerhus | Holstrup TS",
    metaDescription: "Totalentreprise med én fast kontaktperson og samlet ansvar. Renovering, tilbygning og nybyg i Nordsjælland — 30+ års erfaring.",
  },
  {
    slug: "hovedentreprise",
    title: "Hovedentreprise",
    shortTitle: "Hovedentreprise",
    excerpt: "Vi styrer byggepladsen som hovedentreprenør, mens bygherren selv står for projektering og udbud. Ideel til erhverv og boligforeninger med egen rådgiver.",
    metaTitle: "Hovedentreprise i Nordsjælland | Holstrup TS",
    metaDescription: "Hovedentreprise på renovering af villa, ejendom eller sommerhus. Styring af byggeplads, fag og tidsplan — 30+ års erfaring.",
  },
  {
    slug: "renovering",
    title: "Renovering af villa og lejlighed",
    shortTitle: "Renovering",
    excerpt: "Fra enkel opfriskning til gennemgribende renovering. Vi tager os af tømrerarbejdet og kan agere totalentreprenør når du ønsker ét fast kontaktpunkt.",
    metaTitle: "Renovering af villa og lejlighed | Holstrup TS",
    metaDescription: "Villa- og lejlighedsrenovering i Nordsjælland. Ét kontaktpunkt for hele processen — fra nedrivning til afleveringsforretning.",
  },
  {
    slug: "sommerhus",
    title: "Sommerhusbyggeri og -renovering",
    shortTitle: "Sommerhus",
    excerpt: "Nye sommerhuse, tilbygninger og renovering langs den nordsjællandske kyst. Vi vælger materialer der tåler salt, sand og vind i årtier.",
    metaTitle: "Sommerhus tømrer i Nordsjælland | Holstrup TS",
    metaDescription: "Bygger og renoverer sommerhuse i Hornbæk, Tisvildeleje, Gilleleje og resten af Nordsjælland. Kystmaterialer og 30+ års erfaring.",
  },
  {
    slug: "doere-og-vinduer",
    title: "Døre og vinduer",
    shortTitle: "Døre og vinduer",
    excerpt: "Udskiftning af døre og vinduer — herunder Velux ovenlysvinduer. Vi tager hånd om den tætte tilslutning, isolering og den indvendige afslutning.",
    metaTitle: "Udskiftning af døre og vinduer | Holstrup TS",
    metaDescription: "Nye døre og vinduer i Nordsjælland — inkl. Velux ovenlys. Tæt, velisoleret og fagligt korrekt afsluttet.",
  },
  {
    slug: "gipsvaeg",
    title: "Gipsvægge og lette skillevægge",
    shortTitle: "Gipsvæg",
    excerpt: "Opsætning af gipsvægge, indretning af eksisterende rum, lydisolerede skillevægge og tekniske gipsløsninger til boliger, kontorer og institutioner.",
    metaTitle: "Gipsvæg opsat af tømrer | Holstrup TS",
    metaDescription: "Opsætning af gipsvægge, lydvægge og tekniske skillevægge i Nordsjælland. Fast pris, præcist håndværk.",
  },
  {
    slug: "gulve",
    title: "Gulve og gulvrenovering",
    shortTitle: "Gulve",
    excerpt: "Parket, lamelgulv, plankegulv og slibning af eksisterende trægulve. Vi sørger for at underlaget er korrekt, så gulvet holder i årtier.",
    metaTitle: "Nye gulve og gulvrenovering | Holstrup TS",
    metaDescription: "Lægning af nye gulve og slibning af gamle i Nordsjælland. Parket, lamelgulv, plankegulv og undergulv.",
  },
  {
    slug: "byggeraadgivning",
    title: "Byggerådgivning og bygherrerådgivning",
    shortTitle: "Byggerådgivning",
    excerpt: "Uvildig rådgivning fra en tømrer med 30+ års fingre i træet. Vi gennemgår tilbud, tegninger og tidsplaner — og hjælper dig med at stille de rigtige krav.",
    metaTitle: "Byggerådgivning af erfaren tømrer | Holstrup TS",
    metaDescription: "Uvildig bygherrerådgivning i Nordsjælland — fra en håndværker med 30+ års praktisk erfaring. Sparring, kvalitetsgennemgang og forhandling.",
  },
  {
    slug: "fejlsoegning",
    title: "Fejlsøgning, tilsyn og 1-års gennemgang",
    shortTitle: "Tilsyn",
    excerpt: "Mistanke om fejl i byggeriet? Vi laver grundig gennemgang, dokumentation og rapport — både under byggeriet og ved 1- og 5-års eftersyn.",
    metaTitle: "Fejlsøgning og tilsyn af bygninger | Holstrup TS",
    metaDescription: "Tømrerfaglig fejlsøgning, tilsyn og 1-års eftersyn i Nordsjælland. Grundig gennemgang og skriftlig rapport.",
  },
];
