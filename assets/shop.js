/* Кошница, рендиране на продукти и общи взаимодействия */
const CART_KEY = 'as_cart_v1';
const SHIPPING_FLAT = 3.90;
const FREE_SHIPPING = 40;

const cartRead = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } };
const cartWrite = items => { localStorage.setItem(CART_KEY, JSON.stringify(items)); paintCount(); };
const cartCount = () => cartRead().reduce((n, i) => n + i.qty, 0);
/* В кошницата `slug` е sku на конкретния вариант (опаковка). */
const cartSubtotal = () => cartRead().reduce((s, i) => {
  const r = bySku(i.slug); return s + (r ? r.variant.price * i.qty : 0);
}, 0);

function addToCart(sku, qty = 1) {
  const items = cartRead();
  const found = items.find(i => i.slug === sku);
  if (found) found.qty += qty; else items.push({ slug: sku, qty });
  cartWrite(items);
  const r = bySku(sku);
  if (r) toast('Добавено в количката: ' + r.product.brand + ' · ' + r.variant.size);
}
function setQty(sku, qty) {
  let items = cartRead();
  if (qty <= 0) items = items.filter(i => i.slug !== sku);
  else { const f = items.find(i => i.slug === sku); if (f) f.qty = qty; }
  cartWrite(items);
}

function paintCount() {
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    const n = cartCount();
    el.textContent = n;
    el.hidden = n === 0;
  });
}

let toastTimer;
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.innerHTML = '<i data-lucide="check-circle-2"></i><span></span>';
  t.querySelector('span').textContent = msg;
  if (window.lucide) lucide.createIcons();
  requestAnimationFrame(() => t.classList.add('on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 2600);
}

function cardHTML(p) {
  const tags = (p.badges || []).map(b => `<span class="tag" style="background:${p.tint};color:${p.accent}">${b}</span>`).join('');
  const vs = variantsOf(p), multi = hasVariants(p);
  const from = priceFrom(p);
  /* При няколко опаковки показваме „от <най-ниската цена>" и размерите,
     а бутонът води към продуктовата страница, за да се избере опаковка. */
  const priceHTML = multi
    ? `<span class="price"><small class="from">от</small>${money(from)}</span>`
    : `<span class="price">${money(p.price)}</span>`;
  const sizeChip = multi
    ? `<span class="chip chip-variants">${vs.map(v => v.size).join(' · ')}</span>`
    : `<span class="chip">${p.size}</span>`;
  const action = multi
    ? `<a class="btn btn-primary btn-sm" href="product.html?p=${p.slug}"><i data-lucide="sliders-horizontal"></i>Избери</a>`
    : `<button class="btn btn-primary btn-sm" data-add="${defaultVariant(p).sku}"><i data-lucide="shopping-bag"></i>Купи</button>`;
  return `<article class="card">
<a class="shot" href="product.html?p=${p.slug}"><img src="${imgSrc(defaultVariant(p).sku)}" alt="${p.brand} ${p.name}" loading="lazy"><span class="tags">${tags}</span></a>
<div class="body">
<span class="brandline">${p.brand}</span>
<h3><a href="product.html?p=${p.slug}">${p.name}</a></h3>
<p class="benefit">${p.short}</p>
<div class="chips">${sizeChip}<span class="chip" style="border-color:${p.accent}66;color:${p.accent}">${p.specs.origin}</span></div>
<div class="foot">${priceHTML}${action}</div>
</div></article>`;
}

function renderProducts(el, list) {
  el.innerHTML = list.map(cardHTML).join('');
  if (window.lucide) lucide.createIcons();
  initReveal(el);
}

/* Плавно появяване при скрол.
   Картите също се появяват, но само с просветляване - вж. `.card[data-reveal]`
   в site.css. Мащаб, рамка и сянка остават извън играта. */
const REVEAL_SEL = '.cat,.pillar,.usp,.step,.oflow-item,.dcard,.bline,.overlay-sheet,.sec-head,' +
  '.benefits li,.faq details,.card,.val,.ig-tile,.story-art,.story-copy,.vet-art,.vet-copy,' +
  '.contact-list a,.contact-list div,.formbox,.hero-strip .wrap>*,.blines';
let observer;
/* Предпазна мрежа около IntersectionObserver. Наблюдателят се справя сам при
   нормално превъртане - това тук е застраховка за случаите, в които браузърът
   може да пропусне наблюдение (много бърз флик, върната от bfcache страница,
   пренареждане при въртене на телефона). Цената е нулева: минава само през
   още непоказаните елементи, по същия праг, веднъж на кадър. */
let sweepQueued = false;
function sweepReveal() {
  sweepQueued = false;
  const limit = innerHeight * 0.94;
  document.querySelectorAll('[data-reveal]:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < limit) el.classList.add('in');
  });
}
function queueSweep() {
  if (sweepQueued) return;
  sweepQueued = true;
  requestAnimationFrame(sweepReveal);
}

function initReveal(scope) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!observer) {
    observer = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    addEventListener('scroll', queueSweep, { passive: true });
    addEventListener('resize', queueSweep, { passive: true });
  }
  const root = scope || document;
  /* Забавянето се брои в рамките на съседите, а не глобално: така всеки ред
     се излива отляво надясно, вместо да се получава случаен ритъм по цялата
     страница. Таванът е 5 стъпки - иначе последната карта в дълъг ред чака
     цяла секунда, преди изобщо да тръгне. */
  const seen = new Map();
  root.querySelectorAll(REVEAL_SEL).forEach(el => {
    if (el.hasAttribute('data-reveal')) return;
    el.setAttribute('data-reveal', '');
    const n = seen.get(el.parentElement) || 0;
    seen.set(el.parentElement, n + 1);
    el.style.setProperty('--d', Math.min(n, 5) * 80 + 'ms');
    observer.observe(el);
  });
  queueSweep();
}

/* Падащи цветчета - деликатен акцент */
function spawnPetals(host, count = 6) {
  if (!host || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('img');
    p.src = 'assets/sakura-petal.png';
    p.alt = '';
    p.className = 'petal';
    p.style.cssText = `left:${6 + Math.random() * 88}%;top:-8%;width:${14 + Math.random() * 16}px;opacity:0;z-index:1;animation:drift ${16 + Math.random() * 12}s linear ${Math.random() * 14}s infinite`;
    host.appendChild(p);
  }
}

document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) { e.preventDefault(); addToCart(add.dataset.add, 1); }
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  paintCount();
  initReveal();
  const burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', () => {
    const nav = document.querySelector('nav.main');
    if (!nav) return;
    const open = nav.style.display === 'flex';
    nav.style.display = open ? '' : 'flex';
    /* състоянието се съобщава и на екранните четци, не само визуално */
    burger.setAttribute('aria-expanded', open ? 'false' : 'true');
    if (!open) { nav.style.position = 'absolute'; nav.style.top = '82px'; nav.style.left = '0'; nav.style.right = '0'; nav.style.flexDirection = 'column'; nav.style.background = '#fff'; nav.style.padding = '18px 22px'; nav.style.borderBottom = '1px solid rgba(10,9,8,.12)'; nav.style.margin = '0'; }
  });
});
