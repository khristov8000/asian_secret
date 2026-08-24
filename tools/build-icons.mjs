/* Сглобява assets/icons.js само от иконите, които сайтът наистина ползва.

   Досега иконите идваха от unpkg.com с обикновен <script> в главата: чужд
   хост в критичния път. Бавен unpkg = бавно първо рисуване; паднал unpkg =
   сайт без нито една икона. Тук те стават част от нашите файлове, минават
   през същия отпечатък ?v= и не зависят от никого.

   Взимат се 36 икони вместо цялата библиотека - останалите хиляди не се
   ползват никъде.

   Пуска се с: node tools/build-icons.mjs <папка-със-svg>
   Свалянето е ръчно и се прави веднъж:
     curl -sf https://unpkg.com/lucide-static@0.454.0/icons/<име>.svg */
import fs from 'fs';
import path from 'path';

const src = process.argv[2];
if (!src) { console.error('употреба: node tools/build-icons.mjs <папка-със-svg>'); process.exit(1); }

const icons = {};
for (const f of fs.readdirSync(src).filter(f => f.endsWith('.svg'))) {
  const svg = fs.readFileSync(path.join(src, f), 'utf8');
  /* Пази се само вътрешността: обвивката се пише наново при рисуването,
     за да носи класовете и размерите, които CSS-ът очаква. */
  const inner = svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>'))
    .replace(/\s*\n\s*/g, '').trim();
  icons[path.basename(f, '.svg')] = inner;
}

const out = `/* Създава се от tools/build-icons.mjs - не се пипа на ръка.
   Само иконите, които сайтът ползва (${Object.keys(icons).length} на брой).
   Заменя lucide от unpkg: същото извикване, без чужд хост в критичния път. */
(function () {
  const P = ${JSON.stringify(icons)};

  /* Същият подпис като на lucide: страниците извикват lucide.createIcons(). */
  function createIcons() {
    document.querySelectorAll('[data-lucide]').forEach(el => {
      const name = el.getAttribute('data-lucide');
      const d = P[name];
      if (d === undefined) return;          /* непозната икона - не се пипа */
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'lucide lucide-' + name);
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      /* Иконата е декорация - името ѝ вече стои в текста или в aria-label
         на бутона, затова се крие от екранните четци. */
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = d;
      el.replaceWith(svg);
    });
  }

  window.lucide = { createIcons };
  /* Файлът стои в дъното на <body>, точно където беше този от unpkg: маркъпът
     над него вече е разпарсен. Скриптовете под него рисуват още съдържание и
     викат lucide.createIcons() пак - както досега. */
  createIcons();
})();
`;

fs.writeFileSync(path.join(process.cwd(), 'assets/icons.js'), out);
const kb = (Buffer.byteLength(out) / 1024).toFixed(1);
console.log(`assets/icons.js: ${Object.keys(icons).length} икони, ${kb} KB`);
