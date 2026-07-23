'use strict';

const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const yearElement = document.querySelector('#current-year');
const cursorGlow = document.querySelector('.cursor-glow');
const revealElements = document.querySelectorAll('.reveal');

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

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu();
});

if (yearElement) yearElement.textContent = String(new Date().getFullYear());

// Use the actual certificate images stored in the portfolio repository.
const localCertificateImages = {
  'learn-python-3.png': 'assets/certificates/learn-python-3.webp',
  'learn-intermediate-python-3.png': 'assets/certificates/learn-intermediate-python-3.webp',
  'learn-advanced-python-3.png': 'assets/certificates/learn-advanced-python-3.webp',
  'learn-java.png': 'assets/certificates/learn-java.webp',
};

document.querySelectorAll('.certificate-image').forEach((image) => {
  const currentSource = image.getAttribute('src') ?? '';
  const matchedFilename = Object.keys(localCertificateImages).find((filename) =>
    currentSource.endsWith(filename),
  );

  if (!matchedFilename) return;

  image.onerror = null;
  image.removeAttribute('onerror');
  image.src = `${localCertificateImages[matchedFilename]}?v=actual-certificates-1`;
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -35px' },
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min((index % 4) * 65, 195)}ms`;
    observer.observe(element);
  });
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
