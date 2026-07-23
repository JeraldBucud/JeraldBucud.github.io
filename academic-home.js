'use strict';

(() => {
  const aboutSection = document.querySelector('#about');
  if (!aboutSection || document.querySelector('#academic-qualifications')) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'academic-credentials.css?v=cqu-formal-qualifications-1';
  document.head.append(stylesheet);

  const section = document.createElement('section');
  section.className = 'section academic-home-section';
  section.id = 'academic-qualifications';
  section.innerHTML = `
    <div class="shell">
      <div class="academic-home-heading">
        <div>
          <p class="section-code">03 / FORMAL QUALIFICATIONS</p>
          <h2>Postgraduate IT qualifications completed <em>with Distinction.</em></h2>
        </div>
        <p>
          Two Australian Qualifications Framework awards from CQUniversity, forming part of my pathway toward the Master of Information Technology.
        </p>
      </div>

      <div class="academic-home-grid">
        <article class="academic-home-card">
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
              A completed postgraduate qualification recognising advanced study in information technology and progression toward the Master of Information Technology.
            </p>
          </div>
        </article>

        <article class="academic-home-card">
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
          </div>
        </article>
      </div>

      <div class="academic-home-footer">
        <a class="button button-solid" href="credentials.html">View all credentials <span>↗</span></a>
      </div>
    </div>
  `;

  aboutSection.insertAdjacentElement('afterend', section);

  const heroActions = document.querySelector('.hero-actions');
  if (heroActions && !heroActions.querySelector('a[href="credentials.html"]')) {
    const credentialsButton = document.createElement('a');
    credentialsButton.className = 'button button-ghost';
    credentialsButton.href = 'credentials.html';
    credentialsButton.innerHTML = 'View credentials <span>↗</span>';
    heroActions.append(credentialsButton);
  }

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

  const loadImage = async (image, paths) => {
    try {
      const chunks = await Promise.all(paths.map(async (path) => {
        const response = await fetch(`${path}?v=cqu-2025-1`);
        if (!response.ok) throw new Error(`Unable to load ${path}`);
        return response.text();
      }));

      image.src = `data:image/webp;base64,${chunks.join('').replace(/\s/g, '')}`;
      image.hidden = false;
      image.parentElement?.querySelector('.testamur-loading')?.remove();
    } catch (error) {
      const loading = image.parentElement?.querySelector('.testamur-loading');
      if (loading) loading.textContent = 'Testamur preview unavailable. View it on the Credentials page.';
      console.error(error);
    }
  };

  section.querySelectorAll('[data-testamur]').forEach((image) => {
    loadImage(image, imageSources[image.dataset.testamur]);
  });
})();
