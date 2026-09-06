# KontorKlar – kontorklar.no

Statisk nettside for KontorKlar (Trude Øiesvold): fleksibel kontorhjelp,
administrativ støtte, prosjektstøtte og lederstøtte.

Ren HTML, CSS og JavaScript. **Ingen byggetrinn, ingen avhengigheter, ingen npm.**
Åpne `index.html` i en nettleser, så kjører hele siden.

---

## Filstruktur

```
kontorklar/
├── index.html        Forsiden – alt innhold, ankernavigasjon
├── personvern.html   Personvernerklæring, 12 nummererte kapitler
├── takk.html         Kvittering etter skjemainnsending (noindex)
├── css/style.css     Ett stilark. Fargene ligger som variabler øverst.
├── js/main.js        Header ved skroll, mobilmeny, reveal, årstall
├── verktoy/          lag-logo.ps1 – bygger logovariantene fra originalfila
├── bilder/           Logo i tre varianter + delingsbilde (se under)
├── favicon.png       Fanikon, klippet ut av logomerket
├── robots.txt
└── sitemap.xml
```

### Seksjoner på forsiden

Siden er satt opp som et dokument: hver seksjon har nummer og navn i en
venstremarg som blir stående mens innholdet ruller forbi.

| | Anker | Innhold |
|---|---|---|
| 01 | `#tjenester` | Fire oppføringer i et register, skilt av hårfine linjer |
| 02 | `#offentlig` | Brevet fra kommunen, med fire notater i margen |
| 03 | `#slik` | Tre kjøpsmodeller som spalter i et vilkårsoppsett |
| 04 | `#hvem` | Målgruppene som én løpende linje |
| 05 | `#om` | Trude Øiesvold, erfaring og verdier |
| 06 | `#kontakt` | FormSubmit-skjema og kontaktopplysninger |

### Hva som er KontorKlars eget

De andre kundesidene deler header, skjema, tilgjengelighet og
mobilmeny – det er løste problemer, og de skal være like. Det som er
denne sidas eget er:

- **Dokumentlayouten.** Nummerert venstremarg, hårfine linjer, ingen kort
  med skygge. Gir siden et arkiv-preg som passer en administrativ tjeneste.
- **Haugen i hero-en.** Tretten ark ligger ferdig sortert i tre bunker i
  HTML-en. `main.js` sprer dem ut ved sidelast og lar dem falle på plass
  igjen mens man ruller – rot som blir til orden, som er hele
  salgsargumentet. Uten JS, med redusert bevegelse, eller på skjermer
  under 900 px ligger de bare sortert.
- **Brevet.** Seksjon 02 viser et faktisk brev med en frist som er ringet
  rundt, og fire nummererte notater ved siden. Tallene i brevet svarer til
  notatene.

---

## Sjekkliste før lansering

Alt som mangler er merket `TODO` i koden. Søk etter `TODO` i alle filer –
da finner du hvert eneste sted som må fylles inn.

- [ ] **E-postadresse.** Byttes fire steder i `index.html` (skjemaets `action`,
      `.contact-list`, `.form-note`, JSON-LD) og to steder i `personvern.html`.
- [ ] **Aktiver FormSubmit.** Send én testhenvendelse fra den publiserte siden.
      FormSubmit sender da en aktiveringsmail til adressen over – den må bekreftes,
      ellers kommer ingen henvendelser fram.
- [ ] **Telefonnummer.** `index.html` (`.contact-list` + JSON-LD `telephone`) og
      `personvern.html`.
- [ ] **Org.nr. og foretaksnavn.** Footeren på alle tre sidene, og punkt 1 i
      `personvern.html`.
- [ ] **Sted og område.** JSON-LD `address` og `areaServed` i `index.html`.
      Skal KontorKlar profileres lokalt, bytt `areaServed` fra «Norge» til
      kommunen/regionen – det gir langt bedre lokale søketreff.
- [ ] **Portrett av Trude.** Legges som `bilder/trude.webp` (ca. 800 × 1000 px,
      stående). `TODO`-kommentaren i `#om` inneholder den ferdige `<img>`-taggen
      som skal erstatte «TØ»-plassholderen.
- [ ] **Dato i personvernerklæringen** (`.legal-updated`).
- [ ] **Datoer i `sitemap.xml`** (`lastmod`).
- [ ] Eventuelle sosiale profiler legges i JSON-LD som `"sameAs": [ ... ]`.

---

## Logo og bilder

Logoen er klippet ut av kundens originalfil (`KontorKlar.png`, 1536 × 1024) og
delt i tre bruksklare varianter med gjennomsiktig bakgrunn:

| Fil | Brukes til |
|---|---|
| `bilder/logo.png` | Header. Merket og ordmerket låst horisontalt, 853 × 200 |
| `bilder/logo-lys.png` | Footeren, som står på merkenavy. Alt blekk gjort hvitt |
| `bilder/logo-merke.png` | Merket alene, kvadratisk. Brukt på `takk.html` |
| `bilder/og-image.png` | Deling på Facebook og LinkedIn, 1200 × 630 |
| `favicon.png` | Fanikon, 180 × 180 |

Skal de lages på nytt – for eksempel hvis kunden sender en ny logofil – kjør
`verktoy/lag-logo.ps1` fra PowerShell. Skriptet klipper ut merket og ordmerket,
gjør den hvite bakgrunnen gjennomsiktig og bygger alle variantene. Utsnittene
øverst i skriptet må justeres hvis den nye fila har annen komposisjon.

**Én ting mangler fortsatt:** portrettet av Trude – `bilder/trude.webp`, ca.
800 × 1000 px stående. Fram til det foreligger viser «Om meg» et monogram.

### Om logofila

Originalen er et rasterbilde, ikke vektor. Det holder fint på skjerm i de
størrelsene siden bruker, men:

- Favicon i 16 × 16 blir grøtete, fordi merket har tynne blader og en tynn ring.
- Til trykk – visittkort, skilt, bildekor – trengs en ekte SVG/EPS. Be kunden
  få logoen tegnet om i vektor før noe skal på trykk.

Originalen inneholder også en ikonrad og to undertekster som **ikke** er tatt med
på nettsiden. Det er en merkeplansje, ikke en logo – bare merket og ordmerket
egner seg som sidelogo.

## Farger og skrift

Alle farger ligger som variabler øverst i `css/style.css`. **Endre der – ikke
nedover i filen.**

Navy og grønn er pipettert rett ut av logofila, ikke valgt på frihånd:

| Variabel | Verdi | Hentet fra | Brukes til |
|---|---|---|---|
| `--ink` / `--dark` | `#1A3345` | «Kontor» i ordmerket | Tekst, mørkt bånd, footer |
| `--green-strong` | `#536B5A` | «Klar» i ordmerket | Knapper og lenker (5,4:1) |
| `--green` | `#6E8472` | Bladet i merket | Ikoner og grafikk (3,7:1) |
| `--green-dark` | `#3E5344` | – | Hover |
| `--bg` | `#F7F6F3` | – | Varm off-white bakgrunn |
| `--ink-soft` | `#5A6874` | – | Dempet tekst (5,3:1) |

Byttes logoen ut, hent fargene på nytt fra den nye fila – ikke gjett.

Skrift: **Fraunces** til overskrifter og **Inter** til brødtekst, begge fra
Google Fonts. Byttes de ut, må `<link>`-taggen endres i alle tre HTML-filene.

---

## Publisering

FTP til Domeneshop med FileZilla. Last opp innholdet i mappa til webroten.

**Viktig:** endres `css/style.css` eller `js/main.js`, må de lastes opp sammen med
HTML-filene. Lastes bare HTML-en opp, virker den nye siden halvveis.

Git brukes til versjonskontroll, ikke deploy.

---

## Testing før levering

1. Åpne `index.html` lokalt.
2. Test uten JavaScript. Nettleserflagget `--disable-javascript` virker ikke i
   headless Edge, så lag heller en kopi uten script-taggen:
   `sed 's|<script src="js/main.js"></script>||' index.html > _test.html`
   Da skal alt innhold vises, skjemaet virke, og arkene i hero-en ligge
   ferdig sortert. Skjul-tilstanden for `.reveal` henger på klassen
   `js-ready`, som `main.js` setter selv – uteblir scriptet, vises alt i
   stedet for å bli usynlig. Slett `_test.html` etterpå.
3. Tab gjennom siden. «Hopp til hovedinnhold» skal komme først, og alt som kan
   fokuseres skal ha synlig omriss.
4. Sjekk mobilvisningen i DevTools eller på telefon. I headless nettleser styrer
   ikke `--window-size` layoutbredden; skal den måles der, må sida lastes i en
   iframe med fast bredde.
5. Kjør `index.html` gjennom [validator.w3.org](https://validator.w3.org/) og
   JSON-LD-en gjennom Googles Rich Results Test.
6. Send en testhenvendelse og bekreft at du havner på `takk.html`.
