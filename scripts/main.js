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

  // ── Blog JSON renderer ──
  const blogContainer = $('#blogPosts');
  const formatDate = (isoDate) => {
    try {
      return new Date(`${isoDate}T12:00:00`).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch {
      return isoDate;
    }
  };

  const renderPosts = async () => {
    if (!blogContainer) return;

    try {
      const response = await fetch('/data/posts.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const posts = await response.json();
      blogContainer.innerHTML = posts.map((post) => `
        <article class="post-card fade-in" id="post-${post.id}">
          <p class="post-card__date">${formatDate(post.date)}</p>
          <h3 class="post-card__title">
            <a href="/blog/${post.id}" class="post-card__link">${post.title}</a>
          </h3>
          <p class="post-card__summary">${post.summary}</p>
          <div class="post-card__tags">
            ${(post.tags || []).map((tag) => `<span class="tag">#${tag}</span>`).join('')}
          </div>
        </article>
      `).join('');

      // Reveal new blog elements
      $$('.fade-in', blogContainer).forEach(el => el.classList.add('fade-in--visible'));
    } catch (err) {
      blogContainer.innerHTML = `
        <article class="post-card">
          <h3 class="post-card__title">Bitácora temporalmente no disponible</h3>
          <p class="post-card__summary">No pude cargar el JSON de posts. Error: ${err.message}</p>
        </article>
      `;
    }
  };

  renderPosts();
})();
