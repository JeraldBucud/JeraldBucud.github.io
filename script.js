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

// Personal branding and full professional name.
document.title = 'Jerald Christopher Bucud | Software Developer';

document.querySelector('meta[property="og:title"]')?.setAttribute(
  'content',
  'Jerald Christopher Bucud | Software Developer',
);

const textWalker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
const textNodes = [];
while (textWalker.nextNode()) textNodes.push(textWalker.currentNode);
textNodes.forEach((node) => {
  if (node.nodeValue?.includes('Jerald Bucud')) {
    node.nodeValue = node.nodeValue.replaceAll('Jerald Bucud', 'Jerald Christopher Bucud');
  }
});

const brandSymbol = document.querySelector('.brand-symbol');
const brandRole = document.querySelector('.brand-role');
if (brandSymbol) {
  brandSymbol.innerHTML = '<img class="personal-brand-logo" src="assets/branding/jaycee-bucud-white.svg" alt="">';
}
if (brandRole) {
  brandRole.textContent = 'Jerald Christopher Bucud';
}

const favicon = document.querySelector('link[rel="icon"]');
if (favicon) favicon.setAttribute('href', 'assets/branding/jaycee-bucud-black.svg');

// Development core: only technologies used in projects or coursework.
const developmentCore = document.querySelector('.system-map');

if (developmentCore) {
  const technologyRings = [
    {
      className: 'orbit-track orbit-track-outer',
      duration: '36s',
      technologies: [
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
        { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
        { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
      ],
    },
    {
      className: 'orbit-track orbit-track-middle orbit-track-reverse',
      duration: '29s',
      technologies: [
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
        { name: 'Next.js', icon: 'assets/icons/nextjs.svg', monochrome: true },
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
        { name: 'FastAPI', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg' },
      ],
    },
    {
      className: 'orbit-track orbit-track-inner',
      duration: '23s',
      technologies: [
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
        { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', monochrome: true },
      ],
    },
  ];

  const renderRing = (ring) => {
    const nodes = ring.technologies.map((technology, index) => {
      const angle = (360 / ring.technologies.length) * index - 90;
      return `
        <div class="orbit-position" style="--node-angle:${angle}deg">
          <button class="tech-node${technology.monochrome ? ' tech-node-monochrome' : ''}" type="button" aria-label="${technology.name}" title="${technology.name}">
            <span class="tech-node-inner">
              <img src="${technology.icon}" alt="" loading="lazy">
              <span class="tech-label">${technology.name}</span>
            </span>
          </button>
        </div>
      `;
    }).join('');

    return `<div class="${ring.className}" style="--orbit-duration:${ring.duration}">${nodes}</div>`;
  };

  developmentCore.innerHTML = `
    <div class="map-grid" aria-hidden="true"></div>
    <div class="core-ring core-ring-outer" aria-hidden="true"></div>
    <div class="core-ring core-ring-middle" aria-hidden="true"></div>
    <div class="technology-orbits">${technologyRings.map(renderRing).join('')}</div>
    <div class="system-core">
      <img class="core-brand-logo" src="assets/branding/jaycee-bucud-white.svg" alt="">
      <span class="core-eyebrow">Development core</span>
      <strong>BUILD<br>CONNECT<br>IMPROVE</strong>
      <span class="core-count">11 technologies</span>
    </div>
  `;

  const coreStylesheet = document.createElement('link');
  coreStylesheet.rel = 'stylesheet';
  coreStylesheet.href = `development-core.css?v=shared-ring-hover-2-${Date.now()}`;
  document.head.append(coreStylesheet);

  const orbitTracks = [...developmentCore.querySelectorAll('.orbit-track')];
  const outerTrack = developmentCore.querySelector('.orbit-track-outer');
  const secondRingTracks = [
    developmentCore.querySelector('.orbit-track-middle'),
    developmentCore.querySelector('.orbit-track-inner'),
  ].filter(Boolean);
  const techNodes = [...developmentCore.querySelectorAll('.tech-node')];

  // Transparent orbit layers must not block the logo cards beneath them.
  orbitTracks.forEach((track) => {
    track.style.pointerEvents = 'none';
  });
  techNodes.forEach((node) => {
    node.style.pointerEvents = 'auto';
  });

  const setTracksPaused = (tracks, paused) => {
    tracks.filter(Boolean).forEach((track) => {
      track.style.animationPlayState = paused ? 'paused' : 'running';
      track.querySelectorAll('.tech-node-inner').forEach((inner) => {
        inner.style.animationPlayState = paused ? 'paused' : 'running';
      });
    });
  };

  const setNodeActive = (node, active) => {
    const position = node.closest('.orbit-position');
    const label = node.querySelector('.tech-label');
    const image = node.querySelector('img');

    if (position) position.style.zIndex = active ? '200' : '';
    node.style.zIndex = active ? '200' : '';
    node.style.borderColor = active ? 'var(--acid)' : '';
    node.style.background = active ? '#172017' : '';
    node.style.boxShadow = active
      ? '0 0 0 3px rgba(201, 255, 69, .10), 0 17px 42px rgba(201, 255, 69, .15)'
      : '';
    node.style.scale = active ? '1.14' : '';

    if (label) {
      label.style.opacity = active ? '1' : '';
      label.style.visibility = active ? 'visible' : '';
      label.style.transform = active ? 'translate(-50%, 0)' : '';
    }

    if (image) {
      const monochrome = node.classList.contains('tech-node-monochrome');
      image.style.filter = active
        ? `${monochrome ? 'brightness(0) invert(1) ' : ''}drop-shadow(0 0 8px rgba(201, 255, 69, .42))`
        : '';
      image.style.transform = active ? 'scale(1.05)' : '';
    }
  };

  const getTracksForNode = (node) => {
    const track = node.closest('.orbit-track');
    const isSecondRing = track?.classList.contains('orbit-track-middle')
      || track?.classList.contains('orbit-track-inner');
    return isSecondRing ? secondRingTracks : [outerTrack].filter(Boolean);
  };

  const activate = (node) => {
    setTracksPaused(getTracksForNode(node), true);
    setNodeActive(node, true);
  };

  const deactivate = (node) => {
    setNodeActive(node, false);
    setTracksPaused(getTracksForNode(node), false);
  };

  techNodes.forEach((node) => {
    node.addEventListener('pointerenter', () => activate(node));
    node.addEventListener('pointerleave', () => deactivate(node));
    node.addEventListener('focus', () => activate(node));
    node.addEventListener('blur', () => deactivate(node));
  });
}
