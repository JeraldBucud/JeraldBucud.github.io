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
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hero && orbitOne && orbitTwo && !reducedMotion) {
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
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
      ],
    },
    {
      className: 'orbit-track orbit-track-inner',
      duration: '23s',
      technologies: [
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
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
      <span class="core-count">10 technologies</span>
    </div>
  `;

  const orbitTracks = [...developmentCore.querySelectorAll('.orbit-track')];
  const techNodes = [...developmentCore.querySelectorAll('.tech-node')];

  const setTrackPaused = (track, paused) => {
    if (!track) return;
    track.style.animationPlayState = paused ? 'paused' : 'running';
    track.querySelectorAll('.tech-node-inner').forEach((inner) => {
      inner.style.animationPlayState = paused ? 'paused' : 'running';
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

  orbitTracks.forEach((track) => {
    track.style.pointerEvents = 'none';
  });

  techNodes.forEach((node) => {
    node.style.pointerEvents = 'auto';
    const track = node.closest('.orbit-track');

    const activate = () => {
      setTrackPaused(track, true);
      setNodeActive(node, true);
    };

    const deactivate = () => {
      setNodeActive(node, false);
      setTrackPaused(track, false);
    };

    node.addEventListener('pointerenter', activate);
    node.addEventListener('pointerleave', deactivate);
    node.addEventListener('focus', activate);
    node.addEventListener('blur', deactivate);
  });
}
