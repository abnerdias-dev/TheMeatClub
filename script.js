/**
 * THE MEAT CLUB — Main JavaScript
 * Handles: preloader, navbar, menu tabs, testimonials slider, scroll animations, back to top
 */

document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     PRELOADER
  ========================================= */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('hidden');
        // Remove from DOM after transition
        preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
      }, 1800);
    });
  }


  /* =========================================
     NAVBAR — scroll effect + hamburger
  ========================================= */
  const navbar  = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  }

  // Close nav on link click (mobile)
  document.querySelectorAll('#nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });


  /* =========================================
     MENU TABS
  ========================================= */
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });


  /* =========================================
     TESTIMONIALS SLIDER
  ========================================= */
  const track   = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoTimer;

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      currentIndex = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetTimer(); });
    nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetTimer(); });

    function startTimer() {
      autoTimer = setInterval(() => goTo(currentIndex + 1), 5000);
    }

    function resetTimer() {
      clearInterval(autoTimer);
      startTimer();
    }

    startTimer();

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
        resetTimer();
      }
    });
  }


  /* =========================================
     SCROLL ANIMATIONS (custom AOS-like)
  ========================================= */
  const animatedEls = document.querySelectorAll('[data-aos]');

  function checkVisibility() {
    animatedEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.88;
      if (inView) el.classList.add('aos-animate');
    });
  }

  window.addEventListener('scroll', checkVisibility, { passive: true });
  checkVisibility(); // run on load


  /* =========================================
     BACK TO TOP BUTTON
  ========================================= */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* =========================================
     ACTIVE NAV LINK on scroll (highlight)
  ========================================= */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('#nav-links a:not(.nav-cta)');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.id;
    });

    navAnchors.forEach(a => {
      a.classList.remove('active-link');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active-link');
      }
    });
  }, { passive: true });


  /* =========================================
     PARALLAX — subtle on hero
  ========================================= */
  const heroImg = document.querySelector('.hero-img');

  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `scale(1.05) translateY(${scrollY * 0.15}px)`;
      }
    }, { passive: true });
  }


  /* =========================================
     SMOOTH SCROLL for anchor links
  ========================================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* =========================================
     GALLERY — lightbox overlay (simple)
  ========================================= */
  const galleryItems = document.querySelectorAll('.gallery-item');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'gallery-overlay';
  overlay.innerHTML = `
    <div class="go-inner">
      <img id="go-img" src="" alt="" />
      <button id="go-close" aria-label="Fechar"><i class="fas fa-times"></i></button>
    </div>
  `;
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,0.92);
    display:none;align-items:center;justify-content:center;cursor:zoom-out;
    backdrop-filter:blur(6px);
  `;

  const goInner = overlay.querySelector('.go-inner');
  goInner.style.cssText = 'position:relative;max-width:90vw;max-height:90vh;';

  const goImg = overlay.querySelector('#go-img');
  goImg.style.cssText = 'max-width:100%;max-height:85vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,0.8);object-fit:contain;';

  const goClose = overlay.querySelector('#go-close');
  goClose.style.cssText = `
    position:absolute;top:-16px;right:-16px;width:40px;height:40px;
    background:var(--gold);border:none;border-radius:50%;cursor:pointer;
    display:flex;align-items:center;justify-content:center;color:#000;
    font-size:1rem;transition:transform 0.2s;
  `;
  goClose.addEventListener('mouseenter', () => goClose.style.transform = 'scale(1.1)');
  goClose.addEventListener('mouseleave', () => goClose.style.transform = '');

  document.body.appendChild(overlay);

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        goImg.src = img.src;
        goImg.alt = img.alt;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeOverlay() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  goClose.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeOverlay();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeOverlay();
  });


  /* =========================================
     ACTIVE NAV LINK style
  ========================================= */
  const style = document.createElement('style');
  style.textContent = `
    #nav-links a.active-link { color: var(--gold) !important; }
    #nav-links a.active-link::after { width: 100% !important; }
  `;
  document.head.appendChild(style);


  console.log('%c🥩 The Meat Club — Website loaded!', 'color:#c8922a;font-size:14px;font-weight:bold;');

});
