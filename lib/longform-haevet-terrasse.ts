import { HAEVET_PRICES, prisForbehold } from "./priser";
import type { LongformContent } from "./longform";

/**
 * /guides/haevet-terrasse
 *
 * Den bedste informationelle indgang i hele undersøgelsen. Søgningen ejes i
 * dag af generalist-guides uden fagligt indhold: de skriver reglen af og
 * stopper der. En tømrer med 30+ år kan skrive den bedre, fordi han ved
 * hvad reglen betyder for konstruktionen — og hvad det koster at gøre det
 * ordentligt. Siden er trafikmagnet ind til de to terrassesider.
 *
 * Tonen er bevidst: håndværker, ikke jurist. Alle steder hvor noget
 * afhænger af den konkrete lokalplan, står der at det skal tjekkes.
 */
export const HAEVET_TERRASSE_CONTENT: LongformContent = {
  path: "/guides/haevet-terrasse",
  serviceSlug: "traeterrasse",
  eyebrow: "Guide · BR18 · Hævet terrasse",
  h1: "Hævet terrasse: reglerne, de 30 cm og hvad det koster",
  intro:
    "En terrasse i terrænhøjde er ingens sag andet end din egen. Løfter du den, bliver den pludselig et byggeprojekt med tilladelse, afstandskrav til skel og en nabo der skal høres. Grænsen går ved 30 cm. Her står hvad der sker på hver side af den, hvad kommunen skal bruge, hvad det tager af tid, og hvad det koster at bygge en hævet terrasse ordentligt.",
  hero: "/images/detail-hand-wood.jpg",
  heroAlt: "Tømrerhånd på en terrassekonstruktion i træ",
  metaTitle: "Hævet terrasse: regler, 30 cm og byggetilladelse",
  metaDescription:
    "Hvornår kræver en hævet terrasse byggetilladelse? De 30 cm over terræn, 2,5 m til skel, krav om værn og 4-8 ugers sagsbehandling. Skrevet af en tømrer, ikke en jurist.",
  breadcrumb: [
    { name: "Forside", href: "/" },
    // Ingen href: der findes ingen /guides-oversigt, og et brødkrumme-link
    // til siden selv er både forvirrende og forkert i schema.
    { name: "Guides" },
    { name: "Hævet terrasse" },
  ],
  aside: {
    heading: "Det korte svar",
    items: [
      "Under 30 cm over terræn: ingen tilladelse",
      "Over 30 cm: byggetilladelse, hver gang",
      "Mindst 2,5 m til skel i villaområder",
      "Værn kræves ved fald på mere end 0,5 m",
      "Regn med 4-8 ugers sagsbehandling",
      "Byg aldrig først og søg bagefter",
    ],
  },
  blocks: [
    {
      kind: "prose",
      heading: "Hvornår en terrasse regnes som hævet",
      body: [
        "Grænsen er 30 centimeter. Ligger terrassens gulv mindre end 30 cm over det omkringliggende terræn, betragter kommunerne den som en belægning i terræn, og så kræver den hverken tilladelse eller anmeldelse. Kommer den over de 30 cm, regnes den som et hævet opholdsareal — samme kategori som en altan eller en tagterrasse — og så skal der byggetilladelse til.",
        "Det er værd at forstå hvorfor grænsen ligger der, for det forklarer hvordan kommunen behandler sagen. Reglen handler ikke om konstruktionen eller om sikkerhed. Den handler om indblik. Fra 30 cm og op begynder du at kunne se ind over et hegn og ned i naboens have og stue, og det er den gene lovgivningen beskytter mod. Derfor er det også det spørgsmål kommunen stiller først: hvem kan du se, og hvad kan de se af dig.",
        "Målet tages fra det naturlige terræn ved terrassen, ikke fra det laveste punkt i haven. Falder grunden, måles der ved terrassen selv. Og det tæller ikke som en løsning at fylde jord på for at hæve terrænet — de fleste lokalplaner sætter en grænse for terrænregulering på plus/minus 30 cm i forhold til det oprindelige terræn, og så er man lige vidt.",
      ],
    },
    {
      kind: "prose",
      heading: "De 2,5 meter til skel",
      body: [
        "I et almindeligt villaområde skal bebyggelse holde mindst 2,5 meter til naboskel, og et hævet opholdsareal tæller som bebyggelse. Det betyder i praksis at en hævet terrasse ikke må ligge helt ude ved hækken, uanset hvor pænt den ellers er lavet.",
        "Kravet på de 2,5 meter er udgangspunktet i bygningsreglementet, men en lokalplan kan stille strengere krav, og nogle lokalplaner sætter en byggelinje der ligger længere inde på grunden. Det er derfor det første vi gør, når nogen ringer om en hævet terrasse: vi slår lokalplanen op på den konkrete adresse. Den står offentligt tilgængelig, og den vinder over den generelle regel.",
        "Kommunen kan dispensere, men det er ikke noget man skal regne med. Er terrassen tegnet så den lige akkurat overholder afstanden, er det langt den bedste vej — en dispensationssag tager længere, den koster mere, og den kan ende med et nej efter tre måneder.",
      ],
    },
    {
      kind: "list",
      heading: "Det kommunen skal have i ansøgningen",
      intro:
        "En ansøgning der er komplet første gang bliver behandlet i én omgang. En der mangler et bilag, ryger i kø igen når bilaget kommer, og det er typisk der de fleste uger går tabt. Det her skal med:",
      items: [
        "Situationsplan: grunden set ovenfra med huset, terrassen, skel og afstandene målsat.",
        "Snittegning med koter: hvor højt terrassens gulv ligger i forhold til det eksisterende terræn. Det er den tegning der afgør hele sagen.",
        "Facadetegning: hvordan terrassen ser ud fra siden, inkl. værn og trappe.",
        "Beskrivelse af værn: højde, materiale og hvor tætte åbningerne er.",
        "Redegørelse for indbliksgener hvis terrassen ligger tæt på skel: hvad kan man se, og hvad gør I for at begrænse det — for eksempel en tæt brystning i stedet for et åbent rækværk mod naboen.",
        "Fuldmagt, hvis det er os der søger på dine vegne.",
      ],
      outro:
        "Vi laver tegningerne og sender ansøgningen hvis du vil have os til det. Det er ikke fordi det ikke kan lade sig gøre selv — det kan det — men tegninger med koter er den del folk oftest må lave om.",
    },
    {
      kind: "prose",
      heading: "Sagsbehandlingstid: regn med fire til otte uger",
      body: [
        "Fra kommunen har en komplet ansøgning til der ligger en tilladelse, går der typisk fire til otte uger for en simpel terrassesag. Det svinger fra kommune til kommune og hen over året — foråret er højsæson for byggeansøgninger, og marts til maj er derfor den langsomste periode.",
        "Skal sagen i naboorientering, kommer der mere tid oveni. Kommunen sender så sagen til de berørte naboer med en frist på typisk 14 dage til at komme med bemærkninger, og derefter skal de bemærkninger behandles. Det kan lægge tre til fire uger til. Naboorientering udløses næsten altid når terrassen ligger tæt på skel eller er hævet meget.",
        "Det praktiske råd er banalt, men det virker: tal med naboen selv, inden du sender ansøgningen. En nabo der har hørt om projektet over hækken og har set en tegning, skriver sjældent et klagebrev. En nabo der først hører om det i et brev fra kommunen, gør det oftere.",
        "Og læg det i kalenderen bagfra. Skal terrassen bruges i juni, skal ansøgningen sendes i februar eller marts — ikke fordi byggeriet tager lang tid, men fordi papiret gør.",
      ],
    },
    {
      kind: "prose",
      heading: "Værn, faldhøjde og de tekniske krav",
      body: [
        "Er der mere end en halv meter ned fra terrassen til terrænet, skal der værn på. Det er ikke til forhandling, og det er heller ikke noget man skal ville forhandle — et fald på 80 cm ned på en flisekant er nok til at brække en håndled.",
        "Værnet skal være mindst 1 meter højt, målt fra terrassens gulv. Det skal kunne holde til at nogen læner sig ud over det, hvilket i praksis betyder at stolperne skal være boltet til den bærende konstruktion, ikke skruet i endetræet på et terrassebræt. Og åbningerne i værnet må ikke være så store at et lille barn kan komme igennem eller sætte hovedet fast — vi regner med højst 89 mm mellem balustre.",
        "Et værn må heller ikke kunne klatres på som en stige. Vandrette lister med jævn afstand er en stige for en femårig. Er der børn i huset, laver vi lodrette balustre eller en tæt beklædning, og vi siger det også når folk beder om det vandrette udtryk, fordi det er pænere. Det er det. Det er bare ikke værd at diskutere med en skadestue.",
        "Under dækket skal der være luft. En hævet terrasse har den fordel at ventilationen er god næsten af sig selv, men kun hvis siderne ikke lukkes helt tæt. Beklædes siderne, skal der være åbninger nok til at luften kan komme igennem — ellers får du et lukket, fugtigt rum under et trædæk, og så rådner bæringen indefra hvor ingen kan se det.",
      ],
    },
    {
      kind: "prices",
      heading: "Hvad en hævet terrasse koster at bygge ordentligt",
      intro:
        "En hævet terrasse koster mere pr. m² end en i terræn, og det er ikke fordi den er mere besværlig at lægge brædder på. Det er fordi bæringen skal regnes, fundamenterne skal være dybere og tage større last, og fordi værn og trappe er reelt tømrerarbejde.",
      rows: HAEVET_PRICES,
      note: `Priserne er inkl. moms. Byggesagsgebyr til kommunen kommer oveni og varierer meget — nogle kommuner tager ikke noget for en simpel terrassesag, andre afregner efter timeforbrug. Vi oplyser hvad din kommune tager, inden vi sender ansøgningen. ${prisForbehold("grunden og det terrassen skal bære på")}`,
    },
    {
      kind: "list",
      heading: "Det vi ikke anbefaler",
      intro:
        "Efter tredive år i faget er der fire fejl vi ser igen og igen på hævede terrasser:",
      items: [
        "Byg ikke først og søg bagefter. En lovliggørelsessag koster mere end ansøgningen ville have gjort, den tager længere, og kommunen kan kræve terrassen sænket eller revet ned. Vi har set det ske, og det er en dyr dag.",
        "Hæv den ikke til 29 cm for at undgå reglen, hvis huset reelt kræver 60. Så får du en terrasse med et trin midt i, vand der står i overgangen, og en dør der stadig ligger en halv meter over gulvet. Løs problemet, eller søg tilladelsen.",
        "Brug ikke trykimprægneret fyr i bæringen under et hævet dæk. Bæringen kan du ikke komme til at se, og du kan ikke skifte den uden at pille hele terrassen af. Certificeret konstruktionstræ eller varmgalvaniseret stål på betonsokler. Brædderne ovenpå kan altid skiftes — det kan bjælkerne ikke.",
        "Lad være med at lukke siderne helt tæt fordi det ser pænere ud. Et hævet dæk uden luft under er en fugtfælde, og den giver sig til kende efter otte-ti år som en bjælke der kan trykkes ind med en tommelfinger. Vil du have siderne beklædt, laver vi dem med skjulte ventilationsåbninger.",
      ],
    },
    {
      kind: "prose",
      heading: "Sådan bygger vi en hævet terrasse",
      body: [
        "Vi starter med at måle terrænet og sætte koterne, for det er dem hele sagen står og falder med. Derefter tegner vi, slår lokalplanen op, og sender ansøgningen. Mens den ligger hos kommunen, bestiller vi ikke materialer — det er der ingen grund til før vi ved hvad der bliver godkendt.",
        "Selve byggeriet starter med punktfundamenter, støbt under frostfri dybde, omkring 90 cm. På en hævet terrasse bærer hvert punkt mere last end på en i terræn, så de regnes efter dækkets størrelse og ikke sættes efter tommelfingerregel. Stolperne står i varmgalvaniserede stolpesko med luft til betonen, så endetræet aldrig står i vand.",
        "Så kommer bæringen, dækket, værnet og trappen. Vi bolter værnets stolper gennem bærebjælkerne, ikke ind i dækket, og vi laver trappen med den samme stigning hele vejen — en trappe hvor det nederste trin er tre centimeter lavere end resten, er den man falder på, hver gang, i tyve år.",
        "Til sidst afleverer vi formelt med en gennemgang, og du får dokumentationen med: tilladelsen, tegningerne og materialebeskrivelsen. Den skal du bruge den dag huset skal sælges, og den er svær at skaffe bagefter.",
      ],
    },
  ],
  faq: [
    {
      q: "Hvor høj må en terrasse være uden byggetilladelse?",
      a: "30 cm over det omkringliggende terræn. Holder terrassen sig under det, kræver den hverken tilladelse eller anmeldelse. Kommer den over, regnes den som et hævet opholdsareal, og så skal der byggetilladelse til. Målet tages ved terrassen, ikke i det laveste hjørne af haven.",
    },
    {
      q: "Hvor tæt på skel må en hævet terrasse ligge?",
      a: "Udgangspunktet i et villaområde er mindst 2,5 meter til naboskel. En lokalplan kan stille strengere krav, og den vinder over den generelle regel. Vi slår altid lokalplanen op på den konkrete adresse, inden vi tegner noget.",
    },
    {
      q: "Hvor lang tid tager en byggetilladelse til en hævet terrasse?",
      a: "Typisk fire til otte uger fra komplet ansøgning. Skal sagen i naboorientering, kommer der tre til fire uger oveni, fordi naboerne har en frist på omkring 14 dage og bemærkningerne derefter skal behandles. Foråret er langsomst — det er der alle søger.",
    },
    {
      q: "Skal naboen spørges?",
      a: "Kommunen afgør det, ikke dig. Ligger terrassen tæt på skel eller er den hævet meget, sender kommunen næsten altid sagen i naboorientering. Vores råd er at tale med naboen selv inden ansøgningen. En nabo der har set en tegning, klager sjældent. En der først hører om det fra kommunen, gør det oftere.",
    },
    {
      q: "Hvad hvis terrassen allerede er bygget uden tilladelse?",
      a: "Så skal den lovliggøres. Enten retligt, ved at søge og få tilladelse med tilbagevirkende kraft, eller fysisk, ved at sænke eller fjerne det der er for meget. Det er dyrere og langsommere end at have søgt fra start, og kommunen kan i sidste ende kræve nedrivning. Vi hjælper gerne med en lovliggørelsessag, men vi vil hellere hjælpe med ansøgningen først.",
    },
    {
      q: "Kræver en hævet terrasse værn?",
      a: "Ja, hvis der er mere end 0,5 meter ned til terrænet. Værnet skal være mindst 1 meter højt, kunne bære at nogen læner sig ud over det, og have åbninger på højst omkring 89 mm så et barn ikke kan komme igennem. Vandrette lister med jævn afstand frarådes — de fungerer som en stige.",
    },
    {
      q: "Hvad koster en hævet terrasse?",
      a: "2.600–4.200 kr/m² for selve dækket inkl. fundament og bæring, plus 1.400–2.400 kr pr. løbende meter værn og 6.000–12.000 kr for en trappe. Tegninger til byggeansøgningen koster 4.000–8.000 kr. Byggesagsgebyr til kommunen kommer oveni og varierer.",
    },
  ],
  related: [
    {
      href: "/traeterrasse-frederikssund",
      label: "Træterrasse i Frederikssund",
      note: "Priser, træsorter og fundament i vores hjemby.",
    },
    {
      href: "/traeterrasse-egedal",
      label: "Træterrasse i Egedal",
      note: "Stenløse, Ølstykke, Slangerup og Jyllinge.",
    },
    {
      href: "/ydelser/traeterrasse",
      label: "Træterrasse — hele ydelsen",
      note: "Overdækning, trapper, belysning og plantekasser.",
    },
    {
      href: "/ydelser/byggeraadgivning",
      label: "Byggerådgivning",
      note: "Skal du bruge en uvildig fagmand til at se et tilbud igennem.",
    },
  ],
  service: {
    name: "Hævet terrasse — tegning, byggetilladelse og udførelse",
    description:
      "Hævede terrasser i Nordsjælland: koter og tegninger, byggeansøgning til kommunen, punktfundament, bæring, værn og trappe efter bygningsreglementets krav.",
  },
};
