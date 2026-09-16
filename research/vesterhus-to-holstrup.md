# Fra Vesterhus til Holstrup

Udarbejdet 2026-09-16. Kilder: Vesterhus' egen Neon-database (`plain-math-62780574`, 30. aug – 15. sep 2026), Holstrups Neon-database (`rapid-pine-11232363`), begge kodebaser, ca. 90 Google Autocomplete-seeds (da/dk, to ekspansionsrunder) og 22 SERP-tjek med 13 konkurrentsider hentet og læst.

---

## 0. Det afgørende tal: 34 besøgende på 30 dage

Vercel Analytics, seneste 30 dage: **34 besøgende, 68 sidevisninger, 71 % bounce, −49 % mod forrige periode.**

| Side | Besøgende |
|---|---|
| `/` | 24 |
| `/kontakt` | 6 |
| `/ydelser` | 3 |
| `/admin-invisu/leads` | 2 ← Finn/Sebastian selv |
| `/admin-invisu/login` | 2 ← Finn/Sebastian selv |
| `/om` | 2 |
| `/projekter` | 2 |

| Kilde | Besøgende | | Land | Andel |
|---|---|---|---|---|
| google.com | 12 | | Danmark | 62 % ≈ 21 |
| chatgpt.com | 1 | | **Kina** | **18 % ≈ 6** (bots) |
| google.dk | 1 | | USA | 6 % ≈ 2 |
| (direkte/ukendt) | ~20 | | CH + DE | 6 % ≈ 2 |

**Fire ting følger af det, og de er vigtigere end alt andet i dokumentet:**

1. **32 af sitets 39 URL'er fik nul besøgende på 30 dage.** Alle 12 ydelsessider. Alle 20 bysider. Ikke én. Sitet rangerer reelt ikke for noget.
2. **Der er ~15–18 ægte danske besøgende om måneden.** 21 danskere minus Finns og Sebastians egne admin-besøg. Under én person om dagen.
3. **De 14 søgebesøg er næsten sikkert brandsøgninger** — folk der har hørt om Finn og googler "Holstrup tømrer". Non-brand organisk trafik er tæt på nul.
4. **Konverteringen er faktisk fin.** Ved samme tempo har sitet haft ca. 136 besøgende på fire måneder. Derfra kom 9 formularstarter (**6,6 %**) og 2 gennemførte (**1,5 %**). Det er pæne tal for en håndværkerside.

> ### Konklusionen, uden omsvøb
>
> **Holstrup har ikke et konverteringsproblem, et formularproblem eller et indholdsproblem. Sitet har ingen besøgende.**
>
> Siden konverterer omtrent, som den skal. Der er bare 17 mennesker om måneden at konvertere. Det gør hele SEO-delen af denne plan til en **anden**-prioritet: at bygge side nr. 40 og 41, når nr. 8 til 39 har nul besøgende, tilføjer nul.

**Hvad der skal til i tal.** Finn er én mand. 3–4 kvalificerede henvendelser om måneden holder kalenderen fuld. Ved den nuværende rate på 1,5 % kræver det **~270 besøgende om måneden — otte gange mere end i dag.** Der findes tre veje derhen, og SEO er den langsomste af dem. Se §4.

**Forbehold:** ved n=34 skal −49 %, 71 % bounce og landefordelingen ikke overfortolkes. Én person, der testede sitet flittigt i august, kan forklare hele "faldet". Det tal, der *er* robust, er antallet af sider med nul besøgende — og det er 32.

---

## 0b. Hvorfor Vesterhus-sammenligningen peger samme vej

**Vesterhus' resultat er ikke et SEO-resultat.**

55 % af alle besøg på vesterhus.dk kommer fra betalt Meta-trafik. Google organisk står for 221 af ca. 2.993 besøg — 7 % — og næsten alle lander på forsiden. De sider, der konverterer bedst, får stort set ingen organisk trafik overhovedet.

| Kilde (indgangsbesøg, 17 dage) | Besøg | Andel |
|---|---|---|
| Meta betalt (`utm_source=meta`/`ig`) | 1.688 | 56 % |
| Direkte | 813 | 27 % |
| Google organisk | 221 | 7 % |
| Meta organisk (referrer) | 161 | 5 % |
| chatgpt.com | 61 | 2 % |
| Alt andet (Bing, DDG, Tripadvisor, kulturkbh) | ~14 | <1 % |

Holstrup har 9 leads på fire måneder, hvoraf 2 er rigtige. Det er præcis, hvad en side uden trafikkilde ser ud som. Den mest sandsynlige forklaring på forskellen mellem de to sites er ikke sidernes kvalitet — det er, at den ene har en trafikmotor og den anden ikke har.

Det betyder ikke, at der ikke er noget at lære. Det betyder, at rækkefølgen er: **først lokal synlighed og målbarhed, så konverteringsmekanik, og SEO der hvor SERP'en faktisk er svag** — ikke SEO på de søgninger, der lyder størst.

---

## 1. Hvad Vesterhus rent faktisk beviser

Data: 3.791 sidevisninger, 2.993 besøg, 157 booking-klik, 18 arrangementsleads (167.775 kr i tilbud, 26.900 kr bekræftet) over 17 dage.

### 1.1 Intent-specifikke sider konverterer 10–30× bedre end generiske sider

Det stærkeste og mest overførbare fund i hele datasættet.

| Landingsside | Indgange | Booking-klik | Rate |
|---|---|---|---|
| `/firmaarrangement-koebenhavn` | 56 | 17 | **30,4 %** |
| `/private-arrangementer` | 183 | 55 | **30,1 %** |
| `/vinsmagning-koebenhavn` | 32 | 8 | **25,0 %** |
| `/firmajulefrokost-koebenhavn` | 27 | 6 | **22,2 %** |
| `/julefrokost-koebenhavn` | 106 | 12 | 11,3 % |
| `/foedselsdag-lokale-koebenhavn` | 63 | 5 | 7,9 % |
| `/` (forsiden) | 526 | 17 | 3,2 % |
| `/events` (kalenderen) | 530 | 6 | **1,1 %** |

`/events` er sitets mest besøgte side og dets dårligst konverterende. Den trækker trafik; den sælger ingenting. Forsiden er næsten lige så dårlig. De sider, der bærer forretningen, er dem, der matcher **én bestemt opgave ét bestemt sted**.

Det er nøjagtig den samme sidetype, som vinder i håndværker-SERP'en: ydelse × by. Se §3.

### 1.2 Formularen står højt på siden, ikke i bunden

Vesterhus' egen kodekommentar i `views/EventPageView.tsx`:

> *"Formularen står højt oppe og på det mørke bånd. Den er sidens vigtigste handling, og stod før nederst under alle afsnittene .. der skulle man scrolle forbi hele siden for at kunne spørge om en dato."*

Fire dele, alle gratis at kopiere:
1. Formularen ligger **over** brødteksten.
2. Den står på et **mørkt bånd** — det ene sted øjet standser på en ellers lys side.
3. Over den står ét løfte om svartid: *"Vi svarer som regel samme dag, med et forslag og en pris."* Ikke en salgstekst.
4. Nederst er der **ikke** endnu en formular, men et anker-link tilbage op (`#foresp`) plus en fast bundbjælke på mobil, der peger samme sted hen.

### 1.3 Priser står som tal i statisk HTML

Julefrokostsiden har en rigtig `<table>` med pris pr. gæsteantal. Kodekommentaren forklarer hvorfor det ikke er en beregner:

> *"Google læser en tabel og kan vise tallene i søgeresultatet; en pris der først findes når nogen har klikket, findes ikke for en søgemaskine."*

Under tabellen står, hvad der **ikke** kommer oveni (ingen lokaleleje, intet servicetillæg). Det er den halvdel, folk er bange for.

**Dette er også det, der afgør håndværker-SERP'en.** Konkurrentanalysen i §3 viser det samme mønster fra en helt anden branche: portalerne skriver "8.000–25.000 kr. afhængigt af mange faktorer", og den tømrer der ligger nr. 1 skriver "19.500 kr."

### 1.4 Sider om samme emne er bundet sammen som en klynge

De fire december-sider linker til hinanden med **beskrivende** links — "Julefrokost .. sådan foregår den", "Priser pr. person" — i stedet for at drukne i en fælles fodliste. En tæt sammenknyttet gruppe sider om ét emne læses som ét stærkt signal frem for fire løsrevne.

### 1.5 Alt måles førstepart, og leads følges til kroner

Vesterhus logger selv `page_views`, `site_events` (booking-klik, rutevejledning, nyhedsbrev), `booking_clicks` med landingsside og UTM, og `event_leads` med stadie og værdi: `ny → tilbud_sendt → booket → afholdt / tabt`, med `quoted_value`, `confirmed_value`, `realised_value`.

Det er derfor tabellerne ovenfor overhovedet kan laves. Uden dem havde Vesterhus haft præcis den blindhed, Holstrup har i dag.

### 1.6 Schema og hastighed er *hygiejne*, ikke årsag

Begge sites svarer på ~0,28 s TTFB og har korrekt FAQPage + BreadcrumbList. Holstrup har **mere** schema end Vesterhus (Service, Organization, FAQPage, BreadcrumbList). Forskellen ligger ikke her. Brug ikke tid på det.

Værd at bemærke: **ingen af de 13 hentede konkurrentsider havde synligt FAQ- eller Review-schema.** Holstrup er allerede foran på det punkt.

### 1.7 Hvad der bare er *til stede* og ikke forklarer noget

- **Nyhedsbrev:** 12 tilmeldinger på 17 dage. Marginal. Kopiér det ikke.
- **Event-kalenderen:** højeste trafik, laveste konvertering. En indholdsmotor for Meta-annoncer, ikke en salgskanal.
- **`/vin`, `/mad`, `/drikkevarer`:** lang læsetid (47–84 sek.) og 0 booking-klik. Bygger tillid, men kan ikke tilskrives en eneste konvertering.
- **De engelske sider** konverterer 5–20× dårligere end de danske søstersider (`/en/private-events` 1,6 % mod `/private-arrangementer` 30,1 %). **Det er sandsynligvis ikke sidens skyld** — det er højst sandsynligt en bredere annoncemålgruppe med lavere intent. Må ikke bruges som bevis for noget om sidedesign.

### 1.8 Forbehold ved datasættet

- **17 dage.** Ikke et år, ikke en sæsoncyklus.
- **Skæv sæson:** julefrokost-salget topper netop nu og puster de sider op.
- **n=18 på leads.** Retningsgivende, ikke statistik.
- `booking_clicks` har ingen `visit`-kolonne, så konverteringsraterne er *indgang-baserede*, ikke ægte session-sporede. Rangordenen er robust; procenterne er det ikke.

---

## 2. Gap-analyse: Holstrup i dag

### 2.1 Hvad de 9 leads faktisk siger

| Dato | Ydelse | By | Ægte? |
|---|---|---|---|
| 13. maj | (ingen) | — | nej (afbrudt) |
| 13. maj | Nyt tag | Frederiksberg | nej (afbrudt) |
| 5. juni | Nyt tag | — | nej (afbrudt) |
| 22. juni | Tilbygning / udestue | — | nej (afbrudt) |
| 9. aug | Nyt tag | Hørsholm | nej (afbrudt) |
| **9. aug** | **Nyt tag** | **Hørsholm** | **ja** — tagrenovering på parcelhus, tilstandsrapport |
| 12. aug | Renovering | Frederikssund | nej (afbrudt) |
| 23. aug | Nyt tag | — | nej (afbrudt) |
| **7. sep** | **Vinduer & døre** | **Hillerød** | **ja** — udskiftning af 4 VELUX ovenlys |

1. **Tag er den dominerende udtrykte efterspørgsel** — 5 af 9. Matcher ejerens prioritering.
2. **VELUX er den seneste ægte henvendelse**, og den er konkret. Signal værd at handle på.
3. **Terrasser og gulve har produceret nul henvendelser.** Men se §3.3 — for terrasser er det et *trafik*problem, ikke et efterspørgselsproblem, og det er en vigtig skelnen.

7 af 9 er afbrudte delformularer. Det er dog **ikke** et argument for at røre formularen — den er netop bygget om af en anden agent.

### 2.2 De tre største huller

**Hul 1 — der findes ingen ydelse × by-sider, og det er præcis den sidetype der vinder.**

Dette er det største enkeltfund i hele researchen. Holstrup har `/ydelser/traeterrasse` og `/tomrer-frederikssund`, men ingen `/traeterrasse-frederikssund`. **Hver eneste konkurrent, der rangerer på de søgninger, der giver leads, har krydset mellem ydelse og by.**

Og strukturen virker allerede: **Holstrup ligger nr. 3 på en Egedal-forespørgsel med `/tomrer-stenloese`.** Fundamentet er på plads — det er krydset, der mangler.

**Hul 2 — der er ingen Google Business Profile og nul anmeldelser.**

- `SITE.googleBusinessUrl` er tom streng i `lib/site.ts`.
- `REVIEWS` er tom og `REVIEW_AGGREGATE` er `null`. `Reviews`-komponenten er bygget, ligger allerede på forside, ydelsessider og bysider, og renderer ingenting. Kodekommentaren siger det selv: *"Alle konkurrenter der ligger på side 1 for 'tømrer [by]' viser stjerner eller anmeldelsestal. Holstrup viser i dag ingenting. Det er den største enkeltstående forskel."*
- Håndværker.dk-profilen er tom ("Ikke medlem"), uden anmeldelser og ydelser — og oplyser **et andet telefonnummer** (7022 8014) end sitet (40 17 38 93). NAP-uoverensstemmelse trækker direkte ned i lokal placering.

For en lokal håndværker er kortpakken normalt den største enkeltkanal. Den findes ikke.

**Hul 3 — ingen trafikkilde, og ingen måde at se det på.**

GA4 (`G-NQ50M9DX8L`) ligger bag en cookie-mur, der kun tæller besøgende, som trykker "tillad alle". Der findes ingen førsteparts `page_views`-tabel. Alle 9 leads har holstrup-ts.dk som referrer, dvs. intern — **ingen registreret ekstern kilde til en eneste henvendelse.** Ingen kan i dag svare på, hvor mange der besøger sitet, hvilke sider de ser, eller hvor de kommer fra.

### 2.3 Er bysiderne tynde, og skal der konsolideres frem for multipliceres?

**Ja på begge — men mere nuanceret, end det så ud før SERP-tjekket.**

`lib/city-content.ts` → `buildCityContent()` bygger alle 20 bysiders fire afsnit ud af 3–4 faste sætningspuljer, valgt med en hash af bynavnet. Processafsnittet er **ordret identisk** på tværs af alle byer på nær bynavnet.

Målestokken er nu konkret. Konkurrenterne, der rangerer, ser sådan her ud:
- `bb-tagentreprise.dk/tagrenovering-frederikssund` — ~2.200 ord, otte H2'er, "trin for trin" i fire faser, fire-spørgsmåls-FAQ.
- `tomrernordsjaelland.dk/nyt-tag-pris-frederikssund` — ~2.200 ord, rigtig pristabel (1.400/2.300/3.200 kr/m²), afsnit om *"Lokale forhold i Frederikssund"*.
- `tb-byg.dk/traeterrasse-frederikssund` — ~800–900 ord, ingen pris, ingen FAQ, ingen anmeldelser. **Den lave barre.**

En hash-genereret variation slår ikke 2.200 ord med ægte lokalt indhold. Men den slår godt nok en 800-ords side uden pris.

**Konkret anbefaling:**

- **Skriv 5–6 bysider i hånden:** Frederikssund, Stenløse, Ølstykke, Slangerup, Jyllinge, Hillerød. Kriteriet er, om Finn kan lægge et rigtigt jobbillede og en rigtig sætning om en rigtig opgave på siden.
- **Fjern kystbyerne** — Rungsted, Skodsborg, Vedbæk, Humlebæk, Hornbæk, Tisvildeleje, Gilleleje, Helsingør. 45–60 minutters kørsel, nul leads, og teksterne om "syrefaste beslag" og "smalle indkørsler i Rungsted" er skrevet af en generator. 301 til `/omraader`.
- **Behold generatoren på de resterende mellembyer** (Allerød, Farum, Værløse, Birkerød, Lynge, Jørlunde) — de koster ingenting at have stående og er ikke skadelige, så længe de ikke er sitets hovedindsats.
- **Byg ydelse × by-sider — men kun 8–10 stykker, ikke 240.** Se §4. Det er ikke i modstrid med "seks sider der fortjener at ranke": det er præcis de sider, der fortjener det, fordi SERP'en for dem er svag og dokumenteret.
- **Skru `areaServed` ned** fra 40 `City`-objekter til det reelle serviceområde. Vesterhus udsender 1.

---

## 3. SERP-virkeligheden for de fire ydelser

### 3.1 Metode

Volumen er **bånd, ikke tal** — samme metode som `RE 69 - Autocamper/research/seo-sidekort.md` §1:

| Bånd | Estimat/md (DK) | Signal |
|---|---|---|
| **Høj** | > 1.000 | Hovedseed med 10 fulde autocomplete-forslag, egne kategorisider hos portaler, annoncører |
| **Mellem** | 200–1.000 | Forslag under 2+ seeds, mindst én konkurrent med dedikeret side |
| **Lav** | 50–200 | Ét autocomplete-forslag, SERP domineret af generiske sider |
| **Longtail** | < 50 | Kun i ekspansionsrunde 2, eller logisk afledt uden autocomplete |

**SERP-sværhed 1–5:** 1 = ingen dedikerede sider · 3 = små lokale firmaer/guides · 5 = leadportaler/beregnerdomæner + nationale kæder.

Grundlag: ca. 90 autocomplete-seeds, 22 SERP-tjek, 13 konkurrentsider hentet. **Forbehold:** sessionens søgebudget løb tør ved 22 tjek. Uverificeret: VELUX × Roskilde/Ballerup/Hørsholm som selvstændige SERP'er, og "nyt trægulv/gulvlægger" lokalt. WebFetch stripper JSON-LD, så "ingen schema" betyder *ikke synlig i renderet indhold*, ikke bevist fraværende.

---

### 3.2 VELUX / ovenlys — bedste risikojusterede mulighed

| # | Keyword | Intent | Bånd | Svær | Hvorfor | Mål-URL |
|---|---|---|---|---|---|---|
| 1 | udskiftning af velux vindue pris | M | Mellem | **3** | 10 fulde forslag. SERP toppes af **lokale tømrere**: buschardt-byg #1, toemrerarenstorff #3 | `/velux-udskiftning-pris` |
| 2 | velux vinduer nordsjælland | L+M | Lav | **2** | Buschardt ranker #1 med **én side på 1.300 ord**. Lav volumen, varm køber, ingen portalmur | `/ydelser/velux-ovenlysvinduer` |
| 3 | velux montering pris | M | Lav-Mellem | 3 | 4 forslag; samme SERP-profil | samme |
| 4 | **velux montering frederikssund** | L+M | Longtail | **1** | SERP indeholder **ingen Frederikssund-virksomhed overhovedet** — kun velux.dk's guider, et gør-det-selv-forum, og tømrere fra Fredensborg/Holbæk/Fredericia. **Tom stol** | `/velux-frederikssund` |
| 5 | velux montering uden undertag | I | Lav | **1** | Fuldt forslag. Montagefejl-søgning; kun VELUX' PDF'er og fora svarer | afsnit på hovedside |
| 6 | velux montering tagpap | I | Lav | **1** | Fuldt forslag; konkret montageproblem | afsnit |
| 7 | nyt velux vindue pris | M | Mellem | 3 | Fuldt forslag | `/velux-udskiftning-pris` |
| 8 | velux tvilling / dobbelt vindue pris | M | Longtail | 2 | To fulde forslag. Store partier = store ordrer | prisside |
| 9 | velux montering hillerød | L+M | Longtail | **3** | SERP befolket: JLH Tømrer, BM Tømrer, Peter Nielsen & Søn (50 år), Lind-Birkedal ("Årets Tømrer 2023") | `/velux-hilleroed` |
| 10 | hvad koster et velux vindue | I→M | **Mellem** | **5** | 8 fulde forslag = stærkeste money-cluster. **Men SERP 100 % prisportaler** (tagviden, byggeli, byggefokus, mit-byggeri, viden-om-vinduer) | skriv stoffet, **jag ikke placeringen** |
| 11 | ovenlysvindue pris | I/M | Mellem | **5** | 8 forslag; SERP 100 % tag-portaler | drop |
| 12 | velux service | I | Mellem | 5 | VELUX' egen supportintention, ikke købsintention | drop |
| 13 | **velux montør** | M | Longtail | 1 | **"velux montør" = 1 forslag. "velux certificeret montør" = 0. "velux anbefalet montør" = 0.** Danskerne søger "tømrer" eller "velux montering" | **byg ikke sider på ordet "montør"** |

**Hvem vinder:** to helt adskilte lag. De nationale prissøgninger er ejet af lead-portaler og er tabt på forhånd. Men **"tømrer + velux + område" er ejet af små lokale tømrerfirmaer** — og barren er lav.

**Konkurrent-teardowns:**
- **buschardt-byg.dk/velux/** (Fredensborg) — **#1**, kun 1.200–1.400 ord. Det, der bærer den: **fire faste priser i kroner** — 19.500 kr. (udskiftning i eksisterende hul), 29.500 kr. (nyt hul), 39.500 kr. (nyt ovenlys), 44.500 kr. (fladt tag) — egne projektfotos, én kundeudtalelse, Byg Garanti-mærke. **Ingen FAQ.**
- **toemrerarenstorff.dk** (Ballerup) — 3.500 ord, prisintervaller, scenarietabel, egne infografikker, checkliste. Ranker nationalt.
- **klyverbyg.dk** (Holbæk) — 1.300 ord, tre prisexempler, to cases med totalpris (102.000 / 88.000 kr.), **før/efter-fotos fra Birkerød og Fredensborg**, ejerportræt, **"VELUX Dagslysrådgiver"-badge i footeren**.

**Vinderformlen er ét konkret kronebeløb.** Portalerne skriver "8.000–25.000 kr. afhængigt af faktorer". Buschardt skriver "19.500 kr." Det er hele differentieringen.

**Og det vigtigste fund i hele opgaven:**

> ### VELUX Dagslysrådgiver — gratis, og hurtigere end at ranke
>
> VELUX Danmark driver et montørnetværk, **"VELUX Dagslysrådgiver"**:
> - Forbrugeren udfylder en formular på velux.dk med fire projekttyper (udskifte ovenlys, nyt ovenlys, gardiner, renovere loftsrum), og **forespørgslen fordeles automatisk til en lokal dagslysrådgiver.**
> - Dertil et **kortbaseret montørkatalog** ("Søg på kort").
> - **Kravet er ét gratis dagslyskursus** via VELUX Academy (fysisk eller online). **Ingen forretningsaftale** — man forbliver selvstændig.
> - Separat: **VELUX Partnerprogram**, også gratis, giver **Håndværkerbonus** året rundt på ovenlys, gardiner og solafskærmning.
>
> Finns 30+ års VELUX-erfaring gør kurset til en formalitet. Og velux.dk's egen find-en-tømrer-side **ranker selv #2** på "velux montering hillerød tømrer" — at komme i kataloget er at komme ind i et side 1-resultat uden selv at skulle ranke for det.
>
> **Advarsel:** VELUX følger op pr. mail efter få dage og spørger, om kunden er kontaktet. Er han ikke det, **går leadet videre til en anden i netværket.** Hård SLA. Skal ind i en fast rutine, ellers er tilmeldingen værdiløs.

---

### 3.3 Terrasser — korrektion: væsentligt mere vindbart end forventet

**Jeg tog fejl i første gennemgang.** Autocomplete alene pegede på gør-det-selv og fliser og fik mig til at nedprioritere terrasser. SERP-tjekket viser noget andet: **lead-portalerne er stort set fraværende på terrasse**, konkurrenterne er tynde, og Holstrups eksisterende side er allerede bedre end det, der rangerer.

| # | Keyword | Intent | Bånd | Svær | Hvorfor | Mål-URL |
|---|---|---|---|---|---|---|
| 1 | træterrasse | M | Mellem | **3** | 10 fulde forslag (`opbygning`, `brædder`, `fundament`). **SERP = lokale tømrerfirmaer, ikke portaler** | `/ydelser/traeterrasse` (findes) |
| 2 | træterrasse pris / terrasse pris pr m2 | M | Mellem | 4 | SERP er prissider (byggeberegneren, bygekspert, boligmesteren). **Ingen lokal tømrer på side 1** — plads at tage | `/ydelser/traeterrasse/pris` |
| 3 | **hævet terrasse** | I→M | Mellem | **3** | 10 fulde forslag, alle regeltunge: `konstruktion`, `byggetilladelse`, `br18`, `afstand til skel`, `bebyggelsesprocent`. SERP: generalistguides (handyhand, nordingenioer, byggeuniverset) — **ingen tømrer med faglighed** | `/ydelser/traeterrasse/haevet-terrasse` |
| 4 | hævet terrasse byggetilladelse / afstand til skel | I | Lav | 3 | BR18 § 179-stof (30 cm, 2,5 m til skel) | sektion samme side |
| 5 | overdækket terrasse (pris) | M | Mellem | 3 | 10 fulde forslag (`tag`, `mod mur`, `med glastag`). **Krydsfeltet terrasse × tag = Holstrups hjemmebane** | `/ydelser/traeterrasse/overdaekket` |
| 6 | **terrasse frederikssund** | L/M | Longtail | **2** | Nul autocomplete. **Kun tb-byg har dedikeret side — 800 ord, ingen pris, ingen FAQ** | `/traeterrasse-frederikssund` |
| 7 | terrasse stenløse / ølstykke / slangerup / jyllinge | L/M | Longtail | **1-2** | SERP tynd (brosboelbyg, ML Byg, Sz Company, Vejbo=murer) + kataloger. **Holstrup ligger allerede nr. 3** | `/traeterrasse-<by>` |
| 8 | træterrasse hillerød | L/M | Longtail | 3 | 8 firmaer med dedikerede sider (kun-terrasser, th3byg, bjørnskov, jatobyg m.fl.) | `/traeterrasse-hilleroed` |
| 9 | trædæk til varmepumpe / udebruser / pool / altan | M | Longtail | **1-2** | Alle fire er faktiske forslag under `trædæk`. **Ingen konkurrent har en side om nogen af dem** | ét blogindlæg pr. stk. |
| 10 | komposit terrasse ulemper | I | Lav | 2 | Eneste ikke-retail forslag i klyngen. Ingen håndværker svarer ærligt | blogindlæg |
| 11 | komposit terrasse / terrasse (bar) | retail | Høj | 5 | 8 af 10 forslag er forhandlere (jem og fix, bauhaus, stark, silvan). Varegruppe, ikke ydelse | **undlad** |
| 12 | ny terrasse fliser / terrassedør | — | Høj | 5 | Forkert fag (murer / vinduesleverandør) | **undlad** |
| 13 | **terrassebygger** | — | — | — | **Nul forslag. Ordet bruges ikke på dansk** | **byg ikke side på det** |

**Hvem vinder:** næsten udelukkende **rigtige lokale tømrerfirmaer** med dedikerede by-sider. 3byggetilbud dukkede op **én gang i hele researchen** — på *brolæggere*, ikke tømrer. Ageras, Byggetilbud.dk og Servicebutikken optrådte slet ikke. Eneste ikke-firma-resultater er kataloger (krak.dk, bedstetoemrer.dk) og guides på prisforespørgslerne.

Én hybrid at holde øje med: **terrasse.nu** (TerrasseNu ApS, Kgs. Lyngby) — programmatisk med 12+ bysider à ~2.500 ord, priser (1.200–1.400 kr/m² thermowood), billeder og 8-punkts FAQ. Skarpeste side i feltet.

**Barren:** `tb-byg.dk/traeterrasse-frederikssund` er ~800–900 ord med H1 "Træterrasse i Frederikssund" og fem egne billeder. **Ingen priser. Ingen FAQ. Ingen anmeldelser.** Holstrups `/ydelser/traeterrasse` har allerede FAQ *og* prisinterval (1.800–3.500 kr/m²) — den er bedre end det, der rangerer. Den mangler bare et bynavn i en H1.

---

### 3.4 Tage — korrektion: den sværeste, ikke den nemmeste

Tag er den ydelse med mest efterspørgsel og de fleste leads, og **den er også den dyreste at vinde organisk.** Det ændrer, hvad der skal bygges.

| # | Keyword | Intent | Bånd | Svær | Hvorfor | Mål-URL |
|---|---|---|---|---|---|---|
| 1 | tagrenovering | M | Høj | 5 | 10 fulde forslag, 7 geo-modifiers. Programmatiske spillere med 40–60 bysider hver | `/ydelser/tagrenovering` (findes) |
| 2 | nyt tag | M | Høj | 5 | 10 fulde forslag | samme |
| 3 | **nyt tag pris / hvad koster et nyt tag** | M | Høj | **5** | **SERP 100 % beregnere/prisportaler:** nytagpris.dk, compara.dk, haandvaerkpriser.dk, overlev.dk, tag-priser.dk, tagberegneren.dk (2 URL'er), prisberegner.dk, nyt-tag.com, tagtjek.dk. **Ti domæner hvis forretning *er* den forespørgsel** | **opgiv helt** |
| 4 | udskiftning af tagrender / tagsten / tagplader / tagpap / taghætte | M | Lav | **2-3** | Alle fem er egne forslag. **Komponent-niveau er hvor longtailen ligger, og hvor prissiderne er tyndest.** Reparation bliver til renovering | én underside pr. komponent |
| 5 | tagrenovering / nyt tag nordsjælland | M | Lav | 3 | Begge er selvstændige forslag. Adamson Byg og Poul Hvitved ejer regionssiderne | regionalt afsnit på tagsiden |
| 6 | nyt tag ovenpå asbesttag | I→M | Longtail-Lav | **2** | 4 forslag, alle lovlighedsspørgsmål (`må man…`, `er det lovligt…`). Høj intent, ingen lokal tømrer svarer | blogindlæg |
| 7 | nyt tag og undertag pris | M | Longtail | 3 | Undertaget afgør prisen — den ærlige samtale, beregnerne ikke tager | sektion på tagsiden |
| 8 | nyt tag med solceller | M | Lav | 3 | 3 forslag. Intet nordsjællandsk firma har en side | blogindlæg |
| 9 | tagrenovering frederikssund | L/M | Longtail | **4** | Nul autocomplete, men 7+ dedikerede sider. **Ca. halvdelen af side 1 er lead-gen** (firma.tagrenovering.dk, faa3tilbud.dk, stecksfliserens.dk) | `/tagrenovering-frederikssund` |
| 10 | tagrenovering stenløse / ølstykke / slangerup | L/M | Longtail | **2** | **Egedal er ikke dækket af nogen tagspiller med lokal forankring** | `/tagrenovering-<by>` |
| 11 | tagrenovering hillerød | L/M | Longtail | 4 | 9 resultater, alle dedikerede, heraf to *hjemmehørende* i Hillerød (Willerup, BB Tagentreprise) | senere bølge |
| 12 | **tagarbejde** | I/B2B | Lav | 2 | Forslag: `bfa`, `arbejdstilsynet`, `stillads`, `faldsikring`, `regler`. **Arbejdsmiljøsøgninger fra branchen, ikke kunder** | **brug det ikke som målsøgeord** |
| 13 | **tag pris** | — | — | — | Forslag: `tag pristine 10`, `bubble mew`, `gem mint`, `pokemon`. **Kapret af Pokémon-kortgradering** | **undlad som skrevet** |
| 14 | tagudskiftning | M | Lav | 3 | Kun 7 forslag, tre er støj (`på japansk`, `for seniorer`, `gratis tagudskiftning` = tilskudsjagt) | synonym i tekst, ikke egen side |

**Hvem vinder — tre lag:** (1) programmatiske tag-spillere med hundredvis af bysider (nyt-tag.com havde *to* resultater på samme SERP, nyt-tag.nu, dansktagkompagni.dk, hvad-koster-et-nyt-tag.dk); (2) lead-portaler og beregnerdomæner; (3) rigtige lokale firmaer (BB Tagentreprise, Adamson Byg, Willerup, Wiggenfeldt, Chr. Sønner).

**Barren er markant højere end på terrasse:**
- `bb-tagentreprise.dk/tagrenovering-frederikssund` — ~2.200 ord, otte H2'er, "trin for trin" i fire faser, 4-spørgsmåls-FAQ, **~40 bysider**. Ingen priser.
- `tomrernordsjaelland.dk/nyt-tag-pris-frederikssund` — ~2.200 ord, **rigtig pristabel** (1.400/2.300/3.200 kr/m², timepris 525–625 kr, håndværkerfradrag 8.600 kr/person), 6-spørgsmåls-FAQ, afsnit om lokale forhold. **Ingen egne billeder** — dens svaghed.
- `adamsonbyg.dk/tagarbejde-hilleroed` — ~850 ord, før/efter-billedpar uden projektbeskrivelser, **ingen FAQ, ingen priser**, 60+ kommunesider.

**Mønsteret:** enten *mange ord + pris + FAQ uden billeder*, eller *billeder uden pris og FAQ*. **Ingen har begge dele.** Det er åbningen — men den er dyrere at gå efter end terrasse.

---

### 3.5 Gulve — bekræftet håbløst, drop det som SEO-mål

| # | Keyword | Intent | Bånd | Svær | Hvorfor | Mål-URL |
|---|---|---|---|---|---|---|
| 1 | gulvafslibning | M | Høj | **5** | 10 fulde forslag. **SERP: 9/9 specialistkæder** | **drop** |
| 2 | gulvafslibning frederikssund | M+L | Lav | **5** | **9 ud af 9 organiske er dedikerede `/gulvafslibning-frederikssund/`-sider fra ni forskellige kæder.** Værste volumen/konkurrence-forhold i hele undersøgelsen | drop |
| 3 | gulvafslibning hillerød | M+L | Lav-Mellem | **5** | Står i den *nationale* autocomplete-base (plads 7) = højeste lokale efterspørgsel. Men igen 9/9 specialistkæder | drop |
| 4 | gulvafslibning nordsjælland / pris / pr m2 | M | Lav-Mellem | 4-5 | Specialisternes kernesider + prisberegnere | drop |
| 5 | **nyt trægulv pris / nye gulve / lægge nyt gulv** | M | **Lav** | **3** | Ikke ejet af slibekæderne — det er **lægning**, ikke slibning, og ægte tømrerarbejde | ét afsnit på `/ydelser/gulve` |
| 6 | **gulvsliber** | DIY | Mellem | — | 10 forslag: **leje, pris, silvan, leje bauhaus, leje xl byg, køb.** "Gulvsliber" er en **maskine** på dansk, ikke en person | **fælde** |
| 7 | **gulvlægger** | job | Mellem | — | 10 forslag: **løn, uddannelse, værktøj, job, knæpuder, stol.** Jobsøgende og lærlinge | **fælde** |
| 8 | parketgulv / plankegulv | retail | Høj | 5 | 10 forslag hver: bauhaus, jem og fix, tilbud, restparti. De vil købe *materiale* | **fælde** |

**Dommen: utvetydigt håbløst.** **18 ud af 18 organiske resultater over to uafhængige by-SERP'er var gulvkæder. Nul tømrere.** Frederikssund: gulvkanonen, dbf-gulvservice, profgulve, ncgulve, gulvfirmaet-lykkebo, davids-gulvafslibning, nikma-gs, nordicgulv, kildegaardgulve. Hillerød: gulvkanonen, dingulvmand, danekilde, nikma-gs, nordicgulv, ncgulve, gulvfirmaet-lykkebo, dansk-gulv. De samme domæner går igen på tværs af begge byer = national bydækning.

`gulvkanonen.dk/gulvafslibning/frederikssund/` er 2.500–3.000 ord **per by**, med FAQ, navngivne 5-stjernede udtalelser, teamprofiler og galleri.

**Og værre: markedet afgøres ikke på placering.** Autocomplete for "gulvafslibning københavn" returnerer *trustpilot*, *anmeldelser*, *bedst bedømte*, **"nc gulve anmeldelser"**, **"m & t gulvservice anmeldelser"**. Forbrugerne søger på navngivne konkurrenters brand + anmeldelser. Selv en perfekt placering lander på en side uden Trustpilot-historik i en kategori, hvor køberen eksplicit leder efter anmeldelser.

Behold gulve som ydelse til eksisterende tag- og VELUX-kunder. Byg ingen sider til det.

---

### 3.6 By × ydelse: hvad er reelt vindbart

| Kombination | Dom | Begrundelse |
|---|---|---|
| **Egedal (Stenløse/Ølstykke/Slangerup/Jyllinge) × terrasse** | **Vindbart nu** | Tynd SERP (brosboelbyg, ML Byg, Sz Company, Vejbo=murer) + kataloger. **Holstrup ligger allerede nr. 3.** Nul autocomplete = ingen har gidet lave sider |
| **Egedal × tag** | **Vindbart nu** | Ingen tagspiller med lokal forankring i Egedal |
| **Frederikssund × VELUX** | **Bedste odds i hele materialet** | **Ingen Frederikssund-virksomhed i SERP'en overhovedet.** De der ranker er fra Fredensborg, Holbæk, Ballerup, Fredericia |
| **Frederikssund × terrasse** | **Vindbart** | Hjemby. Kun tb-byg har dedikeret side — 800 ord, ingen pris, ingen FAQ |
| **Frederikssund × tag** | **Side 1 muligt, top 3 svært** | 7+ dedikerede sider; ca. halvdelen af side 1 er lead-gen |
| **Hørsholm / Birkerød × VELUX** | **Vindbart** | Klyverbyg viser Birkerød-cases, men sidder i Holbæk — ingen lokal adresse. Klart hul |
| Allerød / Farum / Værløse × terrasse | **Vindbart** | Ingen dedikerede terrasse×by-sider fundet |
| Allerød / Farum / Værløse × tag | Middel | Alca-Gruppen (30+ år, Værløse), Bjørklund, Løvenkrands, Poul Hvitved |
| Småbyerne × VELUX | Trivielt vindbart, ~ingen volumen | **Én samlet side med bylisten — ikke seks sider** |
| **Hillerød × VELUX** | Vindbart, kræver arbejde | JLH, BM Tømrer, Peter Nielsen & Søn (50 år), Lind-Birkedal |
| Hillerød × terrasse | Middel-svært | 8 firmaer med dedikerede sider, flere Hillerød-baserede |
| Hillerød × tag | Svært | To firmaer *hjemmehørende* i Hillerød. Nærhed taber I på |
| **"Nordsjælland" × VELUX** | Sværeste enkeltmål, men beatable | Buschardt #1 med kun 1.300 ord og ingen FAQ. Forvent 6–12 mdr. |
| **Hørsholm × tag** | **Håbløst** | Exact-match-domæne **nyt-tag-hørsholm.dk**, plus nyt-tag.com med *to* sider på samme SERP |
| **Roskilde × alt** | **Håbløst** | **Exact-match-domæne tagrenovering-roskilde.dk på plads 1**, Roskilde Gruppen med to domæner, JJ TotalByg (30+ år) |
| **Ballerup × alt** | **Håbløst** | Mest mættede by-sæt i hele researchen: **otte** firmaer med dedikerede `/toemrer-ballerup`-sider |
| **Gulvafslibning × samtlige byer** | **Håbløst** | 18/18 specialistkæder |

**Til ejeren, direkte:** Roskilde og Ballerup bør droppes helt. De står i øvrigt **ikke** i `AREAS` i dag — det er den rigtige beslutning, og den skal fastholdes. Hørsholm kan blive stående som *dækket område*, men fortjener ingen optimeret tagside.

---

## 4. Byggelisten — prioriteret efter værdi ÷ indsats

> **Læs §0 først.** Ved 34 besøgende om måneden er punkt 1, 2, 3, 11 og det nye punkt 0 de eneste, der ændrer noget i år. Resten er rigtige — de er bare langsomme, og de forudsætter trafik, der ikke findes endnu.

### De tre veje til 8× trafik, med tal

| Vej | Tid til første lead | Pris | Realistisk effekt |
|---|---|---|---|
| **Google Business Profile** | 2–6 uger | 0 kr | Kortpakken vises **over** de organiske resultater på "tømrer frederikssund" og "tømrer nær mig". Leads kommer som **opkald og ruteanmodninger, der aldrig rammer sitet** — og derfor heller aldrig dukker op i de 34 |
| **Google Ads** | 3–10 dage | 4–5.000 kr/md | Ved ~25 kr/klik ≈ 180 klik/md = **6× nuværende trafik fra dag ét**. Ved 1,5 % ≈ 3 ægte leads/md ≈ **1.700 kr pr. lead** mod en tagopgave til 250.000 kr |
| **SEO (resten af listen)** | 4–9 måneder | tid | Rigtig på sigt. Løser intet før 2027 |

**Den fjerde vej, som ikke koster noget og bliver overset:** Holstrup har udført arbejde for **NCC, MT Højgaard, Rambøll, PwC, ISS, Tscherning og CG Jensen**. Det er en referenceliste, de fleste enmandsfirmaer ikke kan matche, og den ligger i dag som en logokarrusel på forsiden. Et opkald til de gamle kontakter er hurtigere end nogen kanal på listen.

### 0. Google Search Console — opret den i dag
**Værdi: høj · Indsats: 10 minutter · Effekt: straks (indsigt, ikke leads)**

Der ligger ingen `google-site-verification` på sitet, så der er sandsynligvis ingen Search Console. Uden den kan ingen se, **om de 39 URL'er overhovedet er indekseret**, hvilke søgninger sitet vises på, eller hvor mange visninger det får. Vercel Analytics tæller klik; Search Console tæller de gange, Google overvejede at vise jer — og det er dét tal, der fortæller, om SEO-arbejdet lander.

Indsend sitemappet, og tjek "Sideindeksering" for at se, hvor mange af de 20 bysider Google faktisk har gidet indeksere. Min forventning er, at flere af dem står som "Gennemsøgt – ikke indekseret", og det ville i givet fald bekræfte §2.3.

### 1. VELUX Dagslysrådgiver + Partnerprogram — tilmeld Finn
**Værdi: meget høj · Indsats: meget lav · Effekt: uger**

Gratis dagslyskursus via VELUX Academy. Ingen forretningsaftale. Giver adgang til et lead-flow, VELUX selv distribuerer og rykker for, et badge som de rangerende konkurrenter bruger, og Håndværkerbonus på arbejde Finn alligevel udfører.

**Skal gøres før der skrives én eneste side.** Sæt samtidig en fast rutine op for at ringe leads op inden for 48 timer — VELUX omfordeler efter få dage.

### 2. Google Business Profile — oprettet, verificeret, udfyldt
**Værdi: meget høj · Indsats: lav · Effekt: 2–6 uger**

- Verificér på Sundbylillevej 48, 3600 Frederikssund (postkort, 1–2 uger).
- Kategori: Tømrer (primær) + Tagdækker, Entreprenør.
- Serviceområde: Frederikssund, Ølstykke, Stenløse, Slangerup, Jyllinge, Hillerød, Allerød — **ikke** hele Nordsjælland.
- 15–20 **rigtige** jobbilleder.
- Sæt `SITE.googleBusinessUrl` i `lib/site.ts`, når den er verificeret.
- Ret telefonnummeret på Håndværker.dk og Krak, så NAP er ens.

Kortpakken står over de organiske resultater. Eneste gratis plads, der reelt er åben på tag.

### 3. Anmeldelser — 10 stykker, aktivt indhentet
**Værdi: meget høj · Indsats: lav · Effekt: 3–8 uger**

`Reviews`-komponenten er bygget og placeret. Den venter kun på indhold. Ring til de sidste 15–20 afsluttede kunder — ikke en mail, et opkald. Udfyld `REVIEWS` og `REVIEW_AGGREGATE`; stjernemarkeringen tænder af sig selv. Bed om, at bynavnet nævnes — `Review.city` bruges allerede på bysiderne.

### 4. `/ydelser/velux-ovenlysvinduer` — ny hovedside
**Værdi: høj · Indsats: lav · Effekt: 2–4 mdr. organisk, brugbar straks som annonce- og VELUX-landing**

Primært: `udskiftning af velux vindue pris` · sekundært: `velux vinduer nordsjælland`, `velux montering uden undertag`

Vinkel: *"De fleste utætte VELUX-vinduer er ikke defekte — de er monteret forkert."* Det står allerede skrevet i `service-content.ts` under tagrenovering, begravet.

Byg efter Buschardt/Klyverbyg-skabelonen, og slå dem på det, de mangler:
- **Faste priser i kroner, ikke intervaller** — i en statisk `<table>`. Udskiftning i eksisterende hul / nyt hul i taget / tvilling- og dobbeltparti / fladt tag. Buschardt ligger nr. 1 på præcis dette.
- **Egne før/efter-fotos** — `finn-velux.jpg`, `detail-tag-velux.jpg` findes allerede og er sitets bedste billeder.
- **FAQ** — Buschardt har ingen. Gratis forspring.
- Montageafsnit der besvarer `uden undertag` og `tagpap` konkret.
- Dagslysrådgiver-badge, når punkt 1 er i hus.
- Formular højt på siden (mønster fra punkt 8).

Flyt `/ydelser/doere-og-vinduer` til at pege herind som underemne.

### 5. Ydelse × by-sider — 8–10 stykker, ikke 240
**Værdi: høj · Indsats: middel · Effekt: 2–5 mdr.**

Det største strukturelle hul. Ny rute oven på `AREAS` og `SERVICES`, som allerede findes, med **håndskrevet** indhold pr. side:

| Prioritet | Side | Hvorfor |
|---|---|---|
| 1 | `/velux-frederikssund` | Tom stol — ingen lokal konkurrent overhovedet |
| 2 | `/traeterrasse-frederikssund` | Kun tb-byg, 800 ord uden pris eller FAQ |
| 3–6 | `/traeterrasse-{stenloese,oelstykke,slangerup,jyllinge}` | Egedal er tyndest; rangerer allerede nr. 3 |
| 7 | `/tagrenovering-stenloese` (+ Ølstykke) | Ingen tagspiller med lokal forankring i Egedal |
| 8 | `/velux-hilleroed` | Kontestabel, men VELUX-lead kom netop derfra |
| 9 | `/tagrenovering-frederikssund` | Hjemby; side 1 muligt |
| 10 | `/velux-nordsjaelland` (småbyerne som liste) | Én side, ikke seks |

Minimumskrav pr. side, så de ikke bliver en ny generator: bynavn i H1, mindst ét **rigtigt** jobbillede fra området, pris eller prisspænd, FAQ, og én anmeldelse fra byen (fra punkt 3). **Ingen konkurrent har billeder + pris + FAQ samtidig.** Det er hele åbningen.

Byg **ingen** sider for Roskilde, Ballerup, kystbyerne eller gulvafslibning.

### 6. `hævet terrasse`-klyngen — bedste informationsbrohoved
**Værdi: middel-høj · Indsats: lav · Effekt: 3–6 mdr.**

`/ydelser/traeterrasse/haevet-terrasse` mod `hævet terrasse konstruktion`, `byggetilladelse`, `afstand til skel`, `br18`.

10 fulde autocomplete-forslag, alle regel- og konstruktionstunge, og SERP'en ejes af generalistguides (nordingenioer.dk, byggeuniverset) **uden håndværksfaglighed**. En tømrer med 30+ års erfaring kan skrive den bedre — og den fører direkte til et terrasseprojekt.

Tilføj `/ydelser/traeterrasse/overdaekket` (terrasse × tag = hjemmebane) og `/ydelser/traeterrasse/pris` med granulering på materiale (trykimprægneret / thermowood / hårdttræ / komposit). Holstrups eksisterende 1.800–3.500 kr/m² er allerede mere, end fire ud af fem konkurrenter oplyser.

### 7. Tag: komponent-longtail i stedet for prissøgningen
**Værdi: middel · Indsats: lav · Effekt: 3–6 mdr.**

**Opgiv `hvad koster et nyt tag` helt.** Ti beregnerdomæner hvis forretningsmodel *er* den forespørgsel — de sælger jeres lead videre. En enkelt tømrer med én side slår ikke et domæne, der hedder nytagpris.dk.

Gå i stedet efter det, de ikke dækker:
- Én underside pr. komponent: tagrender, tagsten, tagplader, tagpap, taghætte, undertag. Alle seks er egne autocomplete-forslag, og reparationsopgaver bliver til tagrenoveringer.
- Blogindlæg: `nyt tag ovenpå asbesttag` (4 forslag, alle lovlighedsspørgsmål, høj intent, ingen lokal tømrer svarer) og `nyt tag med solceller`.
- Udgiv `content/blog/hvad-koster-nyt-tag-2026.md`, som allerede ligger skrevet i repoet og i dag holdes ude af sitemappet.
- Brug **ikke** ordene "tagarbejde" (arbejdsmiljøsøgninger) eller "tag pris" (kapret af Pokémon-kortgradering) som målsøgeord.

### 8. Formular- og førsteskærmsmønsteret
**Værdi: høj · Indsats: meget lav · Effekt: straks**

`LeadFormAside` ligger allerede rimeligt højt på ydelses- og bysider (linje 91 og 128) — bedre end forventet, skal ikke laves om. Det, der mangler, er Vesterhus' tre øvrige greb:

- **Ét løfte om svartid** over formularen. I dag står der en holdning i `ContactCta` (*"Den bedste måde at vurdere en opgave på er en ærlig snak"*). Vesterhus skriver: *"Vi svarer som regel samme dag, med et forslag og en pris."*
- **Kontrastbånd** om formularen.
- **Anker-link tilbage op** i bunden i stedet for `ContactCta`s knap til `/kontakt`. Hver gang en besøgende sendes til en anden side for at skrive, tabes en del.

**Rør ikke** `app/kontakt/**`, `app/api/contact*`, `lib/lead-mail.ts` eller `lib/alert.ts`.

### 9. Førstepartsmåling
**Værdi: høj · Indsats: lav-middel · Effekt: øjeblikkelig indsigt**

Portér `page_views` og `site_events` fra `vesterhus-dk/lib/analytics.ts` til Holstrups Neon-projekt. Minimum: sti, besøgs-id, step, referrer, utm, enhed, dwell — plus events for telefonklik, formularstart og afsendelse.

Tilføj `stage` + `quoted_value`/`confirmed_value` til `holstrup_leads`. Alle 9 leads står i dag som `status='new'`, også de to der blev fulgt op og tabt.

Tællingen skal ske aggregeret og uden personhenførbare id'er, så den ikke arver GA4's samtykke-blindhed.

### 10. Rigtige projektbilleder
**Værdi: middel-høj · Indsats: lav (men kræver Finn) · Effekt: understøtter alt andet**

`/projekter` viser 6 projekter, hvoraf fire bruger generiske ydelsesbilleder — "Nyt tegltag i Hillerød" er illustreret med `/images/service-tag.jpg`, samme billede som ydelsessiden. Kun `finn-velux.jpg` og `finn-renovering.jpg` er rigtige jobfotos.

Ingen konkurrent har billeder + pris + FAQ samtidig. Billederne er den halvdel, Holstrup mangler for at tage kombinationen. Bed Finn om før/efter på hver opgave fra nu af — telefonkamera er rigeligt.

### 11. Google Ads på tag — køb de leads I ikke kan ranke jer til
**Værdi: høj · Indsats: middel · Effekt: 1–3 uger · kræver budgetbeslutning**

Den organiske tag-SERP er for dyr at erobre, og tag er samtidig den ydelse med mest efterspørgsel (5 af 9 leads). Det er den rigtige ydelse at betale for.

Google Ads, ikke Meta: et nyt tag er ikke et impulskøb. Folk søger, når taget er utæt. 3.000–5.000 kr/md på 10–15 eksakte søgeord (`nyt tag frederikssund`, `tagrenovering hillerød`, `udskiftning af velux <by>`), der lander på siderne fra punkt 4 og 5. Mål det med punkt 9.

### 12. Bysidekonsolidering
**Værdi: middel · Indsats: middel · Effekt: 3–6 mdr.**

Skriv Frederikssund, Stenløse, Ølstykke, Slangerup, Jyllinge og Hillerød i hånden. 301 kystbyerne til `/omraader`. Lad mellembyerne blive stående på skabelonen — de er ikke skadelige, så længe de ikke er hovedindsatsen. Skru `areaServed` ned fra 40 byer.

---

## 5. Hvad der er hurtigt og hvad der er langsomt

| Kan give henvendelser inden for uger | Betaler sig først efter kvartaler |
|---|---|
| **1.** VELUX Dagslysrådgiver | **4.** VELUX-hovedside (som SEO) |
| **2.** Google Business Profile | **5.** Ydelse × by-sider |
| **3.** Anmeldelser | **6.** Hævet terrasse-klyngen |
| **8.** Formular og førsteskærm | **7.** Tag-komponentsider |
| **11.** Google Ads på tag | **12.** Bysidekonsolidering |
| **9.** Måling (ingen leads, men uden den er alt blindt) | **10.** Projektbilleder (understøttende) |

Sig det direkte til ejeren: **punkt 4–7 og 12 producerer ikke henvendelser i 2026.** SEO for nye sider tager 3–9 måneder. Skal der henvendelser før jul, ligger svaret i punkt 1, 2, 3, 8 og 11 — og de tre første er gratis.

Sæsonbemærkning: terrasser sælges februar–maj. At bygge terrassesiderne nu er rigtigt timet, netop fordi de skal være indekseret inden sæsonen.

---

## 6. Det, der skal bekræftes, før der bruges penge

1. **VELUX × Roskilde, Ballerup og Hørsholm** blev ikke tjekket som selvstændige SERP'er (søgebudgettet løb tør). Roskilde og Ballerup er håbløse på tag og terrasse — men VELUX-laget kan være anderledes. Tjek før der bygges side.
2. **"nyt trægulv" / "gulvlægger" lokalt** blev ikke SERP-tjekket. Det er det eneste gulv-spor med luft, men båndet er lavt.
3. **Eksisterer der allerede en uverificeret, auto-oprettet Google Business Profile?** I så fald skal den gøres krav på frem for at oprette en ny.
4. **Om 3byggetilbud/Ageras optræder i VELUX-bysøgninger** er ikke bevist — de dukkede ikke op i de ni kørte SERP'er (kun Håndværker.dk og handyhand.dk), men fraværet er ikke verificeret.
5. **Schema hos konkurrenterne.** "Ingen synlig FAQ- eller Review-markup" bygger på WebFetch, som stripper JSON-LD. Bekræft med Googles rich-results-test, før det bruges som argument.
