/* Кошница, рендиране на продукти и общи взаимодействия */
const CART_KEY = 'as_cart_v1';
const SHIPPING_FLAT = 4.90;
const FREE_SHIPPING = 60;

const cartRead = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; } };
const cartWrite = items => { localStorage.setItem(CART_KEY, JSON.stringify(items)); paintCount(); };
const cartCount = () => cartRead().reduce((n, i) => n + i.qty, 0);
const cartSubtotal = () => cartRead().reduce((s, i) => { const p = bySlug(i.slug); return s + (p ? p.price * i.qty : 0); }, 0);

function addToCart(slug, qty = 1) {
  const items = cartRead();
  const found = items.find(i => i.slug === slug);
  if (found) found.qty += qty; else items.push({ slug, qty });
  cartWrite(items);
  const p = bySlug(slug);
  toast('Добавено в количката: ' + p.brand + ' · ' + p.size);
}
function setQty(slug, qty) {
  let items = cartRead();
  if (qty <= 0) items = items.filter(i => i.slug !== slug);
  else { const f = items.find(i => i.slug === slug); if (f) f.qty = qty; }
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
  const tags = (p.badges || []).map(b => `<span class="tag" style="color:${p.accent}">${b}</span>`).join('');
  return `<article class="card">
<a class="shot" href="product.html?p=${p.slug}"><img src="${imgSrc(p.slug)}" alt="${p.brand} ${p.name}" loading="lazy"><span class="tags">${tags}</span></a>
<div class="body">
<span class="brandline">${p.brand}</span>
<h3><a href="product.html?p=${p.slug}">${p.name}</a></h3>
<p class="benefit">${p.short}</p>
<div class="chips"><span class="chip">${p.size}</span><span class="chip" style="border-color:${p.accent}66;color:${p.accent}">${p.specs.origin}</span></div>
<div class="foot"><span class="price">${money(p.price)}<small>${moneyBgn(p.price)}</small></span>
<button class="btn btn-primary btn-sm" data-add="${p.slug}"><i data-lucide="shopping-bag"></i>Купи</button></div>
</div></article>`;
}

function renderProducts(el, list) {
  el.innerHTML = list.map(cardHTML).join('');
  if (window.lucide) lucide.createIcons();
  initReveal(el);
}

/* Плавно появяване при скрол */
/* Продуктовите карти нарочно не се анимират — минималистичен, спокоен вид. */
const REVEAL_SEL = '.cat,.pillar,.usp,.step,.dcard,.bcard,.overlay-sheet,.sec-head,.benefits li,.faq details';
let observer;
function initReveal(scope) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!observer) observer = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
  const root = scope || document;
  root.querySelectorAll(REVEAL_SEL).forEach((el, i) => {
    if (el.hasAttribute('data-reveal')) return;
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    observer.observe(el);
  });
}

/* Падащи цветчета — деликатен акцент */
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
  const f = document.querySelector('footer.site .wrap');
  if (f && !f.querySelector('.blossom')) {
    const b = document.createElement('img');
    b.src = 'assets/sakura-bloom.png'; b.alt = ''; b.className = 'blossom';
    document.querySelector('footer.site').appendChild(b);
  }
  const burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', () => {
    const nav = document.querySelector('nav.main');
    if (!nav) return;
    const open = nav.style.display === 'flex';
    nav.style.display = open ? '' : 'flex';
    if (!open) { nav.style.position = 'absolute'; nav.style.top = '82px'; nav.style.left = '0'; nav.style.right = '0'; nav.style.flexDirection = 'column'; nav.style.background = '#fff'; nav.style.padding = '18px 22px'; nav.style.borderBottom = '1px solid rgba(10,9,8,.12)'; nav.style.margin = '0'; }
  });
});
