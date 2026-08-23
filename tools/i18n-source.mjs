/* Показва българския източник за всеки ключ - от шаблона, ако е маркъп, и от
   ui.bg.json, ако е низ от JavaScript или се сглобява в build-а.
   Това е работният лист за превода.
   Пуска се с: node tools/i18n-source.mjs [представка] */
import fs from 'fs';
import path from 'path';
import { TEMPLATES } from './i18n-extract.mjs';

const root = process.cwd();
const src = {};

for (const f of TEMPLATES) {
  const html = fs.readFileSync(path.join(root, f), 'utf8');

  /* текстови ключове */
  for (const m of html.matchAll(/<([a-z0-9]+)([^>]*\sdata-t="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/gi))
    if (!(m[3] in src)) src[m[3]] = m[4];

  /* ключове по атрибути */
  for (const tag of html.match(/<[a-z0-9]+[^>]*>/gi) || []) {
    for (const m of tag.matchAll(/\sdata-t-([\w-]+)="([^"]+)"/g)) {
      const val = tag.match(new RegExp('\\s' + m[1] + '="([^"]*)"'));
      if (val && !(m[2] in src)) src[m[2]] = val[1];
    }
  }
}

/* низовете от JavaScript и сглобяваните в build-а */
const bg = JSON.parse(fs.readFileSync(path.join(root, 'i18n/ui.bg.json'), 'utf8'));
for (const [k, v] of Object.entries(bg)) if (k[0] !== '_' && !(k in src)) src[k] = v;

const prefix = process.argv[2] || '';
const keys = Object.keys(src).filter(k => k.startsWith(prefix)).sort();
const out = {};
for (const k of keys) out[k] = src[k];
console.log(JSON.stringify(out, null, 1));
