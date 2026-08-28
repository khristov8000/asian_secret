/* Отпечатва tools/return-form.html в assets/forms/formulyar-za-vrashtane.pdf.

   Пуска се на ръка, СЛЕД промяна във формуляра:
     node tools/build-return-form.mjs

   Нарочно не влиза в seo-build.mjs. Формулярът се мени веднъж на година, а
   отпечатването иска Chrome и мрежа за шрифтовете - build-ът на сайта трябва
   да върви и без двете.

   Печата се през --print-to-pdf, без puppeteer: единственото, което ни трябва
   от него, е изтеглената двоичка.
   Предпочита се chrome-headless-shell пред пълния Chrome. Проверено на живо:
   пълният Chrome 151 с --headless виси до timeout и не оставя файл, докато
   shell-ът приключва за секунди. */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';

const root = process.cwd();
const src = path.join(root, 'tools', 'return-form.html');
const outDir = path.join(root, 'assets', 'forms');
const out = path.join(outDir, 'formulyar-za-vrashtane.pdf');

if (!fs.existsSync(src)) {
  console.error('липсва ' + src);
  process.exit(1);
}

/* ── къде е Chrome ─────────────────────────────────────────────────────────
   Първо CHROME_PATH, ако някой го е задал. После кешът на puppeteer (там го
   слага `npx puppeteer browsers install chrome`), после стандартните места
   за Windows, macOS и Linux. */
function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  const puppeteer = path.join(os.homedir(), '.cache', 'puppeteer');
  const inCache = (pkg, dirs) => {
    const base = path.join(puppeteer, pkg);
    if (!fs.existsSync(base)) return null;
    for (const rev of fs.readdirSync(base).sort().reverse()) {
      for (const rel of dirs) {
        const p = path.join(base, rev, ...rel);
        if (fs.existsSync(p)) return p;
      }
    }
    return null;
  };

  const shell = inCache('chrome-headless-shell', [
    ['chrome-headless-shell-win64', 'chrome-headless-shell.exe'],
    ['chrome-headless-shell-linux64', 'chrome-headless-shell'],
    ['chrome-headless-shell-mac-x64', 'chrome-headless-shell'],
    ['chrome-headless-shell-mac-arm64', 'chrome-headless-shell']
  ]);
  if (shell) return shell;

  const full = inCache('chrome', [
    ['chrome-win64', 'chrome.exe'],
    ['chrome-linux64', 'chrome'],
    ['chrome-mac-x64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'],
    ['chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing']
  ]);
  if (full) return full;

  const guesses = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];
  return guesses.find(p => fs.existsSync(p)) || null;
}

const chrome = findChrome();
if (!chrome) {
  console.error('Chrome не е намерен. Задайте CHROME_PATH или инсталирайте с:');
  console.error('  npx puppeteer browsers install chrome-headless-shell');
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

/* ── шрифтовете влизат в самия HTML ────────────────────────────────────────
   Само <link> към Google Fonts не стига. Проверено на живо: Chrome намира
   инсталирания локално Manrope, ползва НЕГО (и то в грешната дебелина -
   ExtraLight) и не го вгражда в PDF-а. Резултатът е файл, който изглежда
   различно на всяка машина.
   Затова стиловият лист се сваля тук и всеки шрифтов файл се превръща в
   data: адрес.

   Само това обаче не стигна: докато семейството се казва „Manrope", Chrome
   пак хващаше инсталирания. Затова семействата се преименуват на „AS Print
   <име>" И в @font-face, И в шрифтовите редици на документа. Такова име няма
   на никоя машина, значи няма и какво да го засенчи. */
async function inlineFonts(html) {
  const link = html.match(/<link href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"[^>]*>/);
  if (!link) return html;

  /* Нарочно СТАР User-Agent: така Google Fonts връща статични .ttf, а не
     woff2, изрязан от вариативния шрифт. Статичните носят истинско име на
     дебелината - с вариативния ВСИЧКО влизаше в PDF-а като „Manrope
     ExtraLight" и Chrome изобщо не го вграждаше. Отгоре на това готовият
     файл излиза пет пъти по-лек: 48 KB вместо 252. */
  const UA = 'Mozilla/4.0';
  let css = await (await fetch(link[1], { headers: { 'User-Agent': UA } })).text();

  const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) || [])];
  for (const u of urls) {
    const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
    const mime = u.endsWith('.woff2') ? 'font/woff2' : 'font/ttf';
    css = css.split(u).join('data:' + mime + ';base64,' + buf.toString('base64'));
  }

  const families = [...new Set(
    [...css.matchAll(/font-family:\s*'([^']+)'/g)].map(m => m[1]))];
  let doc = html;
  for (const f of families) {
    const priv = 'AS Print ' + f;
    css = css.split("font-family: '" + f + "'").join("font-family: '" + priv + "'");
    /* В документа семейството е изписано с двойни кавички, в CSS променливите. */
    doc = doc.split('"' + f + '"').join('"' + priv + '"');
  }
  console.log('вградени шрифтови файла: ' + urls.length +
              ' (' + families.join(', ') + ')');

  return doc
    .replace(/<link rel="preconnect"[^>]*>\n?/g, '')
    .replace(link[0], '<style>\n' + css + '\n</style>');
}

let html = fs.readFileSync(src, 'utf8');
try {
  html = await inlineFonts(html);
} catch (e) {
  console.warn('ВНИМАНИЕ: шрифтовете не се свалиха (' + e.message + '). ' +
    'Формулярът излиза с резервен шрифт.');
}

/* Временният файл стои до източника, за да останат относителните пътища верни. */
const tmpHtml = path.join(root, 'tools', '.return-form.print.html');
fs.writeFileSync(tmpHtml, html);

/* Отделен потребителски профил на всяко пускане: инак Chrome се залепва за
   вече отворен прозорец и излиза, без да отпечата нищо.
   --virtual-time-budget дава на шрифтовете от Google Fonts време да се
   изтеглят - без него PDF-ът излиза с резервния системен шрифт. */
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'as-pdf-'));

try {
  /* chrome-headless-shell е headless по рождение и не приема --headless. */
  const isShell = /chrome-headless-shell/i.test(chrome);
  execFileSync(chrome, [
    ...(isShell ? [] : ['--headless']),
    '--disable-gpu',
    '--no-sandbox',
    '--no-first-run',
    /* Chrome иначе тръгва да се регистрира за известия и да синхронизира -
       заявките се провалят, пълнят stderr и бавят излизането. */
    '--disable-background-networking',
    '--disable-sync',
    '--disable-component-update',
    '--disable-extensions',
    '--disable-default-apps',
    '--user-data-dir=' + profile,
    '--virtual-time-budget=12000',
    '--no-pdf-header-footer',
    '--print-to-pdf=' + out,
    pathToFileURL(tmpHtml).href
  ], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 90000 });
} catch (e) {
  console.error('Отпечатването не успя:', (e.stderr || '').toString().trim() || e.message);
  process.exit(1);
} finally {
  fs.rmSync(profile, { recursive: true, force: true });
  if (!process.env.KEEP_HTML) fs.rmSync(tmpHtml, { force: true });
}

if (!fs.existsSync(out)) {
  console.error('Chrome приключи, но файл няма: ' + out);
  process.exit(1);
}

const kb = (fs.statSync(out).size / 1024).toFixed(0);
console.log('assets/forms/formulyar-za-vrashtane.pdf - ' + kb + ' KB');

/* Вграден шрифт означава FontFile2 до името му. Липсва ли, Chrome е ползвал
   заместител и файлът ще изглежда различно другаде - точно това търсим. */
const raw = fs.readFileSync(out, 'latin1');
const files = (raw.match(/\/FontFile2/g) || []).length;
for (const f of ['Playfair', 'Manrope']) {
  if (!raw.includes(f)) console.warn('ВНИМАНИЕ: ' + f + ' не се вижда в PDF-а.');
}
if (files < 2) {
  console.warn('ВНИМАНИЕ: вградени са само ' + files + ' шрифтови програми - ' +
    'очакват се поне 2 (Playfair и Manrope).');
} else {
  console.log('вградени шрифтови програми в PDF-а: ' + files);
}
