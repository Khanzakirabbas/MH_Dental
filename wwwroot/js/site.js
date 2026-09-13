// Mobile nav hamburger toggle
(() => {
  const toggle = document.getElementById('nav-toggle');
  const list = document.getElementById('main-nav-list');
  if (!toggle || !list) return;

  toggle.addEventListener('click', () => {
    const isOpen = list.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close the menu again once the viewport grows back to desktop width.
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && list.classList.contains('open')) {
      list.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Horizontal card sliders (categories, hot products, partners)
(() => {
  document.querySelectorAll('.slider-wrap').forEach((wrap) => {
    const track = wrap.querySelector('[data-slider]');
    const prevBtn = wrap.querySelector('.slider-arrow.prev');
    const nextBtn = wrap.querySelector('.slider-arrow.next');
    if (!track) return;

    const scrollByAmount = () => Math.max(track.clientWidth * 0.8, 200);

    prevBtn?.addEventListener('click', () => {
      track.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
    });
    nextBtn?.addEventListener('click', () => {
      track.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
    });
  });
})();

// Hero banner slider - cross-fades between the images in wwwroot/images,
// with arrow buttons, clickable dots, and autoplay that pauses on hover
// and resets its timer whenever the person interacts manually.
(() => {
  const heroImage = document.querySelector('[data-hero-slider]');
  if (!heroImage) return;

  const slides = heroImage.querySelectorAll('.hero-slide');
  const dots = heroImage.querySelectorAll('.hero-dots span');
  if (slides.length < 2) return; // nothing to slide between

  let active = 0;
  let timer = null;
  const AUTOPLAY_MS = 5000;

  const setActive = (index) => {
    const next = (index + slides.length) % slides.length;
    slides[active]?.classList.remove('active');
    dots[active]?.classList.remove('active');
    active = next;
    slides[active]?.classList.add('active');
    dots[active]?.classList.add('active');
  };

  const start = () => {
    stop();
    timer = setInterval(() => setActive(active + 1), AUTOPLAY_MS);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };
  const restart = () => { stop(); start(); };

  heroImage.querySelector('.hero-arrow.left')?.addEventListener('click', () => {
    setActive(active - 1);
    restart();
  });
  heroImage.querySelector('.hero-arrow.right')?.addEventListener('click', () => {
    setActive(active + 1);
    restart();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index, 10);
      if (!Number.isNaN(index)) {
        setActive(index);
        restart();
      }
    });
  });

  heroImage.addEventListener('mouseenter', stop);
  heroImage.addEventListener('mouseleave', start);

  start();
})();

// Auto-advancing, responsive testimonial carousel.
// Shows 3 cards per view on desktop (>=769px) and 1 on mobile - the CSS
// media query controls each slide's width, this script only handles
// scrolling, dot pagination, and autoplay.
(() => {
  const slider = document.querySelector('[data-testimonial-slider]');
  if (!slider) return;

  const track = slider.querySelector('.testimonial-track');
  const dotsContainer = slider.querySelector('[data-testimonial-dots]');
  const slideCount = track.children.length;
  if (slideCount === 0) return;

  let timer = null;
  const AUTOPLAY_MS = 4500;

  function pageCount() {
    const groupWidth = track.clientWidth;
    if (groupWidth <= 0) return 1;
    return Math.max(1, Math.round(track.scrollWidth / groupWidth));
  }

  function currentPage() {
    const groupWidth = track.clientWidth;
    if (groupWidth <= 0) return 0;
    return Math.round(track.scrollLeft / groupWidth);
  }

  function goToPage(i) {
    const groupWidth = track.clientWidth;
    track.scrollTo({ left: i * groupWidth, behavior: 'smooth' });
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const pages = pageCount();
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('span');
      if (i === currentPage()) dot.classList.add('active');
      dot.addEventListener('click', () => {
        goToPage(i);
        restart();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateActiveDot() {
    const page = Math.min(currentPage(), dotsContainer.children.length - 1);
    Array.from(dotsContainer.children).forEach((d, i) => d.classList.toggle('active', i === page));
  }

  function next() {
    const pages = pageCount();
    const nextPage = (currentPage() + 1) % pages;
    goToPage(nextPage);
  }

  function start() {
    stop();
    timer = setInterval(next, AUTOPLAY_MS);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restart() {
    start();
  }

  let scrollRaf = null;
  track.addEventListener('scroll', () => {
    if (scrollRaf) return;
    scrollRaf = window.requestAnimationFrame(() => {
      updateActiveDot();
      scrollRaf = null;
    });
  });

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      goToPage(0);
      buildDots();
    }, 200);
  });

  buildDots();
  start();
})();

// Graceful image fallback: if an external image (Pexels/pravatar/etc.) fails
// to load - e.g. no internet access, a firewall blocking the CDN, or a
// broken URL - swap it for a generated placeholder instead of showing a
// broken-image icon.
(() => {
  function placeholderDataUri(label, w, h) {
    const safeLabel = (label || 'Image')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`
      + `<rect width="100%" height="100%" fill="#e9eef7"/>`
      + `<rect width="100%" height="100%" fill="none" stroke="#c7d3e8" stroke-width="2"/>`
      + `<text x="50%" y="50%" font-family="Segoe UI, Arial, sans-serif" font-size="${Math.max(11, Math.round(w / 18))}" fill="#0a2c5c" text-anchor="middle" dominant-baseline="middle">${safeLabel}</text>`
      + `</svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  document.querySelectorAll('img[data-fallback-label]').forEach((img) => {
    img.addEventListener('error', function onError() {
      img.removeEventListener('error', onError);
      const rect = img.getBoundingClientRect();
      const w = Math.max(60, Math.round(rect.width) || img.width || 300);
      const h = Math.max(60, Math.round(rect.height) || img.height || 200);
      img.src = placeholderDataUri(img.getAttribute('data-fallback-label'), w, h);
    }, { once: true });
  });
})();

// Register the service worker for offline support / installability.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((reg) => console.log('MH Dental service worker registered:', reg.scope))
      .catch((err) => console.error('Service worker registration failed:', err));
  });
}

// Handle the "Add to Home Screen" / install experience.
let deferredInstallPrompt = null;
const banner = document.getElementById('pwa-install-banner');
const installBtn = document.getElementById('pwa-install-btn');
const dismissBtn = document.getElementById('pwa-dismiss-btn');
const headerInstallBtn = document.getElementById('pwa-install-icon-btn');
const confirmOverlay = document.getElementById('pwa-confirm-overlay');
const confirmInstallBtn = document.getElementById('pwa-confirm-install');
const confirmCancelBtn = document.getElementById('pwa-confirm-cancel');

function showInstallBanner() {
  if (banner && !sessionStorage.getItem('pwaBannerDismissed')) {
    banner.classList.add('show');
  }
}

function hideInstallBanner() {
  if (banner) banner.classList.remove('show');
}

function showConfirmModal() {
  if (confirmOverlay) confirmOverlay.classList.add('show');
}

function hideConfirmModal() {
  if (confirmOverlay) confirmOverlay.classList.remove('show');
}

async function triggerInstall() {
  if (!deferredInstallPrompt) {
    // Browser hasn't offered an install prompt yet (already installed,
    // unsupported browser, or criteria not met). Let the person know
    // instead of silently doing nothing.
    window.alert('The app isn\'t ready to install right now. It may already be installed, or your browser may not support installing this app.');
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  hideInstallBanner();
}

window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default mini-infobar from appearing on mobile.
  event.preventDefault();
  deferredInstallPrompt = event;
  showInstallBanner();
});

// Bottom banner's own Install button - direct install (person already saw
// the explanatory banner text, so no extra confirmation needed here).
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    await triggerInstall();
  });
}

if (dismissBtn) {
  dismissBtn.addEventListener('click', () => {
    hideInstallBanner();
    sessionStorage.setItem('pwaBannerDismissed', '1');
  });
}

// Header Install icon - always asks for confirmation first.
if (headerInstallBtn) {
  headerInstallBtn.addEventListener('click', () => {
    showConfirmModal();
  });
}

if (confirmInstallBtn) {
  confirmInstallBtn.addEventListener('click', async () => {
    hideConfirmModal();
    await triggerInstall();
  });
}

if (confirmCancelBtn) {
  confirmCancelBtn.addEventListener('click', () => {
    hideConfirmModal();
  });
}

confirmOverlay?.addEventListener('click', (event) => {
  if (event.target === confirmOverlay) hideConfirmModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') hideConfirmModal();
});

window.addEventListener('appinstalled', () => {
  hideInstallBanner();
  hideConfirmModal();
  deferredInstallPrompt = null;
  console.log('MH Dental was installed.');
});
