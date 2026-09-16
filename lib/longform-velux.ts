import { AREAS, SITE } from "./site";
import { kr, krFra, prisForbehold, VELUX_EKSTRA, VELUX_PRICES, VELUX_TILLAEG } from "./priser";
import type { LongformContent } from "./longform";

const TOWNS = AREAS.map((a) => a.name);

/**
 * /velux-ovenlysvinduer — hovedsiden.
 *
 * Laget "tømrer + velux + område" ejes af små lokale tømrere, ikke portaler,
 * og siden der ligger nr. 1 vinder på at skrive priser i kroner. Derfor er
 * pristabellen det første indhold under indledningen — ikke en FAQ til sidst.
 * På "velux montering frederikssund" er der i dag ingen Frederikssund-firmaer
 * i resultaterne overhovedet.
 */
export const VELUX_CONTENT: LongformContent = {
  path: "/velux-ovenlysvinduer",
  serviceSlug: "doere-og-vinduer",
  eyebrow: "Velux · Ovenlys · Fast pris",
  h1: "Velux ovenlysvinduer — montering og udskiftning til fast pris",
  intro:
    "Et ovenlysvindue er den billigste måde at få rigtigt dagslys ind i en tagetage. Det er også et af de steder hvor forkert montage koster mest, fordi fejlen først viser sig som en fugtplet på gipsloftet to vintre senere. Vi har sat Velux i tage i Nordsjælland siden 1992. Her står priserne i kroner, så du kender niveauet inden vi kører ud — og du får din faste pris når vi har set taget.",
  hero: "/images/detail-tag-velux.jpg",
  heroAlt: "Velux ovenlysvindue monteret i tegltag",
  metaTitle: `Velux ovenlysvinduer – fast pris ${krFra(VELUX_PRICES.udskiftningStandard)}`,
  metaDescription: `Montering og udskiftning af Velux ovenlysvinduer i Frederikssund og Nordsjælland. Priser i kroner, fast pris efter besigtigelse — ikke timeregning. Tømrer siden 1992. Ring Finn: ${SITE.phoneDisplay}.`,
  breadcrumb: [
    { name: "Forside", href: "/" },
    { name: "Ydelser", href: "/ydelser" },
    { name: "Velux ovenlysvinduer" },
  ],
  aside: {
    heading: "Prisen dækker",
    items: [
      "Nedtagning af det gamle vindue",
      "Nyt Velux-vindue i den størrelse der passer",
      "Inddækning tilpasset din tagtype",
      "Tilslutning til undertag og dampspærre",
      "Ny indvendig lysning, spartlet klar til maler",
      "Oprydning og bortkørsel af det gamle",
    ],
  },
  blocks: [
    {
      kind: "prices",
      heading: "Hvad et Velux-vindue koster hos os",
      intro:
        "Fast pris pr. vindue, ikke en timepris med et skøn på hvor mange timer det tager. Prisen holder efter vi har set taget — og ser vi noget på besigtigelsen der ændrer den, siger vi det inden vi går i gang, ikke bagefter.",
      rows: [
        {
          label: "Udskiftning i eksisterende hul",
          detail: "Samme størrelse, standardmål op til 78 × 118 cm. Det klassiske: vinduet er 25 år, beslagene er trætte, ruden er dugget indvendigt.",
          price: kr(VELUX_PRICES.udskiftningStandard),
        },
        {
          label: "Udskiftning, stort vindue eller to side om side",
          detail: "Fra 134 × 98 cm og opefter, eller to vinduer i samme tagflade der skiftes på én gang.",
          price: kr(VELUX_PRICES.udskiftningStort),
        },
        {
          label: "Nyt ovenlys i eksisterende tag",
          detail: "Nyt hul hvor der ikke var et før. Inkl. udveksling mellem spærene, nyt undertag omkring hullet og ny lysning indvendigt.",
          price: kr(VELUX_PRICES.nytHul),
        },
        {
          label: "Ovenlys i fladt tag",
          detail: "Opbygget karm, ny tilslutning til tagpappen, dampspærre og lysning. En anden opgave end et vindue i en skrå tagflade.",
          price: kr(VELUX_PRICES.fladtTag),
        },
      ],
      note: `Priserne er inkl. moms og gælder ved normal adgang til tagfladen. Skal der stillads på, eller er undertaget mørt, står tillæggene længere nede. ${prisForbehold("taget")}`,
    },
    {
      kind: "prose",
      heading: "Inddækningen er hele forskellen",
      body: [
        "Når vi bliver kaldt ud til et ovenlysvindue der lækker, er det næsten aldrig vinduet der er noget galt med. Det er inddækningen — pladen der fører vandet fra taget rundt om vinduet og ud på tagfladen igen. Den skal passe til præcis det tagmateriale du har, og der findes forskellige typer til tegl, til fladt materiale som skifer og tagpap, og til profilerede plader.",
        "Sidder der en forkert inddækning, eller er den lagt oven på undertaget i stedet for ind under, så løber vandet den forkerte vej. Det kan stå og gøre det i årevis uden at nogen opdager det, fordi isoleringen suger. Når pletten så endelig kommer på loftet indenfor, er spæret ved siden af vinduet typisk allerede angrebet.",
        "Vi bruger den tid inddækningen kræver, og vi åbner altid op til undertaget. Bliver du tilbudt en Velux-udskiftning hvor undertaget ikke røres, er det ikke en fuld montage — det er et vindue lagt ned i den gamle utæthed.",
      ],
    },
    {
      kind: "prose",
      heading: "Nyt hul i taget — hvad der reelt sker",
      body: [
        "Skal der et vindue ind hvor der ikke var et, starter det med spærene. Et Velux-vindue i standardbredde passer mellem to spær med normal afstand, og så skal der ikke skæres i bærende træ overhovedet. Er vinduet bredere, eller sidder spærene tættere, laver vi en udveksling: spæret skæres over og lasten føres ud i naboerne gennem et tværstykke. Det er almindeligt tømrerarbejde, men det skal regnes igennem, ikke gættes.",
        "Derefter skæres undertaget op, der monteres en krave der fører vandet uden om karmen, vinduet sættes i, og inddækningen lægges. Indvendigt tilsluttes dampspærren tæt hele vejen rundt — det er den detalje der afgør om der kommer kondens bag gipsen om ti år.",
        "Til sidst kommer lysningen. Den skæres lodret foroven og vandret forneden, ikke vinkelret på vinduet. Det lyder som en detalje, men det er forskellen på et rum der bliver lyst og et rum hvor lyset står i en kasse. Vi afleverer lysningen spartlet og klar til maler.",
      ],
    },
    {
      kind: "prose",
      heading: "Ovenlys i fladt tag er en anden opgave",
      body: [
        "Et fladt tag har ingen hældning der kan føre vandet væk, så løsningen er en opbygget karm der løfter vinduet 15–30 cm op over tagfladen. Tagpappen føres op ad karmen og afsluttes under vinduets egen inddækning. Gøres det omvendt, står vandet i samlingen.",
        "Prisen er højere fordi der er mere arbejde i karmen, fordi der næsten altid skal en tagdækker ind over pap-tilslutningen, og fordi isoleringen omkring karmen skal laves færdig på en måde der ikke giver en kuldebro. Vi koordinerer tagdækkeren, så du har ét firma at forholde dig til.",
      ],
    },
    {
      kind: "list",
      heading: "Det vi ikke anbefaler",
      intro:
        "Der er fire situationer hvor vi plejer at fraråde opgaven, også selvom vi kunne tjene på den:",
      items: [
        "Nye ovenlys i et tag der skal skiftes indenfor fem år. Inddækningen skal alligevel laves om når tagstenene kommer af. Vent, og lad vinduerne indgå i tagprojektet — så betaler du kun for inddækningen én gang.",
        "Ovenlys mod syd uden udvendig solafskærmning. En tagetage med to sydvendte ovenlys og intet udenpå bliver over 30 grader i juli. Indvendige gardiner stopper lyset, men de stopper ikke varmen — den er allerede inde. En udvendig markise gør.",
        "Ovenlys som svar på et fugtproblem på loftet. Får du kondens eller skimmel deroppe, er årsagen næsten altid manglende ventilation i tagrummet eller en utæt dampspærre. Et vindue fjerner ikke årsagen, det giver bare et nyt sted den kan sætte sig.",
        `Ny rude i en karm der er over 25 år gammel. Ruden kan skiftes, og det koster typisk ${kr(VELUX_EKSTRA.rudeUdskiftning)}. Men beslag, tætningslister og selve karmtræet er lige så gamle, og så har du betalt en tredjedel af prisen for at udsætte det hele i tre-fire år.`,
      ],
    },
    {
      kind: "prose",
      heading: "Hvem der kommer ud",
      body: [
        "Det er Finn der kommer og ser på opgaven, og det er Finn du har i røret bagefter. Holstrup TS er et lille firma med over 30 års erfaring bag sig, og Velux-montage er noget vi har lavet gennem hele den periode — først som hustømrer på store entrepriser, siden på villaer og sommerhuse i hele Nordsjælland.",
        "Vi er ikke en kæde med et callcenter, og vi er ikke sælgere. Ringer du, taler du med den håndværker der skal stå på taget.",
      ],
    },
    {
      kind: "list",
      heading: "Byerne vi monterer Velux i",
      intro: `Fra kontoret på ${SITE.address.street} i ${SITE.address.city} kører vi ud i hele Nordsjælland. De byer vi er oftest i:`,
      items: TOWNS,
      outro:
        "Ligger du lige udenfor listen, så ring alligevel — vi kører gerne længere når opgaven har en størrelse der bærer turen.",
    },
  ],
  faq: [
    {
      q: "Hvad koster det at få skiftet et Velux-vindue?",
      a: `${kr(VELUX_PRICES.udskiftningStandard)} for en udskiftning i eksisterende hul i standardstørrelse, inkl. nyt vindue, ny inddækning, tilslutning til undertag og ny indvendig lysning. Skal der et nyt hul i taget, ligger det på ${kr(VELUX_PRICES.nytHul)}. Priserne er inkl. moms, og du får ét fast tal når vi har set taget.`,
    },
    {
      q: "Kan I skifte vinduet uden at ændre hullet i taget?",
      a: "Ja, og det er langt det billigste. Velux har holdt de samme standardmål i årtier, så et vindue fra 1998 kan næsten altid erstattes af et nyt i samme størrelse uden at røre spærene. Vi måler altid op inden, så vi bestiller den rigtige type.",
    },
    {
      q: "Hvor lang tid tager en udskiftning?",
      a: "Et vindue tager en arbejdsdag inkl. lysning. Sidder der to vinduer i samme tagflade, kan vi typisk nå begge på én dag, fordi opstart, afdækning og oprydning kun skal laves én gang. Det er også derfor det er billigere pr. stk. at tage dem samlet.",
    },
    {
      q: "Skal jeg søge byggetilladelse til et ovenlysvindue?",
      a: "Nej. Et ovenlys der ligger i tagfladen på et almindeligt enfamiliehus kræver ikke byggetilladelse, fordi det hverken ændrer husets volumen eller etageareal. En kvist gør begge dele og kræver tilladelse. Er huset bevaringsværdigt eller ligger i et område med en lokalplan om tagets udtryk, tjekker vi altid reglerne først.",
    },
    {
      q: "Kan man sætte ovenlys i et tag med eternit eller bølgeplader?",
      a: "Ja. Der findes inddækning til profilerede tagmaterialer, og den er lavet netop til den slags tag. Er pladerne fra før 1988, skal vi regne med asbest i dem, og så skal nedtagningen laves efter reglerne med korrekt bortskaffelse. Det aftaler og prissætter vi inden opgaven, aldrig undervejs.",
    },
    {
      q: "Monterer I andre mærker end Velux?",
      a: "Ja, vi sætter også Roto og Fakro i. Vi anbefaler oftest Velux, ikke af loyalitet, men fordi reservedele, gardiner og inddækninger er nemmest at skaffe til dem om ti år — og et ovenlysvindue skal holde længere end det.",
    },
    {
      q: "Kan I efterisolere tagetagen samtidig?",
      a: "Ja, og det er ofte det rigtige tidspunkt. Når lysningen alligevel er åben, kan vi se hvordan isoleringen ligger og om dampspærren er hel. Vi giver en samlet pris hvis begge dele skal med.",
    },
  ],
  related: [
    {
      href: "/velux-udskiftning-pris",
      label: "Velux udskiftning — pris i detaljer",
      note: "Scenarier, tillæg, og hvornår en udskiftning ikke kan svare sig.",
    },
    {
      href: "/velux-frederikssund",
      label: "Velux montering i Frederikssund",
      note: "Den lokale side — ti minutter fra kontoret, intet kørselstillæg.",
    },
    {
      href: "/ydelser/doere-og-vinduer",
      label: "Døre og vinduer",
      note: "Hele ydelsen — facadevinduer, hoveddøre og terrassedøre.",
    },
    {
      href: "/ydelser/tagrenovering",
      label: "Tagrenovering",
      note: "Skal taget alligevel skiftes, hører ovenlysene med i det projekt.",
    },
    {
      href: "/tomrer-frederikssund",
      label: "Tømrer i Frederikssund",
      note: "Vores hjemby — 10 minutter fra kontoret.",
    },
  ],
  service: {
    name: "Montering og udskiftning af Velux ovenlysvinduer",
    description:
      "Udskiftning og nymontering af Velux ovenlysvinduer i Nordsjælland til fast pris. Korrekt inddækning, tilslutning til undertag og dampspærre samt ny indvendig lysning.",
  },
};

/**
 * /velux-udskiftning-pris — prissiden.
 *
 * Søgningen "udskiftning af velux vindue pris" har en anden hensigt end
 * hovedsiden: den er stillet af en der allerede ved hvad de skal have, og
 * kun vil vide hvad det koster. Derfor er alt her tal, tillæg og ærlighed
 * om hvornår man skal lade være.
 */
export const VELUX_PRIS_CONTENT: LongformContent = {
  path: "/velux-udskiftning-pris",
  serviceSlug: "doere-og-vinduer",
  eyebrow: "Velux · Pris · 2026",
  h1: "Udskiftning af Velux-vindue — hvad det koster",
  intro:
    "De fleste tilbud på en Velux-udskiftning svinger med 15.000 kroner, og det er sjældent fordi håndværkerne er uenige om arbejdet. Det er fordi de regner forskellige ting med. Her står hvad en udskiftning koster hos os, hvad der kan komme oveni, og hvornår vi vil fraråde dig at gøre det.",
  hero: "/images/finn-velux.jpg",
  heroAlt: "Finn i gang med at montere et Velux-vinduesparti",
  metaTitle: `Velux udskiftning pris – ${kr(VELUX_PRICES.udskiftningStandard)}`,
  metaDescription: `Hvad koster det at skifte et Velux-vindue? Typisk ${kr(VELUX_PRICES.udskiftningStandard)} inkl. inddækning og lysning. Se tillæg og hvornår det ikke kan svare sig. Nordsjælland.`,
  breadcrumb: [
    { name: "Forside", href: "/" },
    { name: "Velux ovenlysvinduer", href: "/velux-ovenlysvinduer" },
    { name: "Pris på udskiftning" },
  ],
  aside: {
    heading: "Sådan er tilbuddet",
    items: [
      "Fast pris efter besigtigelse — ikke timeregning",
      "Skriftlig aftale om omfang og materialer",
      "Tillæg aftales skriftligt, inden de laves",
      "Alle priser inkl. moms",
      "Oprydning og bortkørsel er med",
      "5 års garanti efter AB18 på det udførte",
    ],
  },
  blocks: [
    {
      kind: "prices",
      heading: "De fire scenarier",
      intro:
        "Næsten alle opgaver falder i en af fire kasser. Find den der ligner din — så ved du hvor du ligger, inden du overhovedet ringer.",
      rows: [
        {
          label: "1 · Vinduet skiftes 1:1",
          detail: "Samme hul, samme størrelse, op til 78 × 118 cm. Undertaget omkring vinduet er i orden.",
          price: kr(VELUX_PRICES.udskiftningStandard),
        },
        {
          label: "2 · Stort vindue, eller to i samme tagflade",
          detail: "Fra 134 × 98 cm, eller to vinduer der skiftes samtidigt. Pr. vindue bliver det billigere end to enkeltopgaver.",
          price: kr(VELUX_PRICES.udskiftningStort),
        },
        {
          label: "3 · Der skal et nyt hul i taget",
          detail: "Enten et helt nyt ovenlys, eller et eksisterende der skal blive større. Inkl. udveksling mellem spær.",
          price: kr(VELUX_PRICES.nytHul),
        },
        {
          label: "4 · Fladt tag",
          detail: "Opbygget karm og ny tilslutning til tagpappen. Kræver typisk en tagdækker ind over, som vi koordinerer.",
          price: kr(VELUX_PRICES.fladtTag),
        },
      ],
      note: `Alle priser er pr. vindue, inkl. moms, materialer, arbejde, oprydning og bortkørsel. ${prisForbehold("taget")}`,
    },
    {
      kind: "prices",
      heading: "Tillæg der kan komme oveni",
      intro:
        "De her fem er dem vi oftest ender med at skulle tage stilling til. De står som intervaller, fordi de afhænger af huset — men de bliver altid aftalt skriftligt inden vi laver dem, aldrig sat på regningen bagefter.",
      rows: VELUX_TILLAEG,
      note: "Hvad vi gør hvis der dukker noget uventet op efter vi er gået i gang — råd, et mørt undertag, et underlag der ikke bærer — står i vores handelsbetingelser. Kort fortalt: vi stopper, ringer til dig, og aftaler prisen inden vi laver arbejdet.",
    },
    {
      kind: "prose",
      heading: "Det der flytter prisen mest",
      body: [
        "Tagtypen er den største faktor. Et vindue i tegl er den billigste opgave, fordi inddækningen er lavet til netop den profil og stenene kan løftes af og lægges tilbage. Skifer, naturskifer og profilerede plader kræver mere tilpasning. Fladt tag er en helt anden konstruktion og koster derfor dobbelt.",
        "Undertaget er den næststørste, og den man ikke kan se hjemmefra. Er huset fra 70'erne og har en gammel banevare som undertag, smuldrer den typisk når man rører den. Så skal der nyt i omkring vinduet, ellers er der ingen tætning at slutte til. Det er den enkelte post der oftest overrasker folk.",
        `Adgangen er den tredje. Kan vi nå tagfladen forsvarligt fra en stige, er der intet tillæg. Er tagfladen stejl, facaden høj, eller ligger vinduet over en glasoverdækning, skal der stillads på — og så koster opgaven ${krFra(VELUX_EKSTRA.stillads)} mere.`,
        "Lysningen er den fjerde, og den fylder mere end folk tror. Er den gamle lysning skæv, fugtskadet eller lavet i krydsfiner der er gået op i lag, skal der bygges ny. Det er tømrerarbejde indvendigt, og det tager tid.",
      ],
    },
    {
      kind: "prose",
      heading: "Hvorfor vi ikke giver en timepris",
      body: [
        "Du kan få en timepris hos os hvis du beder om det, men vi anbefaler det ikke, og vi giver den ikke selv. Grunden er enkel: på en Velux-udskiftning er det os der bestemmer hvor mange timer der går, og du har ingen mulighed for at vurdere om otte timer var rimeligt eller om det kunne være gjort på fem.",
        "En fast pris flytter den risiko over på os, hvor den hører hjemme. Finder vi noget uventet, som et mørt spær eller en dampspærre der aldrig er blevet lukket, siger vi det på stedet, og du får en aftaleseddel med et tal på, inden vi går videre. Du skriver under, eller du siger nej. Ingen regninger der vokser mens man kigger på dem.",
      ],
    },
    {
      kind: "list",
      heading: "Hvornår en udskiftning ikke kan svare sig",
      intro:
        "Det her koster os opgaver, men vi siger det alligevel, fordi vi hellere vil have et opkald om tre år end en dårlig historie i morgen:",
      items: [
        "Når taget skal skiftes indenfor tre til fem år. Inddækningen skal alligevel laves om når stenene kommer af, så du betaler for den to gange. Vent, og tag vinduerne med i tagprojektet — der koster de langt mindre, fordi taget alligevel er åbent.",
        `Når kun ruden er punkteret og karmen er under 15 år. Så skift ruden. Det koster typisk ${kr(VELUX_EKSTRA.rudeUdskiftning)}, og resten af vinduet har stadig halvdelen af sin levetid tilbage.`,
        "Når ét vindue skal skiftes, men der sidder tre af samme årgang. Skift dem samlet. Stillads, opstart, afdækning og oprydning betales én gang i stedet for tre, og du sparer typisk 20 procent i forhold til tre særskilte opgaver.",
        `Når vinduet sidder et forkert sted. Sidder ovenlyset over en skunk eller helt oppe i kippen hvor ingen kan se ud af det, så flyt det i stedet for at skifte det. Det koster typisk ${kr(VELUX_EKSTRA.flytVindue)} mere, og du får et rum der virker i stedet for et nyt vindue på et dumt sted.`,
      ],
      outro:
        "Er du i tvivl om hvilken af dem der gælder dig, så ring. Det tager ti minutter at afgøre i telefonen, og det koster ikke noget.",
    },
    {
      kind: "prose",
      heading: "Hvorfor tilbuddene svinger så meget",
      body: [
        "Når du har tre tilbud på bordet og det billigste er 11.000 og det dyreste er 26.000, er det næsten altid fire ting der forklarer forskellen: om inddækningen er med, om undertaget er regnet ind, om lysningen indvendigt er med, og om der er sat stillads på.",
        "Et tilbud på 11.000 kr er typisk et vindue plus montage — og så en regning bagefter for alt det andet. Spørg konkret til de fire punkter på hvert tilbud, så bliver de sammenlignelige. Det er den bedste ting du kan gøre, også hvis du ender med at vælge en anden end os.",
      ],
    },
  ],
  faq: [
    {
      q: "Hvad koster det at skifte et Velux-vindue i 2026?",
      a: `${kr(VELUX_PRICES.udskiftningStandard)} inkl. moms for en udskiftning i eksisterende hul i standardstørrelse. Prisen dækker nyt vindue, ny inddækning, tilslutning til undertag og dampspærre, ny indvendig lysning spartlet klar til maler, samt oprydning og bortkørsel.`,
    },
    {
      q: "Kan jeg nøjes med at skifte ruden?",
      a: `Hvis karmen er under 15 år og i god stand, ja. En ny rude koster typisk ${kr(VELUX_EKSTRA.rudeUdskiftning)}. Er karmen ældre end det, er beslag og tætningslister lige så gamle, og så har du betalt en tredjedel af prisen for at udskyde det hele i nogle få år.`,
    },
    {
      q: "Hvad koster det hvis undertaget er ødelagt?",
      a: "2.500–6.000 kr oveni, afhængigt af hvor stort et stykke der skal skiftes. Vi kan ikke se det fra jorden, så det afgøres på besigtigelsen eller når vinduet er ude. Du får det at vide med et tal på, inden vi laver det.",
    },
    {
      q: "Skal der stillads på?",
      a: `Kun hvis tagfladen ikke kan nås forsvarligt fra en stige. Det gælder typisk stejle tage, huse i to fulde etager, og vinduer der sidder over en carport eller glasoverdækning. Stillads koster ${krFra(VELUX_EKSTRA.stillads)}. På et almindeligt parcelhus i halvanden etage er der som regel ikke behov.`,
    },
    {
      q: "Hvad koster det at få to eller tre vinduer skiftet på én gang?",
      a: `Billigere pr. stk. end enkeltvis. To vinduer i samme tagflade ligger på ${kr(VELUX_PRICES.udskiftningStort)} samlet når de er i standardstørrelse, fordi opstart, afdækning og oprydning kun skal laves én gang. Ved tre eller flere giver vi en samlet pris efter besigtigelse.`,
    },
    {
      q: "Er prisen med moms?",
      a: "Ja. Alle tal på siden er inkl. moms. Vi synes ikke en privat boligejer skal sidde og gange med 1,25 for at finde ud af hvad noget koster.",
    },
  ],
  related: [
    {
      href: "/velux-ovenlysvinduer",
      label: "Velux ovenlysvinduer",
      note: "Hovedsiden — hvordan montagen foregår, og hvad inddækningen betyder.",
    },
    {
      href: "/velux-frederikssund",
      label: "Velux montering i Frederikssund",
      note: "Bor du lokalt: ingen kørsel, og besigtigelse indenfor få dage.",
    },
    {
      href: "/ydelser/tagrenovering",
      label: "Tagrenovering",
      note: "Skal taget skiftes indenfor fem år, hører vinduerne med her.",
    },
    {
      href: "/ydelser/doere-og-vinduer",
      label: "Døre og vinduer",
      note: "Facadevinduer, hoveddøre og terrassedøre.",
    },
  ],
  service: {
    name: "Udskiftning af Velux ovenlysvinduer til fast pris",
    description:
      "Fast pris på udskiftning af Velux ovenlysvinduer i Nordsjælland, inkl. inddækning, undertagstilslutning og ny indvendig lysning.",
  },
};
