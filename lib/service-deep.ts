import type { Block } from "./longform";
import {
  HAEVET_PRICES,
  TAG_PRICES,
  TAG_TILLAEG,
  TERRASSE_PRICES,
  TILBYGNING_PRICES,
  prisForbehold,
} from "./priser";

/**
 * Den dybe del af de tre ydelsessider Google faktisk viser — tag, tilbygning
 * og terrasse (Search Console jun–sep 2026: 6.000–11.000 visninger hver, men
 * pos. 35–60). De var 700–900 ord uden priser og uden kilder; VELUX-siden,
 * som er bygget som langform, er 1.800.
 *
 * Renderes under de eksisterende afsnit i service-content.ts, så URL'erne og
 * den historik Google har på dem bevares.
 *
 * Regler og tal er hentet fra kilderne i hver `sources`-blok. Priserne står
 * i priser.ts og skal bekræftes af Finn.
 */
export type ServiceDeep = {
  blocks: Block[];
  faq: { q: string; a: string }[];
};

export const SERVICE_DEEP: Record<string, ServiceDeep> = {
  tagrenovering: {
    blocks: [
      {
        kind: "prices",
        heading: "Hvad koster et nyt tag i Nordsjælland?",
        intro:
          "Pris pr. m² tagflade med alt det der hører til: nedtagning af det gamle tag, nyt undertag, lægter, inddækninger, montage og bortkørsel. En typisk parcelhusvilla har 150–180 m² tagflade.",
        rows: TAG_PRICES,
        note: prisForbehold("taget"),
      },
      {
        kind: "prices",
        heading: "Det der ofte kommer oveni",
        rows: TAG_TILLAEG,
      },
      {
        kind: "prose",
        heading: "Undertaget holder kortere end stenene",
        body: [
          "Tegl kan ligge i 60 år og mere. Mange undertage gør ikke. Det betyder at et undertag valgt for billigt kan tvinge dig til at tage et ellers godt tag ned igen, bare for at komme til det der ligger under.",
          "Derfor vælger vi undertaget ud fra hvor længe tagbelægningen skal holde, ikke omvendt. Et diffusionsåbent undertag, korrekt ventilation mellem undertag og belægning, og tætte overgange ved kviste, skorsten og ovenlys er det der afgør om taget holder sin levetid.",
        ],
      },
      {
        kind: "list",
        heading: "Sådan forløber en tagudskiftning",
        items: [
          "Besigtigelse: vi ser taget udefra og loftet indefra — spær, fugt, ventilation og isolering. Gratis og uden binding.",
          "Fast pris og tidsplan på skrift, med hvad der er med, og hvad der ikke er.",
          "Stillads og afdækning, så huset er tæt hver aften, også hvis vejret skifter.",
          "Nedtagning og bortskaffelse af det gamle tag. Er der asbest, sker det efter reglerne nedenfor.",
          "Nyt undertag, lægter, inddækninger og belægning — og efterisolering, hvis loftet alligevel er åbent.",
          "Tagrender, nedløb og en gennemgang sammen med dig, før stilladset tages ned.",
        ],
      },
      {
        kind: "prose",
        heading: "Eternittag fra før 1988: tænk asbest ind fra start",
        body: [
          "Bølge- og skifereternit lagt før slutningen af 80'erne kan indeholde asbest. Det er ikke farligt at bo under, men det må ikke knuses, slibes eller brækkes af på en måde der frigiver fibre.",
          "Siden 1. januar 2025 må asbestholdigt materiale kun fjernes af virksomheder med autorisation — undtaget er kortvarigt arbejde af mindre omfang, fx en enkelt plade. Spørg altid den der skal tage dit tag ned, om de har autorisationen. Den kan tjekkes i Erhvervsstyrelsens register.",
        ],
      },
      {
        kind: "prose",
        heading: "Håndværkerfradrag på tagarbejde",
        body: [
          "Selve udskiftningen af tagbelægningen giver som udgangspunkt ikke fradrag. Efterisolering gør — arbejdslønnen hører under fradraget for grøn istandsættelse, som i 2026 er op til 9.000 kr. pr. person om året. Vi skriver arbejdsløn og materialer hver for sig på fakturaen, så du kan bruge den direkte.",
        ],
      },
      {
        kind: "sources",
        heading: "Læs mere hos kilderne",
        intro: "Reglerne og tallene ovenfor bygger på de her kilder. De er værd at læse, før du indhenter tilbud.",
        items: [
          {
            href: "https://www.bolius.dk/nyt-tag-til-parcelhuset-16771",
            label: "Bolius: Nyt tag til parcelhuset",
            note: "hvornår det kan betale sig, og hvad der påvirker prisen.",
          },
          {
            href: "https://www.bolius.dk/nyt-undertag-skal-jeg-saa-ogsaa-have-nyt-tag-33218",
            label: "Bolius: Nyt undertag, skal jeg så også have nyt tag?",
            note: "om levetiden på undertag kontra tagbelægning.",
          },
          {
            href: "https://www.bolius.dk/pas-paa-asbest-i-taget-3412",
            label: "Bolius: Asbest i taget",
            note: "hvordan du genkender det, og hvad du skal passe på.",
          },
          {
            href: "https://at.dk/faa-viden/asbest/autorisation-for-nedrivning-af-asbest/arbejdstilsynets-og-erhvervsstyrelsens-regler",
            label: "Arbejdstilsynet: Autorisation til nedrivning af asbest",
            note: "reglerne der gælder fra 2025, og undtagelsen for små opgaver.",
          },
          {
            href: "https://skat.dk/borger/fradrag/servicefradrag/tjek-om-du-kan-faa-servicefradrag",
            label: "SKAT: Tjek om du kan få håndværker- og servicefradrag",
            note: "hvilke arbejder der giver fradrag, og årets beløbsgrænser.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Hvad hvis mit gamle tag indeholder asbest?",
        a: "Så skal nedtagningen udføres af en virksomhed med asbestautorisation. Det lægger typisk 250–450 kr/m² oveni. Vi tager det med i prisen fra start, så det ikke bliver en overraskelse.",
      },
      {
        q: "Kan ovenlysvinduerne skiftes samtidig?",
        a: "Ja, og det er det billigste tidspunkt at gøre det på, fordi taget og stilladset alligevel er der. Se priserne på VELUX-udskiftning på siden om ovenlysvinduer.",
      },
      {
        q: "Skal vi flytte ud mens taget skiftes?",
        a: "Nej. Vi dækker af hver dag, så huset er tæt om natten. Der er støj i dagtimerne, og loftsrummet skal være tømt, hvis vi skal efterisolere.",
      },
    ],
  },

  tilbygning: {
    blocks: [
      {
        kind: "prices",
        heading: "Hvad koster en tilbygning?",
        intro:
          "Pris pr. m² for en nøglefærdig tilbygning i Nordsjælland. Jo flere installationer — køkken, bad, gulvvarme — jo højere ender m²-prisen.",
        rows: TILBYGNING_PRICES,
        note: prisForbehold("huset og grunden"),
      },
      {
        kind: "prose",
        heading: "Hvor meget må du bygge til?",
        body: [
          "Fire regler i bygningsreglementet (BR18 §§ 170–177) afgør det for et almindeligt parcelhus. Bebyggelsesprocenten: det samlede etageareal må som udgangspunkt højst være 30 % af grundens areal. Højden: højst to etager og 8,5 m over terræn. Afstanden: tilbygningen skal holdes mindst 2,5 m fra skel mod nabo og sti. Og ingen del af den må være højere end 1,4 gange afstanden til skel.",
          "Reglen om at man godt må bygge tættere end 2,5 m på skel, gælder kun garager, carporte, udhuse og lignende — ikke en tilbygning man skal bo i.",
          "En lokalplan eller servitut kan være strammere end BR18, og den vinder. Derfor starter vi altid med at slå grunden op, før der tegnes noget.",
        ],
      },
      {
        kind: "list",
        heading: "Fra idé til indflytning",
        items: [
          "Første snak og besigtigelse: hvad mangler I reelt, og hvad tillader grunden?",
          "Skitse og overslag, så I ved om projektet holder inden for budgettet, før I betaler for tegninger.",
          "Tegninger og byggeansøgning. En tilbygning til beboelse kræver byggetilladelse. Kommunens sagsbehandlingstid varierer, så den planlægger vi efter.",
          "Nabohøring, hvis projektet kræver dispensation fra reglerne.",
          "Byggeri med fast tidsplan: fundament, råhus, tæt hus, installationer og indvendig afslutning.",
          "Aflevering og færdigmelding til kommunen.",
        ],
      },
      {
        kind: "prose",
        heading: "Tilbygningen skal leve op til energikravene",
        body: [
          "En tilbygning skal overholde BR18's energikrav på lige fod med nybyg — isolering, vinduer og tæthed. Det koster lidt mere i materialer, men det betyder også at den nye stue ikke bliver husets kolde rum. Energiberegningen er en del af byggeansøgningen.",
        ],
      },
      {
        kind: "sources",
        heading: "Læs mere hos kilderne",
        intro: "Tjek selv reglerne for din grund, før I lægger jer fast på et projekt:",
        items: [
          {
            href: "https://www.bygningsreglementet.dk/Tekniske-bestemmelser/08/Krav/168_186",
            label: "BR18 §§ 168–186: Byggeret",
            note: "bebyggelsesprocent, højde og afstand til skel.",
          },
          {
            href: "https://bygningsreglementet.dk/Tekniske-bestemmelser/11/Krav",
            label: "BR18 kapitel 11: Energiforbrug",
            note: "de energikrav tilbygningen skal leve op til.",
          },
          {
            href: "https://www.bolius.dk/tilbygning",
            label: "Bolius: Tilbygning",
            note: "Bolius' samlede guider til at bygge til.",
          },
          {
            href: "https://www.bolius.dk/nemmere-at-bygge-skur-carport-og-drivhus-39299",
            label: "Bolius: Byggetilladelse til carport, skur og drivhus",
            note: "hvornår mindre bygninger kan opføres uden tilladelse.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Skal naboen høres?",
        a: "Kun hvis projektet kræver dispensation, fx fra højden eller afstanden til skel. Holder tilbygningen sig inden for reglerne, er der ingen nabohøring.",
      },
      {
        q: "Hvad er billigst: tilbygning eller kvist?",
        a: "Pr. m² er en kvist ofte billigst, fordi huset allerede har fundament og tag. Men den giver kun plads på 1. sal. Vi regner begge dele igennem, hvis huset giver mulighed for det.",
      },
    ],
  },

  traeterrasse: {
    blocks: [
      {
        kind: "prices",
        heading: "Hvad koster en træterrasse pr. m²?",
        intro: "Inkl. materialer, fundament og montage. Træsorten er det der flytter prisen mest.",
        rows: TERRASSE_PRICES,
        note: prisForbehold("terrassen og jorden den skal stå på"),
      },
      {
        kind: "prices",
        heading: "Hævet terrasse koster mere",
        intro:
          "Står terrassen højt over terræn, kommer bærende konstruktion, værn og trappe oveni — og ofte en byggeansøgning.",
        rows: HAEVET_PRICES,
      },
      {
        kind: "prose",
        heading: "I terræn eller hævet — det skifter reglerne",
        body: [
          "En terrasse i terrænhøjde kræver normalt hverken tilladelse eller anmeldelse. Hæver du den, ændrer det sig: højden over terræn, afstanden til skel og om naboen kan kigge ind, afgør om kommunen skal inddrages. Vores guide til hævet terrasse gennemgår grænserne én for én.",
        ],
      },
      {
        kind: "sources",
        heading: "Læs mere hos kilderne",
        items: [
          {
            href: "https://www.bolius.dk/terrasse",
            label: "Bolius: Terrasse",
            note: "træsorter, vedligehold og fundament.",
          },
          {
            href: "https://www.bolius.dk/5-regler-du-skal-huske-naar-du-bygger-smaaprojekter-paa-grunden-2558",
            label: "Bolius: 5 regler når du bygger småprojekter på grunden",
            note: "skel, højder og hvornår kommunen skal inddrages.",
          },
          {
            href: "https://www.bygningsreglementet.dk/Tekniske-bestemmelser/08/Krav/168_186",
            label: "BR18 §§ 168–186: Byggeret",
            note: "de regler for højde og afstand til skel en hævet terrasse skal holde sig inden for.",
          },
        ],
      },
    ],
    faq: [
      {
        q: "Hvornår er det bedst at bygge terrasse?",
        a: "Vi bygger hele året, så længe jorden ikke er frossen, når fundamentet skal sættes. Vil du have terrassen klar til foråret, er vinteren det bedste tidspunkt at bestille.",
      },
    ],
  },
};
