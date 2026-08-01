/* =========================================================
   VISA IMMIGRATION (VIM) — Main JavaScript
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function () {
    var preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(function () {
        preloader.classList.add('is-hidden');
      }, 900);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Sticky header on scroll ---------- */
    var header = document.getElementById('header');
    function onScroll() {
      if (!header) return;
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Mobile navigation ---------- */
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('nav');
    var body = document.body;

    function closeNav() {
      if (!hamburger || !nav) return;
      hamburger.classList.remove('is-open');
      nav.classList.remove('is-open');
      body.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open menu');
    }

    function openNav() {
      if (!hamburger || !nav) return;
      hamburger.classList.add('is-open');
      nav.classList.add('is-open');
      body.classList.add('nav-open');
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close menu');
    }

    if (hamburger && nav) {
      hamburger.addEventListener('click', function () {
        if (nav.classList.contains('is-open')) {
          closeNav();
        } else {
          openNav();
        }
      });

      // Close when a nav link is clicked
      nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeNav);
      });

      // Close on Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          closeNav();
        }
      });

      // Close when clicking overlay
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('is-open') &&
            !nav.contains(e.target) &&
            !hamburger.contains(e.target)) {
          closeNav();
        }
      });
    }

    /* ---------- Smooth scrolling (native + offset fix) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });

    /* ---------- Scroll reveal animations ---------- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- Active nav link on scroll ---------- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav__link');
    if ('IntersectionObserver' in window && sections.length && navLinks.length) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.toggle('is-active',
                link.getAttribute('href') === '#' + id);
            });
          }
        });
      }, { threshold: 0.4, rootMargin: '-20% 0px -40% 0px' });
      sections.forEach(function (sec) { sectionObserver.observe(sec); });
    }

    /* ---------- Current year ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Consultation form -> WhatsApp ---------- */
    var form = document.getElementById('consultationForm');
    var successMsg = document.getElementById('formSuccess');

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var fullName = (document.getElementById('fullName') || {}).value || '';
        var phone = (document.getElementById('phone') || {}).value || '';
        var email = (document.getElementById('email') || {}).value || '';
        var destination = (document.getElementById('destination') || {}).value || '';
        var message = (document.getElementById('message') || {}).value || '';

        // Basic validation
        if (!fullName || !phone || !email || !destination) {
          if (successMsg) {
            successMsg.textContent = 'Please fill in all required fields.';
            successMsg.style.background = 'rgba(214,69,69,0.1)';
            successMsg.style.borderColor = 'rgba(214,69,69,0.3)';
            successMsg.style.color = '#d64545';
            successMsg.classList.add('is-visible');
          }
          return;
        }

        var text =
          'Hello Visa Immigration (VIM),\n\n' +
          'I would like to request an immigration consultation.\n\n' +
          'Name: ' + fullName + '\n' +
          'Phone: ' + phone + '\n' +
          'Email: ' + email + '\n' +
          'Preferred Destination: ' + destination + '\n' +
          'Message: ' + (message || '-') + '\n\n' +
          'Thank you.';

        var url = 'https://wa.me/93780412583?text=' + encodeURIComponent(text);

        if (successMsg) {
          successMsg.textContent = 'Thank you! Opening WhatsApp with your message...';
          successMsg.style.background = 'rgba(47,158,111,0.1)';
          successMsg.style.borderColor = 'rgba(47,158,111,0.3)';
          successMsg.style.color = '#2f9e6f';
          successMsg.classList.add('is-visible');
        }

        window.open(url, '_blank', 'noopener');
        form.reset();

        setTimeout(function () {
          if (successMsg) successMsg.classList.remove('is-visible');
        }, 6000);
      });
    }

  });
})();
