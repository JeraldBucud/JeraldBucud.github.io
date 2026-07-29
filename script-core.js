'use strict';

const loadSharedStylesheet = (selector, href, dataAttribute) => {
  if (document.querySelector(selector)) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = href;
  stylesheet.dataset[dataAttribute] = '';
  document.head.appendChild(stylesheet);
};

// Shared compatibility and accessibility layers are loaded on every page that
// uses this common script, avoiding repeated edits across each HTML document.
loadSharedStylesheet(
  'link[data-responsive-browser-qa]',
  'responsive-browser-qa.css?v=sprint-6a-1',
  'responsiveBrowserQa',
);
loadSharedStylesheet(
  'link[data-accessibility]',
  'accessibility.css?v=sprint-6b-1',
  'accessibility',
);

const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const brandLink = document.querySelector('.brand');
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const allNavigationLinks = [...document.querySelectorAll('.nav-links a')];
const revealElements = document.querySelectorAll('.reveal');
const sections = [...document.querySelectorAll('main section[id]')];
const cursorGlow = document.querySelector('.cursor-glow');
const yearElement = document.querySelector('#current-year');
const mainContent = document.querySelector('main');
const pageFooter = document.querySelector('footer');
const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reducedMotion = reducedMotionQuery.matches;

const setBackgroundInert = (isInert) => {
  [mainContent, pageFooter].forEach((region) => {
    if (!region) return;
    if (isInert) region.setAttribute('inert', '');
    else region.removeAttribute('inert');
  });
};

const setMenuState = (isOpen) => {
  navLinks?.classList.toggle('open', isOpen);
  menuToggle?.setAttribute('aria-expanded', String(isOpen));
  menuToggle?.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  body.classList.toggle('menu-open', isOpen);
  setBackgroundInert(isOpen);
};

const closeMenu = ({ restoreFocus = false } = {}) => {
  const wasOpen = navLinks?.classList.contains('open') ?? false;
  setMenuState(false);

  if (restoreFocus && wasOpen) {
    menuToggle?.focus();
  }
};

menuToggle?.addEventListener('click', () => {
  const isOpen = !(navLinks?.classList.contains('open') ?? false);
  setMenuState(isOpen);

  if (isOpen) {
    requestAnimationFrame(() => allNavigationLinks[0]?.focus());
  }
});

allNavigationLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));
brandLink?.addEventListener('click', () => closeMenu());

document.addEventListener('keydown', (event) => {
  const menuIsOpen = navLinks?.classList.contains('open') ?? false;

  if (event.key === 'Escape') {
    closeMenu({ restoreFocus: true });
    return;
  }

  if (event.key !== 'Tab' || !menuIsOpen || !menuToggle) return;

  const focusableMenuItems = [menuToggle, ...allNavigationLinks];
  const firstItem = focusableMenuItems[0];
  const lastItem = focusableMenuItems[focusableMenuItems.length - 1];

  if (event.shiftKey && document.activeElement === firstItem) {
    event.preventDefault();
    lastItem?.focus();
  } else if (!event.shiftKey && document.activeElement === lastItem) {
    event.preventDefault();
    firstItem?.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860) closeMenu();
});

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

// Expose the current page or in-page location to assistive technology without
// marking category links on case-study pages as the current page.
document.querySelectorAll('.nav-links a.active').forEach((link) => {
  const targetUrl = new URL(link.getAttribute('href') ?? '', window.location.href);
  const currentUrl = new URL(window.location.href);

  if (targetUrl.pathname === currentUrl.pathname && !targetUrl.hash) {
    link.setAttribute('aria-current', 'page');
  }
});

// Announce links that deliberately open a new browser tab.
document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  const announcement = 'opens in a new tab';
  const currentLabel = link.getAttribute('aria-label');

  if (currentLabel) {
    if (!currentLabel.toLowerCase().includes(announcement)) {
      link.setAttribute('aria-label', `${currentLabel}, ${announcement}`);
    }
    return;
  }

  if (link.querySelector('.new-tab-announcement')) return;
  const note = document.createElement('span');
  note.className = 'sr-only new-tab-announcement';
  note.textContent = ' (opens in a new tab)';
  link.appendChild(note);
});

// Prevent decorative arrows and ticker separators from adding noise to spoken output.
document.querySelectorAll([
  '.ticker-track i',
  '.identity-arrow',
  '.contact-link:not(.contact-link-static) i',
  '.button > span:last-child',
  '.nav-cta > span:last-child',
  '.text-link > span:last-child',
  '.qualification-action > span:last-child',
  '.credential-link > span:last-child',
].join(',')).forEach((element) => element.setAttribute('aria-hidden', 'true'));

// Keep the shared identity mark consistent on pages that do not load
// homepage-specific branding styles.
document.querySelectorAll('.personal-brand-logo').forEach((logo) => {
  logo.setAttribute('width', '36');
  logo.setAttribute('height', '36');
  Object.assign(logo.style, {
    display: 'block',
    width: '36px',
    height: '36px',
    objectFit: 'contain',
  });
});

document.querySelectorAll('.brand-symbol').forEach((symbol) => {
  Object.assign(symbol.style, {
    display: 'grid',
    width: '36px',
    height: '36px',
    flex: '0 0 36px',
    placeItems: 'center',
    lineHeight: '0',
  });
});

// Three issuer-hosted previews are used because the matching local image files
// are not part of the repository. The credential links remain unchanged.
const credentialPreviewSources = new Map([
  ['data-analytics-bootcamp.png', 'https://cdn.disco.co/certificates/aa88007d-0de5-4241-8b26-d46d33c78cea.png'],
  ['agile-scrum-project-management.jpg', 'https://udemy-certificate.s3.amazonaws.com/image/UC-a12a2e50-95cd-4bb6-9879-017471efa6df.jpg'],
  ['project-management-beginner.jpg', 'https://udemy-certificate.s3.amazonaws.com/image/UC-8dd28725-5eb3-4a63-b01b-ae9796141f33.jpg'],
]);

document.querySelectorAll('.certificate-image').forEach((image) => {
  const currentSource = image.getAttribute('src') ?? '';
  const filename = currentSource.split('/').pop()?.split('?')[0] ?? '';
  const issuerSource = credentialPreviewSources.get(filename);
  if (!issuerSource) return;

  image.referrerPolicy = 'no-referrer';
  image.decoding = 'async';
  image.src = issuerSource;
});

// The main SmartTech call-to-action already links to the public repository.
// Remove the repeated repository callout so all public case studies finish consistently.
document.querySelector('.smarttech-repository-note')?.remove();

let motionToggle = null;
const ticker = document.querySelector('.ticker');
const motionPreferenceKey = 'portfolio-motion-paused';

const readSavedMotionPreference = () => {
  try {
    return window.localStorage.getItem(motionPreferenceKey) === 'true';
  } catch {
    return false;
  }
};

const persistMotionPreference = (isPaused) => {
  try {
    window.localStorage.setItem(motionPreferenceKey, String(isPaused));
  } catch {
    // Browsing modes that block storage should still retain the current-page state.
  }
};

const updateMotionControl = (isPaused) => {
  if (!motionToggle) return;
  motionToggle.setAttribute('aria-pressed', String(isPaused));
  motionToggle.setAttribute(
    'aria-label',
    isPaused ? 'Resume decorative motion' : 'Pause decorative motion',
  );
  motionToggle.textContent = isPaused ? 'Resume motion' : 'Pause motion';
};

const setMotionPaused = (isPaused, { persist = true } = {}) => {
  body.classList.toggle('motion-paused', isPaused);
  updateMotionControl(isPaused);
  if (persist) persistMotionPreference(isPaused);
};

if (reducedMotion) {
  setMotionPaused(true, { persist: false });
} else if (ticker) {
  motionToggle = document.createElement('button');
  motionToggle.className = 'motion-toggle';
  motionToggle.type = 'button';
  ticker.classList.add('has-motion-toggle');
  ticker.appendChild(motionToggle);

  setMotionPaused(readSavedMotionPreference(), { persist: false });

  motionToggle.addEventListener('click', () => {
    setMotionPaused(!body.classList.contains('motion-paused'));
  });
}

if (reducedMotion) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
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
          const isCurrent = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isCurrent);

          if (isCurrent) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-32% 0px -58% 0px', threshold: 0 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

if (cursorGlow && window.matchMedia('(pointer: fine)').matches && !reducedMotion) {
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('pointermove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  const animateGlow = () => {
    if (!body.classList.contains('motion-paused')) {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      cursorGlow.style.transform = `translate(${currentX - 210}px, ${currentY - 210}px)`;
    }
    requestAnimationFrame(animateGlow);
  };

  animateGlow();
}

const hero = document.querySelector('.hero');
const orbitOne = document.querySelector('.hero-orbit-one');
const orbitTwo = document.querySelector('.hero-orbit-two');

if (hero && orbitOne && orbitTwo && !reducedMotion) {
  let ticking = false;

  const updateHeroMotion = () => {
    if (!body.classList.contains('motion-paused')) {
      const progress = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
      orbitOne.style.transform = `translate3d(0, ${progress * 60}px, 0) rotate(${progress * 18}deg)`;
      orbitTwo.style.transform = `translate3d(0, ${progress * 34}px, 0) rotate(${-progress * 22}deg)`;
    }
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
  // The animated map duplicates the adjacent written skills list. Treat it as a
  // decorative visual and avoid adding eight non-functional buttons to the tab order.
  developmentCore.setAttribute('aria-hidden', 'true');
  developmentCore.removeAttribute('aria-label');

  const technologyRings = [
    {
      className: 'orbit-track orbit-track-outer',
      duration: '36s',
      technologies: [
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
        { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg' },
      ],
    },
    {
      className: 'orbit-track orbit-track-middle orbit-track-reverse',
      duration: '29s',
      technologies: [
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
        { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
        { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
        { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg' },
      ],
    },
  ];

  const technologyCount = technologyRings.reduce(
    (total, ring) => total + ring.technologies.length,
    0,
  );

  const renderRing = (ring) => {
    const nodes = ring.technologies.map((technology, index) => {
      const angle = (360 / ring.technologies.length) * index - 90;
      return `
        <div class="orbit-position" data-node-angle="${angle}" style="--node-angle:${angle}deg">
          <span class="tech-node${technology.monochrome ? ' tech-node-monochrome' : ''}" title="${technology.name}">
            <span class="tech-node-inner">
              <img src="${technology.icon}" alt="" loading="lazy">
              <span class="tech-label">${technology.name}</span>
            </span>
          </span>
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
      <span class="core-eyebrow">Primary stack</span>
      <strong>JAVA<br>SPRING<br>REACT</strong>
      <span class="core-count">${technologyCount} core technologies</span>
    </div>
  `;

  // Preserve even spacing even where older layout rules use fixed node angles.
  developmentCore.querySelectorAll('.orbit-position').forEach((position) => {
    position.style.setProperty('--node-angle', `${position.dataset.nodeAngle}deg`, 'important');
  });

  const orbitTracks = [...developmentCore.querySelectorAll('.orbit-track')];
  const techNodes = [...developmentCore.querySelectorAll('.tech-node')];
  const activeNodes = new Set();

  const setTrackPaused = (track, paused) => {
    if (!track) return;
    track.style.animationPlayState = paused ? 'paused' : 'running';
    track.querySelectorAll('.tech-node-inner').forEach((inner) => {
      inner.style.animationPlayState = paused ? 'paused' : 'running';
    });
  };

  const syncOrbitPlayback = () => {
    const paused = activeNodes.size > 0;
    orbitTracks.forEach((track) => setTrackPaused(track, paused));
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

  const syncNodeInteraction = (node) => {
    const active = node.matches(':hover');
    setNodeActive(node, active);

    if (active) activeNodes.add(node);
    else activeNodes.delete(node);

    syncOrbitPlayback();
  };

  orbitTracks.forEach((track) => {
    track.style.pointerEvents = 'none';
  });

  techNodes.forEach((node) => {
    node.style.pointerEvents = 'auto';

    const syncSoon = () => {
      requestAnimationFrame(() => syncNodeInteraction(node));
    };

    node.addEventListener('pointerenter', syncSoon);
    node.addEventListener('pointerleave', syncSoon);
  });
}
