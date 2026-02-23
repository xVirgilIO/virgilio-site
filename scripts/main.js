(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Nav scroll effect ──
  const nav = $('#nav');
  const handleScroll = () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── Mobile menu ──
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  const overlay = $('#navOverlay');

  const openMenu = () => {
    links.classList.add('nav__links--open');
    overlay.classList.add('nav__overlay--visible');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.innerHTML = '&#10005;';
  };

  const closeMenu = () => {
    links.classList.remove('nav__links--open');
    overlay.classList.remove('nav__overlay--visible');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '&#9776;';
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.contains('nav__links--open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  $$('.nav__link', links).forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ── Escape key closes menu ──
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // ── Intersection Observer for fade-in ──
  const fadeElements = $$('.fade-in');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('fade-in--visible'));
  }

  // ── Active nav link on scroll ──
  const sections = $$('section[id]');
  const navLinks = $$('.nav__link');

  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'nav__link--active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();
