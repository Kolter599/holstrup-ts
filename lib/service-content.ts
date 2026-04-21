export type Section = { heading: string; body: string };
export type ServiceContent = {
  slug: string;
  eyebrow: string;
  h1: string;
  intro: string;
  hero: string;
  sections: Section[];
  bullets: string[];
  faq: { q: string; a: string }[];
};

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  tagrenovering: {
    slug: "tagrenovering",
    eyebrow: "Tag · Udskiftning · Reparation",
    h1: "Tagrenovering i Nordsjælland",
    intro:
      "Et tag holder i 40-60 år når det er bygget rigtigt, og 10-15 år kortere når det ikke er. Vi udskifter, reparerer og efterisolerer tage i Nordsjælland med fokus på det færreste ser: undertaget, ventilationen og overgangene.",
    hero: "/images/service-tag.jpg",
    sections: [
      {
        heading: "Sådan ved du at det er tid",
        body: "Revnede tagsten, fugt på loftet, mosbælter på nordsiden, utætte skotrender, og en faldende tagrygning er de klassiske tegn. Hvis taget er over 50 år gammelt og du oplever bare et par af dem, så er det tid til at få et fagligt blik på taget. Vi kommer ud og gennemgår både ude- og inde-fra. Det er gratis og uden binding.",
      },
      {
        heading: "Det er ikke stenene der svigter",
        body: "Når vi bliver kaldt ud til fugt- og rådskader er årsagen næsten aldrig tagstenene. Det er undertaget der er hullet, ventilationen der er stoppet, eller inddækningen ved skorsten og kvist der er forkert. Når vi renoverer, arbejder vi os igennem hele konstruktionen: spær, undertag, ventilation, isolering, overgange — og først til allersidst kommer tagstenene op.",
      },
      {
        heading: "Materialevalg uden lager-bias",
        body: "Vi anbefaler det der passer huset, ikke det vi tilfældigvis har på lager. Tegl klæder de gamle huse, men sort betontag virker bedre på funkis. Skifer er smukt men kostbart, tagpap kræver eftersyn hvert 5. år. Til kystbyer som Hornbæk, Tisvildeleje og Gilleleje anbefaler vi materialer der har bevist sig over tid mod salt og vind.",
      },
      {
        heading: "Velux er typisk problembarnet",
        body: "Vi har set rigtig mange forkert monterede Velux-vinduer. Inddækningen er det vigtigste, og den bliver tit lavet for hurtigt. Vi tager den tid der skal til. Korrekt undertag, tæt tilslutning, dampspærre rundt om karmen, og indvendig afslutning der hænger sammen med det eksisterende loft. Det er det der gør forskellen mellem et tag der holder og et der lækker.",
      },
    ],
    bullets: [
      "Fast pris efter besigtigelse — ingen ubehagelige tillæg",
      "Skriftlig aftale om omfang, materialer og tidsplan",
      "Oprydning og bortskaffelse indgår altid",
      "Koordinering med blikkenslager og andre fag",
      "Lokalplaner og tilladelser håndterer vi for dig",
      "Hjælp til håndværkerfradrag og forsikringsdokumentation",
    ],
    faq: [
      { q: "Hvad koster et nyt tag?", a: "Prisen afhænger af tagets størrelse, kompleksitet, materiale og om der skal efterisoleres. For en typisk nordsjællandsk villa starter prisen omkring 250-350.000 kr for et klassisk tegltag. Vi giver altid fast pris efter besigtigelse." },
      { q: "Skal jeg søge om byggetilladelse?", a: "For en ren udskiftning af tagsten med samme farve og materiale er der som regel ingen tilladelse. Skal der ændres udtryk, tagkonstruktion eller tagkip, skal kommunen inddrages. Vi sørger for det hele." },
      { q: "Hvor lang tid tager det?", a: "En villa kan typisk få nyt tag på 2-4 uger afhængigt af vejr og kompleksitet. Vi dækker altid af, så regnen ikke skader noget, også selvom arbejdet strækker sig." },
      { q: "Kan jeg få håndværkerfradrag?", a: "Arbejdet på isolering og efterisolering kan typisk give håndværkerfradrag. Vi sender en specificeret regning som kan bruges til fradrag." },
    ],
  },
  traeterrasse: {
    slug: "traeterrasse",
    eyebrow: "Terrasse · Anlæg · Overdækning",
    h1: "Træterrasse med holdbart håndværk",
    intro:
      "Terrassen er det sted hvor huset og haven mødes — og den bruges hver dag. Vi bygger terrasser i hårdtræ, trykimprægneret fyr, lærk og komposit, med vægt på det der afgør holdbarheden: fundamentet, ventilationen og de usynlige detaljer.",
    hero: "/images/service-terrasse.jpg",
    sections: [
      {
        heading: "Det fundament du ikke ser bestemmer holdbarheden",
        body: "90% af dårlige terrasser er ikke dårligt træ — det er forkert fundament og manglende luft under brædderne. Vi fundamenter enten med punktbundsrør, fundablokke eller træskruer afhængig af jordbund. Og vi sørger altid for min. 20 cm luft under brædderne og fald væk fra huset.",
      },
      {
        heading: "Valg af træ",
        body: "Hårdtræ (fx ipe, bangkirai, kebony) er kostbart men holder 30+ år uden behandling. Trykimprægneret fyr er billigere og dur fint hvis fundamentet er i orden. Kompositbrædder (WPC) er vedligeholdelsesfri men har et andet udtryk. Vi rådgiver ud fra budget, stil og hvor meget vedligehold du vil lave.",
      },
      {
        heading: "Hele terrasseprojektet i ét",
        body: "Terrasser er sjældent 'bare' brædder. De har brug for trapper, altankanter, overdækning, udvendig belysning, plantekasser og evt. udekøkken. Vi tegner og udfører hele projektet, så det hænger sammen — arkitektonisk og teknisk.",
      },
    ],
    bullets: [
      "Korrekt fundament med luft og fald",
      "Valg af træ ud fra budget og vedligehold",
      "Integrerede trapper og plantekasser",
      "Overdækning og udvendig belysning",
      "Ansøgning om byggetilladelse hvis relevant",
      "Fast pris og skriftlig aftale",
    ],
    faq: [
      { q: "Hvad koster en ny terrasse?", a: "En ny terrasse starter typisk omkring 1.800-3.500 kr pr. m² inkl. materiale og montage, afhængigt af træsort og underlag. Hårdtræ og komposit ligger højere end fyr." },
      { q: "Hvor lang tid holder terrassen?", a: "Hårdtræ 30+ år uden behandling. Trykimprægneret fyr 15-20 år med olie. Komposit typisk 25-30 år." },
      { q: "Skal jeg søge om tilladelse?", a: "En terrasse i terrænhøjde kræver normalt ikke tilladelse. Skal den hæves, overdækkes eller bygges tæt på skel, kan der være regler. Vi tjekker altid lokalplanen." },
    ],
  },
  tilbygning: {
    slug: "tilbygning",
    eyebrow: "Tilbygning · Kvist · Udestue",
    h1: "Tilbygning, kvist og udnyttelse af tagetage",
    intro:
      "En tilbygning skal føles som en naturlig del af huset — ikke en påklistret kasse. Vi laver tilbygninger, udestuer, kviste og indretning af tagetagen, med særligt fokus på at det tekniske og arkitektoniske passer med det eksisterende hus.",
    hero: "/images/service-tilbygning.jpg",
    sections: [
      {
        heading: "Tilbygning til villa eller rækkehus",
        body: "Vi starter altid med en snak om hvad du reelt mangler. Nogle gange er løsningen ikke en tilbygning — det er en omfordeling af det I allerede har. Men når en tilbygning er svaret, sørger vi for at den hænger rigtigt sammen med det eksisterende hus: højde, tag, facade, gulve og overgange.",
      },
      {
        heading: "Kvist og udnyttelse af tagetage",
        body: "En kvist er den mest effektive måde at skaffe plads på en 1½-plansvilla. Vi ser på tagkonstruktionen, vurderer statikken, tegner kvisten så den passer husets stil, og udfører alt — fra fjernelse af gammelt tag til indvendig afslutning. Indretning af tagetage med sovrum, badeværelse og trappe er en klassisk Holstrup-opgave.",
      },
      {
        heading: "Udestue og overdækket terrasse",
        body: "En udestue forlænger husets brugssæson med et halvt år. Vi bygger både klassiske udestuer med glaspartier og isolerede helårsstuer. Vi tager hånd om det hele: fundament, vægge, tag, vinduer, el og overgang til det eksisterende hus.",
      },
      {
        heading: "Byggetilladelse og tegninger",
        body: "Tilbygninger kræver næsten altid byggetilladelse. Vi tager den dialog med kommunen, tegner projektet og indsender ansøgningen. For større tilbygninger samarbejder vi med en fast arkitekt.",
      },
    ],
    bullets: [
      "Arkitektoniske løsninger der passer det eksisterende hus",
      "Kviste, tagboliger, udestuer og klassiske tilbygninger",
      "Byggetilladelse og dialog med kommunen",
      "Én kontaktperson fra start til slut",
      "Koordinering af murer, VVS, el og maler",
      "Fast pris og skriftlig tidsplan",
    ],
    faq: [
      { q: "Hvor meget må jeg bygge til?", a: "Afhænger af lokalplan og bebyggelsesprocent — typisk 30% af grunden. Vi tjekker altid de konkrete regler inden vi går videre." },
      { q: "Hvad koster en tilbygning?", a: "Meget forskelligt — fra omkring 18.000-28.000 kr pr. m² for en simpel tilbygning, op til 35.000+ kr pr. m² ved høj kvalitet, specielle løsninger eller vanskelig adgang." },
      { q: "Kan I også tage arkitektarbejdet?", a: "Vi samarbejder med en fast arkitekt og kan lave en samlet aftale. For mindre tilbygninger laver vi selv tegningsmaterialet." },
    ],
  },
  totalentreprise: {
    slug: "totalentreprise",
    eyebrow: "Totalentreprise · Ét ansvar",
    h1: "Totalentreprise med én fast kontaktperson",
    intro:
      "Hvis du ikke selv har lyst til at være projektleder for dit byggeri i din fritid, er totalentreprise det enkleste valg. Ét firma står for tegning, tilladelser, alle fag og det færdige resultat. Du har ét telefonnummer at ringe til.",
    hero: "/images/service-totalentreprise.jpg",
    sections: [
      {
        heading: "Hvad du reelt får",
        body: "Du underskriver én kontrakt. Holstrup TS koordinerer murer, VVS, el, maler, blikkenslager og gulvmand. Vi laver tidsplanen, bestiller materialer, fører dagligt tilsyn, ringer ikke til dig hver gang en lille ting skal tages stilling til, og afleverer til den dato vi har aftalt. I praksis betyder det at du kan passe dit arbejde mens vi passer dit byggeri.",
      },
      {
        heading: "Når totalentreprise passer bedst",
        body: "Du har ikke en fast arkitekt eller bygningsrådgiver i forvejen. Du vil have ro i maven og ét sted at klage hvis noget ikke er som aftalt. Du vægter den samlede oplevelse højere end at klemme den allersidste krone ud af hver fagentreprenør. Og du forstår at en sammenhængende proces næsten altid bliver billigere end en opsplittet — fordi der er færre fejlbestillinger og mindre dødtid.",
      },
      {
        heading: "Total versus hoved versus fag",
        body: "Ved totalentreprise tager vi også projekteringen. Ved hovedentreprise har du selv arkitekt eller rådgiver, og vi udfører pladsstyringen. Ved ren fagentreprise hyrer du hver fagmand særskilt og er selv projektleder. De fleste private bygherrer har bedst gavn af totalentreprise. Vi kan alle tre — og er ærlige hvis dit projekt passer bedre til en af de andre modeller.",
      },
    ],
    bullets: [
      "Én kontrakt, ét ansvar, én kontaktperson",
      "Fast pris efter grundig besigtigelse",
      "Skriftlig tidsplan med milepæle",
      "Dialog med kommune og myndigheder",
      "Styring af alle fag på pladsen",
      "Afleveringsforretning med mangelgennemgang",
    ],
    faq: [
      { q: "Hvad koster totalentreprise i forhold til fagentreprise?", a: "Typisk 5-10% mere end ren fagentreprise — men det koster dig heller ikke det der går tabt i tidsplaner, fejlbestillinger og mangler ved fagentreprise. I praksis bliver totalentreprise ofte billigere samlet set." },
      { q: "Står I for arkitekt og tegninger også?", a: "Ja. Vi samarbejder med en fast arkitekt og har selv rutine med det løbende tegningsmateriale. Vi sørger også for byggetilladelse." },
      { q: "Hvad hvis der opstår mangler?", a: "Du har 5 års garanti på synlige fejl og 10 år på skjulte fejl, jf. ABT18. Vi afleverer altid formelt med mangelgennemgang — ikke bare 'nu er det vist færdigt'." },
    ],
  },
  hovedentreprise: {
    slug: "hovedentreprise",
    eyebrow: "Hovedentreprise · Pladsen er vores",
    h1: "Hovedentreprise for bygherrer med eget projekt",
    intro:
      "Har du allerede arkitekt og projekt — men mangler en entreprenør der kan styre pladsen? Vi tager hovedentreprisen og koordinerer alle fag. Det er den klassiske løsning for bygherrer, boligforeninger og ejendomsselskaber med egen rådgiver.",
    hero: "/images/service-hovedentreprise.jpg",
    sections: [
      {
        heading: "Rollen som hovedentreprenør",
        body: "Bygherren og rådgiveren har styr på det de gør — projektering, udbud, godkendelser. Vi styrer det vi er bedst til — byggepladsen. Koordinering af fag, tidsplan, materialelogistik, arbejdsmiljø, tilsyn og den daglige kommunikation med bygherre.",
      },
      {
        heading: "Hvornår giver hovedentreprise mening?",
        body: "Når bygherren har egen rådgiver eller arkitekt. Når der er flere fag der skal styres samtidig. Når der er krav til dokumentation, arbejdsmiljø og kvalitet der skal overholdes formelt. Og når bygherren vil bevare overblikket uden at sidde som projektleder.",
      },
      {
        heading: "Typiske bygherrer vi arbejder for",
        body: "Private villaejere med større renoveringer. Boligforeninger og andelsboligforeninger med tagudskiftning, facaderenovering eller tilbygning. Erhvervsbygherrer med mindre byggerier i Nordsjælland. Og kommercielle udlejere af mindre ejendomme.",
      },
    ],
    bullets: [
      "Samlet byggeledelse og fagkoordinering",
      "Daglig dialog med bygherre og rådgiver",
      "Overholdelse af tidsplan og budget",
      "Kvalitets- og arbejdsmiljøstyring",
      "Løbende dokumentation af udført arbejde",
      "Afleveringsforretning med mangelliste",
    ],
    faq: [
      { q: "Hvordan honoreres hovedentreprisen?", a: "Enten som fast pris på hele arbejdet eller som regningsarbejde med loft. For langt de fleste byggerier giver fast pris mest ro i maven." },
      { q: "Hvad hvis projektet ændrer sig undervejs?", a: "Ændringer håndteres med skriftlige tillæg til kontrakten (aftalesedler) — både i omfang og pris. Bygherren ved altid præcist hvad der ændres og hvad det koster." },
      { q: "Følger I AB18 / ABT18?", a: "Ja. Vi bruger standardbetingelser som AB18 eller ABT18 i alle lidt større projekter. Det beskytter begge parter." },
    ],
  },
  renovering: {
    slug: "renovering",
    eyebrow: "Renovering · Villa · Lejlighed",
    h1: "Renovering af villa og lejlighed",
    intro:
      "Renovering er det mest kompliserede i byggebranchen — alt i et eksisterende hus afhænger af noget andet. Vi har renoveret hundreder af villaer og lejligheder i Nordsjælland og ved at kvaliteten ligger i forberedelsen.",
    hero: "/images/service-renovering.jpg",
    sections: [
      {
        heading: "Start med en grundig gennemgang",
        body: "Før vi overhovedet taler pris, laver vi en grundig gennemgang af ejendommen. Hvad er i god stand? Hvad bør udskiftes nu? Hvad kan vente? De fleste budgetoverskridelser i renoveringer kommer fra ting der ikke blev opdaget inden arbejdet gik i gang.",
      },
      {
        heading: "Små renoveringer — store renoveringer",
        body: "Fra at udskifte en enkelt væg og lave et nyt badeværelse, til at strippe et helt hus til isoleringen og bygge det op igen. Vi tager både den lille og den store opgave — men vi er ærlige omkring hvornår det ikke giver mening at renovere og hvornår man bør bygge nyt.",
      },
      {
        heading: "Lejlighedsrenovering og andelsboliger",
        body: "Renovering af lejligheder kræver særligt hensyn til naboer, ejerforening og stigstrenge. Vi har rutine med andelsboligforeninger i Storkøbenhavn og Nordsjælland — og kender både de tekniske og de sociale spilleregler.",
      },
    ],
    bullets: [
      "Grundig gennemgang før tilbud",
      "Fast pris og skriftlig tidsplan",
      "Koordinering af alle fag",
      "Støv- og støjbegrænsning ved beboet renovering",
      "Dialog med ejerforening og naboer",
      "Fuld dokumentation af udført arbejde",
    ],
    faq: [
      { q: "Kan jeg blive boende under renoveringen?", a: "Afhænger af omfanget. Mindre renoveringer kan klares med delvis aflukning. Gennemgribende renoveringer kræver typisk at boligen fraflyttes i 2-6 uger." },
      { q: "Hvordan holder I budgettet?", a: "Med en grundig besigtigelse inden aftalen og skriftlig aftaleseddel ved eventuelle ændringer. Vi har altid rutine med uforudsete ting i gamle huse — og en plan for hvordan de håndteres." },
      { q: "Renoverer I også sommerhuse?", a: "Ja — se separat side om sommerhusrenovering." },
    ],
  },
  sommerhus: {
    slug: "sommerhus",
    eyebrow: "Sommerhus · Kyst · Hele året",
    h1: "Sommerhusbyggeri og -renovering",
    intro:
      "Et sommerhus ved den nordsjællandske kyst udsættes for salt, sand, vind og temperaturskift — helt anderledes end et hus inde i landet. Vi bygger og renoverer med materialer og metoder der holder, også når huset står tomt i vinterhalvåret.",
    hero: "/images/service-sommerhus.jpg",
    sections: [
      {
        heading: "Kystmaterialer der holder",
        body: "Salt og vind tærer hurtigt på forkerte materialer. Ved kystbyggerier anbefaler vi typisk hårdtræ til terrasser, zink eller komposit i stedet for jern, og særligt modstandsdygtige malings- og træolie-typer. Beslag i syrefast stål. Utætheder fanges før de bliver til dyre skader.",
      },
      {
        heading: "Helårsisolering og vinterdrift",
        body: "Mange sommerhuse bruges i stigende grad hele året. Vi efterisolerer, tætner og installerer frostsikre vand- og afløbsløsninger. Og vi rådgiver om det der gør den største forskel: tætte vinduer, korrekt dampspærre og god ventilation.",
      },
      {
        heading: "Nyt sommerhus fra grunden",
        body: "For bygherrer der skal bygge nyt sommerhus, laver vi enten totalentreprise med egen arkitekt, eller hovedentreprise hvor du bringer din rådgiver. Vi har rutine med lokalplaner i Gilleleje, Tisvildeleje, Hornbæk og Rungsted.",
      },
    ],
    bullets: [
      "Kystmaterialer og syrefaste beslag",
      "Helårsisolering og tætningsarbejde",
      "Frostsikring af vand og afløb",
      "Ny terrasse, ny altan, ny udestue",
      "Dialog med lokalplan og kommune",
      "Vedligeholdelsesaftaler for sommerhusejere",
    ],
    faq: [
      { q: "Kan man bygge nyt sommerhus på en gammel grund?", a: "Ja, hvis lokalplanen tillader det. Vi tjekker altid lokalplan og byggelinjer før tilbud. I mange områder er der grænser for højde, tagform og farver." },
      { q: "Hvad koster renovering af sommerhus?", a: "Afhænger helt af omfang — men regn med 8.000-15.000 kr pr. m² for en grundig renovering med nye vinduer, efterisolering, køkken og bad." },
      { q: "Står I for vedligehold?", a: "Ja — vi tilbyder vedligeholdelsesaftaler for sommerhusejere, hvor vi kommer en eller to gange om året, gennemgår huset og udbedrer det der er nødvendigt." },
    ],
  },
  "doere-og-vinduer": {
    slug: "doere-og-vinduer",
    eyebrow: "Vinduer · Døre · Velux",
    h1: "Udskiftning af døre og vinduer",
    intro:
      "Vinduer er et af de steder huset taber mest energi — og et af de steder forkert montage skaber mest skade. Vi udskifter vinduer og døre med fokus på den tætte tilslutning, isoleringen rundt om karmen og den indvendige afslutning.",
    hero: "/images/service-vinduer.jpg",
    sections: [
      {
        heading: "Det der virkelig afgør energibesparelsen",
        body: "Mange fokuserer på U-værdien på selve vinduet — men den samlede energibesparelse afgøres mere af tilslutningen mellem karm og væg. Forkert monterede A-vinduer kan lække lige så meget som gamle termovinduer hvis tætningen ikke er korrekt. Vi bruger rigtig tid på isolering og dampspærre rundt om karmen.",
      },
      {
        heading: "Velux og ovenlys",
        body: "Ovenlysvinduer er et svagt punkt. Vi er specialiserede i Velux-montage med korrekt undertag, inddækning og indvendig afslutning. Det er her rigtig mange fugtskader opstår — lad være med at spare på det.",
      },
      {
        heading: "Døre — inkl. hoveddøre og terrassedøre",
        body: "En hoveddør skal være tæt, tyverisikker og pæn. Vi skifter hoveddøre, terrassedøre og skydedøre — og sørger for at tærsklen er tæt, dørkarmen er lodret, og at alt låsework fungerer.",
      },
    ],
    bullets: [
      "Korrekt tæt tilslutning (isolering + dampspærre)",
      "Velux og andre ovenlysvinduer",
      "Hoveddøre, terrassedøre og skydedøre",
      "Indvendig afslutning med lister og afhøvling",
      "Bortkørsel af gamle vinduer",
      "Hjælp til håndværkerfradrag og energitilskud",
    ],
    faq: [
      { q: "Hvor meget kan jeg spare på energien?", a: "Med skift fra gamle termovinduer til moderne A-vinduer kan man typisk spare 3.000-7.000 kr om året på varmeregningen i et almindeligt parcelhus — afhængig af vinduesareal og varmekilde." },
      { q: "Skal jeg vælge træ, træ-alu eller plast?", a: "Træ kræver vedligeholdelse men er smukt og reparérbart. Træ-alu er vedligeholdelsesfrit udvendigt men koster mere. Plast er billigst men har kortere levetid. Vi rådgiver gerne efter hvad der passer dit hus." },
      { q: "Hvor hurtigt kan I komme?", a: "Levering af vinduer tager typisk 4-8 uger. Selve montagen kan tit ske indenfor 1-2 uger efter levering." },
    ],
  },
  gipsvaeg: {
    slug: "gipsvaeg",
    eyebrow: "Gipsvæg · Skillevæg · Lyd",
    h1: "Gipsvægge og lette skillevægge",
    intro:
      "Gipsvægge er ofte den mest omkostningseffektive måde at ændre indretning på. Vi opsætter alt fra enkle skillevægge til lydisolerede vægge mellem lejligheder og tekniske vægge i erhvervsbyggerier.",
    hero: "/images/service-gipsvaeg.jpg",
    sections: [
      {
        heading: "Simpelt er sværere end det ser ud",
        body: "En gipsvæg ser simpel ud. Men lige linjer, ordentlig skruning, korrekt sammenstilling og pæn spartling er det der skiller en tømrers væg fra en gør-det-selv-væg. Vi sørger for at væggen er helt lige, at hjørnerne er pæne og at spartlingen er klar til maler.",
      },
      {
        heading: "Lyd- og brandisolerede vægge",
        body: "Lydisolation er en kombination af væggens opbygning (dobbelt gips, isolering, adskilt lægte), tilslutninger og detaljer ved dørkarme og stikkontakter. Til ejendomme og lejligheder udfører vi vægge efter BR18 lydkrav — ofte 52 dB eller højere.",
      },
      {
        heading: "Tekniske vægge",
        body: "Vægge der skal skjule rør, kabler eller installationer kræver en anden type opbygning. Vi laver tekniske skillevægge med serviceadgang, og tager koordinationen med VVS og el.",
      },
    ],
    bullets: [
      "Lette skillevægge i kontor og bolig",
      "Lydvægge (52+ dB) mellem lejligheder",
      "Brandisolerede skillevægge",
      "Tekniske vægge med installationer",
      "Spartling og afslutning til maler",
      "Oprydning og bortskaffelse",
    ],
    faq: [
      { q: "Hvad koster en gipsvæg pr. m²?", a: "For en enkel skillevæg i bolig ligger prisen typisk mellem 500-900 kr pr. m² inkl. materiale og arbejde. Lydvægge og tekniske vægge koster mere." },
      { q: "Leverer I også malerarbejdet?", a: "Vi afslutter væggen klar til maler (grundspartlet og fint spartlet). Selve malingen kan vi koordinere via vores netværk af malere." },
      { q: "Hvor lang tid tager det?", a: "En almindelig skillevæg i en stue kan laves på 1-2 dage inkl. spartling. Lydvægge og tekniske vægge tager længere." },
    ],
  },
  gulve: {
    slug: "gulve",
    eyebrow: "Gulv · Parket · Lamel",
    h1: "Nye gulve og gulvrenovering",
    intro:
      "Et gulv holder i 30-60 år hvis det bliver lagt rigtigt — og kun i 5-10 år hvis underlaget ikke er i orden. Vi lægger og slipper gulve i boliger, ejendomme og sommerhuse, med særlig omhu for det der ligger under.",
    hero: "/images/service-gulve.jpg",
    sections: [
      {
        heading: "Underlaget afgør resten",
        body: "Før vi lægger ét bræt, tjekker vi undergulvet: er det plant (max 2 mm/m), tørt (< 85% relativ fugt) og stabilt? Vi afretter hvor nødvendigt og lægger rette dampspærre og trinlyddæmpning. Et godt gulv er 80% forberedelse.",
      },
      {
        heading: "Parket, lamel og plankegulv",
        body: "Parketgulv giver klassisk kvalitet og kan slibes 4-5 gange gennem levetiden. Lamelgulv er billigere og lettere at lægge. Plankegulv (brede planker) giver det særlige, håndværksmæssige udtryk. Vi rådgiver efter budget og hvor meget slid gulvet skal tåle.",
      },
      {
        heading: "Slibning af gamle trægulve",
        body: "Gamle parketgulve og plankegulve kan slibes og olies frem for at skiftes. Det er både billigere og mere bæredygtigt. Vi laver korrekt slibning i 3 runder og afslutter med hårdvoksolie eller lak efter ønske.",
      },
    ],
    bullets: [
      "Parket, lamel og plankegulv",
      "Afretning af undergulv",
      "Slibning og oliering af gamle gulve",
      "Trinlyddæmpning i lejligheder",
      "Gulvvarme-kompatible løsninger",
      "Afslutning med sokler og overgange",
    ],
    faq: [
      { q: "Kan I lægge gulv ovenpå eksisterende gulv?", a: "Nogle gange — afhænger af eksisterende gulvs stand, højde og underlag. Vi tjekker altid først." },
      { q: "Hvilket gulv passer til gulvvarme?", a: "Laminat, lamelgulv og plankegulv i tørre, stabile træsorter som eg og ask. Parket i flere lag er også mulig. Vi vælger gulv der er godkendt til gulvvarme af producenten." },
      { q: "Hvor lang tid tager det?", a: "En stue kan typisk lægges på 1-2 dage. Slibning af eksisterende gulv tager 3-5 dage inkl. tørretid mellem olielag." },
    ],
  },
  byggeraadgivning: {
    slug: "byggeraadgivning",
    eyebrow: "Rådgivning · Bygherre · Ekspert",
    h1: "Byggerådgivning fra en tømrer med fingre i træet",
    intro:
      "De fleste byggesagkyndige har læst om byggeri. Vi har bygget. 30+ års erfaring fra rigtige byggepladser ser og vurderer noget helt andet end en ren teoretisk rådgiver — og det viser sig særligt når noget skal vurderes i praksis.",
    hero: "/images/service-raadgivning.jpg",
    sections: [
      {
        heading: "Hvad rådgivningen kan dække",
        body: "Vi gennemgår tilbud fra håndværkere og vurderer om omfang, materialer og priser er fair. Vi ser færdigt arbejde efter og identificerer skjulte problemer. Vi sidder med ved kontraktforhandling og hjælper dig stille de rigtige krav. I praksis er det rådgivning du ringer om når der er noget på spil.",
      },
      {
        heading: "Den klassiske: tilbudsgennemgang",
        body: "Det mest brugte er en gennemgang før du skriver under på et større tilbud. På et tilbud på 300.000 kr bør du vide præcist hvad der er med, hvad der er udenfor, og hvor de typiske skjulte priser ligger. Vi sammenligner med markedspris, peger på huller, og hjælper dig forhandle. Det koster typisk 4-8 timer i samlet honorar — og kan spare dig fem-cifrede beløb.",
      },
      {
        heading: "1- og 5-års eftersyn — gør det aldrig selv",
        body: "AB18 og ABT18 giver dig ret til formelle eftersyn. Det er der mange skjulte fejl bliver fundet, og det er det sted hvor entreprenøren stadig har et ansvar. Vi anbefaler altid at bruge en uvildig fagmand — ikke den entreprenør der selv udførte arbejdet. Vi laver grundig gennemgang og udleverer en skriftlig rapport.",
      },
      {
        heading: "Tilsyn under byggeriet",
        body: "På større byggeprojekter kan vi stå for kvalitetssikring og tilsyn på dine vegne. Det er ikke en heldagsrolle — typisk 2-4 timer om ugen på pladsen, hvor vi fanger problemer mens der stadig er tid til at fikse dem. Det betaler sig næsten altid.",
      },
    ],
    bullets: [
      "Tilbudsgennemgang og forhandling",
      "1- og 5-års bygningseftersyn",
      "Fejlsøgning og rapporter",
      "Tilsyn på bygherrens vegne",
      "Rådgivning om kontrakt og udbud",
      "Uvildig vurdering af håndværk",
    ],
    faq: [
      { q: "Hvad koster byggerådgivning?", a: "Timebaseret — typisk 1.200-1.600 kr i timen. En gennemgang af et hus og skriftlig rapport koster typisk 6.000-12.000 kr." },
      { q: "Er I autoriserede byggesagkyndige?", a: "Nej, vi er ikke autoriserede byggesagkyndige (tilstandsrapport-ordningen). Vi er håndværkere med 30+ års erfaring. For en formel tilstandsrapport henviser vi til en certificeret person." },
      { q: "Kan jeg få en second opinion på et tilbud?", a: "Ja. Send os tilbuddet og en kort beskrivelse, så giver vi feedback — typisk indenfor 3-5 arbejdsdage." },
    ],
  },
  fejlsoegning: {
    slug: "fejlsoegning",
    eyebrow: "Tilsyn · Fejlsøgning · Eftersyn",
    h1: "Fejlsøgning, tilsyn og 1-års gennemgang",
    intro:
      "Mistanke om fugt, skjulte fejl eller dårligt udført arbejde? Vi laver grundig fagmæssig gennemgang og skriftlig rapport — både under byggeriet og ved 1- og 5-års eftersyn, der er dine rettigheder som bygherre.",
    hero: "/images/detail-hand-wood.jpg",
    sections: [
      {
        heading: "Hvornår giver fejlsøgning mening?",
        body: "Ved mistanke om fugt, fejl i tag, dårligt udført tømrerarbejde eller problemer der er opstået kort efter aflevering. Ved overtagelse af et nyt hus eller sommerhus. Ved 1- og 5-års eftersyn som AB/ABT-reglerne giver bygherren ret til.",
      },
      {
        heading: "Sådan foregår en gennemgang",
        body: "Vi kommer ud og gennemgår bygningen systematisk — udvendigt, indvendigt, loft og kælder. Vi dokumenterer fund med fotos, noter og evt. fugtmålinger. Du modtager en skriftlig rapport der kan bruges overfor entreprenør, forsikring eller ejerforening.",
      },
      {
        heading: "1-års eftersyn er guld værd",
        body: "Både AB18 og ABT18 giver bygherren ret til et 1-års eftersyn. Det er det sted hvor mange skjulte fejl opdages mens entreprenøren stadig har ansvar. Vi anbefaler altid at få denne gennemgang lavet af en uvildig fagmand — ikke af den entreprenør der selv udførte arbejdet.",
      },
    ],
    bullets: [
      "Skriftlig rapport med fotos",
      "Fugtmålinger og visuel inspektion",
      "1- og 5-års bygningseftersyn",
      "Vurdering af færdigt arbejde",
      "Tilsyn under byggeriet",
      "Hjælp til klage-håndtering",
    ],
    faq: [
      { q: "Hvad koster en gennemgang?", a: "En grundig gennemgang af et enfamiliehus med skriftlig rapport koster typisk 6.000-12.000 kr afhængigt af omfang og kompleksitet." },
      { q: "Kan jeg bruge rapporten overfor entreprenøren?", a: "Ja — en fagmæssig rapport er typisk stærkt bevismateriale i en klage eller ved Byggeriets Ankenævn. Vi formulerer rapporten så den kan bruges formelt." },
      { q: "Dækker I alle huse?", a: "Ja — villa, rækkehus, sommerhus, lejlighed og mindre erhvervsejendomme. For meget store ejendomme henviser vi eventuelt til specialiseret rådgiver." },
    ],
  },
};
