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

const developmentCore = document.querySelector('.system-map');

if (developmentCore) {
  const technologies = [
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg', x: 50, y: 12, layer: 'language' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', x: 77, y: 22, layer: 'language' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg', x: 88, y: 46, layer: 'language' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg', x: 82, y: 72, layer: 'frontend' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg', x: 61, y: 88, layer: 'frontend' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', x: 37, y: 88, layer: 'frontend' },
    { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', x: 16, y: 72, layer: 'frontend', monochrome: true },
    { name: 'Spring', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg', x: 11, y: 47, layer: 'backend' },
    { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg', x: 23, y: 23, layer: 'backend' },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg', x: 35, y: 35, layer: 'backend' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', x: 65, y: 35, layer: 'data' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg', x: 66, y: 65, layer: 'data' },
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', x: 34, y: 65, layer: 'tooling', monochrome: true },
  ];

  const technologyNodes = technologies.map((technology, index) => `
    <button
      class="tech-node tech-node-${technology.layer}${technology.monochrome ? ' tech-node-monochrome' : ''}"
      type="button"
      style="--node-x:${technology.x}%; --node-y:${technology.y}%; --node-delay:${index * -0.17}s"
      aria-label="${technology.name}"
      title="${technology.name}"
    >
      <img src="${technology.icon}" alt="" loading="lazy">
      <span>${technology.name}</span>
    </button>
  `).join('');

  developmentCore.innerHTML = `
    <div class="map-grid" aria-hidden="true"></div>
    <div class="core-ring core-ring-outer" aria-hidden="true"></div>
    <div class="core-ring core-ring-middle" aria-hidden="true"></div>
    <div class="core-ring core-ring-inner" aria-hidden="true"></div>
    <div class="technology-nodes">${technologyNodes}</div>
    <div class="system-core">
      <span class="core-eyebrow">Development core</span>
      <strong>BUILD<br>CONNECT<br>IMPROVE</strong>
      <span class="core-count">13 technologies</span>
    </div>
    <div class="core-legend" aria-label="Technology categories">
      <span><i class="legend-dot legend-language"></i> Languages</span>
      <span><i class="legend-dot legend-framework"></i> Frameworks</span>
      <span><i class="legend-dot legend-data"></i> Data &amp; tools</span>
    </div>
  `;

  const coreStyle = document.createElement('style');
  coreStyle.textContent = `
    .system-map {
      isolation: isolate;
    }

    .technology-nodes {
      position: absolute;
      inset: 0;
      z-index: 5;
    }

    .core-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      border: 1px solid var(--line);
      border-radius: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
    }

    .core-ring-outer {
      width: min(88%, 540px);
      aspect-ratio: 1;
      border-style: dashed;
      animation: core-ring-spin 55s linear infinite;
    }

    .core-ring-middle {
      width: min(66%, 405px);
      aspect-ratio: 1;
      border-color: rgba(106, 228, 218, .22);
      animation: core-ring-spin 42s linear infinite reverse;
    }

    .core-ring-inner {
      width: min(43%, 265px);
      aspect-ratio: 1;
      border-color: rgba(201, 255, 69, .30);
    }

    @keyframes core-ring-spin {
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .tech-node {
      position: absolute;
      top: var(--node-y);
      left: var(--node-x);
      display: grid;
      width: 58px;
      min-height: 58px;
      place-items: center;
      padding: 9px;
      border: 1px solid var(--line-strong);
      border-radius: 13px;
      background: rgba(11, 14, 11, .94);
      box-shadow: 0 12px 30px rgba(0, 0, 0, .28);
      cursor: default;
      transform: translate(-50%, -50%);
      animation: tech-node-float 4.8s ease-in-out infinite;
      animation-delay: var(--node-delay);
      transition: z-index .2s ease, border-color .2s ease, background .2s ease, transform .25s var(--ease), box-shadow .25s ease;
    }

    .tech-node::after {
      content: '';
      position: absolute;
      inset: -5px;
      z-index: -1;
      border: 1px solid transparent;
      border-radius: 17px;
      transition: border-color .2s ease;
    }

    .tech-node img {
      width: 34px;
      height: 34px;
      object-fit: contain;
      pointer-events: none;
    }

    .tech-node-monochrome img {
      filter: brightness(0) invert(1);
    }

    .tech-node span {
      position: absolute;
      top: calc(100% + 7px);
      left: 50%;
      width: max-content;
      max-width: 112px;
      padding: 4px 6px;
      border: 1px solid var(--line);
      background: #0b0e0b;
      color: var(--muted);
      font-family: var(--font-mono);
      font-size: 7px;
      letter-spacing: .06em;
      opacity: 0;
      pointer-events: none;
      text-transform: uppercase;
      transform: translate(-50%, -4px);
      transition: opacity .2s ease, transform .2s ease;
    }

    .tech-node:hover,
    .tech-node:focus-visible {
      z-index: 9;
      border-color: var(--acid);
      background: #111711;
      box-shadow: 0 16px 42px rgba(201, 255, 69, .10);
      outline: none;
      transform: translate(-50%, -50%) scale(1.12);
    }

    .tech-node:hover::after,
    .tech-node:focus-visible::after {
      border-color: rgba(201, 255, 69, .28);
    }

    .tech-node:hover span,
    .tech-node:focus-visible span {
      opacity: 1;
      transform: translate(-50%, 0);
    }

    .tech-node-language {
      border-color: rgba(201, 255, 69, .42);
    }

    .tech-node-frontend,
    .tech-node-backend {
      border-color: rgba(106, 228, 218, .38);
    }

    .tech-node-data,
    .tech-node-tooling {
      border-color: rgba(174, 140, 255, .40);
    }

    @keyframes tech-node-float {
      0%, 100% { margin-top: 0; }
      50% { margin-top: -7px; }
    }

    .system-core {
      z-index: 7;
    }

    .core-count {
      margin-top: 14px;
      color: var(--acid);
      font-family: var(--font-mono);
      font-size: 7px;
      letter-spacing: .10em;
      text-transform: uppercase;
    }

    .core-legend {
      position: absolute;
      right: 14px;
      bottom: 12px;
      z-index: 8;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 8px 14px;
      max-width: 360px;
      color: var(--dim);
      font-family: var(--font-mono);
      font-size: 7px;
      letter-spacing: .06em;
      text-transform: uppercase;
    }

    .core-legend span {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .legend-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .legend-language { background: var(--acid); }
    .legend-framework { background: var(--cyan); }
    .legend-data { background: var(--purple); }

    @media (max-width: 1120px) {
      .tech-node {
        width: 52px;
        min-height: 52px;
        padding: 8px;
      }

      .tech-node img {
        width: 30px;
        height: 30px;
      }
    }

    @media (max-width: 680px) {
      .system-map {
        min-height: 520px;
      }

      .tech-node {
        width: 45px;
        min-height: 45px;
        padding: 7px;
        border-radius: 11px;
      }

      .tech-node img {
        width: 26px;
        height: 26px;
      }

      .system-core {
        width: 170px;
        height: 170px;
      }

      .system-core strong {
        font-size: 23px;
      }

      .core-legend {
        right: 8px;
        bottom: 8px;
        left: 8px;
        justify-content: center;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .core-ring,
      .tech-node {
        animation: none !important;
      }
    }
  `;

  document.head.append(coreStyle);
}
