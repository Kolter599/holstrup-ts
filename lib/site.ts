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
  /** Lokal kontekst — bruges på by-siden så hver tekst er forskellig */
  localFlavor?: string;
  /** Husstil eller bygnings-egenart der er typisk for området */
  buildingStyle?: string;
};

export const AREAS: Area[] = [
  {
    slug: "frederikssund", name: "Frederikssund", postal: "3600", tier: "core",
    description: "Vores hjemby. Kontoret ligger på Sundbylillevej, og vi kører ud til opgaver alle dage — fra Sundparken og Marbækparken til parcelhuskvartererne ved fjorden.",
    localFlavor: "Frederikssund-husene strækker sig fra de gule 60'er-villaer i Søbækparken til ældre fjordhuse omkring havnen. Hver type har sine egne typiske svagheder, og dem kender vi.",
    buildingStyle: "1950-70'er parcelhuse, fjordhuse og nyere boligområder",
  },
  {
    slug: "hilleroed", name: "Hillerød", postal: "3400", tier: "core",
    description: "Hillerød er en af de byer vi kører til oftest. Mange opgaver kommer fra villakvartererne omkring Frederiksborg Slot og Ullerød, hvor husene typisk er fra 60'erne og 70'erne.",
    localFlavor: "Mange Hillerød-villaer har det klassiske eternit- eller tegltag fra 70'erne, der nu er udskiftningsmodent. Vi har lavet 20+ tagudskiftninger i området alene de sidste fem år.",
    buildingStyle: "70'er-villaer, ældre stationsbyhuse, nyere parcelhuse",
  },
  {
    slug: "alleroed", name: "Allerød", postal: "3450", tier: "core",
    description: "Vi løser tømrer- og entrepriseopgaver i hele Allerød, fra Lillerød over Lynge-skoven til Blovstrød. Mange af opgaverne er villatilbygninger og tagrenoveringer.",
    localFlavor: "Allerød-grundene er ofte store nok til både tilbygning og udestue. Vi har stærk rutine med Allerød Kommunes byggesagsbehandling — vi ved hvilke tegninger og bilag der skal med fra start.",
    buildingStyle: "Murermestervillaer, parcelhuse i parker, sommerlandsbolig-stil",
  },
  {
    slug: "birkeroed", name: "Birkerød", postal: "3460", tier: "core",
    description: "Birkerød har en blandet boligmasse med både ældre stuehuse og funkis-villaer. Vi har renoveret en stor del af begge typer — altid med respekt for husets oprindelige stil.",
    localFlavor: "Mange Birkerød-villaer fra 30'erne og 40'erne har bevaringsværdige facader og tagkviste. Når vi renoverer, beder vi altid om de oprindelige tegninger fra Sølvkilden eller stadsarkivet.",
    buildingStyle: "Funkis, murermestervillaer, ældre stuehuse",
  },
  {
    slug: "farum", name: "Farum", postal: "3520", tier: "core",
    description: "I Farum er det især Farum Sø-området og Stavnsholt vi kører til. Mange villaer fra 70'erne og 80'erne — ofte med ovenlys, kviste og udestuer der trænger til en opdatering.",
    localFlavor: "Farum-husene har ofte etagedeling med tagetage. Det giver os mange opgaver med kvistbygning og ny indretning af 1. sal — hvor varme- og dampspærre er den vigtigste detalje.",
    buildingStyle: "70-80'er parcelhuse, rækkehuse, nyere udstykninger",
  },
  {
    slug: "oelstykke", name: "Ølstykke", postal: "3650", tier: "core",
    description: "Ølstykke ligger 10 minutter fra vores kontor. Det betyder hurtig opstart, korte mellem-besøg, og fleksible aftaler om mindre opgaver der ellers ikke kunne svare sig.",
    localFlavor: "I Ølstykke kommer mange opgaver fra de ældre boligforeninger. Vi har stærk rutine med ejerforenings-kommunikation, generalforsamlinger og fælles renoveringer.",
    buildingStyle: "Murermestervillaer, andelsboligforeninger, parcelhuse",
  },
  {
    slug: "stenloese", name: "Stenløse", postal: "3660", tier: "core",
    description: "Stenløse er nabokommune. Vi har bygget her i mange år — fra mindre tilbygninger til komplette renoveringer af parcelhuse i Egedal Kommune.",
    localFlavor: "Egedal Kommunes byggesagsbehandling er typisk hurtig på enkle ansøgninger. Vi sørger for at sende ind med de rette bilag fra start, så processen ikke trækker ud.",
    buildingStyle: "60-90'er parcelhuse, kommunale udstykninger, rækkehuse",
  },
  {
    slug: "jyllinge", name: "Jyllinge", postal: "4040", tier: "core",
    description: "Jyllinge ligger ved fjorden, og det stiller særlige krav til de huse der står tættest på vandet. Vi bygger og renoverer både fjordhuse og almindelige villaer i området.",
    localFlavor: "Fjordhusene i Jyllinge får ofte saltskader på vinduesrammer og facadebeklædning. Vi anbefaler altid materialer og overflader der tåler det tætte fjord-klima — fx hårdtræ frem for fyr.",
    buildingStyle: "Fjordhuse, parcelhuse, sommerhus-lignende strandboliger",
  },
  {
    slug: "slangerup", name: "Slangerup", postal: "3550", tier: "core",
    description: "Slangerup ligger 15 minutter fra vores kontor. Vi kører her med små reparationer, klassiske tømreropgaver og hele renoveringer for private bygherrer.",
    localFlavor: "Slangerup har en blanding af ældre stationsbyhuse og nyere parcelhuse. På de ældre huse arbejder vi tit med original-vinduer og bevarende facaderenovering.",
    buildingStyle: "Stationsbyhuse, ældre stuehuse, nyere udstykninger",
  },
  {
    slug: "joerlunde", name: "Jørlunde", postal: "3550", tier: "core",
    description: "Jørlunde ligger lige ved siden af os. Vi kender lokalvejene, lokalsmedjen og de fleste af de ældre husnumre. Mange små opgaver kommer fra Jørlunde-familierne.",
    localFlavor: "I Jørlunde finder du både ældre landejendomme og nyere parcelhuse. Vi arbejder en del med stuehus-renoveringer hvor bjælker, indvendige vægge og gulve skal udskiftes med respekt for det oprindelige.",
    buildingStyle: "Landejendomme, stuehuse, parcelhuse, ombyggede stalde",
  },
  {
    slug: "lynge", name: "Lynge", postal: "3540", tier: "core",
    description: "Holstrup TS havde tidligere kontor på Gl. Nøglegårdsvej i Lynge. Vi kender området fra alle vinkler — de gamle byggemarkeder, de typiske husstørrelser, de lokale håndværkere.",
    localFlavor: "Lynge er kendt for sine veludstyrede 70'er-parcelhuse på store grunde. Det giver mange muligheder for tilbygning, udestue eller ny terrasse — vi har lavet flere af alle typer her.",
    buildingStyle: "70-80'er parcelhuse, sommerhuslignende boliger, mindre landejendomme",
  },
  {
    slug: "vaerloese", name: "Værløse", postal: "3500", tier: "core",
    description: "Værløse er et af de områder hvor vi har fast samarbejde med flere arkitekter. Mange villaer her ønsker både arkitektonisk integritet og praktisk plads — det er en fin balance.",
    localFlavor: "Værløse-villaerne er typisk dyrere ejendomme hvor materialevalg betyder noget. Vi anbefaler altid hårdtræ til terrasser og kvalitets-tegl til tag, fordi de holder bedre over tid.",
    buildingStyle: "Murermestervillaer, funkis, nyere arkitekttegnede villaer",
  },
  {
    slug: "hornbaek", name: "Hornbæk", postal: "3100", tier: "coast",
    description: "Hornbæk er en af de byer vi kører oftest til langs kysten. Mange sommerhuse her bruges hele året, og det stiller krav til isolering, vinduer og frostsikring.",
    localFlavor: "Hornbæk-husene står ofte i fyrretræer på sandgrund og bliver hårdt prøvet af salt og vind. Vi anbefaler typisk cedertræ eller termobehandlet fyr til facadebeklædning, fordi det tåler kysten bedst.",
    buildingStyle: "Klassiske sommerhuse, helårsboliger ved kysten, nyere strandvillaer",
  },
  {
    slug: "humlebaek", name: "Humlebæk", postal: "3050", tier: "coast",
    description: "I Humlebæk arbejder vi en del med liebhaverejendomme — både i selve byen og langs Strandvejen. Renoveringer her kræver høj kvalitet og diskret arbejdsproces.",
    localFlavor: "Humlebæk-grunden er ofte tæt op ad nabo. Vi planlægger altid byggepladsen så støj, støv og adgang generer naboen mindst muligt — det er en del af det at arbejde i området.",
    buildingStyle: "Liebhaverejendomme, strandvillaer, byhuse, nyere arkitektur",
  },
  {
    slug: "vedbaek", name: "Vedbæk", postal: "2950", tier: "coast",
    description: "Vedbæk er fast lokation for liebhaver-renoveringer. Vi har erfaring med både de ældre strandvillaer og de moderne nybyg — to vidt forskellige opgaver med ét fælles krav: høj finish.",
    localFlavor: "Mange Vedbæk-villaer har enestående originale detaljer fra 1900-tallets begyndelse. Vi bevarer altid det vi kan — tagkviste, originale vinduer, oprindelige fyrretræsgulve.",
    buildingStyle: "Strandvillaer, liebhaverboliger, klassiske patriciervillaer",
  },
  {
    slug: "rungsted", name: "Rungsted Kyst", postal: "2960", tier: "coast",
    description: "Rungsted Kyst er en af de mest krævende kystbyer at bygge i — både i forhold til detaljerings-niveau og adgangsforhold. Vi har bygget her i over et årti.",
    localFlavor: "Rungsted-grundene har ofte små portlåger og smalle indkørsler, som gør store byggematerialer svære at få ind. Vi planlægger leverancer i mindre paller og tager altid hånd om den daglige oprydning.",
    buildingStyle: "Liebhaverboliger, strandvillaer, ældre patriciervillaer",
  },
  {
    slug: "skodsborg", name: "Skodsborg", postal: "2942", tier: "coast",
    description: "Skodsborg er en lille men krævende kystby. Vi udfører tømrer- og byggerådgivnings-opgaver for boligejere her, der typisk værdsætter både fagligheden og diskretionen.",
    localFlavor: "Skodsborg-husene er ofte placeret tæt på vandet. Vi anbefaler altid syrefaste beslag, hårdtræ og særligt modstandsdygtig maling — det dur ikke at spare på materialer i den her klima-zone.",
    buildingStyle: "Strandvillaer, liebhaverejendomme, nyere arkitekt-villaer",
  },
  {
    slug: "gilleleje", name: "Gilleleje", postal: "3250", tier: "coast",
    description: "Gilleleje er en sommerhus-by vi har arbejdet i i mange år. Både rene sommerhuse, helårsboliger og mindre fritidshuse — vi kender forskellene mellem byggetyperne her.",
    localFlavor: "Gilleleje-sommerhusene varierer fra 40'er-træhuse til moderne arkitekttegnede fritidsboliger. Vi tilpasser altid materiale- og energi-løsninger til hvad huset reelt skal kunne — helårsbrug eller weekend-fritidshus.",
    buildingStyle: "Sommerhuse, helårsboliger, fritidsboliger, nyere arkitektboliger",
  },
  {
    slug: "tisvildeleje", name: "Tisvildeleje", postal: "3220", tier: "coast",
    description: "Tisvildeleje er en af de byer vi kører til med både små og store opgaver. Mange sommerhuse her bygges om til helårsbrug, og det er en specifik proces vi har stærk rutine med.",
    localFlavor: "Tisvildeleje-husene står ofte i fyrre- og bøgeskov, hvor fugt fra skoven er den største langtidsrisiko. Vi sørger altid for korrekt ventilation både under og rundt om huset.",
    buildingStyle: "Sommerhuse, klassiske 70'er-fritidshuse, helårsomdannede sommerhuse",
  },
  {
    slug: "helsingoer", name: "Helsingør", postal: "3000", tier: "coast",
    description: "Helsingør er en stor by med mange husstande, lige fra ældre købstadshuse i centrum til parcelhuse i Borupgård og Snekkersten. Vi løser opgaver i alle dele af byen.",
    localFlavor: "I Helsingør by arbejder vi en del med fredede og bevaringsværdige ejendomme. Det kræver tæt dialog med Helsingør Kommunes byggesag — som vi har stærk rutine med.",
    buildingStyle: "Købstadshuse, fredede ejendomme, parcelhuse, strandboliger",
  },
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
