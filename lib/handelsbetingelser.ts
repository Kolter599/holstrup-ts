/**
 * HANDELSBETINGELSER — teksten der forklarer hvad et tilbud fra Holstrup
 * dækker, og hvad der sker når virkeligheden under taget ser anderledes ud
 * end den gjorde på besigtigelsen.
 *
 * Pointen med hele siden er løftet i "Sådan gør vi": vi stopper, ringer, og
 * aftaler prisen inden vi laver arbejdet. Aldrig en overraskelse på
 * regningen. Den sætning beskytter Finn og beroliger kunden på én gang —
 * så den må ikke blødes op eller skrives om til jura.
 *
 * Pristabellerne på ydelses- og langformssiderne peger herind via
 * prisForbehold() i lib/priser.ts.
 */

export type BetingelserSection = {
  heading: string;
  body?: string[];
  items?: string[];
};

export const HANDELSBETINGELSER = {
  path: "/handelsbetingelser",
  eyebrow: "AFTALE · PRIS · TILLÆG",
  h1: "Handelsbetingelser",
  metaTitle: "Handelsbetingelser – hvad et tilbud dækker",
  metaDescription:
    "Hvad et tilbud fra Holstrup TS er baseret på, hvad der kan ændre prisen undervejs, og hvordan vi aftaler tillæg med dig inden vi laver arbejdet — aldrig bagefter.",
  intro:
    "Vi skriver det her i almindeligt dansk, fordi det er den del af en håndværkeraftale folk oftest bliver snydt på: hvad sker der, når der dukker noget op under taget som ingen kunne se på forhånd. Her står hvordan vi gør.",
  sections: [
    {
      heading: "Et tilbud bygger på det vi kunne se",
      body: [
        "Når vi giver dig en pris, er den baseret på det vi kunne se og måle på besigtigelsen, og på det vi aftalte skulle laves. Omfang, materialer og tidsplan står skriftligt i tilbuddet, så du og vi har den samme opgave i hovedet.",
        "Tilbuddet er gyldigt i 30 dage fra den dato der står på det. Siger du ja indenfor den periode, er prisen den vi har skrevet — med de forbehold der står herunder.",
        "Det er værd at sige ligeud: en tømrer kan ikke se gennem et tag eller et terrassedæk. Vi kan se stand, alder, konstruktion og adgang, og vi kan gætte kvalificeret på resten ud fra tredive års erfaring. Men det der ligger under overfladen, ser vi først når den er åbnet.",
      ],
    },
    {
      heading: "Priserne her på sitet er spænd, ikke tilbud",
      body: [
        "De priser du finder på siderne her, er spænd der viser hvad opgaver som din typisk lander på. De er der for at du kan regne med et niveau, inden du bruger tid på at ringe.",
        "Et tilbud er noget andet: det er ét tal, det er skriftligt, det gælder din opgave, og du får det først når Finn har været ude og se på det. Besigtigelsen er gratis og forpligter dig ikke til noget.",
      ],
    },
    {
      heading: "Det der kan ændre prisen undervejs",
      body: [
        "Der er fem ting der i praksis kan flytte en aftalt pris. Vi skriver dem her, fordi de ikke skal komme bag på nogen:",
      ],
      items: [
        "Råd eller skader der var skjult. Et mørt spær ved siden af ovenlyset, et undertag der smuldrer når man rører det, en bærende bjælke under terrassedækket der er gået. Det viser sig først når vi har åbnet.",
        "Et underlag der ikke kan bære. Fundament, spær eller terræn der ikke holder til det vi skal bygge ovenpå. Vi bygger ikke videre på noget der ikke kan bære — så skal det laves først.",
        "Materialepriser der flytter sig mellem tilbud og opstart. Træ, tagsten og vinduer svinger. Går der lang tid fra du siger ja til vi går i gang, kan en væsentlig prisstigning slå igennem.",
        "Vejr og leveringsforsinkelser. Frost, længere regnperioder eller en leverandør der ikke kan levere til tiden kan rykke tidsplanen. Det ændrer sjældent prisen, men det kan ændre datoerne.",
        "Ændringer du selv beder om undervejs. En anden træsort, et vindue mere, en bredere trappe. Det er helt i orden — det skal bare prissættes, inden vi laver det.",
      ],
    },
    {
      heading: "Sådan gør vi, når det sker",
      body: [
        "Vi stopper. Vi ringer eller viser dig det på stedet. Du får at vide hvad vi har fundet, hvad der skal laves ved det, og hvad det koster — og du får det på skrift som en aftaleseddel med et tal på.",
        "Først når du har sagt ja til den aftaleseddel, går vi videre med det ekstra arbejde. Siger du nej, laver vi det ikke, og så aftaler vi hvad der skal ske i stedet.",
        "Du får aldrig en regning på noget du ikke har sagt ja til først. Det er hele pointen med at have det stående her: ingen regninger der vokser mens man kigger på dem.",
      ],
    },
    {
      heading: "Hvis vi er uenige",
      body: [
        "Ring til Finn. Langt de fleste ting løser sig i telefonen samme dag, og vi vil hellere rette noget end have en utilfreds kunde i Frederikssund, hvor alle kender alle.",
        "Kontaktoplysninger står i bunden af alle sider. Du får fat i den samme person hele vejen igennem — ham der gav tilbuddet, og ham der har stået på taget.",
      ],
    },
  ] satisfies BetingelserSection[],
} as const;
