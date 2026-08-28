/* Съгласие за бисквитки.

   Разметката на лентата стои в шаблоните, до подложката, а НЕ се сглобява
   тук. Причината е една: така текстът минава през същия data-t механизъм
   като целия останал сайт и преводът има само едно място - i18n/ui.*.json.
   Скрипт, който сам си пише текста, би вкарал втори речник.

   Днес сайтът не зарежда нито един външен брояч или пиксел - в браузъра се
   пази само количката (`as_cart_v1`) и езикът след плащане. Затова
   „Анализ" и „Маркетинг" стоят изключени и нищо не чака съгласие. Изборът
   пак се записва: денят, в който се добави Google Analytics или пиксел на
   Meta, скриптът им трябва да пита `asConsent.get().analytics` ПРЕДИ да се
   зареди, а не да се пита дали някой е питал.

   Записът живее в localStorage, не в бисквитка: сървърът няма нужда да го
   вижда, а бисквитка би пътувала с всяка заявка без причина. */
(function () {
  var KEY = 'as_consent_v1';
  var VERSION = 1;
  /* Съгласието не е вечно. След година лентата пита пак - това е и срокът,
     който Комисията за защита на личните данни приема за разумен. */
  var MAX_AGE = 365 * 24 * 60 * 60 * 1000;

  var CATS = ['analytics', 'marketing'];

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      if (!v || v.v !== VERSION) return null;
      if (!v.ts || Date.now() - v.ts > MAX_AGE) return null;
      return v;
    } catch (e) {
      /* Частен прозорец или забранено хранилище: третира се като „още не е
         питано". Лентата се показва, изборът просто не се помни. */
      return null;
    }
  }

  function write(choice) {
    var v = { v: VERSION, ts: Date.now() };
    for (var i = 0; i < CATS.length; i++) v[CATS[i]] = !!choice[CATS[i]];
    try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    return v;
  }

  /* Публичният вход. Бъдещите скриптове за анализ питат оттук, вместо да
     четат ключа сами - инак форматът на записа става обществен договор. */
  var api = {
    get: function () {
      var v = read();
      var out = { given: !!v };
      for (var i = 0; i < CATS.length; i++) out[CATS[i]] = !!(v && v[CATS[i]]);
      return out;
    },
    set: function (choice) { announce(write(choice || {})); },
    /* Оттеглянето на съгласие трябва да е толкова лесно, колкото даването
       му - оттук го вика връзката „Настройки за бисквитки" в подложката. */
    open: function () { show(true); }
  };
  window.asConsent = api;

  function announce(v) {
    var detail = { given: true };
    for (var i = 0; i < CATS.length; i++) detail[CATS[i]] = !!v[CATS[i]];
    try {
      window.dispatchEvent(new CustomEvent('as:consent', { detail: detail }));
    } catch (e) {}
  }

  var bar = document.getElementById('cookieBar');

  /* Връзката в подложката работи и на страници без лента (ако някога се
     появи такава): тогава води към политиката, вместо да не прави нищо. */
  function bindFooter() {
    var links = document.querySelectorAll('[data-cookie-settings]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        if (!bar) return;
        e.preventDefault();
        api.open();
      });
    }
  }

  if (!bar) { bindFooter(); return; }

  function boxes() { return bar.querySelectorAll('[data-cc-cat]'); }

  function fill(v) {
    var b = boxes();
    for (var i = 0; i < b.length; i++) b[i].checked = !!(v && v[b[i].getAttribute('data-cc-cat')]);
  }

  function show(openPanel) {
    fill(read());
    bar.hidden = false;
    bar.classList.toggle('open', !!openPanel);
    var more = bar.querySelector('[data-cc="toggle"]');
    if (more) more.setAttribute('aria-expanded', openPanel ? 'true' : 'false');
    /* Класът се слага в следващия кадър: `hidden` току-що е паднал и без
       това преходът няма от какво да тръгне - лентата би изникнала наведнъж. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bar.classList.add('in'); });
    });
  }

  function hide() {
    bar.classList.remove('in');
    var done = false;
    var finish = function () {
      if (done) return;
      done = true;
      bar.hidden = true;
      bar.classList.remove('open');
    };
    bar.addEventListener('transitionend', finish, { once: true });
    /* Ако преходът е изключен (prefers-reduced-motion) transitionend не идва
       никога и лентата би останала невидима, но кликаема върху подложката. */
    setTimeout(finish, 700);
  }

  function decide(choice) {
    api.set(choice);
    hide();
  }

  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cc]');
    if (!btn) return;
    var act = btn.getAttribute('data-cc');

    if (act === 'toggle') {
      var open = !bar.classList.contains('open');
      bar.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      return;
    }
    if (act === 'all') return decide({ analytics: true, marketing: true });
    if (act === 'necessary') return decide({ analytics: false, marketing: false });
    if (act === 'save') {
      var choice = {}, b = boxes();
      for (var i = 0; i < b.length; i++) choice[b[i].getAttribute('data-cc-cat')] = b[i].checked;
      return decide(choice);
    }
  });

  bindFooter();

  /* Първото посещение: лентата излиза едва след като страницата се е
     подредила. Появата ѝ едновременно с героя на началната страница
     изяжда първото впечатление, а нищо не чака отговора ѝ. */
  if (!read()) {
    if (document.readyState === 'complete') setTimeout(show, 900);
    else window.addEventListener('load', function () { setTimeout(show, 900); });
  } else {
    /* Вече има избор - известява се веднага, за да не чакат бъдещите
       скриптове събитие, което няма да дойде. */
    announce(read());
  }
})();
