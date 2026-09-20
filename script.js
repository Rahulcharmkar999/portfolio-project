/* =====================================================
   PORTFOLIO SCRIPT - Rahul Charmkar
   ===================================================== */

// Shortcuts for selecting elements
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];


/* ===== 1. Preloader ===== */
// Hide the welcome screen 1.5 seconds after the page loads
window.addEventListener('load', () => {
  setTimeout(() => {
    $('#preloader').classList.add('hide');
  }, 1500);
});


/* ===== 2. Typing effect (hero) ===== */
const roles = [
  'an Aspiring AI Engineer',
  'a Machine Learning Enthusiast',
  'a Python Developer',
  'a Data Science Learner'
];

const typedText = $('#typed');
let roleIndex = 0;      // which role is showing
let charIndex = 0;      // how many letters are showing
let isDeleting = false; // typing or erasing

function type() {
  const word = roles[roleIndex];

  // Add or remove one letter
  charIndex += isDeleting ? -1 : 1;
  typedText.textContent = word.slice(0, charIndex);

  let speed = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex === word.length) {
    // Finished typing: pause, then start erasing
    isDeleting = true;
    speed = 1400;
  } else if (isDeleting && charIndex === 0) {
    // Finished erasing: move to the next role
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 300;
  }

  setTimeout(type, speed);
}

type();


/* ===== 3. Scroll effects ===== */
const header = $('header');
const progressBar = $('#progress');
const topButton = $('#topBtn');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  // Progress bar width (0% to 100%)
  progressBar.style.width = (scrolled / maxScroll) * 100 + '%';

  // Blurred navbar after a little scroll
  header.classList.toggle('scrolled', scrolled > 50);

  // Show back-to-top button after 400px
  topButton.classList.toggle('show', scrolled > 400);
});

topButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ===== 4. Reveal on scroll ===== */
// Elements with class "reveal" fade in when they enter the screen
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;

    // Stagger siblings so cards appear one after another
    const position = [...el.parentNode.children].indexOf(el);
    el.style.transitionDelay = (position % 4) * 0.12 + 's';

    el.classList.add('show');
    revealObserver.unobserve(el);

    // Clean up afterwards so hover effects stay fast
    setTimeout(() => {
      el.classList.remove('reveal', 'reveal-left', 'reveal-right', 'show');
      el.style.transitionDelay = '';
    }, 1200);
  });
}, { threshold: 0.15 });

$$('.reveal').forEach((el) => revealObserver.observe(el));


/* ===== 5. Number counters (Stats section) ===== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const numberEl = entry.target;
    const end = Number(numberEl.dataset.count);  // target from data-count
    const step = Math.max(1, end / 60);          // about 1 second of counting
    let value = 0;

    function count() {
      value = Math.min(end, value + step);
      numberEl.textContent = Math.floor(value);
      if (value < end) requestAnimationFrame(count);
    }

    count();
    counterObserver.unobserve(numberEl);
  });
});

$$('[data-count]').forEach((el) => counterObserver.observe(el));


/* ===== 6. Active nav link ===== */
// Highlight the nav link of the section currently on screen
const navLinks = $$('nav a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      const isCurrent = link.getAttribute('href') === '#' + entry.target.id;
      link.classList.toggle('active', isCurrent);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });  // triggers near the middle of the screen

$$('section[id]').forEach((section) => sectionObserver.observe(section));


/* ===== 7. Mobile menu ===== */
$('#menuBtn').addEventListener('click', () => {
  $('nav').classList.toggle('open');
});

// Close the menu after choosing a link
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    $('nav').classList.remove('open');
  });
});


/* ===== 8. Mouse spotlight on cards ===== */
// Saves mouse position inside each card; CSS uses it for the glow
const cards = $$(
  '.detail-card, .skill-category, .timeline-content, ' +
  '.learn-card, .project-card, .certificate-card, .coding-card, .info-box'
);

cards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const box = card.getBoundingClientRect();
    card.style.setProperty('--mx', event.clientX - box.left + 'px');
    card.style.setProperty('--my', event.clientY - box.top + 'px');
  });
});


/* ===== 9. Skills filter tabs ===== */
// Each skill card has data-group (languages, web, data, tools).
// Clicking a tab shows only the cards of that group.
const filterButtons = $$('.filter-btn');
const skillCards = $$('.skill-category');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    // Highlight the clicked tab
    filterButtons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-selected', 'true');

    // Show or hide cards
    skillCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.group === filter;
      card.classList.toggle('is-hidden', !show);

      // Replay the small fade-in on the cards that stay visible
      if (show) {
        card.classList.remove('filter-in');
        void card.offsetWidth;   // restart the CSS animation
        card.classList.add('filter-in');
      }
    });
  });
});

// Remove the animation class when it ends, so hover lift keeps working
skillCards.forEach((card) => {
  card.addEventListener('animationend', () => {
    card.classList.remove('filter-in');
  });
});


/* ===== 10. Tech Stack progress bars ===== */
// Each bar grows to its level (set in HTML with --level) when it scrolls into view
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('filled');
    barObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

$$('.tech-fill').forEach((bar) => barObserver.observe(bar));