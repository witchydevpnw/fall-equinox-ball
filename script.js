/* ============================================================
   FALL EQUINOX BALL — script.js
   Obsidian Book Collective
   ============================================================ */

'use strict';

/* ------------------------------------------------------------
   CONFIG — update these values as needed
   ------------------------------------------------------------ */
const CONFIG = {
  // TODO: Replace with your Squarespace ticket URL when available
  ticketURL: 'https://YOUR-SQUARESPACE-URL-HERE',

  // Event date — adjust timezone offset if needed (currently uses local time)
  eventDate: new Date('2026-09-26T20:00:00'),

  // Ticket sale start date
  ticketSaleDate: new Date('2026-05-15T00:00:00'),
};


/* ============================================================
   COUNTDOWN TIMER
   ============================================================ */
(function initCountdown() {
  const els = {
    days:    document.getElementById('cd-days'),
    hours:   document.getElementById('cd-hours'),
    minutes: document.getElementById('cd-minutes'),
    seconds: document.getElementById('cd-seconds'),
    timer:   document.getElementById('countdown-timer'),
  };

  function pad(n, len = 2) {
    return String(n).padStart(len, '0');
  }

  function tick() {
    const now  = new Date();
    const diff = CONFIG.eventDate - now;

    if (diff <= 0) {
      els.timer.innerHTML =
        '<p class="section-title" style="font-size:clamp(1.5rem,4vw,2.5rem)">The Ball Has Begun!</p>';
      return;
    }

    const days    = Math.floor(diff / 864e5);
    const hours   = Math.floor((diff % 864e5) / 36e5);
    const minutes = Math.floor((diff % 36e5)  / 6e4);
    const seconds = Math.floor((diff % 6e4)   / 1e3);

    els.days.textContent    = pad(days, 3);
    els.hours.textContent   = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();


/* ============================================================
   TICKET CTA — date-aware, updates both instances
   ============================================================ */
(function initTicketCTA() {
  const now         = new Date();
  const ticketsLive = now >= CONFIG.ticketSaleDate;

  function buildCTA() {
    if (ticketsLive) {
      return `
        <a href="${CONFIG.ticketURL}" target="_blank" rel="noopener" class="btn-tickets">
          Buy Tickets — Make Haste!
        </a>`;
    }
    return `
      <button class="btn-tickets locked" disabled aria-disabled="true">
        Tickets on Sale May 15th
      </button>
      <p class="tickets-note">Mark thy calendar — tickets on sale 5 / 15 / 2026</p>`;
  }

  const html = buildCTA();
  const primary   = document.getElementById('ticket-cta');
  const secondary = document.getElementById('ticket-cta-2');
  if (primary)   primary.innerHTML   = html;
  if (secondary) secondary.innerHTML = html;
})();


/* ============================================================
   FALLING LEAVES — canvas animation
   ============================================================ */
(function initLeaves() {
  const canvas = document.getElementById('leaves-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Colors drawn from the brand palette
  const COLORS = [
    'rgba(116,147,145,',  // teal
    'rgba(178,194,186,',  // floral gray-green
    'rgba(120,145,142,',  // floral gray-teal
    'rgba(205,122,102,',  // floral coral
    'rgba(102, 78, 31,',  // gold
  ];

  const COUNT = 45;

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Leaf {
    constructor(randomY = false) {
      this.init(randomY);
    }

    init(randomY = false) {
      this.x      = Math.random() * canvas.width;
      this.y      = randomY ? Math.random() * canvas.height : -20;
      this.w      = Math.random() * 10 + 5;
      this.h      = this.w * (Math.random() * 0.4 + 0.4);
      this.vy     = Math.random() * 1.2 + 0.4;
      this.vx     = (Math.random() - 0.5) * 0.6;
      this.angle  = Math.random() * Math.PI * 2;
      this.spin   = (Math.random() - 0.5) * 0.035;
      this.wobble = Math.random() * Math.PI * 2;
      this.wFreq  = Math.random() * 0.025 + 0.008;
      this.alpha  = Math.random() * 0.35 + 0.08;
      this.color  = COLORS[Math.floor(Math.random() * COLORS.length)];
    }

    update() {
      this.wobble += this.wFreq;
      this.x      += this.vx + Math.sin(this.wobble) * 0.55;
      this.y      += this.vy;
      this.angle  += this.spin;
      if (this.y > canvas.height + 30) this.init();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = `${this.color}1)`;
      ctx.beginPath();
      // Simple leaf: ellipse with a pointed tip
      ctx.ellipse(0, 0, this.w / 2, this.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Stem line
      ctx.strokeStyle = `${this.color}0.6)`;
      ctx.lineWidth   = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -this.h / 2);
      ctx.lineTo(0,  this.h / 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  let leaves = [];

  function build() {
    leaves = Array.from({ length: COUNT }, () => new Leaf(true));
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    leaves.forEach(l => { l.update(); l.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  build();
  loop();

  // Re-size canvas when the window changes
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); build(); }, 200);
  });
})();


/* ============================================================
   SWIPER CAROUSEL
   ============================================================ */
(function initSwiper() {
  new Swiper('.gallery-swiper', {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 20,
    loop: true,
    speed: 700,
    autoplay: {
      delay: 3200,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    keyboard: { enabled: true },
    a11y: {
      prevSlideMessage: 'Previous photo',
      nextSlideMessage: 'Next photo',
    },
  });
})();


/* ============================================================
   SCROLL FADE-IN
   ============================================================ */
(function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach(el => observer.observe(el));
})();


/* ============================================================
   PARALLAX — subtle shift on corner decorations while scrolling
   ============================================================ */
(function initParallax() {
  const tl = document.querySelector('.corner-tl');
  const br = document.querySelector('.corner-br');
  const tr = document.querySelector('.corner-tr');
  const bl = document.querySelector('.corner-bl');

  if (!tl) return;

  // Reduced motion check
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const shift = y * 0.12;
      if (tl) tl.style.transform = `translateY(${shift}px)`;
      if (br) br.style.transform = `scaleX(-1) translateY(${-shift}px)`;
      if (tr) tr.style.transform = `translateY(${shift * 0.7}px)`;
      if (bl) bl.style.transform = `rotate(180deg) translateY(${shift * 0.7}px)`;
      ticking = false;
    });
    ticking = true;
  });
})();
