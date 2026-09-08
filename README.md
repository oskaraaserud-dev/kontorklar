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
├── send.php          Tar imot kontaktskjemaet og sender det som e-post
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
| 03 | `#slik` | Fem tilbud. Fast KontorKlar-dag fremhevet øverst |
| 04 | `#hvem` | Målgruppene som én løpende linje |
| 05 | `#om` | Trude Øiesvold, erfaring og verdier |
| 06 | `#kontakt` | Kontaktskjema og kontaktopplysninger |

Navlenken heter «Priser», men peker på `#slik`. Folk leter etter ordet
«priser»; seksjonen heter «Slik jobber vi» fordi den handler om mer enn tall.

### Hva som er KontorKlars eget

De andre kundesidene deler header, skjema, tilgjengelighet og
mobilmeny – det er løste problemer, og de skal være like. Det som er
denne sidas eget er:

- **Dokumentlayouten.** Nummerert venstremarg, hårfine linjer, ingen kort
  med skygge. Gir siden et arkiv-preg som passer en administrativ tjeneste.
- **Kalenderbladet i det fremhevede panelet.** Dagen som settes av er ringet rundt med
  nøyaktig samme håndtegnede form som fristen i brevet over (`.brev__frist` og
  `.kal__dag` deler `border-radius`). Seksjon 02 ringer rundt en frist du har
  fått, 03 rundt dagen du bruker på å rekke den. Kalenderen viser ekte
  oktober 2026 – endres måneden, må ukedagene stemme.
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

Kontaktopplysningene er på plass. Foretaket er registrert som
**KontorKlar Øiesvold** (enkeltpersonforetak, org.nr. 938 426 961, Lunner).
Trude ønsket ikke postadresse i personvernerklæringen – foretaksnavn, org.nr.,
e-post og telefon identifiserer behandlingsansvarlig, og det er tilstrekkelig
etter personvernforordningen artikkel 13.

Skjemaet går nå til `send.php` på hennes eget webhotell. Kravet om
behandling i EU/EØS er dermed innfridd strengere enn noen tjeneste kunne
gjort: opplysningene forlater ikke Norge, og det finnes ingen databehandler
å føre opp.

Dette gjenstår:

- [ ] **Opprett `nettside@kontorklar.no`** hos domene.no, som postkasse eller
      alias videre til Trude. Skriptet sender fra denne adressen. Ligger
      avsenderadressen på et annet domene enn nettstedet, havner e-posten lett
      i søppelpost (SPF og DMARC).
- [ ] **Test skjemaet etter opplasting.** PHP kjører ikke på GitHub Pages, så
      det kan først testes når filene ligger hos domene.no. Send en ekte
      henvendelse og bekreft at den kommer fram, at du havner på `takk.html`,
      og at norske tegn vises riktig i e-posten.
- [ ] Kontroller prisene mot Trudes e-post en siste gang før lansering. Dette
      er det eneste bindende innholdet på siden.

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
| `bilder/trude.jpg` | Portrettet i seksjon 06, 900 × 878 |
| `favicon.png` | Fanikon, 180 × 180 |

Portrettet er hele originalen, bare skalert ned – ikke beskåret. `.om__foto`
har derfor **ingen `aspect-ratio`**; bildet beholder sitt eget format, så et
nytt portrett kan byttes inn uten å bli strukket eller kuttet. Det er **JPEG,
ikke WebP** – det finnes ingen WebP-koder på maskinen.

Skal de lages på nytt – for eksempel hvis kunden sender en ny logofil – kjør
`verktoy/lag-logo.ps1` fra PowerShell. Skriptet klipper ut merket og ordmerket,
gjør den hvite bakgrunnen gjennomsiktig og bygger alle variantene. Utsnittene
øverst i skriptet må justeres hvis den nye fila har annen komposisjon.

Alle bildene er på plass.

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

**Webhotellet er hos domene.no**, ikke Domeneshop som de øvrige kundesidene.
PHP 8 er med på alle deres pakker, og serverne står i Oslo. Kontrollpanelet er
cPanel, så det er FTP eller filbehandleren der.

Last opp innholdet i mappa til `public_html`. `send.php` må med – uten den
virker ikke skjemaet.

### Ikke last opp disse

De hører til utviklingen, ikke til nettstedet, og blir liggende offentlig
lesbare hvis de følger med:

| | Hvorfor |
|---|---|
| `README.md` | Denne fila. Interne notater om pris, kunde og begrunnelser |
| `.gitignore` | Ingen nytte på en webserver |
| `verktoy/` | Byggeskript, ikke en del av nettstedet |
| `.git/` | Hele historikken. Domene.no svarer 403 på den, men last den likevel ikke opp |

### Tving HTTPS

**Dette må gjøres, ikke bare bør.** Uten omdirigering serveres siden også på
`http://`, og fordi skjemaets `action` er relativ (`send.php`), sendes navn,
e-post, telefon og melding da i klartekst. Personvernerklæringen punkt 9 lover
uttrykkelig kryptert forbindelse, så uten dette stemmer den ikke.

Enkleste vei er bryteren i cPanel: **Domener → Force HTTPS Redirect**. Den
skriver regelen selv, uten at du rører `.htaccess` – webhotellet har allerede
en der som styrer PHP, og den vil du ikke overskrive.

Sjekk etterpå at `http://kontorklar.no` svarer 301 til `https://`.

**Viktig:** endres `css/style.css` eller `js/main.js`, må de lastes opp sammen med
HTML-filene. Lastes bare HTML-en opp, virker den nye siden halvveis.

**Bump versjonsnummeret ved hver endring i CSS eller JS.** Lenkene står som
`css/style.css?v=2` og `js/main.js?v=2` i alle tre HTML-filene. Uten dette kan
en besøkende få ny HTML sammen med gammel CSS fra nettleserens mellomlager, og
siden ser ødelagt ut – innholdet klistrer seg til venstre kant og arkene i
hero-en forsvinner. GitHub Pages og de fleste webhotell setter ti minutters
mellomlagring på filene, så det er ikke nok å bare laste opp på nytt.

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
6. Send en testhenvendelse **fra webhotellet**, ikke fra GitHub Pages. PHP
   kjører ikke der, så skjemaet gir 404 på forhåndsvisningen. Det er ventet.

## Skjemaet

`send.php` tar imot skjemaet og sender det videre som e-post. Ingen tredjepart.

Verdt å vite hvis noe skulle svikte:

- Skriptet svarer alltid med en omdirigering – til `takk.html` hvis det gikk
  bra, ellers tilbake til `index.html#kontakt`. Det viser aldri en feilmelding
  til den besøkende.
- Kommer ingenting fram, er den vanligste årsaken at `nettside@kontorklar.no`
  ikke finnes, eller at `mail()` er slått av. Sjekk feilloggen i cPanel.
- Er `mail()` upålitelig hos domene.no, er neste steg å sende via SMTP
  (`smtp.domene.no`) med PHPMailer i stedet. Da trengs et passord, som ikke
  skal ligge i git – legg det i en fil utenfor webroten.
- Beskyttelsen mot søppelpost er en skjult honningkrukke, samme som før.
  Kommer det spam likevel, er neste steg et enkelt regnestykke eller en
  tidssperre – ikke captcha, som rammer ekte kunder hardest.

---

## Priser

Prisene ligger to steder som må holdes i takt: seksjon `#slik` i `index.html`,
og `hasOfferCatalog` i JSON-LD-en øverst i samme fil. Endres en pris, må begge
oppdateres.

| | Pris | Omfang |
|---|---|---|
| **Fast KontorKlar-dag** | 5 500 kr | Inntil 7 timer, én dag |
| KontorKlar Mini | 3 750 kr | 5 timer, ingen binding |
| Fast KontorKlar 10 | 7 500 kr/mnd. | 10 timer per måned |
| Fast KontorKlar 20 | 14 500 kr/mnd. | 20 timer per måned |
| Kontorhjelp | 795 kr/time | Min. én time, så per påbegynte 15 min |
| Prosjektstøtte | 895 kr/time | |
| Lederstøtte | 895 kr/time | |
| Prosjekt eller periode | fra 895 kr/time | |

Fast KontorKlar-dag er signaturtjenesten. Den ligger derfor som et fremhevet
panel øverst i seksjonen – grønn flate, kalenderblad, egen knapp – mens de
fire andre står i et rolig rutenett under. Hierarkiet er bevisst og bestilt av
Trude; ikke jevn det ut.

I e-posten hennes står Fast KontorKlar-dag som nummer tre i rekken. Den er
flyttet først fordi et stort panel klemt mellom små kort bryter rutenettet.
Rekkefølgen på de fire andre er hennes.

### Merverdiavgift

KontorKlar er ikke registrert i Merverdiavgiftsregisteret, og en egen note
nederst i seksjonen forklarer det. Et bart «eks. mva» ville vært misvisende –
det antyder at noe kommer i tillegg.

**Dette må endres ved registreringsplikt**, som inntrer ved 50 000 kr omsetning
på tolv måneder. Én fast KontorKlar-dag i måneden er 66 000 kr i året, så
terskelen passeres sannsynligvis det første året. Da må noten skrives om og
prisene enten merkes «eks. mva» eller settes opp.

