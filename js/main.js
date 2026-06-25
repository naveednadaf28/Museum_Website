/**
 * MuseumX – Interactive Museum Experience
 * Main JavaScript
 */

(function () {
  'use strict';

  const LOADER_DURATION = 1500;

  const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3c7?auto=format&fit=crop&w=800&h=600&q=85';

  /* ---------- Loader ---------- */
  function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, LOADER_DURATION);
  }

  /* ---------- Image Fallbacks ---------- */
  function initImageFallbacks() {
    document.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalHeight === 0) {
        img.src = FALLBACK_IMAGE;
      }
      img.addEventListener('error', function onError() {
        if (img.src !== FALLBACK_IMAGE) {
          img.src = FALLBACK_IMAGE;
        }
        img.removeEventListener('error', onError);
      });
    });
  }

  /* ---------- Navbar Scroll ---------- */
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ---------- Hero Parallax ---------- */
  function initHeroParallax() {
    const heroBg = document.querySelector('.hero-bg[data-parallax]');
    if (!heroBg) return;

    const onScroll = () => {
      const hero = heroBg.closest('.hero');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const offset = window.scrollY * 0.25;
        heroBg.style.transform = `scale(1.08) translateY(${offset * 0.35}px)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile Menu ---------- */
  function initMobileMenu() {
    const hamburger = document.querySelector('.navbar .hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileClose = document.querySelector('.mobile-close');
    const mobileLinks = document.querySelectorAll('.mobile-menu-nav a, .mobile-menu a:not(.mobile-close)');

    if (!hamburger || !mobileMenu) return;

    const openMenu = () => {
      hamburger.classList.add('active');
      mobileMenu.classList.add('active');
      document.body.classList.add('menu-open');
    };

    const closeMenu = () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    hamburger.addEventListener('click', () => {
      if (mobileMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', closeMenu);
    }

    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* ---------- Active Nav Link ---------- */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu-nav a');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ---------- Smooth Scroll ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- Scroll Reveal ---------- */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ---------- Counter Animation ---------- */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      const duration = 2200;
      const start = performance.now();

      const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(eased * target);
        el.textContent = prefix + current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = prefix + target.toLocaleString() + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((counter) => observer.observe(counter));
  }

  /* ---------- Chart Animation ---------- */
  function initChartAnimation() {
    const charts = document.querySelectorAll('.analytics-chart, .chart-placeholder');
    charts.forEach((chart) => {
      const bars = chart.querySelectorAll('.chart-bar');
      if (!bars.length) return;

      bars.forEach((bar) => {
        const height = bar.style.height || bar.getAttribute('data-height');
        if (height) {
          bar.style.height = '0%';
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              bars.forEach((bar, i) => {
                const height = bar.getAttribute('data-height') || bar.style.height;
                setTimeout(() => {
                  bar.style.height = height || '50%';
                }, i * 60);
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(chart);
    });
  }

  /* ---------- Progress Bars Animation ---------- */
  function initProgressBars() {
    const fills = document.querySelectorAll('.progress-fill[data-width]');
    if (!fills.length) return;

    fills.forEach((fill) => {
      fill.style.width = '0%';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.getAttribute('data-width');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    fills.forEach((fill) => observer.observe(fill));
  }

  /* ---------- FAQ Accordion ---------- */
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((i) => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  /* ---------- Newsletter Form ---------- */
  function initNewsletter() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value.trim()) {
          showSuccessMessage('Subscribed!', 'Thank you for subscribing to our newsletter.');
          input.value = '';
        }
      });
    });
  }

  /* ---------- Contact Form ---------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = form.querySelector('#contactEmail');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (email && !emailRegex.test(email.value.trim())) {
        email.classList.add('error');
        return;
      }

      showSuccessMessage('Message Sent!', 'We will get back to you shortly.');
      form.reset();
    });
  }

  /* ---------- Success Message ---------- */
  function showSuccessMessage(title, subtitle) {
    let overlay = document.querySelector('.success-overlay');
    let message = document.querySelector('.success-message');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'success-overlay';
      document.body.appendChild(overlay);
    }

    if (!message) {
      message = document.createElement('div');
      message.className = 'success-message';
      message.innerHTML = `
        <div class="icon">✓</div>
        <h3></h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem;"></p>
      `;
      document.body.appendChild(message);
    }

    message.querySelector('h3').textContent = title;
    const p = message.querySelector('p');
    if (p) p.textContent = subtitle || '';

    overlay.classList.add('show');
    message.classList.add('show');

    setTimeout(() => {
      overlay.classList.remove('show');
      message.classList.remove('show');
    }, 2500);
  }

  /* ---------- Login Form ---------- */
  function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = form.querySelector('#loginEmail');
      const emailError = form.querySelector('#emailError');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      email.classList.remove('error');
      if (emailError) emailError.textContent = '';

      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('error');
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        return;
      }

      const role = form.querySelector('input[name="role"]:checked');
      const isAdmin = role && role.value === 'admin';

      showSuccessMessage('Login Successful', 'Redirecting to your dashboard...');

      setTimeout(() => {
        window.location.href = isAdmin ? 'admin-dashboard.html' : 'user-dashboard.html';
      }, 2000);
    });
  }

  /* ---------- Signup Form ---------- */
  function initSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = form.querySelector('#signupEmail');
      const password = form.querySelector('#signupPassword');
      const confirmPassword = form.querySelector('#confirmPassword');
      const emailError = form.querySelector('#signupEmailError');
      const passwordError = form.querySelector('#passwordError');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      email.classList.remove('error');
      password.classList.remove('error');
      confirmPassword.classList.remove('error');
      if (emailError) emailError.textContent = '';
      if (passwordError) passwordError.textContent = '';

      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('error');
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        return;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('error');
        if (passwordError) passwordError.textContent = 'Passwords do not match.';
        return;
      }

      showSuccessMessage('Account Created Successfully', 'Welcome to MuseumX!');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2500);
    });
  }

  /* ---------- Logout ---------- */
  function initLogout() {
    const logoutBtns = document.querySelectorAll('[data-logout]');
    logoutBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'login.html';
      });
    });
  }

  /* ---------- Dashboard Sidebar Toggle ---------- */
  function initDashboardSidebar() {
    const toggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const overlay = document.querySelector('.dashboard-sidebar-overlay');

    if (!toggle || !sidebar) return;

    const open = () => {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('show');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        close();
      } else {
        open();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', close);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        close();
      }
    });
  }

  /* ---------- Dashboard Nav Sections ---------- */
  function initDashboardNav() {
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    const sections = document.querySelectorAll('[data-dashboard-section]');

    if (!navLinks.length) return;

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const sectionId = link.getAttribute('data-section');
        if (!sectionId) return;

        e.preventDefault();
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');

        sections.forEach((section) => {
          section.style.display =
            section.getAttribute('data-dashboard-section') === sectionId ? 'block' : 'none';
        });

        const sidebar = document.querySelector('.dashboard-sidebar');
        const overlay = document.querySelector('.dashboard-sidebar-overlay');
        if (sidebar && window.innerWidth < 768) {
          sidebar.classList.remove('open');
          if (overlay) overlay.classList.remove('show');
          document.body.style.overflow = '';
        }
      });
    });
  }

  /* ---------- CTA Buttons ---------- */
  function initCTAButtons() {
    document.querySelectorAll('[data-scroll]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-scroll');
        const el = document.querySelector(target);
        if (el) {
          e.preventDefault();
          const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    document.querySelectorAll('[data-link]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const href = btn.getAttribute('data-link');
        if (href) window.location.href = href;
      });
    });
  }

  /* ---------- Init ---------- */
  function init() {
    if (document.getElementById('loader')) {
      document.body.style.overflow = 'hidden';
      initLoader();
    }

    initImageFallbacks();
    initNavbar();
    initHeroParallax();
    initMobileMenu();
    initActiveNav();
    initSmoothScroll();
    initScrollReveal();
    initCounters();
    initChartAnimation();
    initProgressBars();
    initFAQ();
    initNewsletter();
    initContactForm();
    initLoginForm();
    initSignupForm();
    initLogout();
    initDashboardSidebar();
    initDashboardNav();
    initCTAButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
