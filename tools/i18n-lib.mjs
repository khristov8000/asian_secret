/* Единствената карта на адресите. Build-ът, hreflang таговете, sitemap-ът и
   превключвателят на езици четат оттук - затова не могат да се разминат. */
export const SITE = 'https://asiansecret.bg';
export const LANGS = ['bg', 'en', 'ru'];

/* Пътните сегменти. Българският и руският споделят транслитерацията:
   "produkt" и "kategoria" се четат и като продукт/категория на руски. */
export const SEG = {
  bg: { product: 'produkt', category: 'kategoria' },
  en: { product: 'product', category: 'category' },
  ru: { product: 'produkt', category: 'kategoria' }
};

/* Българският няма представка - старите адреси остават непокътнати. */
const prefix = lang => (lang === 'bg' ? '' : '/' + lang);

export function urlFor(page, lang, param) {
  const p = prefix(lang);
  switch (page) {
    case 'home': return p + '/';
    case 'products': return p + '/products';
    case 'about': return p + '/about';
    case 'contact': return p + '/contact';
    case 'cart': return p + '/cart';
    /* Правните страници делят един път на трите езика, както about и contact.
       Пътят е един и същ навсякъде, за да няма трето място, което да се
       разминава с картата - преводът е на съдържанието, не на адреса. */
    case 'privacy': return p + '/privacy';
    case 'terms': return p + '/terms';
    case 'returns': return p + '/returns';
    /* Шаблонът product.html сам по себе си - noindex, зареждан по ?p= от
       стари връзки. Различен е от конкретна продуктова страница и затова
       има свой ключ: urlFor('product') без слъг даваше /product/undefined/. */
    case 'productTpl': return p + '/product';
    case 'product': return p + '/' + SEG[lang].product + '/' + param + '/';
    case 'category': return p + '/' + SEG[lang].category + '/' + param + '/';
    default: throw new Error('unknown page: ' + page);
  }
}

/* Адрес -> файл на диска. Чистите адреси се поднасят от .htaccess, затова
   /en/products идва от en/products.html, а /en/ - от en/index.html. */
export function fileFor(page, lang, param) {
  const u = urlFor(page, lang, param);
  const rel = u.replace(/^\//, '');
  return u.endsWith('/') ? rel + 'index.html' : rel + '.html';
}

/* Пълен набор от четири записа, винаги в един и същи ред, с включен
   самопосочващ се запис - Google изхвърля еднопосочните набори. */
export function alternatesFor(page, param) {
  const bg = SITE + urlFor(page, 'bg', param);
  return [
    { lang: 'bg', url: bg },
    { lang: 'en', url: SITE + urlFor(page, 'en', param) },
    { lang: 'ru', url: SITE + urlFor(page, 'ru', param) },
    { lang: 'x-default', url: bg }
  ];
}

/* Превежда само текстовите полета. Всичко останало - слъг, цена, цветове,
   имена на икони, пътища до снимки - се пренася непокътнато. Български не
   минава оттук изобщо: източникът му е assets/data.js. */
export function translateProduct(p, lang, dict) {
  if (lang === 'bg') return p;
  const t = dict[p.slug];
  if (!t) return p;

  const out = { ...p };
  if (t.name) out.name = t.name;
  if (t.size) out.size = t.size;
  if (t.short) out.short = t.short;
  if (t.intro) out.intro = t.intro;
  if (t.badges) out.badges = t.badges;

  /* benefits е плосък масив: заглавие, описание, заглавие, описание...
     Иконата стои в оригинала и не се вижда в преводния файл. */
  if (t.benefits) {
    out.benefits = p.benefits.map((b, i) => ({
      ...b,
      t: t.benefits[i * 2] ?? b.t,
      d: t.benefits[i * 2 + 1] ?? b.d
    }));
  }
  if (t.specs) out.specs = { ...p.specs, ...t.specs };

  /* Вариантите носят свои size и count ("36 маски в кутия") и се четат както
     на картата на продукта, така и в спецификациите - без това българският
     изтичаше в английските страници. Ключът е sku, защото той не се превежда. */
  if (t.variants && p.variants) {
    out.variants = p.variants.map(v => {
      const tv = t.variants[v.sku];
      return tv ? { ...v, ...(tv.size ? { size: tv.size } : {}), ...(tv.count ? { count: tv.count } : {}) } : v;
    });
  }

  if (t.story && p.story) {
    out.story = { ...p.story };
    if (t.story.lead) out.story.lead = t.story.lead;
    if (t.story.caps && p.story.images) {
      out.story.images = p.story.images.map((im, i) => ({
        ...im, cap: t.story.caps[i] ?? im.cap
      }));
    }
  }
  return out;
}

/* Категориите и грижите са малки - превеждат се на място по id. */
export function translateList(list, lang, dict) {
  if (lang === 'bg') return list;
  return list.map(x => (dict[x.id] ? { ...x, ...dict[x.id] } : x));
}
