/* ============================================================
   LLOYD JERIEL PARAYNO - PORTFOLIO
   script.js
   ============================================================ */

'use strict';

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (!dot || !ring) return;

  // Check for touch device
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring follows with easing
  function animateRing() {
    const ease = 0.12;
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states on interactive elements
  const hoverTargets = document.querySelectorAll(
    '[data-cursor-hover], a, button, .portfolio-thumb, .filter-btn, .service-card, .skill-card, .testi-btn'
  );

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('cursor-hover');
      ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('cursor-hover');
      ring.classList.remove('cursor-hover');
    });
  });

  // Click pulse
  document.addEventListener('mousedown', () => {
    ring.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    ring.classList.remove('cursor-click');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ============================================================
   LOADER
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger hero animations
      document.querySelectorAll('.hero-content .reveal-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 150 + 100);
      });
    }, 1900);
  });
})();

/* ============================================================
   NAVBAR - scroll behavior
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Scrolled class for styling
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }, { passive: true });
})();

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
(function initHamburger() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !mobileMenu) return;

  function toggleMenu(open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });
})();

/* ============================================================
   ACTIVE NAV LINK on scroll
   ============================================================ */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => observer.observe(section));
})();

/* ============================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================ */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Skill bars
        const bar = entry.target.querySelector('.skill-fill');
        if (bar) {
          const width = bar.getAttribute('data-width');
          setTimeout(() => { bar.style.width = width + '%'; }, 200);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => {
    // Don't double-observe hero elements (handled by loader)
    if (!el.closest('.hero-content')) {
      observer.observe(el);
    }
  });
})();

/* ============================================================
   ANIMATED COUNTER (hero stats)
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  function animateCounter(el) {
    const target    = parseInt(el.getAttribute('data-count'), 10);
    const duration  = 1800;
    const start     = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   SKILL BARS (triggered separately for non-reveal elements)
   ============================================================ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        setTimeout(() => {
          entry.target.style.width = width + '%';
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => observer.observe(bar));
})();

/* ============================================================
   PORTFOLIO FILTER — REVISED
   ============================================================ */
(function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.pf-card');

  if (!filterBtns.length) return;

  // Count per category
  function updateCounts(filter) {
    const totals = { all: 0, reels: 0, canva: 0, social: 0 };
    cards.forEach(c => {
      const cat = c.dataset.category;
      totals.all++;
      if (totals[cat] !== undefined) totals[cat]++;
    });
    Object.keys(totals).forEach(key => {
      const el = document.getElementById('count-' + key);
      if (el) el.textContent = totals[key];
    });
  }

  updateCounts('all');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach((card, i) => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.classList.remove('pf--hidden');
          card.classList.remove('pf--visible');
          // Stagger re-entrance
          setTimeout(() => {
            card.classList.add('pf--visible');
          }, i * 55);
        } else {
          card.classList.add('pf--hidden');
          card.classList.remove('pf--visible');
        }
      });
    });
  });

  // Initial entrance animation
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add('pf--visible'), i * 70 + 300);
  });
})();

/* ============================================================
   PORTFOLIO MODAL — REVISED
   ============================================================ */
(function initModal() {
  const overlay       = document.getElementById('modalOverlay');
  const closeBtn      = document.getElementById('modalClose');
  const modalBody     = document.getElementById('modalBody');
  const modalBg       = document.getElementById('modalBg');
  const modalPlatform = document.getElementById('modalPlatform');
  const modalNum      = document.getElementById('modalNum');
  const modalIcon     = document.getElementById('modalIcon');
  // NEW: the real thumbnail <img> element inside the modal
  const modalThumb    = document.getElementById('modalThumb');

  if (!overlay) return;

  /* ── Platform icon SVGs ─────────────────────────────────── */
  const ytIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>`;
  const igIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/></svg>`;
  const ttIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z"/></svg>`;
  const cvIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>`;
  const playBig   = `<svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.14"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
  const designBig = `<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="opacity:0.12"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`;

  /* ── Project data (unchanged from original) ─────────────── */
  const PROJECTS = {
    p1: {
      category:'Reels & Video Editing', platform:'YouTube Shorts',
      platformClass:'pf-platform--yt', platformIcon:ytIcon, num:'01',
      bgClass:'pf-bg--boxing',
      // NEW: thumbnail image src — matches the card's <img src>
      thumb:'images/boxing-thumbnail.png',
      title:'Boxing Storytelling Edit',
      desc:'A motivational short-form boxing video built around emotional storytelling — cinematic cuts, AI voiceover, timed subtitles, layered sound effects, and background music working in sync to keep the viewer hooked from the first second.',
      tags:['Storytelling','AI Voiceover','Sports Editing','Captions','YouTube Shorts'],
      link:'https://youtube.com/shorts/cAoYZdHP6g8?si=JqnESPDs-78FZuwI',
      centerIcon:playBig
    },
    p2: {
      category:'Reels & Video Editing', platform:'YouTube Shorts',
      platformClass:'pf-platform--yt', platformIcon:ytIcon, num:'02',
      bgClass:'pf-bg--daily', thumb:'images/daily-bread.png',
      title:'DailyBread Spiritual Content',
      desc:'Short-form spiritual and Bible-based content using AI voiceover, gentle emotional pacing, and engaging visual storytelling. Each edit delivers a meaningful message in under 60 seconds without sacrificing depth.',
      tags:['Faith Content','AI Voiceover','Short-Form Editing','Subtitles'],
      link:'https://youtube.com/shorts/1CInVLu-QQM?si=1R1IUDIHrOATsDtf',
      centerIcon:playBig
    },
    p3: {
      category:'Reels & Video Editing', platform:'YouTube Shorts',
      platformClass:'pf-platform--yt', platformIcon:ytIcon, num:'03',
      bgClass:'pf-bg--mic', thumb:'images/micready.png',
      title:'Mic Ready Teleprompter Practice',
      desc:'Educational short-form content for aspiring flight attendants practicing with a teleprompter. Clean cuts, accurate caption timing, and engaging pacing make this series approachable and easy to follow.',
      tags:['Educational Content','Captions','Reels Editing','Clean Cuts'],
      link:'https://youtube.com/shorts/ONx89Jy7T7o?si=V1p0hM74Uez6ga18',
      centerIcon:playBig
    },
    p4: {
      category:'Reels & Video Editing', platform:'Instagram',
      platformClass:'pf-platform--ig', platformIcon:igIcon, num:'04',
      bgClass:'pf-bg--platz', thumb:'images/tom-platz.png',
      title:'Tom Platz Motivational Reel',
      desc:'A cinematic tribute to classic bodybuilding legend Tom Platz. This edit channels raw intensity through dramatic cuts, bold subtitles, and a cinematic color grade — designed to resonate deeply with fitness audiences on Instagram.',
      tags:['Fitness Content','Storytelling','Gym Aesthetic','Cinematic Edit','Instagram Reels'],
      link:'https://www.instagram.com/p/DYKBLU8SwEf/',
      centerIcon:playBig
    },
    p5: {
      category:'Reels & Video Editing', platform:'TikTok',
      platformClass:'pf-platform--tt', platformIcon:ttIcon, num:'05',
      bgClass:'pf-bg--talking', thumb:'images/talk-head.png',
      title:'Talking Head Social Clip',
      desc:'Polished talking-head format short-form video for TikTok — featuring a clean intro animation, accurate caption overlays, deliberate pacing cuts, and a modern social media visual style that holds attention.',
      tags:['Talking Head','TikTok Editing','Captions','Social Format'],
      link:'https://www.tiktok.com/@dame_talks21/video/7503877665477152007?is_from_webapp=1&sender_device=pc',
      centerIcon:playBig
    },
    p6: {
      category:'Canva Graphics', platform:'Canva',
      platformClass:'pf-platform--cv', platformIcon:cvIcon, num:'06',
      bgClass:'pf-bg--iron1', thumb:'images/carousel.png',
      title:'Iron District Gym Carousel 01',
      desc:'A fitness-themed multi-slide Instagram carousel for Iron District Gym. Built on a strong masculine visual identity using modern typography, dark backgrounds, and strategic layout to drive saves and shares.',
      tags:['Carousel Design','Fitness Branding','Canva','Instagram','Typography'],
      link:'https://canva.link/xd8jzrronsjggfr',
      centerIcon:designBig
    },
    p7: {
      category:'Canva Graphics', platform:'Canva',
      platformClass:'pf-platform--cv', platformIcon:cvIcon, num:'07',
      bgClass:'pf-bg--iron2', thumb:'images/carousel-01.png',
      title:'Iron District Gym Carousel 02',
      desc:'A follow-up carousel for Iron District Gym focused on motivational messaging and audience engagement. Consistent branding with layout variation keeps the feed visually cohesive yet fresh.',
      tags:['Gym Content','Canva Graphics','Branding','Social Media'],
      link:'https://canva.link/4uz5znzt8ipfkwn',
      centerIcon:designBig
    },
    p8: {
      category:'Canva Graphics', platform:'Canva',
      platformClass:'pf-platform--cv', platformIcon:cvIcon, num:'08',
      bgClass:'pf-bg--iron3', thumb:'images/cbum.png',
      title:'Iron District Gym Carousel 03',
      desc:'The third carousel in the Iron District series — dark aesthetic fitness graphics with a clean structural layout, bold typographic choices, and modern branding visuals designed for maximum impact.',
      tags:['Fitness Design','Carousel','Social Media Graphics','Dark Aesthetic'],
      link:'https://canva.link/xclokydymmogz7x',
      centerIcon:designBig
    },
    p9: {
      category:'Canva Graphics', platform:'Canva',
      platformClass:'pf-platform--cv', platformIcon:cvIcon, num:'09',
      bgClass:'pf-bg--anytime', thumb:'images/redesign.png',
      title:'Anytime Fitness Hiring Post Redesign',
      desc:"A complete redesign of a social media hiring post for Anytime Fitness — improved visual hierarchy, cleaner typography, stronger color contrast, and a more polished layout that elevates the brand's digital presence.",
      tags:['Redesign','Canva','Branding','Hiring Post','Hierarchy'],
      link:'https://canva.link/63osvvtgo1s9jy0',
      centerIcon:designBig
    }
  };

  /* ── Helper: load thumbnail into modal with fade-in ─────── */
  function loadModalThumb(src, alt) {
    if (!modalThumb) return;

    // Reset immediately — remove loaded class so it fades out first
    modalThumb.classList.remove('thumb-loaded');

    if (!src) {
      modalThumb.src = '';
      return;
    }

    // Set up onload handler before setting src
    // so we catch the load event even if cached
    modalThumb.onload = function () {
      // Small RAF delay so the opacity transition is visible
      requestAnimationFrame(() => {
        modalThumb.classList.add('thumb-loaded');
      });
    };

    modalThumb.onerror = function () {
      // If image fails, keep it hidden — gradient bg shows through
      modalThumb.classList.remove('thumb-loaded');
    };

    modalThumb.alt = alt || '';
    modalThumb.src = src;
  }

  /* ── openModal ──────────────────────────────────────────── */
  function openModal(id) {
    const p = PROJECTS[id];
    if (!p) return;

    // Set gradient background class (unchanged)
    modalBg.className = 'pf-modal-bg ' + p.bgClass;

    // Set platform badge (unchanged)
    modalPlatform.className = 'pf-modal-platform ' + p.platformClass;
    modalPlatform.innerHTML = p.platformIcon + p.platform;

    // Set card number & center icon (unchanged)
    modalNum.textContent = p.num;
    modalIcon.innerHTML  = p.centerIcon;

    // NEW: Load the real thumbnail image with cinematic fade-in
    loadModalThumb(p.thumb, p.title);

    // Build modal body (unchanged)
    modalBody.innerHTML = `
      <div class="pf-modal-meta">
        <span class="pf-modal-category">${p.category}</span>
      </div>
      <h3 class="pf-modal-title">${p.title}</h3>
      <p class="pf-modal-desc">${p.desc}</p>
      <div class="pf-modal-tags">
        ${p.tags.map(t => `<span class="pf-modal-chip">${t}</span>`).join('')}
      </div>
      <div class="pf-modal-actions">
        <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="pf-modal-link">
          View Live Project
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
        <button class="pf-modal-link pf-modal-link--ghost" id="modalCloseInner">Close</button>
      </div>
    `;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalCloseInner')?.addEventListener('click', closeModal);
  }

  /* ── closeModal ─────────────────────────────────────────── */
  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Reset thumbnail when modal closes
    if (modalThumb) {
      modalThumb.classList.remove('thumb-loaded');
    }
  }

  /* ── Event listeners (unchanged) ───────────────────────── */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pf-btn[data-id]');
    if (btn) { openModal(btn.dataset.id); return; }
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();

/* ============================================================
   TESTIMONIALS CAROUSEL
   ============================================================ */
(function initTestimonials() {
  const track    = document.getElementById('testimonialsTrack');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  const dotsWrap = document.getElementById('testiDots');

  if (!track) return;

  const cards    = track.querySelectorAll('.testimonial-card');
  const total    = cards.length;
  let current    = 0;
  let autoTimer;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.testi-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    resetAuto();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-play
  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();

  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', startAuto);

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  }, { passive: true });
})();

/* ============================================================
   CONTACT FORM — WEB3FORMS
   ============================================================ */

(function initContactForm() {

  const form = document.getElementById('contactForm');
  const submitBtn = form.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `
      <span>Sending...</span>
    `;

    submitBtn.disabled = true;

    try {

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {

        form.reset();

        submitBtn.innerHTML = `
          <span>Message Sent</span>
        `;

        if (success) {
          success.classList.add('visible');
        }

        setTimeout(() => {

          submitBtn.innerHTML = originalText;

          submitBtn.disabled = false;

          if (success) {
            success.classList.remove('visible');
          }

        }, 4000);

      } else {

        alert(data.message);

        submitBtn.innerHTML = originalText;

        submitBtn.disabled = false;
      }

    } catch (error) {

      alert("Something went wrong.");

      submitBtn.innerHTML = originalText;

      submitBtn.disabled = false;

    }

  });

})();

/* ============================================================
   SMOOTH SCROLL for nav links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ============================================================
   MOUSE GLOW EFFECT on skill cards
   ============================================================ */
(function initCardGlow() {
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
})();

/* ============================================================
   PARALLAX on hero orbs (subtle)
   ============================================================ */
(function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.08;
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ============================================================
   NAVBAR ACTIVE LINK STYLES
   ============================================================ */
(function injectNavActiveStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--text-primary);
    }
    .nav-link.active::after {
      width: 100%;
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   INIT LOG
   ============================================================ */
console.log('%cLloyd Jeriel Parayno Portfolio', 'font-family: sans-serif; font-size: 16px; font-weight: bold; color: #b8f5a0;');
console.log('%cSocial Media Manager & Content Creator', 'font-family: sans-serif; font-size: 12px; color: #8a8a96;');
