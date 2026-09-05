/* Lucent, lucent.ae
   Header condensing, in-view nav highlighting, one-time scroll reveals,
   mobile menu, language preference. No dependencies. */
(function () {
  'use strict';

  var header = document.querySelector('.header');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  /* Header goes from transparent over the hero to a blurred bone bar. */
  function onScroll() {
    if (header) header.classList.toggle('is-condensed', window.scrollY > 24);
    var mid = window.innerHeight * 0.45;
    var current = null;
    sections.forEach(function (el) {
      if (el.getBoundingClientRect().top <= mid) current = el.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* Anchor jumps clear the fixed header. */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
      closeMenu();
      history.replaceState(null, '', '#' + id);
    });
  });

  /* Reveal once, staggered across siblings. Fails open. */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function showAll() { reveals.forEach(function (el) { el.classList.add('is-in'); }); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
        setTimeout(function () { entry.target.classList.add('is-in'); }, delay);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
    setTimeout(showAll, 2000);
  } else {
    showAll();
  }

  /* Mobile menu */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* Remember the visitor's language choice for next visit. */
  document.querySelectorAll('[data-set-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('lucent-lang', a.getAttribute('data-set-lang')); } catch (e) {}
    });
  });
})();
