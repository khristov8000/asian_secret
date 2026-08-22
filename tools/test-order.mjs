/* Проверка на функцията за поръчки без да се праща нито едно писмо.
   `fetch` е подменен, за да се улови какво би отишло към Resend.
   Пуска се с: node tools/test-order.mjs */
process.env.RESEND_API_KEY = 'test-key';
process.env.ORDER_TO = 'owner@example.com';
process.env.ORDER_FROM = 'Asian Secret <orders@asiansecret.bg>';

const sent = [];
globalThis.fetch = async (url, opts) => {
  sent.push(JSON.parse(opts.body));
  return { ok: true, status: 200, json: async () => ({ id: 'test' }), text: async () => '' };
};

const { default: handler } = await import('../api/order.js');

function mockRes() {
  const r = { statusCode: 0, body: null, headers: {} };
  r.setHeader = (k, v) => { r.headers[k] = v; };
  r.status = c => { r.statusCode = c; return r; };
  r.json = b => { r.body = b; return r; };
  r.end = () => r;
  return r;
}
const call = async body => {
  sent.length = 0;
  const res = mockRes();
  await handler({ method: 'POST', headers: { origin: 'https://asiansecret.bg' }, body }, res);
  return res;
};

const base = {
  name: 'Мария Иванова', phone: '0888 123 456', email: 'maria@example.com',
  city: 'София', zip: '1000', address: 'ул. Витоша 15',
  deliveryMode: 'address', payment: 'Наложен платеж', note: 'тест'
};

let pass = 0, fail = 0;
const check = (label, cond, detail) => {
  if (cond) { pass++; console.log('  ok   ' + label); }
  else { fail++; console.log('  FAIL ' + label + (detail ? '  -> ' + detail : '')); }
};

console.log('\nцени се смятат на сървъра, не се вярва на браузъра');
{
  /* Клиентът твърди, че маската е 0.01 - трябва да се пренебрегне. */
  const res = await call({ ...base, items: [{ sku: 'resbro-ex', qty: 1, price: 0.01 }] });
  const owner = sent[0];
  check('заявката минава', res.statusCode === 200, 'status ' + res.statusCode);
  check('сумата е по каталога (29,90 + 3,90 = 33,80)',
    owner && owner.html.includes('33,80'), owner && owner.subject);
  check('подхвърлената цена 0,01 не се появява', owner && !owner.html.includes('0,01'));
}

console.log('\nпрагът за безплатна доставка');
{
  await call({ ...base, items: [{ sku: 'resbro-ex', qty: 1 }] });
  check('под 40 EUR -> 3,90', sent[0].html.includes('3,90'));
  await call({ ...base, items: [{ sku: 'resbro-ex', qty: 2 }] });
  check('над 40 EUR -> Безплатна', sent[0].html.includes('Безплатна'));
}

console.log('\nдвете писма');
{
  await call({ ...base, items: [{ sku: 'resbro-ex', qty: 1 }] });
  check('изпращат се точно 2 писма', sent.length === 2, 'бр. ' + sent.length);
  check('първото е до магазина', sent[0] && sent[0].to[0] === 'owner@example.com');
  check('второто е до клиента', sent[1] && sent[1].to[0] === 'maria@example.com');
  check('отговорът до магазина води към клиента', sent[0].reply_to === 'maria@example.com');
  check('отговорът до клиента води към магазина', sent[1].reply_to === 'zax12@abv.bg');
  check('и двете имат текстов вариант', sent.every(m => m.text && m.text.length > 40));
  check('клиентът е поздравен по име', sent[1].html.includes('Мария'));
}

console.log('\nотхвърляне на нередни заявки');
{
  check('без продукти', (await call({ ...base, items: [] })).statusCode === 400);
  check('непознат SKU', (await call({ ...base, items: [{ sku: 'няма-такъв', qty: 1 }] })).statusCode === 400);
  check('невалиден имейл',
    (await call({ ...base, email: 'не-е-имейл', items: [{ sku: 'resbro-ex', qty: 1 }] })).statusCode === 400);
  check('липсващо име',
    (await call({ ...base, name: '', items: [{ sku: 'resbro-ex', qty: 1 }] })).statusCode === 400);
  const bot = await call({ ...base, company: 'спам', items: [{ sku: 'resbro-ex', qty: 1 }] });
  check('капанът за ботове мълчи и не праща', bot.body.skipped === true && sent.length === 0);
}

console.log('\nграници на количеството');
{
  await call({ ...base, items: [{ sku: 'resbro-ex', qty: 9999 }] });
  check('количеството се ограничава до 99', sent[0].html.includes('99 бр.'));
  await call({ ...base, items: [{ sku: 'resbro-ex', qty: -5 }] });
  check('отрицателно количество става 1', sent[0].html.includes('1 бр.'));
}

console.log('\nHTML не се чупи от опасен вход');
{
  await call({ ...base, name: '<script>alert(1)</script>', items: [{ sku: 'resbro-ex', qty: 1 }] });
  check('таговете са екранирани', !sent[0].html.includes('<script>alert'));
}

console.log('\n' + (fail ? fail + ' FAILED, ' : '') + pass + ' passed');
process.exit(fail ? 1 : 0);
