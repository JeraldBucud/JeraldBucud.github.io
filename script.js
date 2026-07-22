'use strict';

const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const revealElements = document.querySelectorAll('.reveal');
const sections = [...document.querySelectorAll('main section[id]')];
const cursorGlow = document.querySelector('.cursor-glow');
const yearElement = document.querySelector('#current-year');

const closeMenu = () => {
  navLinks?.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  body.classList.remove('menu-open');
};

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  body.classList.toggle('menu-open', isOpen);
});

navAnchors.forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu();
});

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -45px' },
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min((index % 4) * 70, 210)}ms`;
    revealObserver.observe(element);
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navAnchors.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-32% 0px -58% 0px', threshold: 0 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  const animateGlow = () => {
    currentX += (targetX - currentX) * 0.09;
    currentY += (targetY - currentY) * 0.09;
    cursorGlow.style.transform = `translate(${currentX - 210}px, ${currentY - 210}px)`;
    requestAnimationFrame(animateGlow);
  };

  animateGlow();
}

const hero = document.querySelector('.hero');
const orbitOne = document.querySelector('.hero-orbit-one');
const orbitTwo = document.querySelector('.hero-orbit-two');

if (hero && orbitOne && orbitTwo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;

  const updateHeroMotion = () => {
    const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
    orbitOne.style.transform = `translate3d(0, ${progress * 60}px, 0) rotate(${progress * 18}deg)`;
    orbitTwo.style.transform = `translate3d(0, ${progress * 34}px, 0) rotate(${-progress * 22}deg)`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateHeroMotion);
  }, { passive: true });
}
