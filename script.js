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

// typewriter effect for the hero title, only when not reduced-motion
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
  document.querySelectorAll('#work .project.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.1) + 's';
  });
  document.querySelectorAll('.jump-grid.reveal .jump-card').forEach((el, i) => {
    el.style.transitionDelay = (i * 0.08) + 's';
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
