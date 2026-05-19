/* ══════════════════════════════════════════════════════════
   COFFEE AVENUE — Main JavaScript
   Interactions, Animations, and Dynamic Behavior
   ══════════════════════════════════════════════════════════ */

'use strict';

/* ─── UTILITIES ──────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── PRELOADER ──────────────────────────────────────────── */
function initPreloader() {
  const preloader = $('#preloader');
  if (!preloader) return;

  const minDisplayTime = 1800;
  const start = Date.now();

  window.addEventListener('load', () => {
    const elapsed = Date.now() - start;
    const remaining = Math.max(0, minDisplayTime - elapsed);
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Trigger hero animations
      $$('.animate-fade-up').forEach(el => {
        requestAnimationFrame(() => el.classList.add('visible'));
      });
    }, remaining);
  });
}

/* ─── STICKY NAVBAR ──────────────────────────────────────── */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 80;
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;
    if (scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  updateNavbar();
}

/* ─── MOBILE DRAWER ──────────────────────────────────────── */
function initMobileDrawer() {
  const hamburger = $('#hamburger');
  const drawer    = $('#mobileDrawer');
  if (!hamburger || !drawer) return;

  function openDrawer() {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    document.body.classList.add('menu-open');
    // Focus first link
    const firstLink = $('a', drawer);
    if (firstLink) firstLink.focus();
  }

  function closeDrawer() {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    document.body.classList.remove('menu-open');
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = drawer.classList.contains('open');
    isOpen ? closeDrawer() : openDrawer();
  });

  // Close on link click
  $$('.mobile-drawer__link, .mobile-drawer__cta', drawer).forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close on outside click
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });
}

/* ─── HERO PARALLAX ──────────────────────────────────────── */
function initParallax() {
  const heroDeep = $('.hero__bg--deep');
  if (!heroDeep) return;

  // Disable on reduced-motion or mobile
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches || window.innerWidth < 768) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroHeight = document.getElementById('hero')?.offsetHeight || 0;
        if (scrollY < heroHeight) {
          const offset = scrollY * 0.35;
          heroDeep.style.transform = `scale(1.05) translateY(${offset}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ─── HERO PARTICLES ─────────────────────────────────────── */
function initParticles() {
  const container = $('#heroParticles');
  if (!container) return;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) return;

  const PARTICLE_COUNT = 18;
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'hero__particle';

    const size = Math.random() * 4 + 2;
    const x    = Math.random() * 100;
    const dur  = Math.random() * 15 + 12;
    const del  = Math.random() * 10;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      animation-duration: ${dur}s;
      animation-delay: -${del}s;
    `;
    container.appendChild(p);
    particles.push(p);
  }
}

/* ─── MENU TABS ──────────────────────────────────────────── */
function initMenuTabs() {
  const tabs   = $$('.menu__tab');
  const panels = $$('.menu__panel');
  if (!tabs.length || !panels.length) return;

  function activateTab(selectedTab) {
    const target = selectedTab.dataset.tab;

    tabs.forEach(tab => {
      const isSelected = tab === selectedTab;
      tab.classList.toggle('menu__tab--active', isSelected);
      tab.setAttribute('aria-selected', isSelected);
    });

    panels.forEach(panel => {
      const isActive = panel.id === `tab-${target}`;
      panel.classList.toggle('menu__panel--active', isActive);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));

    // Keyboard navigation
    tab.addEventListener('keydown', (e) => {
      let idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') {
        idx = (idx + 1) % tabs.length;
        tabs[idx].focus();
        activateTab(tabs[idx]);
      }
      if (e.key === 'ArrowLeft') {
        idx = (idx - 1 + tabs.length) % tabs.length;
        tabs[idx].focus();
        activateTab(tabs[idx]);
      }
    });
  });
}

/* ─── INTERSECTION OBSERVER — AOS ───────────────────────── */
function initScrollAnimations() {
  const elements = $$('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
}

/* ─── HERO FADE-UP TRIGGER ───────────────────────────────── */
function initHeroAnimations() {
  // These run after preloader clears, but also on DOMContentLoaded fallback
  const elements = $$('.animate-fade-up');
  if (!elements.length) return;

  // Fallback: if preloader not present, animate immediately
  if (!$('#preloader')) {
    setTimeout(() => {
      elements.forEach(el => el.classList.add('visible'));
    }, 100);
  }
}

/* ─── LIVE OPEN STATUS ───────────────────────────────────── */
function initOpenStatus() {
  const statusEl = $('#openStatus');
  if (!statusEl) return;

  function updateStatus() {
    // Coffee Avenue closes at 1 AM — 25:00 in 24h from midnight perspective
    // Open: any time until 1:00 AM
    const now = new Date();
    // Use Bangladesh Standard Time (UTC+6)
    const bdOffset = 6 * 60;
    const utcMins  = now.getUTCHours() * 60 + now.getUTCMinutes();
    const bdMins   = (utcMins + bdOffset) % (24 * 60);

    // Open if before 60 (1:00 AM = 60 minutes) OR after 0 (opened)
    // Assuming open all day until 1 AM next day, not specifying open time, just close at 1AM
    const CLOSE_MINUTE = 60; // 1:00 AM = 60 minutes from midnight

    const isOpen = bdMins >= CLOSE_MINUTE; // open from 1AM onwards until next 1AM

    const dot  = statusEl.querySelector('.location__status-dot');
    const text = statusEl.querySelector('.location__status-text');

    if (isOpen) {
      statusEl.classList.remove('closed');
      text.textContent = 'Open Now · Closes at 1:00 AM';
    } else {
      statusEl.classList.add('closed');
      text.textContent = 'Closed · Opens Later Today';
    }
  }

  updateStatus();
  // Update every minute
  setInterval(updateStatus, 60 * 1000);
}

/* ─── SMOOTH SCROLLING ───────────────────────────────────── */
function initSmoothScroll() {
  const NAVBAR_HEIGHT = 80;

  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── BACK TO TOP ────────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  const SHOW_THRESHOLD = 400;
  let ticking = false;

  function updateVisibility() {
    btn.classList.toggle('visible', window.scrollY > SHOW_THRESHOLD);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateVisibility);
      ticking = true;
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── MENU ITEM — TILT EFFECT ────────────────────────────── */
function initCardTilt() {
  const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!mq.matches) return;

  $$('.menu-item, .service-card, .review-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -4;
      const tiltY = dx * 4;

      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 0.1s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });
}

/* ─── NAV LINK ACTIVE STATE ──────────────────────────────── */
function initNavActiveState() {
  const sections = $$('section[id]');
  const navLinks = $$('.navbar__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href').replace('#', '');
          link.style.color = href === id ? 'var(--clr-white)' : '';
          if (href === id) {
            link.style.setProperty('--link-underline', '100%');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ─── INIT ───────────────────────────────────────────────── */
function init() {
  initPreloader();
  initNavbar();
  initMobileDrawer();
  initParallax();
  initParticles();
  initMenuTabs();
  initScrollAnimations();
  initHeroAnimations();
  initOpenStatus();
  initSmoothScroll();
  initBackToTop();
  initCardTilt();
  initNavActiveState();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
