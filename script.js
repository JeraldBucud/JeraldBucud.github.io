const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');

const savedTheme = localStorage.getItem('portfolio-theme');
const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && preferredDark)) {
  root.dataset.theme = 'dark';
}

themeToggle?.addEventListener('click', () => {
  const isDark = root.dataset.theme === 'dark';

  if (isDark) {
    delete root.dataset.theme;
    localStorage.setItem('portfolio-theme', 'light');
  } else {
    root.dataset.theme = 'dark';
    localStorage.setItem('portfolio-theme', 'dark');
  }
});

const closeMenu = () => {
  navLinks?.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('is-open') ?? false;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener('click', closeMenu);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) {
    closeMenu();
  }
});

document.querySelector('#current-year').textContent = new Date().getFullYear();

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -45px',
    },
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}
