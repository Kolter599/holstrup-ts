import { SITE } from "./site";
import { prisForbehold, TERRASSE_PRICES } from "./priser";
import type { Block, LongformContent } from "./longform";

/**
 * Terrasse × by.
 *
 * Sitet har /ydelser/traeterrasse og /tomrer-<by>, men intet der krydser de
 * to — og det er præcis det kryds folk søger på. Konkurrenternes sider på
 * de her søgninger er omkring 800 ord uden priser, uden FAQ og uden lokal
 * viden, så barren er ikke høj. Den er bare aldrig blevet ramt.
 *
 * To sider, ikke seks. Egedal-siden dækker flere byer i ét, fordi der ikke
 * er søgevolumen nok pr. by til at retfærdiggøre en side hver.
 */

const PRICE_BLOCK: Block = {
  kind: "prices",
  heading: "Hvad en terrasse koster pr. m²",
  intro:
    "Priserne er inkl. materiale, fundament, montage og bortkørsel af det gamle. Det der afgør hvor i intervallet du lander, er terrassens form — en firkant er billigere pr. m² end en der skal gå om et hjørne, rundt om et træ og ned ad to trin.",
  rows: TERRASSE_PRICES,
  note: `Trapper, værn, overdækning og indbyggede plantekasser prissættes særskilt. Skal terrassen hæves mere end 30 cm over terræn, gælder andre regler og en anden pris — det står i guiden om hævet terrasse. ${prisForbehold("terrassen og det den skal ligge på")}`,
};

const NOT_RECOMMENDED: Block = {
  kind: "list",
  heading: "Det vi ikke anbefaler",
  intro: "Fire ting vi fraråder hver eneste gang, uanset hvad budgettet er:",
  items: [
    "Terrassebrædder lagt direkte på fliser eller jord. Uden luft under er det ligegyldigt hvilket træ du har valgt — det rådner nedefra, og en hårdtræsterrasse holder så ti år i stedet for tredive. Vi bygger altid med mindst 20 cm luft og fald væk fra huset.",
    "Terrasse i præcis samme højde som dørtrinnet. Det ser rigtigt ud på tegningen, men vand og sne har ingen steder at gå hen, og så står det ind ad døren. Der skal minimum to centimeter ned fra trinnet.",
    "Trykimprægneret fyr i den bærende konstruktion under en terrasse man ikke kan komme til at se. Brug certificeret konstruktionstræ eller galvaniserede bjælkesko på betonsokler. Bæringen skal holde længere end brædderne, for brædderne kan skiftes.",
    "Komposit på en helt sydvendt terrasse uden skygge. Den bliver for varm at gå på med bare fødder i juli. Det er ikke en produktfejl, det er fysik — mørke plader i fuld sol. Vælg en lys nuance, eller vælg træ.",
  ],
};

const PROCESS: Block = {
  kind: "prose",
  heading: "Sådan foregår det",
  body: [
    "Du ringer eller skriver. Indenfor et døgn ringer vi tilbage og aftaler en gratis besigtigelse. Vi kommer ud, ser grunden, mærker efter hvad jorden er, måler op og taler igennem hvad du egentlig skal bruge terrassen til — en spiseplads til otte er en anden terrasse end et sted at drikke kaffe om morgenen.",
    "Derefter får du et skriftligt tilbud med fast pris, en materialeliste og en tidsplan. Siger du ja, aftaler vi opstart. En almindelig terrasse på 25-40 m² tager typisk fem til otte arbejdsdage, afhængigt af fundament og om der skal trappe og værn med.",
    "Vi rydder op hver dag, og vi kører det gamle væk. Det skal ikke ligge i en bunke bag garagen til foråret.",
  ],
};

export const TERRASSE_FREDERIKSSUND: LongformContent = {
  path: "/traeterrasse-frederikssund",
  serviceSlug: "traeterrasse",
  eyebrow: "Terrasse · Frederikssund · 3600",
  h1: "Træterrasse i Frederikssund",
  intro:
    "Vores kontor ligger på Sundbylillevej, så Frederikssund er den by vi bygger flest terrasser i. Vi kender jordbunden, vi kender husene, og vi ved hvad der sker med en terrasse der ligger tæt på fjorden. Her står priserne pr. m², hvad vi anbefaler af træ, og hvad vi fraråder.",
  hero: "/images/service-terrasse.jpg",
  heroAlt: "Nybygget træterrasse i hårdtræ",
  metaTitle: "Træterrasse i Frederikssund – pris pr. m²",
  metaDescription: `Ny træterrasse i Frederikssund. Priser fra 1.800 kr/m² i fyr til 3.500 kr/m² i hårdtræ. Fast pris, gratis besigtigelse. Tømrer siden 1992. Ring Finn: ${SITE.phoneDisplay}.`,
  breadcrumb: [
    { name: "Forside", href: "/" },
    { name: "Træterrasse", href: "/ydelser/traeterrasse" },
    { name: "Frederikssund" },
  ],
  aside: {
    heading: "Hver terrasse får",
    items: [
      "Punktfundament under frostfri dybde",
      "Mindst 20 cm luft under brædderne",
      "Fald væk fra huset, altid",
      "Syrefaste eller galvaniserede beslag",
      "Skjult skruning hvor træet tillader det",
      "Fast pris og skriftlig aftale",
    ],
  },
  blocks: [
    {
      kind: "prose",
      heading: "Terrasser i Frederikssund — hvad husene byder på",
      body: [
        "Frederikssund-husene strækker sig fra de gule 60'er-villaer i Søbækparken til de ældre fjordhuse omkring havnen, og de to typer stiller vidt forskellige krav til en terrasse. Villaerne har typisk en havedør i stueplan og en flad have, hvor terrassen kan ligge i terræn og bare skal have luft nok under sig. Fjordhusene ligger ofte på en grund der falder mod vandet, og så skal terrassen enten bygges op eller trappes ned i to niveauer.",
        "Det andet Frederikssund byder på er vind. Kommer den fra vest over fjorden, står den lige ind i haven, og en terrasse uden læ bliver ikke brugt. Det er værd at tænke ind fra start — et hjørne, en lav mur eller en skærm i samme træ koster langt mindre når det bygges sammen med terrassen end når det sættes på bagefter.",
        "Vi kører ud i hele kommunen: fra Sundparken og Marbækparken til parcelhuskvartererne ved fjorden, og videre til Slangerup og Jørlunde. Fra kontoret er der ti minutter til de fleste af dem, og det betyder at vi kan komme forbi og se en detalje uden at skulle regne en halv dag ind i prisen.",
      ],
    },
    PRICE_BLOCK,
    {
      kind: "prose",
      heading: "Fundamentet er 90 procent af holdbarheden",
      body: [
        "Når vi bliver kaldt ud til en terrasse der er gået i stykker efter otte år, er det næsten aldrig træet der har svigtet. Det er fundamentet. Enten er der lagt fliser direkte på jorden med strøer ovenpå, eller også står punktfundamenterne ikke dybt nok, og så løfter frosten dem en vinter og sætter dem skævt ned igen.",
        "Vi graver punktfundamenter ned under frostfri dybde — det vil sige omkring 90 cm i det meste af Nordsjælland. Tættere på fjorden, hvor grundvandet står højt, bruger vi typisk fundablokke eller støbte punkter med armering i stedet for jordskruer, fordi skruer mister deres greb i en våd, blandet jord.",
        "Ovenpå kommer en bærende konstruktion med bjælkesko i galvaniseret stål, og så brædderne. Der skal være mindst 20 cm luft under, ellers kan fugten ikke komme væk, og der skal være fald væk fra huset, så vandet ikke står op ad soklen. Det er ikke avanceret. Det er bare det der bliver sprunget over når en terrasse skal være billig.",
      ],
    },
    {
      kind: "prose",
      heading: "Træsorterne, og hvad de reelt kræver af dig",
      body: [
        "Trykimprægneret fyr er det billigste, og det er et fint valg hvis fundamentet er i orden og du ikke har noget imod at olie hvert andet år. Gør du ikke det, bliver det gråt og fnugget, og efter femten år er det slut. Det er ikke en dårlig terrasse, det er bare en terrasse med en tidsplan.",
        "Lærk og termobehandlet fyr står imellem. De kan stå ubehandlede og gråne, og de holder omkring tyve til femogtyve år. Det er den type vi oftest ender med at anbefale til en almindelig villahave, hvor folk gerne vil slippe for vedligeholdet men ikke vil betale hårdtræspris.",
        "Hårdtræ — bangkirai, ipe eller kebony — koster mest og holder over tredive år uden behandling. Ligger huset tæt på fjorden, anbefaler vi det næsten altid, fordi saltet i luften er hårdt ved både træ og beslag. Samme sted anbefaler vi syrefaste skruer og beslag frem for almindelige galvaniserede, for de ruster igennem på få år så tæt på vandet.",
        "Komposit er vedligeholdelsesfrit og holder femogtyve til tredive år. Det har et andet udtryk end træ, og det skal man kunne lide. Vi sælger det gerne, men vi sælger det ikke som træ.",
      ],
    },
    NOT_RECOMMENDED,
    {
      kind: "prose",
      heading: "Skal terrassen hæves?",
      body: [
        "Falder haven, eller ligger havedøren en halv meter over terræn, ender du hurtigt med en hævet terrasse. Og så bliver det pludselig en byggesag. Kort fortalt: er terrassen hævet mere end 30 cm over terræn, regnes den som et hævet opholdsareal, og så skal kommunen ind over — også selvom det bare er et trædæk.",
        "Det er ikke en grund til at lade være. Det er en grund til at vide det inden man går i gang, for en lovliggørelsessag bagefter er dyr og i værste fald ender den med krav om at rive ned. Vi har skrevet reglerne, afstandskravene og sagsbehandlingstiden sammen i en guide, og vi laver tegningerne og sender ansøgningen hvis du vil have os til det.",
      ],
    },
    PROCESS,
  ],
  faq: [
    {
      q: "Hvad koster en ny træterrasse i Frederikssund?",
      a: "Fra 1.800 kr/m² i trykimprægneret fyr til 3.500 kr/m² i hårdtræ, inkl. materiale, fundament og montage. En almindelig terrasse på 30 m² i lærk lander derfor typisk mellem 66.000 og 81.000 kr. Trapper, værn og overdækning kommer oveni.",
    },
    {
      q: "Hvor lang tid tager det at bygge terrassen?",
      a: "Fem til otte arbejdsdage for 25-40 m². Skal der graves til punktfundamenter i hård lerjord, eller skal der trappe og værn med, kan det blive et par dage mere. Vi giver en tidsplan i tilbuddet, ikke et skøn i telefonen.",
    },
    {
      q: "Hvilket træ anbefaler I tæt på fjorden?",
      a: "Hårdtræ, og syrefaste beslag. Saltet i luften tærer både på træ og på almindelige galvaniserede skruer, og vi har set nok terrasser i Jyllinge og ved Frederikssund havn til at vide at det ikke er teori. Ligger huset længere inde i landet, er lærk et fint og billigere valg.",
    },
    {
      q: "Skal jeg søge tilladelse til en terrasse?",
      a: "Ikke hvis den ligger i terrænhøjde. Hæves den mere end 30 cm over terræn, skal der byggetilladelse til, og der er krav om afstand til skel. Vi tjekker altid lokalplanen for din adresse inden vi giver tilbud.",
    },
    {
      q: "Kan I bygge videre på min eksisterende terrasse?",
      a: "Nogle gange. Det afhænger helt af hvordan den bærende konstruktion under den ser ud. Vi kigger den igennem på besigtigelsen og siger ærligt om det kan betale sig at bygge ovenpå eller om det bliver dyrere end at starte forfra. Ofte er svaret desværre det sidste.",
    },
    {
      q: "Laver I også overdækning og læskærm?",
      a: "Ja. Overdækning, læskærme, indbyggede plantekasser, trapper og udendørs belysning laver vi som en del af samme projekt. Det bliver både billigere og pænere end at sætte det på bagefter, fordi det kan bygges ind i konstruktionen fra start.",
    },
  ],
  related: [
    {
      href: "/ydelser/traeterrasse",
      label: "Træterrasse — hele ydelsen",
      note: "Materialer, overdækning og hvad vi laver ud over selve dækket.",
    },
    {
      href: "/guides/haevet-terrasse",
      label: "Guide: hævet terrasse og reglerne",
      note: "De 30 cm, de 2,5 meter til skel og hvornår du skal søge.",
    },
    {
      href: "/traeterrasse-egedal",
      label: "Træterrasse i Egedal",
      note: "Stenløse, Ølstykke, Slangerup og Jyllinge.",
    },
    {
      href: "/tomrer-frederikssund",
      label: "Tømrer i Frederikssund",
      note: "Alt det andet vi laver i byen.",
    },
  ],
  service: {
    name: "Træterrasse i Frederikssund",
    description:
      "Nye træterrasser i Frederikssund i fyr, lærk, komposit og hårdtræ. Punktfundament under frostfri dybde, fast pris og skriftlig aftale.",
  },
};

export const TERRASSE_EGEDAL: LongformContent = {
  path: "/traeterrasse-egedal",
  serviceSlug: "traeterrasse",
  eyebrow: "Terrasse · Egedal og omegn",
  h1: "Træterrasse i Egedal — Stenløse, Ølstykke og omegn",
  intro:
    "Vi bygger terrasser i Stenløse, Ølstykke, Smørum og Ganløse i Egedal Kommune — og i Slangerup og Jyllinge lige udenfor, som hører til henholdsvis Frederikssund og Roskilde Kommune. Den detalje er værd at kende, for det er kommunen der afgør reglerne i det øjeblik terrassen skal hæves. Her står priserne, træsorterne og hvad vi fraråder.",
  hero: "/images/service-terrasse.jpg",
  heroAlt: "Træterrasse bygget til et parcelhus",
  metaTitle: "Træterrasse i Egedal – Stenløse og Ølstykke",
  metaDescription: `Ny træterrasse i Stenløse, Ølstykke, Slangerup og Jyllinge. Pris fra 1.800 kr/m². Fast pris og gratis besigtigelse. Tømrer siden 1992. Ring Finn: ${SITE.phoneDisplay}.`,
  breadcrumb: [
    { name: "Forside", href: "/" },
    { name: "Træterrasse", href: "/ydelser/traeterrasse" },
    { name: "Egedal" },
  ],
  aside: {
    heading: "Hver terrasse får",
    items: [
      "Punktfundament under frostfri dybde",
      "Mindst 20 cm luft under brædderne",
      "Fald væk fra huset, altid",
      "Syrefaste eller galvaniserede beslag",
      "Tjek af lokalplanen for din adresse",
      "Fast pris og skriftlig aftale",
    ],
  },
  blocks: [
    {
      kind: "prose",
      heading: "Fire byer, tre kommuner — og derfor tre sæt regler",
      body: [
        "Stenløse og Ølstykke ligger i Egedal Kommune. Slangerup hører til Frederikssund Kommune, og Jyllinge til Roskilde. De ligger alle sammen indenfor en halv times kørsel fra vores kontor, og vi bygger i dem alle — men når en terrasse skal hæves, eller når der er en lokalplan der siger noget om hegn, højder og afstand til skel, er det den rigtige kommune der skal spørges.",
        "Det lyder som en formalitet, og det er det også lige indtil nogen søger det forkerte sted eller slet ikke søger. Vi slår altid lokalplanen op på den konkrete adresse inden vi giver tilbud, og vi siger til hvis der er noget i den der ændrer på det du havde tænkt dig.",
        "Egedal Kommunes byggesagsbehandling er typisk hurtig på de enkle sager, og det hjælper at ansøgningen er komplet første gang. Vi sender med de bilag der skal til — situationsplan, snit med koter og facadetegning — frem for at sende noget ind og vente på at få det retur med en mangelliste.",
      ],
    },
    PRICE_BLOCK,
    {
      kind: "prose",
      heading: "Husene i de fire byer, og hvad de betyder for terrassen",
      body: [
        "Stenløse er mest parcelhuse fra 60'erne til 90'erne i kommunale udstykninger. Flade grunde, havedør i stueplan, og ofte en eksisterende flisebelægning der skal væk eller bygges over. Her ligger terrassen som regel i terræn, og opgaven er ren og lige til — det er den type vi laver flest af.",
        "Ølstykke ligger ti minutter fra kontoret og har en del ældre boligforeninger. Skal der terrasse på en rækkehusgrund eller et fællesareal, er der som regel en ejerforening eller en andelsbestyrelse ind over, og der skal være styr på hvad vedtægterne siger om udvendige ændringer. Vi har rutine med den dialog, og vi kan godt lave en fælles pris hvis flere naboer vil have det samme lavet på én gang — det er markant billigere pr. terrasse.",
        "Slangerup har en blanding af ældre stationsbyhuse og nyere parcelhuse. På de ældre huse er soklen tit lav og terrænet faldet omkring den gennem hundrede år, så der skal tænkes over hvordan terrassen slutter til huset uden at lukke soklen inde. En terrasse der står op ad en gammel muret sokkel uden luft, giver fugt indenfor.",
        "Jyllinge ligger ved fjorden, og der gælder de samme regler som for alle kystnære huse: hårdtræ frem for fyr, og syrefaste beslag frem for galvaniserede. Vi har set for mange skruehoveder ruste af i det område til at anbefale andet.",
      ],
    },
    {
      kind: "prose",
      heading: "Fundamentet er 90 procent af holdbarheden",
      body: [
        "Punktfundamenter under frostfri dybde, omkring 90 cm. Det er det der afgør om terrassen står lige om ti år, eller om den har sat sig et hjørne så døren ikke kan gå op. Frosten løfter en fundering der ikke er dyb nok, og den sætter sig aldrig præcis tilbage igen.",
        "Jorden i Egedal er mange steder hård ler, og det betyder to ting: det er hårdt arbejde at grave, men fundamentet står til gengæld godt når det først er nede. Tættere på fjorden i Jyllinge er jorden mere blandet og våd, og der bruger vi støbte punkter med armering frem for jordskruer, fordi skruer mister deres greb i den slags jord.",
        "Ovenpå kommer bærende bjælker i galvaniserede bjælkesko, mindst 20 cm luft under brædderne, og fald væk fra huset. Det er de tre ting der gør forskellen, og de er alle sammen usynlige når terrassen er færdig. Det er præcis derfor de bliver sprunget over af dem der skal være billigst.",
      ],
    },
    NOT_RECOMMENDED,
    {
      kind: "prose",
      heading: "Hævet terrasse: spørg kommunen, ikke naboen",
      body: [
        "Skal terrassen hæves mere end 30 cm over terræn, regnes den som et hævet opholdsareal, og så kræver den byggetilladelse. Der er også et afstandskrav til skel, typisk 2,5 meter, og kommunen kan sende sagen i naboorientering hvis der er indbliksgener. Det gælder i alle tre kommuner, men detaljerne i lokalplanerne er forskellige.",
        "Det hyppigste vi møder er en terrasse der allerede er bygget for høj, og hvor naboen så klager. Det bliver en lovliggørelsessag, og de er dyre og langsomme. Har du en hævet terrasse i tankerne, så læs guiden først — den gennemgår de 30 cm, de 2,5 meter, kravet om værn, hvad tegningerne skal vise og hvad man skal regne med i sagsbehandlingstid.",
      ],
    },
    PROCESS,
  ],
  faq: [
    {
      q: "Hvad koster en træterrasse i Stenløse eller Ølstykke?",
      a: "Fra 1.800 kr/m² i trykimprægneret fyr til 3.500 kr/m² i hårdtræ, inkl. materiale, punktfundament og montage. En terrasse på 30 m² i lærk lander typisk mellem 66.000 og 81.000 kr. Trappe, værn og overdækning prissættes særskilt.",
    },
    {
      q: "Dækker I også Slangerup og Jyllinge?",
      a: "Ja. Begge ligger indenfor en halv times kørsel fra vores kontor i Frederikssund. Slangerup hører til Frederikssund Kommune og Jyllinge til Roskilde — det har ingen betydning for prisen, men det har betydning for hvem der skal søges hos hvis terrassen skal hæves.",
    },
    {
      q: "Kan I lave terrasser for en hel boligforening?",
      a: "Ja, og det bliver billigere pr. terrasse. Opstart, levering og maskiner betales én gang i stedet for fem, og vi kan lægge arbejdet i en rækkefølge der ikke spærrer alle indkørsler samtidig. Vi har rutine med dialogen med bestyrelser og generalforsamlinger.",
    },
    {
      q: "Hvilket træ skal jeg vælge?",
      a: "Ligger huset ved fjorden i Jyllinge: hårdtræ og syrefaste beslag. Ligger det inde i landet og vil du helst slippe for vedligehold: lærk eller termobehandlet fyr. Vil du have det billigst og har du ikke noget imod at olie hvert andet år: trykimprægneret fyr. Vi anbefaler ikke det samme til alle.",
    },
    {
      q: "Hvor lang tid tager en byggetilladelse til en hævet terrasse?",
      a: "Regn med fire til otte uger fra komplet ansøgning til afgørelse, og længere hvis sagen skal i naboorientering. Vi laver tegningerne og sender ansøgningen, så den er komplet første gang — det er der den meste tid ellers går tabt.",
    },
  ],
  related: [
    {
      href: "/ydelser/traeterrasse",
      label: "Træterrasse — hele ydelsen",
      note: "Materialer, overdækning og hvad vi laver ud over selve dækket.",
    },
    {
      href: "/guides/haevet-terrasse",
      label: "Guide: hævet terrasse og reglerne",
      note: "De 30 cm, de 2,5 meter til skel og hvornår du skal søge.",
    },
    {
      href: "/traeterrasse-frederikssund",
      label: "Træterrasse i Frederikssund",
      note: "Vores hjemby, ti minutter væk.",
    },
    {
      href: "/tomrer-stenloese",
      label: "Tømrer i Stenløse",
      note: "Tag, tilbygning og renovering i Egedal.",
    },
    {
      href: "/tomrer-oelstykke",
      label: "Tømrer i Ølstykke",
      note: "Boligforeninger og parcelhuse.",
    },
  ],
  service: {
    name: "Træterrasse i Egedal, Slangerup og Jyllinge",
    description:
      "Nye træterrasser i Stenløse, Ølstykke, Slangerup og Jyllinge i fyr, lærk, komposit og hårdtræ. Punktfundament under frostfri dybde og fast pris.",
  },
};
