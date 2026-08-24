/* Локален сървър, който повтаря правилата от .htaccess: /products поднася
   products.html, а старите адреси се пренасочват. Без него `python -m
   http.server` дава 404 на чистите адреси.

   Пускане:  node tools/serve.mjs   ->  http://localhost:8000            */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const root = path.resolve(import.meta.dirname, '..');
const port = Number(process.argv[2] || 8000);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

const isFile = p => fs.existsSync(p) && fs.statSync(p).isFile();
const isDir = p => fs.existsSync(p) && fs.statSync(p).isDirectory();

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const qs = url.search;
  let pathname = decodeURIComponent(url.pathname);

  const redirect = to => { res.writeHead(301, { Location: to + qs }); res.end(); };

  /* index.html -> /  и  foo.html -> /foo */
  if (pathname.endsWith('/index.html')) return redirect(pathname.slice(0, -10));
  if (pathname.endsWith('.html')) return redirect(pathname.slice(0, -5));

  const local = () => path.join(root, pathname.replace(/^\/+/, ''));

  /* /products/ -> /products, когато няма такава папка */
  if (pathname.length > 1 && pathname.endsWith('/') && !isDir(local()))
    return redirect(pathname.slice(0, -1));

  let file = local();
  if (isDir(file)) file = path.join(file, 'index.html');
  else if (!isFile(file) && isFile(file + '.html')) file += '.html';

  if (!isFile(file)) {
    /* Същото като ErrorDocument 404 /404.html в .htaccess: страницата се
       поднася СЪС статус 404 и без смяна на адреса, за да може локално да се
       види точно каквото ще види и посетителят. */
    const nf = path.join(root, '404.html');
    if (isFile(nf)) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(nf));
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('404 - ' + pathname);
  }

  res.writeHead(200, {
    'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log('http://localhost:' + port));
