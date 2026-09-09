const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');

if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
  }));
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// typewriter effect for the hero title only, not repeated on other sections
const heroTitle = document.querySelector('.hero-title');
if (heroTitle && !reduceMotion) {
  const original = heroTitle.innerHTML;
  const container = document.createElement('span');
  container.style.visibility = 'hidden';
  container.innerHTML = original;
  document.body.appendChild(container);

  heroTitle.innerHTML = '';
  let delay = 0;
  const step = 28; // ms per character

  const walk = (sourceNode, targetNode) => {
    sourceNode.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split('').forEach(ch => {
          const span = document.createElement('span');
          span.className = 'tw-char';
          span.textContent = ch;
          span.style.animationDelay = delay + 'ms';
          delay += step;
          targetNode.appendChild(span);
        });
      } else {
        const clone = node.cloneNode(false);
        targetNode.appendChild(clone);
        walk(node, clone);
      }
    });
  };
  walk(container, heroTitle);
  container.remove();
}

const revealEls = document.querySelectorAll('.reveal');

if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('in'));
} else {
  document.querySelectorAll('#projects .project.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
}

// scrollspy — highlight the nav link for the section currently in view
const sections = document.querySelectorAll('main > section[id]');
const navLinkByHref = new Map();
document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
  navLinkByHref.set(a.getAttribute('href').slice(1), a);
});

if (sections.length && navLinkByHref.size) {
  const setActive = (id) => {
    navLinkByHref.forEach(a => a.classList.remove('active'));
    const active = navLinkByHref.get(id);
    if (active) active.classList.add('active');
  };

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => spy.observe(s));
}
