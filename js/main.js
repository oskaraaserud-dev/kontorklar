/* ============================================================
   KontorKlar – interaksjon
   Vanilla JS, ingen avhengigheter. Siden skal fungere helt uten
   denne filen – alt her er forbedringer, ikke forutsetninger.
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: bakgrunn og skygge etter skroll ---------- */

  var header = document.getElementById("siteHeader");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateHeader();
      ticking = false;
    });
  }, { passive: true });

  updateHeader();

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

    // Lukk når man velger et menypunkt
    siteNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });

    // Escape lukker menyen og gir fokus tilbake til knappen
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
