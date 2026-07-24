'use strict';

const body = document.body;
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const yearElement = document.querySelector('#current-year');
const cursorGlow = document.querySelector('.cursor-glow');

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

const academicStylesheet = document.createElement('link');
academicStylesheet.rel = 'stylesheet';
academicStylesheet.href = 'academic-credentials.css?v=cqu-formal-qualifications-1';
document.head.append(academicStylesheet);

const credentialsMain = document.querySelector('.credentials-main');
const credentialsHero = document.querySelector('.credentials-hero');

if (credentialsMain && credentialsHero && !document.querySelector('#formal-qualifications')) {
  const formalSection = document.createElement('section');
  formalSection.className = 'formal-qualifications-section';
  formalSection.id = 'formal-qualifications';
  formalSection.innerHTML = `
    <div class="shell">
      <div class="formal-qualification-heading reveal">
        <div>
          <p class="section-code">01 / FORMAL QUALIFICATIONS</p>
          <h2>CQUniversity qualifications completed <em>with Distinction.</em></h2>
        </div>
        <p>
          Formal Australian Qualifications Framework awards completed as part of my postgraduate information-technology pathway.
        </p>
      </div>

      <div class="formal-qualification-grid">
        <article class="formal-qualification-card reveal">
          <div class="testamur-frame">
            <span class="testamur-loading">Loading Graduate Diploma testamur…</span>
            <img class="testamur-image" data-testamur="graduate-diploma" alt="CQUniversity Graduate Diploma of Information Technology with Distinction testamur awarded to Jerald Christopher Bucud" hidden>
          </div>
          <div class="qualification-content">
            <div class="qualification-tags"><span>CQUniversity</span><span>AQF</span><span>With Distinction</span></div>
            <h3>Graduate Diploma of Information Technology</h3>
            <p class="qualification-issuer">Central Queensland University</p>
            <p class="qualification-date">Conferred 24 November 2025</p>
            <p class="qualification-description">
              A completed postgraduate qualification recognising advanced information-technology study and progression toward the Master of Information Technology.
            </p>
            <div class="qualification-actions">
              <a class="qualification-action" data-testamur-link="graduate-diploma" href="#" target="_blank" rel="noopener noreferrer"><span>Open testamur</span><span>↗</span></a>
            </div>
          </div>
        </article>

        <article class="formal-qualification-card reveal">
          <div class="testamur-frame">
            <span class="testamur-loading">Loading Graduate Certificate testamur…</span>
            <img class="testamur-image" data-testamur="graduate-certificate" alt="CQUniversity Graduate Certificate in Information Technology with Distinction testamur awarded to Jerald Christopher Bucud" hidden>
          </div>
          <div class="qualification-content">
            <div class="qualification-tags"><span>CQUniversity</span><span>AQF</span><span>With Distinction</span></div>
            <h3>Graduate Certificate in Information Technology</h3>
            <p class="qualification-issuer">Central Queensland University</p>
            <p class="qualification-date">Conferred 28 July 2025</p>
            <p class="qualification-description">
              A completed postgraduate qualification establishing a strong foundation across information technology and software-development study.
            </p>
            <div class="qualification-actions">
              <a class="qualification-action" data-testamur-link="graduate-certificate" href="#" target="_blank" rel="noopener noreferrer"><span>Open testamur</span><span>↗</span></a>
            </div>
          </div>
        </article>
      </div>
    </div>
  `;

  credentialsHero.insertAdjacentElement('afterend', formalSection);
}

const summaryValues = document.querySelectorAll('.credentials-summary > div > span');
if (summaryValues[0]) summaryValues[0].textContent = '09';
if (summaryValues[1]) summaryValues[1].textContent = '04';

const imageSources = {
  'graduate-diploma': [
    'assets/academic/build/gd-00.b64',
    'assets/academic/build/gd-01.b64',
    'assets/academic/build/gd-02.b64',
  ],
  'graduate-certificate': [
    'assets/academic/build/gc-00.b64',
    'assets/academic/build/gc-01.b64',
    'assets/academic/build/gc-02.b64',
  ],
};

const testamurObjectUrls = new Set();

const cleanBase64 = (value) => value
  .replace(/^data:[^;]+;base64,/, '')
  .replace(/\s/g, '');

const decodeBase64 = (value) => {
  const decoded = atob(cleanBase64(value));
  const bytes = new Uint8Array(decoded.length);

  for (let index = 0; index < decoded.length; index += 1) {
    bytes[index] = decoded.charCodeAt(index);
  }

  return bytes;
};

const mergeByteArrays = (arrays) => {
  const totalLength = arrays.reduce((total, array) => total + array.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;

  arrays.forEach((array) => {
    merged.set(array, offset);
    offset += array.length;
  });

  return merged;
};

const isCompleteWebP = (bytes) => {
  if (bytes.length < 12) return false;

  const header = String.fromCharCode(...bytes.slice(0, 4));
  const format = String.fromCharCode(...bytes.slice(8, 12));
  if (header !== 'RIFF' || format !== 'WEBP') return false;

  const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const expectedLength = dataView.getUint32(4, true) + 8;
  return bytes.length >= expectedLength;
};

const decodeTestamurChunks = (encodedChunks) => {
  const cleanedChunks = encodedChunks.map(cleanBase64);
  const attempts = [];

  // The repository stores each binary segment as its own Base64 document.
  // Decode each document first, then combine the resulting bytes.
  try {
    attempts.push(mergeByteArrays(cleanedChunks.map(decodeBase64)));
  } catch (error) {
    console.warn('Independent Base64 chunk decoding failed.', error);
  }

  // Retain support for assets that were split as one continuous Base64 string.
  try {
    attempts.push(decodeBase64(cleanedChunks.join('')));
  } catch (error) {
    console.warn('Continuous Base64 decoding failed.', error);
  }

  const completeImage = attempts.find(isCompleteWebP);
  if (!completeImage) {
    throw new Error('The reconstructed testamur is incomplete or is not a valid WebP image.');
  }

  const dataView = new DataView(
    completeImage.buffer,
    completeImage.byteOffset,
    completeImage.byteLength,
  );
  const expectedLength = dataView.getUint32(4, true) + 8;

  return completeImage.slice(0, expectedLength);
};

const loadTestamur = async (image, paths) => {
  const loading = image.parentElement?.querySelector('.testamur-loading');

  try {
    const chunks = await Promise.all(paths.map(async (path) => {
      const response = await fetch(`${path}?v=cqu-2025-2`);
      if (!response.ok) throw new Error(`Unable to load ${path}`);
      return response.text();
    }));

    const bytes = decodeTestamurChunks(chunks);
    const objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'image/webp' }));
    testamurObjectUrls.add(objectUrl);

    const link = document.querySelector(`[data-testamur-link="${image.dataset.testamur}"]`);
    if (link) link.href = objectUrl;

    image.addEventListener('load', () => {
      image.hidden = false;
      loading?.remove();
    }, { once: true });

    image.addEventListener('error', () => {
      image.hidden = true;
      if (loading) loading.textContent = 'Testamur preview is temporarily unavailable.';
      URL.revokeObjectURL(objectUrl);
      testamurObjectUrls.delete(objectUrl);
    }, { once: true });

    image.src = objectUrl;
  } catch (error) {
    image.hidden = true;
    if (loading) loading.textContent = 'Testamur preview is temporarily unavailable.';
    console.error(error);
  }
};

document.querySelectorAll('[data-testamur]').forEach((image) => {
  loadTestamur(image, imageSources[image.dataset.testamur]);
});

window.addEventListener('pagehide', () => {
  testamurObjectUrls.forEach((url) => URL.revokeObjectURL(url));
  testamurObjectUrls.clear();
});

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

const revealElements = document.querySelectorAll('.reveal');

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
