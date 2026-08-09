/* ==========================================================================
   КОЛИБРИ · ванильный JS, без зависимостей
   Всё здесь — надстройка. Сайт полностью читается и работает без него.
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Мобильное меню ----------------------------------------- */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.hasAttribute('data-open');
      if (open) {
        nav.removeAttribute('data-open');
      } else {
        nav.setAttribute('data-open', '');
      }
      toggle.setAttribute('aria-expanded', String(!open));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.removeAttribute('data-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.hasAttribute('data-open')) {
        nav.removeAttribute('data-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- 2. Плавное появление секций -------------------------------- */

  var revealables = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });

    /* Первый экран показываем сразу, без ожидания скролла. */
    requestAnimationFrame(function () {
      document.querySelectorAll('.hero .reveal').forEach(function (el) {
        el.classList.add('is-in');
      });
    });
  }

  /* ---------- 3. Карта ощущений ------------------------------------------ */
  /* Данные лежат в разметке (data-атрибуты на кнопках списка), чтобы
     правка цен и сроков делалась в одном месте — в HTML.                   */

  var map = document.querySelector('[data-painmap]');

  if (map) {
    var panel = map.querySelector('[data-zone-panel]');
    var buttons = map.querySelectorAll('[data-zone]');

    var render = function (btn) {
      if (!panel) return;

      var level = parseInt(btn.getAttribute('data-level'), 10) || 1;
      var bars = '';
      for (var i = 1; i <= 5; i++) {
        bars += '<span class="scale__bar"' + (i <= level ? ' data-on' : '') + '></span>';
      }

      panel.innerHTML =
        '<h3>' + btn.getAttribute('data-name') + '</h3>' +
        '<span class="zone-panel__price">' + btn.getAttribute('data-price') + '</span>' +
        '<dl>' +
          '<div><dt>Ощущения</dt><dd>' +
            '<span class="scale"><span class="scale__bars">' + bars + '</span>' +
            '<span class="scale__word">' + level + ' из 5 — ' + btn.getAttribute('data-feel') + '</span></span>' +
          '</dd></div>' +
          '<div><dt>Заживление</dt><dd>' + btn.getAttribute('data-heal') + '</dd></div>' +
          '<div><dt>Украшение</dt><dd>' + btn.getAttribute('data-jewel') + '</dd></div>' +
        '</dl>';

      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-zone') === btn.getAttribute('data-zone')));
      });
    };

    Array.prototype.forEach.call(buttons, function (btn) {
      btn.addEventListener('click', function () { render(btn); });
    });

    /* Стартовое состояние — прокол мочки: самая частая причина прихода. */
    var first = map.querySelector('[data-zone="lobe"]');
    if (first) render(first);
  }

  /* ---------- 4. Липкая полоса записи на телефоне ------------------------ */

  var bar = document.querySelector('.cta-bar');
  var hero = document.querySelector('.hero');

  if (bar && hero && 'IntersectionObserver' in window) {
    var barIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          bar.removeAttribute('data-show');
        } else {
          bar.setAttribute('data-show', '');
        }
      });
    }, { threshold: 0 });
    barIO.observe(hero);
  } else if (bar) {
    bar.setAttribute('data-show', '');
  }

  /* ---------- 5. Год в подвале ------------------------------------------- */

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
