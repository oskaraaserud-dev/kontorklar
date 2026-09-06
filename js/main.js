/* ============================================================
   KontorKlar – interaksjon
   Vanilla JS, ingen avhengigheter. Siden skal fungere helt uten
   denne filen – alt her er forbedringer, ikke forutsetninger.
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: bakgrunn etter skroll ---------- */

  var header = document.getElementById("siteHeader");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  /* ---------- Haugen som sorterer seg ----------
     Arkene ligger ferdig sortert i HTML-en. Her spres de ut ved
     sidelast, og legger seg på plass igjen mens man ruller gjennom
     hero-en. Blir denne filen aldri lastet, står de bare sortert.

     data-dx og data-dy er forskyvning i prosent av haugens bredde,
     slik at spredningen skalerer med elementet. */

  var haug = document.getElementById("haug");
  var heroTekst = document.querySelector(".hero__inner");
  var ark = haug ? Array.prototype.slice.call(haug.querySelectorAll(".ark")) : [];
  var sorterer = ark.length > 0 && !reduceMotion;

  // dx og dy er differansen mellom spredt og sortert posisjon, i prosent
  // av flatas bredde og høyde – samme enheter som left og top i markupen.
  var haugData = ark.map(function (el) {
    return {
      el: el,
      dx: parseFloat(el.getAttribute("data-dx")) || 0,
      dy: parseFloat(el.getAttribute("data-dy")) || 0,
      r: parseFloat(el.getAttribute("data-r")) || 0
    };
  });

  function klem(v) {
    return Math.min(1, Math.max(0, v));
  }

  function haugStrekning() {
    // Så langt scenen står festet mens teksten ved siden ruller forbi.
    // Sorteringen følger den strekningen, slik at bunkene rekker å legge
    // seg mens haugen fortsatt er i bildet.
    var reise = heroTekst ? heroTekst.offsetHeight - haug.offsetHeight : 0;
    return Math.max(220, Math.min(reise, window.innerHeight * 0.6));
  }

  function fremdrift() {
    if (window.innerWidth < 900) {
      // På mobil ligger haugen under første skjermbilde. Da kan ikke
      // skrollposisjonen brukes direkte – i stedet sorterer den seg
      // etter hvert som den kommer opp i synsfeltet.
      var boks = haug.getBoundingClientRect();
      var vh = window.innerHeight;
      return klem((vh - boks.top) / (vh * 0.55));
    }
    // På desktop er haugen i syne fra start, og står festet mens man ruller.
    return klem(window.scrollY / haugStrekning());
  }

  function tegnHaug() {
    if (!sorterer) return;

    var p = fremdrift();
    var igjen = 1 - p;
    var bredde = haug.offsetWidth;
    var hoyde = haug.offsetHeight;

    for (var i = 0; i < haugData.length; i++) {
      var d = haugData[i];
      if (igjen === 0) {
        d.el.style.transform = "";
      } else {
        d.el.style.transform =
          "translate(" + (d.dx * igjen * bredde) / 100 + "px," +
          (d.dy * igjen * hoyde) / 100 + "px) rotate(" + d.r * igjen + "deg)";
      }
    }

    haug.classList.toggle("skjul-lapper", p <= 0.85);
  }

  /* ---------- Felles skroll-lytter ---------- */

  var venter = false;
  window.addEventListener("scroll", function () {
    if (venter) return;
    venter = true;
    window.requestAnimationFrame(function () {
      updateHeader();
      tegnHaug();
      venter = false;
    });
  }, { passive: true });

  window.addEventListener("resize", tegnHaug);

  updateHeader();
  tegnHaug();

  // Sorteres det ikke, står merkelappene synlige slik CSS-en har dem

  /* ---------- Mobilmeny ---------- */

  var navToggle = document.getElementById("navToggle");
  var siteNav = document.getElementById("siteNav");

  function closeNav() {
    if (!navToggle || !siteNav) return;
    siteNav.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Åpne meny");
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var open = siteNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Lukk meny" : "Åpne meny");
    });

    siteNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && siteNav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });
  }

  /* ---------- Reveal: seksjoner toner inn ved skroll ----------
     CSS skjuler .reveal først når <html> har klassen js-ready, og den
     settes her nede. Uteblir scriptet – eller mangler støtte for
     IntersectionObserver – vises alt innhold som normalt. */

  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    // Det som allerede er i syne markeres FØR skjul-tilstanden slås på,
    // ellers ville innholdet øverst blinke bort og tone inn igjen.
    revealEls.forEach(function (el) {
      var box = el.getBoundingClientRect();
      if (box.top < window.innerHeight && box.bottom > 0) {
        el.classList.add("is-visible");
      }
    });

    document.documentElement.classList.add("js-ready");

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function (el) {
      if (!el.classList.contains("is-visible")) observer.observe(el);
    });
  }

  /* ---------- Årstall i footer ---------- */

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
