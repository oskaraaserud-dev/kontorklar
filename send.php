<?php
/* ============================================================
   KontorKlar – mottak av kontaktskjemaet

   Tar imot skjemaet og sender det videre som e-post fra webhotellet
   hos domene.no. Ingen tredjepart er involvert: opplysningene går fra
   den besøkende til innboksen, via servere i Oslo. Det er derfor
   personvernerklæringen ikke lenger har noe avsnitt om overføring
   ut av EØS.

   Fungerer uten JavaScript – vanlig POST og omdirigering.

   NB: PHP kjører ikke på GitHub Pages. Skjemaet virker først når
   filene ligger på webhotellet.
   ============================================================ */

declare(strict_types=1);

// ---- Innstillinger ----------------------------------------------------

const MOTTAKER   = 'trude@kontorklar.no';
// Avsenderadressen må ligge på samme domene som nettstedet, ellers blir
// e-posten lett stoppet av spamfilter (SPF og DMARC).
//
// Her er avsender og mottaker samme adresse. Det fungerer, men enkelte
// spamfiltre gir et lite utslag på det mønsteret, fordi forfalsket post
// ofte ser slik ut. Havner henvendelsene i søppelpost, er det første
// tiltaket å opprette nettside@kontorklar.no som alias videre til Trude
// og sette den inn her – da forsvinner utslaget.
const AVSENDER   = 'trude@kontorklar.no';
const AVSENDER_NAVN = 'KontorKlar nettside';
const EMNE       = 'Ny henvendelse fra kontorklar.no';
const KVITTERING = 'takk.html';
const FEILSIDE   = 'index.html#kontakt';

// ---- Hjelpefunksjoner -------------------------------------------------

/**
 * Fjerner linjeskift. Uten dette kan en angriper skrive egne
 * e-posthoder inn i navn eller emne og bruke skjemaet til å sende
 * spam videre (header injection).
 */
function trygg_linje(string $verdi): string
{
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $verdi));
}

function felt(string $navn, int $maks = 500): string
{
    $verdi = isset($_POST[$navn]) && is_string($_POST[$navn]) ? $_POST[$navn] : '';
    $verdi = trim($verdi);
    // mbstring er nesten alltid installert, men ikke garantert. Uten den
    // ville skriptet stoppet med en fatal feil i stedet for å sende.
    return function_exists('mb_substr')
        ? mb_substr($verdi, 0, $maks)
        : substr($verdi, 0, $maks * 2);
}

/** Koder norske tegn i emne- og navnefelt slik at de vises riktig. */
function mime(string $tekst): string
{
    if ($tekst === '' || preg_match('/^[\x20-\x7E]*$/', $tekst)) {
        return $tekst;   // ren ASCII trenger ingen koding
    }
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader($tekst, 'UTF-8');
    }
    return '=?UTF-8?B?' . base64_encode($tekst) . '?=';
}

function avslutt(string $side): void
{
    header('Location: ' . $side, true, 303);
    exit;
}

// ---- Kun POST ---------------------------------------------------------

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    avslutt(FEILSIDE);
}

// ---- Honningkrukke ----------------------------------------------------
// Feltet er skjult for mennesker. Er det fylt ut, er avsenderen en robot.
// Vi later som om alt gikk bra, slik at roboten ikke lærer noe.

if (felt('_honey') !== '') {
    avslutt(KVITTERING);
}

// ---- Les og valider ---------------------------------------------------

$navn    = trygg_linje(felt('navn', 120));
$epost   = trygg_linje(felt('epost', 160));
$telefon = trygg_linje(felt('telefon', 40));
$emne    = trygg_linje(felt('emne', 120));
$melding = felt('melding', 5000);

$feil = [];
if ($navn === '')    { $feil[] = 'navn'; }
if ($melding === '') { $feil[] = 'melding'; }
if ($epost === '' || !filter_var($epost, FILTER_VALIDATE_EMAIL)) { $feil[] = 'epost'; }

if ($feil) {
    // Skjemafeltene er merket required, så dette skjer normalt bare hvis
    // noen omgår nettleserens validering.
    avslutt(FEILSIDE);
}

// ---- Sett sammen e-posten ---------------------------------------------

$linjer = [
    'Navn:     ' . $navn,
    'E-post:   ' . $epost,
    'Telefon:  ' . ($telefon !== '' ? $telefon : '(ikke oppgitt)'),
    'Gjelder:  ' . ($emne !== '' ? $emne : '(ikke valgt)'),
    '',
    'Melding:',
    $melding,
    '',
    str_repeat('-', 48),
    'Sendt fra kontaktskjemaet på kontorklar.no',
    'Tidspunkt: ' . date('d.m.Y H:i'),
];
$tekst = implode("\n", $linjer);

$hoder = [
    'From: ' . mime(AVSENDER_NAVN) . ' <' . AVSENDER . '>',
    // Svar går rett til den som tok kontakt
    'Reply-To: ' . mime($navn) . ' <' . $epost . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'MIME-Version: 1.0',
    'X-Mailer: KontorKlar',
];

$sendt = mail(
    MOTTAKER,
    mime(EMNE),
    $tekst,
    implode("\r\n", $hoder),
    '-f' . AVSENDER
);

avslutt($sendt ? KVITTERING : FEILSIDE);
