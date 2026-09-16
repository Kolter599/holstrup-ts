import { SITE } from "./site";
import { kr, krFra, prisForbehold, VELUX_EKSTRA, VELUX_PRICES } from "./priser";
import type { LongformContent } from "./longform";

/**
 * /velux-frederikssund
 *
 * Den billigste gevinst i hele undersøgelsen. På "velux montering
 * frederikssund" er der ikke ét Frederikssund-firma i resultaterne: der
 * ligger velux.dk's egne vejledninger, et gør-det-selv-forum, og tømrere
 * fra Fredensborg, Holbæk, Ballerup og Fredericia. Holstrup er den lokale,
 * og ingen har taget pladsen.
 *
 * Kortere end hovedsiden med vilje — siden den skal slå er tynd, og der er
 * ingen grund til at skrive 1.800 ord for at gøre det. Priserne kommer fra
 * samme konstant som de andre sider, så de aldrig kan komme til at sige
 * noget forskelligt.
 */
export const VELUX_FREDERIKSSUND_CONTENT: LongformContent = {
  path: "/velux-frederikssund",
  serviceSlug: "doere-og-vinduer",
  eyebrow: "Velux · Frederikssund · 3600",
  h1: "Velux montering i Frederikssund",
  intro: `Vores kontor ligger på ${SITE.address.street} i ${SITE.address.city}. Når du ringer om et ovenlysvindue her i byen, er det ikke en tømrer fra den anden side af Sjælland der kommer — det er Finn, og der er ti minutter i bilen. Priser i kroner du kan regne efter, og en montage hvor undertaget bliver åbnet og lavet ordentligt.`,
  hero: "/images/finn-velux.jpg",
  heroAlt: "Finn fra Holstrup TS i gang med et Velux-vinduesparti",
  metaTitle: `Velux montering Frederikssund – ${krFra(VELUX_PRICES.udskiftningStandard)}`,
  metaDescription: `Velux ovenlysvinduer i Frederikssund monteret af lokal tømrer. ${krFra(VELUX_PRICES.udskiftningStandard)} inkl. inddækning og lysning, fast pris efter besigtigelse. Ring Finn: ${SITE.phoneDisplay}.`,
  breadcrumb: [
    { name: "Forside", href: "/" },
    { name: "Velux ovenlysvinduer", href: "/velux-ovenlysvinduer" },
    { name: "Frederikssund" },
  ],
  aside: {
    heading: "Lokalt betyder",
    items: [
      "Ti minutter fra kontor til opgave",
      "Besigtigelse indenfor få dage",
      "Finn kommer selv — ingen sælger",
      "Vi kan køre forbi og se en detalje",
      "Fast pris, skriftlig aftale",
      "Samme mand efter opgaven er slut",
    ],
  },
  blocks: [
    {
      kind: "prices",
      heading: "Priser på Velux i Frederikssund",
      intro:
        "Samme priser som på resten af sitet — der er ingen lokalpris, hverken op eller ned. Til gengæld er der ingen kørselstillæg her i byen, og det er der hos flere af dem der kører hertil udefra.",
      rows: [
        {
          label: "Udskiftning i eksisterende hul",
          detail: "Samme størrelse, standardmål op til 78 × 118 cm. Det vi laver flest af.",
          price: kr(VELUX_PRICES.udskiftningStandard),
        },
        {
          label: "Stort vindue, eller to side om side",
          detail: "Fra 134 × 98 cm, eller to vinduer i samme tagflade skiftet på én gang.",
          price: kr(VELUX_PRICES.udskiftningStort),
        },
        {
          label: "Nyt ovenlys i eksisterende tag",
          detail: "Nyt hul, udveksling mellem spærene, nyt undertag omkring hullet og ny lysning.",
          price: kr(VELUX_PRICES.nytHul),
        },
        {
          label: "Ovenlys i fladt tag",
          detail: "Opbygget karm og ny tilslutning til tagpappen. Typisk med en tagdækker ind over, som vi koordinerer.",
          price: kr(VELUX_PRICES.fladtTag),
        },
      ],
      note: `Inkl. moms, materialer, arbejde, oprydning og bortkørsel. Skal der stillads på, koster det ${krFra(VELUX_EKSTRA.stillads)} — men på de fleste Frederikssund-parcelhuse i halvanden etage er der ikke behov. ${prisForbehold("taget")}`,
    },
    {
      kind: "prose",
      heading: "Frederikssund-husene og deres ovenlys",
      body: [
        "Byens boligmasse går fra de gule 60'er-villaer i Søbækparken over parcelhuskvartererne i Sundparken og Marbækparken til de ældre fjordhuse omkring havnen. På 60'er- og 70'er-villaerne sidder ovenlysene typisk i en tagetage der blev indrettet engang i 80'erne, og de vinduer er nu fyrre år gamle. Det er den opgave vi oftest bliver ringet op om herfra.",
        "De vinduer har to problemer. Ruden er punkteret, så den dugger indefra og der er ingen isoleringsværdi tilbage. Og undertaget omkring dem er som regel en gammel banevare der er blevet mør — den smuldrer når man rører den. Derfor kan en udskiftning i Frederikssund ikke laves som et rent vinduesbytte. Der skal nyt undertag omkring hullet, ellers er der ikke noget at slutte inddækningen tæt til.",
        "Tættere på fjorden kommer salt og vind oveni. Der ser vi oftere at beslag og skruer på selve inddækningen har rustet, også selvom vinduet i øvrigt er fint. Det er billigt at rette mens taget alligevel er åbent, og dyrt at opdage senere.",
      ],
    },
    {
      kind: "prose",
      heading: "Det er Finn der kommer",
      body: [
        "Holstrup TS har haft adresse i Frederikssund siden 1992, og Velux-montage har været en fast del af arbejdet hele vejen — først som hustømrer på store entrepriser, siden på villaer og sommerhuse i hele Nordsjælland. Det er over tredive år med de samme vinduer, og det betyder mest når noget ikke er standard: et gammelt mål der ikke laves længere, et spær der sidder forkert, et undertag ingen kan genkende.",
        "Der er ingen sælger og intet callcenter. Du ringer, og du taler med den håndværker der skal op på taget. Det er også ham der tager telefonen hvis der er noget bagefter.",
      ],
    },
    {
      kind: "prose",
      heading: "Hvor hurtigt vi kan komme",
      body: [
        "Besigtigelse i Frederikssund kan som regel ligge indenfor få dage, fordi der ikke skal planlægges en halv dags kørsel omkring den. Selve montagen afhænger af leveringstid på vinduet — standardstørrelser ligger typisk på to til fire uger, særmål længere.",
        "Et vindue tager en arbejdsdag inkl. lysning. Sidder der to i samme tagflade, tager vi dem normalt på samme dag, og så bliver det billigere pr. stk., fordi opstart, afdækning og oprydning kun skal laves én gang.",
        "Vi dækker også Slangerup, Jørlunde, Ølstykke og Stenløse fra samme adresse — alle indenfor en halv times kørsel.",
      ],
    },
    {
      kind: "list",
      heading: "Det vi ikke anbefaler",
      intro:
        "De tre situationer hvor vi plejer at fraråde opgaven, også selvom vi kunne tage den:",
      items: [
        "Nyt ovenlys i et tag der skal skiftes indenfor fem år. Inddækningen skal alligevel laves om når stenene kommer af, så du betaler for den to gange. Vent, og tag vinduerne med i tagprojektet.",
        `Ny rude i en karm der er over 25 år. Ruden kan skiftes for typisk ${kr(VELUX_EKSTRA.rudeUdskiftning)}, men beslag, lister og karmtræ er lige så gamle — så har du betalt en tredjedel for at udsætte det hele i nogle få år.`,
        "Ovenlys mod syd uden udvendig solafskærmning. En tagetage med to sydvendte ovenlys og intet udenpå bliver over 30 grader i juli. Indvendige gardiner stopper lyset, ikke varmen.",
      ],
    },
  ],
  faq: [
    {
      q: "Hvad koster Velux-montering i Frederikssund?",
      a: `${kr(VELUX_PRICES.udskiftningStandard)} inkl. moms for en udskiftning i eksisterende hul i standardstørrelse, og ${kr(VELUX_PRICES.nytHul)} hvis der skal et nyt hul i taget. Du får ét fast tal når vi har set taget. Prisen dækker nyt vindue, inddækning, tilslutning til undertag og dampspærre, ny indvendig lysning samt oprydning og bortkørsel.`,
    },
    {
      q: "Beregner I kørsel i Frederikssund?",
      a: "Nej. Kontoret ligger i byen, så der er ingen kørselstillæg på opgaver i Frederikssund og omegn. Det er værd at spørge om hos firmaer der kører hertil fra Ballerup eller Holbæk — der er det som regel med i prisen ét eller andet sted.",
    },
    {
      q: "Hvor hurtigt kan I komme ud og se på det?",
      a: "Besigtigelse typisk indenfor få dage. Selve montagen afhænger af leveringstiden på vinduet — to til fire uger på standardstørrelser, længere på særmål. Besigtigelsen er gratis og uforpligtende.",
    },
    {
      q: "Skal der nyt undertag på mit hus?",
      a: "Det kan vi ikke se fra jorden, men på et Frederikssund-hus fra 60'erne eller 70'erne er svaret oftest ja omkring vinduet. Den gamle banevare bliver mør. Det koster 2.500–6.000 kr oveni, og du får det at vide med et tal på, inden vi laver det.",
    },
    {
      q: "Skal jeg søge byggetilladelse?",
      a: "Nej, ikke til et ovenlys i tagfladen på et almindeligt enfamiliehus. En kvist er en anden sag og kræver tilladelse fra Frederikssund Kommune. Er huset bevaringsværdigt, eller siger lokalplanen noget om tagets udtryk, tjekker vi reglerne inden vi går i gang.",
    },
    {
      q: "Kommer I også til Slangerup, Jørlunde og Ølstykke?",
      a: "Ja. De ligger alle indenfor en halv times kørsel fra kontoret, og der er ingen prisforskel. Vi kører også videre ud i hele Nordsjælland — se hovedsiden om Velux for hele listen af byer.",
    },
  ],
  related: [
    {
      href: "/velux-ovenlysvinduer",
      label: "Velux ovenlysvinduer",
      note: "Hovedsiden — inddækning, nyt hul i taget og fladt tag forklaret.",
    },
    {
      href: "/velux-udskiftning-pris",
      label: "Velux udskiftning — pris i detaljer",
      note: "Scenarier, tillæg og hvornår det ikke kan svare sig.",
    },
    {
      href: "/tomrer-frederikssund",
      label: "Tømrer i Frederikssund",
      note: "Alt det andet vi laver i byen.",
    },
    {
      href: "/ydelser/tagrenovering",
      label: "Tagrenovering",
      note: "Skal taget skiftes, hører ovenlysene med i det projekt.",
    },
  ],
  service: {
    name: "Velux montering i Frederikssund",
    description:
      "Montering og udskiftning af Velux ovenlysvinduer i Frederikssund til fast pris. Lokal tømrer siden 1992, korrekt inddækning, undertag og indvendig lysning.",
  },
};
