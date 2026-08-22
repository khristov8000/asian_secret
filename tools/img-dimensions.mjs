/* Дописва width и height на статичните <img> в HTML файловете.
   Размерите се четат от самите файлове (PNG/JPEG/WebP заглавки), а не се
   гадаят: без тях браузърът не знае мястото на снимката, докато не я свали,
   и оформлението подскача (CLS).
   Пуска се с: node tools/img-dimensions.mjs [--write] */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const WRITE = process.argv.includes('--write');

/* ── четене на размери от заглавката на файла ────────────────────────────── */
function pngSize(b) {
  if (b.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

function jpegSize(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    // SOF0..SOF15 без DHT(c4)/DAC(cc)/RSTn(d0-d7) носят размерите
    if (marker >= 0xc0 && marker <= 0xcf &&
        marker !== 0xc4 && marker !== 0xcc && (marker < 0xd0 || marker > 0xd7)) {
      return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    }
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}

function webpSize(b) {
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') return null;
  const fmt = b.toString('ascii', 12, 16);
  if (fmt === 'VP8 ') return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
  if (fmt === 'VP8L') {
    const n = b.readUInt32LE(21);
    return { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 };
  }
  if (fmt === 'VP8X') return {
    w: (b[24] | (b[25] << 8) | (b[26] << 16)) + 1,
    h: (b[27] | (b[28] << 8) | (b[29] << 16)) + 1
  };
  return null;
}

function sizeOf(file) {
  let b;
  try { b = fs.readFileSync(file); } catch { return null; }
  return pngSize(b) || jpegSize(b) || webpSize(b);
}

/* ── обхождане на HTML ───────────────────────────────────────────────────── */
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
let added = 0, skipped = 0, missing = [];

for (const f of htmlFiles) {
  const p = path.join(root, f);
  let html = fs.readFileSync(p, 'utf8');
  const before = html;

  html = html.replace(/<img\b[^>]*>/g, tag => {
    if (/\bwidth=/.test(tag) || /\bheight=/.test(tag)) { skipped++; return tag; }
    const m = tag.match(/\bsrc="([^"]+)"/);
    if (!m) { skipped++; return tag; }
    const src = m[1];
    // адреси от шаблонни низове и външни адреси се пропускат
    if (src.includes('${') || /^https?:|^data:/.test(src)) { skipped++; return tag; }
    const rel = src.replace(/^\//, '');
    const dim = sizeOf(path.join(root, rel));
    if (!dim) { missing.push(f + ' -> ' + src); skipped++; return tag; }
    added++;
    return tag.replace(/\s*\/?>$/, ` width="${dim.w}" height="${dim.h}"$&`)
              .replace(/\s+(\/?)>$/, ' $1>');
  });

  if (WRITE && html !== before) fs.writeFileSync(p, html);
}

console.log((WRITE ? 'wrote ' : 'would add ') + added + ' width/height pairs; skipped ' + skipped);
if (missing.length) {
  console.log('\ncould not read dimensions for:');
  for (const m of missing) console.log('  ' + m);
}
