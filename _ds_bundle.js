/* @ds-bundle: {"format":4,"namespace":"AsianSecret_63d594","components":[],"sourceHashes":{"assets/data.js":"b3323ed71990","assets/shop.js":"f604b134816d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AsianSecret_63d594 = window.AsianSecret_63d594 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// assets/data.js
try { (() => {
/* Каталог Asian Secret — текстовете са адаптирани от продуктовите оверлеи на бранда. */
const EUR_BGN = 1.95583;
const money = e => e.toFixed(2).replace('.', ',') + ' €';
const moneyBgn = e => (e * EUR_BGN).toFixed(2).replace('.', ',') + ' лв.';
const CATS = [{
  id: 'masks',
  name: 'Тъканни маски за лице',
  desc: 'Ежедневен ритуал за хидратация и сияние',
  color: '#F3A9AD'
}, {
  id: 'eye',
  name: 'Патчи за очи',
  desc: 'Японска грижа за уморен поглед',
  color: '#F06292'
}, {
  id: 'spf',
  name: 'Слънцезащита',
  desc: 'Висока защита всеки ден',
  color: '#8E5BB5'
}, {
  id: 'hands',
  name: 'Грижа за ръце',
  desc: 'Подхранване и мекота',
  color: '#E8541F'
}, {
  id: 'hair',
  name: 'Грижа за коса',
  desc: 'Блясък, контрол и лека текстура',
  color: '#A9855C'
}];
const CONCERNS = [{
  id: 'hydration',
  name: 'Хидратация'
}, {
  id: 'soothing',
  name: 'Успокояване'
}, {
  id: 'glow',
  name: 'Сияние и равен тон'
}, {
  id: 'aging',
  name: 'Стегнатост и анти-ейдж'
}, {
  id: 'nourish',
  name: 'Подхранване'
}, {
  id: 'protect',
  name: 'Защита'
}];
const PRODUCTS = [{
  slug: 'resbro-ex',
  brand: 'Premium Resbro EX',
  name: 'Изглаждаща тъканна маска за лице',
  size: '40 листа',
  cat: 'masks',
  concerns: ['hydration', 'aging', 'glow'],
  accent: '#C2185B',
  tint: '#FBE9F0',
  price: 29.90,
  badges: ['Бестселър'],
  short: 'Ежедневно овлажняване и стегнатост с колаген, хиалуронова киселина и мултипептиден комплекс.',
  intro: 'Комплекс от активни съставки за хидратирана, гладка и сияйна кожа — в голяма опаковка за ежедневен ритуал.',
  benefits: [{
    t: 'Дълбока хидратация',
    d: 'Колаген, хиалуронова киселина и Sodium PCA задържат влагата и правят кожата мека и гладка.',
    icon: 'droplet'
  }, {
    t: 'Стегнатост и еластичност',
    d: 'Ниацинамид и мултипептиден комплекс помагат да се подобри текстурата и да се повиши стегнатостта.',
    icon: 'sparkles'
  }, {
    t: 'Сияние и защита',
    d: 'Деривати на витамини C и E, ресвератрол и екстракт от грозде връщат свежестта и здравото сияние.',
    icon: 'grape'
  }, {
    t: '100% натурален памук',
    d: 'Меката маска приляга плътно и осигурява максимално насищане с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'За ежедневна грижа',
    count: '40 маски',
    origin: 'Япония'
  },
  overlay: 'resbro-ex'
}, {
  slug: 'resbro-5gf',
  brand: 'Premium Resbro 5GF',
  name: 'Премиална изглаждаща маска',
  size: '40 листа',
  cat: 'masks',
  concerns: ['aging', 'hydration'],
  accent: '#C89235',
  tint: '#F7EFE1',
  price: 32.90,
  badges: ['Премиум'],
  short: 'Премиална грижа и стегнатост с 5 пептида и ресвератрол.',
  intro: 'Луксозна маска за ежедневна грижа с 5 пептида и ресвератрол за домашна анти-ейдж рутина. Популярната маска в голям формат от 40 броя с отлично съотношение цена / качество.',
  benefits: [{
    t: '5 пептида + ресвератрол',
    d: 'Комплексна грижа за повишаване на стегнатостта и поддържане на младостта на кожата.',
    icon: 'atom'
  }, {
    t: 'Дълбока хидратация',
    d: 'Есенцията в голямо количество интензивно овлажнява и изпълва кожата.',
    icon: 'droplet'
  }, {
    t: 'Мека и стегната кожа',
    d: '100% натурален памук приляга отлично и предава максимум есенция.',
    icon: 'sparkles'
  }, {
    t: 'Безопасна формула',
    d: 'Без отдушки, минерални масла и оцветители.',
    icon: 'shield-check'
  }],
  specs: {
    type: 'За ежедневна грижа',
    count: '40 маски',
    origin: 'Япония'
  },
  overlay: 'resbro-5gf'
}, {
  slug: 'arbro-eg',
  brand: 'Arbro EG',
  name: 'Smooth face mask с EGF',
  size: '40 листа',
  cat: 'masks',
  concerns: ['hydration', 'aging'],
  accent: '#2B3A67',
  tint: '#EAEDF5',
  price: 31.90,
  badges: [],
  short: 'Интензивна хидратация и стегнатост с EGF — съставка, отличена с Нобелова награда.',
  intro: 'EGF маска с есенция, равна на 2 флакона тонер (≈470 мл). Интензивно овлажнява, повишава стегнатостта и помага да се намалят видимите признаци на стареене.',
  benefits: [{
    t: 'EGF — Нобелова съставка',
    d: 'Поддържа стегнатостта и помага да се съкратят видимите признаци на стареене.',
    icon: 'atom'
  }, {
    t: 'Дълбока хидратация',
    d: 'Есенция, равна на 2 флакона тонер (≈470 мл), подхранва кожата в дълбочина.',
    icon: 'droplet'
  }, {
    t: 'Комплексна грижа',
    d: 'Изравнява текстурата, придава еластичност и здраво сияние.',
    icon: 'sparkles'
  }, {
    t: '100% натурален памук',
    d: 'Приляга меко към кожата и осигурява максимално насищане с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'За ежедневно овлажняване',
    count: '40 маски',
    origin: 'Япония'
  },
  overlay: 'arbro-eg'
}, {
  slug: 'zen-no-shizuku',
  brand: 'Zen no Shizuku',
  name: 'Японска тъканна маска за лице',
  size: '30 листа',
  cat: 'masks',
  concerns: ['hydration', 'soothing'],
  accent: '#B08A3E',
  tint: '#F6EFE2',
  price: 26.90,
  badges: ['Древни рецепти'],
  short: '14 традиционни растителни екстракта в синергия за ежедневна грижа.',
  intro: 'Древни рецепти. Съвременна красота. 14 традиционни растителни екстракта работят в синергия, за да се грижат за кожата ви всеки ден.',
  benefits: [{
    t: 'Дълбоко овлажняване',
    d: 'Интензивно хидратира и предотвратява загубата на влага.',
    icon: 'droplet'
  }, {
    t: 'Стегнатост и еластичност',
    d: 'Повишава стегнатостта и еластичността на кожата.',
    icon: 'move-up'
  }, {
    t: 'Успокоява кожата',
    d: 'Намалява раздразнението и дискомфорта — подходяща за чувствителна кожа.',
    icon: 'leaf'
  }, {
    t: 'Здрав и сияен вид',
    d: 'Поддържа защитната бариера и придава естествено сияние.',
    icon: 'shield'
  }],
  specs: {
    type: 'Тъканна маска за лице',
    count: '30 маски',
    origin: 'Япония'
  },
  overlay: 'zen-no-shizuku'
}, {
  slug: 'tuneup-niacinamide-36',
  brand: 'TUNE UP',
  name: 'Niacinamide Daily Clear Mask',
  size: '36 броя',
  cat: 'masks',
  concerns: ['glow', 'hydration'],
  accent: '#F06292',
  tint: '#FCEAF1',
  price: 27.90,
  badges: ['Ново'],
  short: 'Сияние и равен тон с ниацинамид — за ежедневна грижа.',
  intro: 'От ESTE QUALITY — бранд с над 3,9 млн. продадени маски. Нова серия за поколението Z с два варианта според настроението ви.',
  benefits: [{
    t: 'Сияние и равен тон',
    d: 'Маската с ниацинамид помага да придаде сияние, овлажнява и прави тена по-равен.',
    icon: 'droplet'
  }, {
    t: 'Ниацинамид — витамин B3',
    d: 'Поддържа стегнатостта и хидратацията, помага срещу матовост и сухота.',
    icon: 'atom'
  }, {
    t: 'Ежедневна грижа',
    d: 'Високоадхезивната тъкан приляга плътно и ефективно доставя влага.',
    icon: 'sparkles'
  }, {
    t: 'Чиста формула',
    d: 'Без парабени, спирт, ПАВ, съставки от животински произход, отдушки и оцветители.',
    icon: 'leaf'
  }],
  specs: {
    type: 'За ежедневна грижа',
    count: '36 маски в кутия',
    origin: 'Япония'
  },
  overlay: 'tuneup-niacinamide'
}, {
  slug: 'tuneup-niacinamide-7',
  brand: 'TUNE UP',
  name: 'Niacinamide Daily Clear Mask',
  size: '7 броя',
  cat: 'masks',
  concerns: ['glow', 'hydration'],
  accent: '#F06292',
  tint: '#FCEAF1',
  price: 7.90,
  badges: [],
  short: 'Удобната опаковка за път — сияние и равен тон с ниацинамид.',
  intro: 'Същата формула с ниацинамид в компактна опаковка от 7 маски — удобно да вземете със себе си.',
  benefits: [{
    t: 'Сияние и равен тон',
    d: 'Ниацинамидът помага да придаде сияние, овлажнява и изравнява тена.',
    icon: 'droplet'
  }, {
    t: 'Удобен формат',
    d: '7 маски в опаковка — удобно за път и пътуване.',
    icon: 'package'
  }, {
    t: 'Ежедневна грижа',
    d: 'Високоадхезивната тъкан приляга плътно и доставя влага ефективно.',
    icon: 'sparkles'
  }, {
    t: 'Чиста формула',
    d: 'Без парабени, спирт, ПАВ, отдушки и оцветители.',
    icon: 'leaf'
  }],
  specs: {
    type: 'За ежедневна грижа',
    count: '7 маски',
    origin: 'Япония'
  },
  overlay: 'tuneup-niacinamide'
}, {
  slug: 'tuneup-dokudami-36',
  brand: 'TUNE UP',
  name: 'Dokudami Daily Protection Mask',
  size: '36 броя',
  cat: 'masks',
  concerns: ['soothing', 'hydration'],
  accent: '#8FAF23',
  tint: '#F2F5E2',
  price: 27.90,
  badges: ['Ново'],
  short: 'Чиста и спокойна кожа с екстракт от хауттюйния.',
  intro: 'Нова линия тъканни маски TUNE UP — два варианта на избор в зависимост от вашето настроение.',
  benefits: [{
    t: 'Хидратация и здрав вид',
    d: 'Екстрактът от хауттюйния помага да се поддържа овлажнеността и придава здрав, поддържан вид.',
    icon: 'droplet'
  }, {
    t: 'Чиста и спокойна кожа',
    d: 'Спомага за подобряване на обменните процеси, намалява видимостта на порите и смекчава неравностите.',
    icon: 'leaf'
  }, {
    t: 'Ежедневна грижа',
    d: 'Високоадхезивната тъкан приляга плътно и ефективно доставя влага.',
    icon: 'sparkles'
  }, {
    t: 'Чиста формула',
    d: 'Без парабени, спирт, ПАВ, съставки от животински произход, отдушки и оцветители.',
    icon: 'shield-check'
  }],
  specs: {
    type: 'За ежедневна грижа',
    count: '36 маски в кутия',
    origin: 'Япония'
  },
  overlay: 'tuneup-dokudami'
}, {
  slug: 'tuneup-dokudami-7',
  brand: 'TUNE UP',
  name: 'Dokudami Daily Protection Mask',
  size: '7 броя',
  cat: 'masks',
  concerns: ['soothing', 'hydration'],
  accent: '#8FAF23',
  tint: '#F2F5E2',
  price: 7.90,
  badges: [],
  short: 'Компактна опаковка с хауттюйния за спокойна кожа.',
  intro: 'Формулата с хауттюйния в опаковка от 7 маски — удобно да вземете със себе си.',
  benefits: [{
    t: 'Хидратация и здрав вид',
    d: 'Хауттюйнията поддържа овлажнеността и здравия вид на кожата.',
    icon: 'droplet'
  }, {
    t: 'Чиста и спокойна кожа',
    d: 'Намалява видимостта на порите и смекчава неравностите.',
    icon: 'leaf'
  }, {
    t: 'Удобен формат',
    d: '7 маски в опаковка — удобно за път.',
    icon: 'package'
  }, {
    t: 'Чиста формула',
    d: 'Без парабени, спирт, ПАВ, отдушки и оцветители.',
    icon: 'shield-check'
  }],
  specs: {
    type: 'За ежедневна грижа',
    count: '7 маски',
    origin: 'Япония'
  },
  overlay: 'tuneup-dokudami'
}, {
  slug: 'temogey-propolis-30',
  brand: 'TEMOGEY',
  name: 'Daily Moisture Mask Red Propolis',
  size: '30 листа',
  cat: 'masks',
  concerns: ['nourish', 'aging', 'hydration'],
  accent: '#E8452A',
  tint: '#FCEBE6',
  price: 22.90,
  badges: ['Бестселър'],
  short: 'Силата на червения прополис за подхранване и стегнатост.',
  intro: 'Маска с екстракт от червен прополис за интензивно подхранване, овлажняване и повишаване на стегнатостта на кожата.',
  benefits: [{
    t: 'Червен прополис',
    d: 'Рядка природна съставка, която помага да се повиши стегнатостта и да се подобри състоянието на кожата.',
    icon: 'hexagon'
  }, {
    t: 'Интензивна хидратация',
    d: 'Дарява усещане за комфорт и помага да се поддържа оптимално ниво на влага.',
    icon: 'droplet'
  }, {
    t: 'Повишава стегнатостта',
    d: 'Спомага за по-гладка, еластична и поддържана кожа.',
    icon: 'move-up'
  }, {
    t: 'Приляга плътно',
    d: 'Осигурява максимално насищане с есенция и комфорт при употреба.',
    icon: 'flower'
  }],
  specs: {
    type: 'За интензивно възстановяване',
    count: '30 маски',
    origin: 'Япония'
  },
  overlay: 'temogey-propolis'
}, {
  slug: 'temogey-propolis-7',
  brand: 'TEMOGEY',
  name: 'Daily Moisture Mask Red Propolis',
  size: '7 листа',
  cat: 'masks',
  concerns: ['nourish', 'aging'],
  accent: '#E8452A',
  tint: '#FCEBE6',
  price: 7.50,
  badges: [],
  short: 'Червен прополис в компактна опаковка от 7 маски.',
  intro: 'Маска с екстракт от червен прополис за подхранване и стегнатост — в опаковка за път.',
  benefits: [{
    t: 'Червен прополис',
    d: 'Помага да се повиши стегнатостта и да се подобри състоянието на кожата.',
    icon: 'hexagon'
  }, {
    t: 'Интензивна хидратация',
    d: 'Поддържа оптимално ниво на влага и дарява комфорт.',
    icon: 'droplet'
  }, {
    t: 'Удобен формат',
    d: '7 маски — удобно за пътуване.',
    icon: 'package'
  }, {
    t: 'Приляга плътно',
    d: 'Максимално насищане на кожата с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'За интензивно възстановяване',
    count: '7 маски',
    origin: 'Япония'
  },
  overlay: 'temogey-propolis'
}, {
  slug: 'temogey-yomogi-30',
  brand: 'TEMOGEY',
  name: 'Daily Moisture Mask Yomogi',
  size: '30 листа',
  cat: 'masks',
  concerns: ['soothing', 'hydration'],
  accent: '#6E9B3C',
  tint: '#EFF4E6',
  price: 22.90,
  badges: [],
  short: 'Силата на Yomogi — екстракт от японски пелин за спокойна кожа.',
  intro: 'Маска с екстракт Yomogi успокоява кожата, интензивно овлажнява и дарява усещане за комфорт.',
  benefits: [{
    t: 'Успокоява кожата',
    d: 'Помага да се намалят раздразнението и зачервяванията.',
    icon: 'droplet'
  }, {
    t: 'Интензивно овлажнява',
    d: 'Поддържа оптималното ниво на влага.',
    icon: 'leaf'
  }, {
    t: 'Свежест и комфорт',
    d: 'Кожата е гладка, мека и напоена.',
    icon: 'sparkles'
  }, {
    t: '100% натурален памук',
    d: 'Комфортно прилягане и максимално насищане с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'За интензивно овлажняване',
    count: '30 маски',
    origin: 'Япония'
  },
  overlay: 'temogey-yomogi'
}, {
  slug: 'temogey-yomogi-7',
  brand: 'TEMOGEY',
  name: 'Daily Moisture Mask Yomogi',
  size: '7 листа',
  cat: 'masks',
  concerns: ['soothing', 'hydration'],
  accent: '#6E9B3C',
  tint: '#EFF4E6',
  price: 7.50,
  badges: [],
  short: 'Японски пелин за спокойна кожа — опаковка от 7 маски.',
  intro: 'Екстрактът Yomogi успокоява, овлажнява и дарява комфорт — в удобен формат за път.',
  benefits: [{
    t: 'Успокоява кожата',
    d: 'Намалява раздразнението и зачервяванията.',
    icon: 'droplet'
  }, {
    t: 'Интензивно овлажнява',
    d: 'Поддържа оптималното ниво на влага.',
    icon: 'leaf'
  }, {
    t: 'Удобен формат',
    d: '7 маски — удобно за чанта и пътуване.',
    icon: 'package'
  }, {
    t: '100% натурален памук',
    d: 'Комфортно прилягане и максимално насищане с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'За интензивно овлажняване',
    count: '7 маски',
    origin: 'Япония'
  },
  overlay: 'temogey-yomogi'
}, {
  slug: 'temogey-bakuchiol-30',
  brand: 'TEMOGEY',
  name: 'Daily Moisture Mask Bakuchiol',
  size: '30 листа',
  cat: 'masks',
  concerns: ['aging', 'hydration'],
  accent: '#9B7BC8',
  tint: '#F1ECF9',
  price: 22.90,
  badges: ['Анти-ейдж'],
  short: 'Натуралната алтернатива на ретинола за стегната и сияйна кожа.',
  intro: 'Силата на Bakuchiol — натурална алтернатива на ретинола за стегната, гладка и сияйна кожа.',
  benefits: [{
    t: 'Bakuchiol',
    d: 'Натурална алтернатива на ретинола за стегната, гладка и сияйна кожа.',
    icon: 'leaf'
  }, {
    t: 'Интензивно овлажняване',
    d: 'Дълбоко подхранва и помага да се поддържа оптимално ниво на влага.',
    icon: 'droplet'
  }, {
    t: 'Стегнатост и сияние',
    d: 'Кожата става по-гладка, стегната и сияйна.',
    icon: 'sparkles'
  }, {
    t: 'Премиален памук',
    d: 'Меката маска приляга плътно и осигурява максимално насищане с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'За интензивно овлажняване',
    count: '30 маски',
    origin: 'Япония'
  },
  overlay: 'temogey-bakuchiol'
}, {
  slug: 'temogey-bakuchiol-7',
  brand: 'TEMOGEY',
  name: 'Daily Moisture Mask Bakuchiol',
  size: '7 листа',
  cat: 'masks',
  concerns: ['aging', 'hydration'],
  accent: '#9B7BC8',
  tint: '#F1ECF9',
  price: 7.50,
  badges: [],
  short: 'Bakuchiol в компактна опаковка от 7 маски.',
  intro: 'Натуралната алтернатива на ретинола — за стегната и сияйна кожа, в удобен формат.',
  benefits: [{
    t: 'Bakuchiol',
    d: 'Натурална алтернатива на ретинола за упругост и сияние.',
    icon: 'leaf'
  }, {
    t: 'Интензивно овлажняване',
    d: 'Дълбоко подхранва кожата.',
    icon: 'droplet'
  }, {
    t: 'Удобен формат',
    d: '7 маски — удобно за път.',
    icon: 'package'
  }, {
    t: 'Премиален памук',
    d: 'Плътно прилягане и максимално насищане с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'За интензивно овлажняване',
    count: '7 маски',
    origin: 'Япония'
  },
  overlay: 'temogey-bakuchiol'
}, {
  slug: 'temogey-aomikan-30',
  brand: 'TEMOGEY',
  name: 'Daily Moisture Mask Aomikan',
  size: '30 листа',
  cat: 'masks',
  concerns: ['glow', 'hydration'],
  accent: '#E0B01C',
  tint: '#FBF3DC',
  price: 22.90,
  badges: [],
  short: 'Екстракт от зелена мандарина за хидратация и сияние.',
  intro: 'Маска с екстракт от зелена мандарина интензивно овлажнява, освежава и помага да се поддържа естественият баланс на кожата.',
  benefits: [{
    t: 'Екстракт от зелена мандарина',
    d: 'Помага да се изравни тонът на кожата и поддържа естествения ѝ баланс.',
    icon: 'citrus'
  }, {
    t: 'Дълбоко овлажняване',
    d: 'Интензивно подхранва и помага да се запази оптималното ниво на влага.',
    icon: 'droplet'
  }, {
    t: 'Свежест и сияние',
    d: 'Дарява на кожата мекота, гладкост и здраво сияние.',
    icon: 'sparkles'
  }, {
    t: '100% натурален памук',
    d: 'Комфортно прилягане и максимално насищане с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'За интензивно овлажняване',
    count: '30 маски',
    origin: 'Япония'
  },
  overlay: 'temogey-aomikan'
}, {
  slug: 'temogey-aomikan-7',
  brand: 'TEMOGEY',
  name: 'Daily Moisture Mask Aomikan',
  size: '7 листа',
  cat: 'masks',
  concerns: ['glow', 'hydration'],
  accent: '#E0B01C',
  tint: '#FBF3DC',
  price: 7.50,
  badges: [],
  short: 'Цитрусова свежест в опаковка от 7 маски.',
  intro: 'Екстрактът от зелена мандарина овлажнява и освежава — в удобен формат за път.',
  benefits: [{
    t: 'Екстракт от зелена мандарина',
    d: 'Изравнява тона и поддържа естествения баланс.',
    icon: 'citrus'
  }, {
    t: 'Дълбоко овлажняване',
    d: 'Помага да се запази оптималното ниво на влага.',
    icon: 'droplet'
  }, {
    t: 'Удобен формат',
    d: '7 маски — удобно за чанта.',
    icon: 'package'
  }, {
    t: '100% натурален памук',
    d: 'Комфортно прилягане и насищане с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'За интензивно овлажняване',
    count: '7 маски',
    origin: 'Япония'
  },
  overlay: 'temogey-aomikan'
}, {
  slug: 'este-snail',
  brand: 'ESTE QUALITY',
  name: 'Маска с муцин от охлюв',
  size: '50 листа',
  cat: 'masks',
  concerns: ['hydration', 'glow'],
  accent: '#35B3C4',
  tint: '#E6F5F7',
  price: 27.90,
  badges: ['Салонен ефект'],
  short: 'Професионална овлажняваща маска с муцин от охлюв.',
  intro: 'Маска с муцин от охлюв — природен компонент за ефект на професионална салонна грижа всеки ден. Обновена формула и с 10% повече есенция.',
  benefits: [{
    t: 'Интензивно овлажнява',
    d: 'Дълбока хидратация и усещане за свежест след всяко приложение.',
    icon: 'droplet'
  }, {
    t: 'Успокоява и освежава',
    d: 'Подходяща за ежедневна грижа дори при чувствителна кожа.',
    icon: 'waves'
  }, {
    t: 'Придава сияние',
    d: 'Кожата изглежда по-здрава, гладка и сияйна.',
    icon: 'sparkles'
  }, {
    t: '100% натурален памук',
    d: 'Комфортно прилягане и максимално насищане на кожата с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'Тъканна маска',
    count: '50 маски',
    origin: 'Япония'
  },
  overlay: 'este-snail'
}, {
  slug: 'este-horse-oil',
  brand: 'ESTE QUALITY',
  name: 'Маска с конско масло',
  size: '50 листа',
  cat: 'masks',
  concerns: ['nourish', 'hydration'],
  accent: '#F07C2A',
  tint: '#FDEEE1',
  price: 27.90,
  badges: [],
  short: 'Природен източник на подхранване и мекота за суха кожа.',
  intro: 'Маска с конско масло — природен източник на овлажняване и подхранване за кожата. Обновена формула и с 10% повече есенция.',
  benefits: [{
    t: 'Интензивно овлажняване',
    d: 'Помага на кожата да задържа влагата и я защитава от сухота.',
    icon: 'droplet'
  }, {
    t: 'Дълбоко подхранване',
    d: 'Конското масло подхранва кожата в дълбочина.',
    icon: 'sparkles'
  }, {
    t: 'Мека и гладка кожа',
    d: 'Кожата остава мека, гладка и поддържана.',
    icon: 'heart'
  }, {
    t: '100% натурален памук',
    d: 'Комфортно прилягане и максимално насищане с есенция.',
    icon: 'flower'
  }],
  specs: {
    type: 'Тъканна маска',
    count: '50 маски',
    origin: 'Япония'
  },
  overlay: 'este-horse-oil'
}, {
  slug: 'este-viper',
  brand: 'ESTE QUALITY',
  name: 'Маска с пептид Viper Peptide-3',
  size: '50 листа',
  cat: 'masks',
  concerns: ['aging', 'hydration'],
  accent: '#EC3A82',
  tint: '#FDE9F1',
  price: 29.90,
  badges: ['Анти-ейдж'],
  short: 'Премиум маска за хидратация и стегнатост на кожата.',
  intro: 'Маска с пептид, вдъхновен от природата. Като основна активна съставка се използва Viper Peptide-3, който спомага за подобряване на стегнатостта и гладкостта на кожата.',
  benefits: [{
    t: 'Повишава стегнатостта',
    d: 'Помага да се поддържа еластичността на кожата.',
    icon: 'move-up'
  }, {
    t: 'Изглажда и смекчава',
    d: 'Прави кожата видимо по-гладка и мека.',
    icon: 'sparkles'
  }, {
    t: 'Ежедневна анти-ейдж грижа',
    d: 'Формулата е разработена за ежедневна антивъзрастова рутина.',
    icon: 'flower'
  }, {
    t: '100% натурален памук',
    d: 'Плътно прилягане и максимално насищане с есенция.',
    icon: 'droplet'
  }],
  specs: {
    type: 'Тъканна маска',
    count: '50 маски',
    origin: 'Япония'
  },
  overlay: 'este-viper'
}, {
  slug: 'pullup-marshmallow',
  brand: 'PulluP',
  name: 'SRS Marshmallow Sheet Mask',
  size: '12 листа',
  cat: 'masks',
  concerns: ['aging', 'hydration'],
  accent: '#9E1B32',
  tint: '#F7E7E9',
  price: 24.90,
  badges: ['Корея'],
  short: 'Премиална тъканна маска с антивъзрастов ефект.',
  intro: 'Маска с иновативен Marshmallow Sheet, който приляга плътно към кожата и помага на активните компоненти да я насищат с влага по-ефективно. Комплекс от 6 активни съставки поддържа стегнатостта и придава гладкост и здраво сияние.',
  benefits: [{
    t: 'Дълбоко овлажняване',
    d: 'Интензивно насища кожата с влага.',
    icon: 'droplet'
  }, {
    t: 'Повишава стегнатостта',
    d: 'Връща на кожата плътност и еластичност.',
    icon: 'sparkles'
  }, {
    t: '6 активни компонента',
    d: 'Комплексно се грижат за младостта на кожата.',
    icon: 'leaf'
  }, {
    t: 'Еластичен Marshmallow Sheet',
    d: 'Плътно прилягане и максимално проникване на есенцията.',
    icon: 'move-up'
  }],
  specs: {
    type: 'Тъканна маска за лице',
    count: '12 маски',
    origin: 'Корея'
  },
  overlay: 'pullup-marshmallow'
}, {
  slug: 'puru-puru-eye',
  brand: 'PuRu PuRu',
  name: 'Патчи за очи',
  size: '60 патча (30 приложения)',
  cat: 'eye',
  concerns: ['hydration', 'glow'],
  accent: '#F0629B',
  tint: '#FCE9F1',
  price: 19.90,
  badges: ['Бестселър'],
  short: 'Японска грижа за уморен поглед — 10–15 минути за видим резултат.',
  intro: 'Патчи за околоочния контур с 3 вида колаген, протеогликани и керамиди — за свеж и отпочинал вид всеки ден.',
  benefits: [{
    t: 'Интензивна хидратация',
    d: 'За свеж и отпочинал вид.',
    icon: 'droplet'
  }, {
    t: '3 вида колаген',
    d: 'Подпомагат еластичността и стегнатостта.',
    icon: 'waves'
  }, {
    t: 'Протеогликани и керамиди',
    d: 'Задържат влагата, укрепват кожната бариера и намаляват сухотата.',
    icon: 'shield'
  }, {
    t: '10–15 минути',
    d: 'За видим резултат — подходящи за ежедневна употреба.',
    icon: 'clock'
  }],
  specs: {
    type: 'За околоочен контур',
    count: '60 патча (30 приложения)',
    origin: 'Япония'
  },
  overlay: 'puru-puru-eye'
}, {
  slug: 'earthful-verbena-30',
  brand: 'Earthful Beauty',
  name: 'i Sheet Mask Verbena',
  size: '30 листа',
  cat: 'masks',
  concerns: ['hydration', 'soothing'],
  accent: '#7FA35A',
  tint: '#EFF4E7',
  price: 21.90,
  badges: ['Powered by plants'],
  short: 'Свежест и лекота с аромат на върбинка.',
  intro: '100% натурален неизбелен памук, Folitect® от преработени гъби, ябълкови стволови клетки и 8 органични екстракта — без 6 нежелани компонента.',
  benefits: [{
    t: 'Свеж аромат на върбинка',
    d: 'Ароматът на върбинка, лимон и билки дарява усещане за чистота и бодрост.',
    icon: 'citrus'
  }, {
    t: 'Folitect®',
    d: 'Интензивно овлажнява и задържа влагата в кожата.',
    icon: 'droplet'
  }, {
    t: 'Ябълкови стволови клетки',
    d: 'Помагат да се запазят стегнатостта и естественото сияние.',
    icon: 'sparkles'
  }, {
    t: '8 органични екстракта',
    d: 'Успокояват и поддържат естествения баланс на кожата.',
    icon: 'leaf'
  }],
  specs: {
    type: 'Тъканна маска за лице',
    count: '30 маски',
    origin: 'Япония'
  },
  overlay: 'earthful'
}, {
  slug: 'earthful-verbena-10',
  brand: 'Earthful Beauty',
  name: 'i Sheet Mask Verbena',
  size: '10 листа',
  cat: 'masks',
  concerns: ['hydration', 'soothing'],
  accent: '#7FA35A',
  tint: '#EFF4E7',
  price: 9.90,
  badges: [],
  short: 'Върбинка — свежест и лекота, в опаковка от 10 маски.',
  intro: 'Натурален неизбелен памук и 8 органични екстракта — без парабени, спирт, минерални масла, оцветители, силикони и UV-филтри.',
  benefits: [{
    t: 'Свеж аромат на върбинка',
    d: 'Върбинка, лимон и билки за усещане за чистота и бодрост.',
    icon: 'citrus'
  }, {
    t: '100% натурален памук',
    d: 'Неизбелен памук — мек, приляга плътно и дарява комфорт.',
    icon: 'flower'
  }, {
    t: 'Хидратация',
    d: 'Folitect® интензивно овлажнява и задържа влагата.',
    icon: 'droplet'
  }, {
    t: 'Без 6 нежелани компонента',
    d: 'Без парабени, спирт, минерални масла, оцветители, силикони и UV-филтри.',
    icon: 'shield-check'
  }],
  specs: {
    type: 'Тъканна маска за лице',
    count: '10 маски',
    origin: 'Япония'
  },
  overlay: 'earthful'
}, {
  slug: 'earthful-immortelle',
  brand: 'Earthful Beauty',
  name: 'i Sheet Mask Immortelle',
  size: '10 листа',
  cat: 'masks',
  concerns: ['soothing', 'nourish'],
  accent: '#E0B44A',
  tint: '#FBF3DE',
  price: 9.90,
  badges: [],
  short: 'Комфорт и отпускане с аромат на имортел.',
  intro: 'Уникалният аромат на имортел с нотки на подправки, дървесина и лека сладост — за момент на спокойствие.',
  benefits: [{
    t: 'Аромат на имортел',
    d: 'Нотки на подправки, дървесина и лека сладост за комфорт и отпускане.',
    icon: 'flower'
  }, {
    t: 'Folitect®',
    d: 'Интензивно овлажнява и задържа влагата.',
    icon: 'droplet'
  }, {
    t: 'Ябълкови стволови клетки',
    d: 'Помагат да се запазят стегнатостта и естественото сияние.',
    icon: 'sparkles'
  }, {
    t: '100% натурален памук',
    d: 'Неизбелен памук — мек и приляга плътно.',
    icon: 'leaf'
  }],
  specs: {
    type: 'Тъканна маска за лице',
    count: '10 маски',
    origin: 'Япония'
  },
  overlay: 'earthful'
}, {
  slug: 'earthful-geranium',
  brand: 'Earthful Beauty',
  name: 'i Sheet Mask Geranium',
  size: '10 листа',
  cat: 'masks',
  concerns: ['soothing', 'hydration'],
  accent: '#E39BB4',
  tint: '#FBEDF2',
  price: 9.90,
  badges: [],
  short: 'Нежна цветна грижа с аромат на здравец.',
  intro: 'Мекият цветен аромат на здравец успокоява и дарява усещане за нежност и хармония.',
  benefits: [{
    t: 'Аромат на здравец',
    d: 'Успокоява и дарява усещане за нежност и хармония.',
    icon: 'flower'
  }, {
    t: 'Folitect®',
    d: 'Интензивно овлажнява и задържа влагата.',
    icon: 'droplet'
  }, {
    t: '8 органични екстракта',
    d: 'Успокояват и поддържат естествения баланс на кожата.',
    icon: 'leaf'
  }, {
    t: 'Без 6 нежелани компонента',
    d: 'Без парабени, спирт, минерални масла, оцветители, силикони и UV-филтри.',
    icon: 'shield-check'
  }],
  specs: {
    type: 'Тъканна маска за лице',
    count: '10 маски',
    origin: 'Япония'
  },
  overlay: 'earthful'
}, {
  slug: 'phytocotton',
  brand: 'Earthful Beauty',
  name: 'Phytocotton натурална памучна маска',
  size: '36 листа',
  cat: 'masks',
  concerns: ['hydration', 'glow'],
  accent: '#4B8B3B',
  tint: '#EBF3E6',
  price: 23.90,
  badges: ['Корея'],
  short: 'Силата на растенията за дълбока хидратация и сияйна кожа.',
  intro: 'Натурална памучна маска с 8 вида органични екстракти — нежна към кожата и природата, подходяща за ежедневна употреба.',
  benefits: [{
    t: 'Интензивна хидратация',
    d: 'За дълбока и продължителна хидратация.',
    icon: 'droplet'
  }, {
    t: '8 вида органични екстракти',
    d: 'Подхранват и освежават кожата.',
    icon: 'leaf'
  }, {
    t: '100% натурален памук',
    d: 'Нежен към кожата и природата.',
    icon: 'flower'
  }, {
    t: 'За всеки тип кожа',
    d: 'Подходяща за ежедневна употреба.',
    icon: 'sparkles'
  }],
  specs: {
    type: 'Памучна маска за лице',
    count: '36 листа в кутия',
    origin: 'Южна Корея'
  },
  overlay: 'phytocotton'
}, {
  slug: 'mhy-spf90',
  brand: 'MHY',
  name: 'Hello SunShine SPF90+ PA+++',
  size: '60 мл',
  cat: 'spf',
  concerns: ['protect', 'hydration'],
  accent: '#7B2FA0',
  tint: '#F1E8F6',
  price: 16.90,
  badges: ['Висока защита'],
  short: 'Висока защита от UVA и UVB лъчи. Всеки ден.',
  intro: 'Слънцезащитен крем с максимална защита SPF90+ PA+++, керамиди и лека, комфортна текстура — подходящ за всички типове кожа.',
  benefits: [{
    t: 'Защита от UVA и UVB',
    d: 'Предотвратява преждевременното стареене, пигментните петна и увреждането на кожната бариера.',
    icon: 'sun'
  }, {
    t: 'Предотвратява стареенето',
    d: 'Намалява риска от бръчки, загуба на стегнатост и матов цвят на кожата.',
    icon: 'sparkles'
  }, {
    t: 'Овлажнява и се грижи',
    d: 'Формулата осигурява комфортно нанасяне и поддържа кожата мека и гладка.',
    icon: 'droplet'
  }, {
    t: 'Керамиди',
    d: 'Укрепват кожната бариера и намаляват сухотата.',
    icon: 'shield'
  }],
  specs: {
    type: 'Слънцезащитен крем',
    count: '60 мл',
    origin: 'Тайланд'
  },
  overlay: 'mhy-spf90'
}, {
  slug: 'mhy-hand-cream',
  brand: 'MHY',
  name: 'Крем за ръце с конско масло',
  size: '100 г',
  cat: 'hands',
  concerns: ['nourish', 'hydration'],
  accent: '#E8541F',
  tint: '#FDEDE4',
  price: 9.90,
  badges: [],
  short: 'Интензивна грижа за суха и чувствителна кожа на ръцете.',
  intro: 'Интензивен овлажняващ крем за ежедневна грижа за суха и чувствителна кожа на ръцете. Бързо се попива, без да оставя лепкавост.',
  benefits: [{
    t: 'Интензивно овлажнява',
    d: 'Овлажнява и подхранва кожата на ръцете.',
    icon: 'droplet'
  }, {
    t: 'Смекчава',
    d: 'Смекчава суха и загрубяла кожа.',
    icon: 'hand-heart'
  }, {
    t: 'Бързо се попива',
    d: 'Без усещане за лепкавост след нанасяне.',
    icon: 'wind'
  }, {
    t: 'Защитава',
    d: 'Предпазва от сухота и външни въздействия.',
    icon: 'shield'
  }],
  specs: {
    type: 'Крем за ръце',
    count: '100 г',
    origin: 'Тайланд'
  },
  overlay: 'mhy-hand-cream'
}, {
  slug: 'mhy-hair-cream',
  brand: 'MHY Hair Expert',
  name: 'Финиширащ крем за коса',
  size: '1 брой',
  cat: 'hair',
  concerns: ['nourish', 'protect'],
  accent: '#8A6A4B',
  tint: '#F5EDE4',
  price: 12.90,
  badges: [],
  short: 'Подчертай стила. Съхрани съвършенството.',
  intro: 'Лека формула за естествен блясък и контрол — идеална за всеки тип коса, без омазняване и утежняване.',
  benefits: [{
    t: 'Блясък и контрол',
    d: 'Придава естествен блясък и укротява хвърчащите коси.',
    icon: 'sparkles'
  }, {
    t: 'Хидратация и защита',
    d: 'Подхранва косъма и го предпазва от изсушаване.',
    icon: 'droplet'
  }, {
    t: 'Лека формула',
    d: 'Не омазнява и не утежнява — идеален за всеки тип коса.',
    icon: 'feather'
  }, {
    t: 'Финиш съвършенство',
    d: 'Перфектен завършек за всяка прическа — всеки ден.',
    icon: 'waves'
  }],
  specs: {
    type: 'Крем за коса',
    count: 'Удобен формат за чанта',
    origin: 'Тайланд'
  },
  overlay: 'mhy-hair-cream'
}];
const bySlug = s => PRODUCTS.find(p => p.slug === s);
const img = p => 'assets/products/' + p.slug + '.jpg';
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/data.js", error: String((e && e.message) || e) }); }

// assets/shop.js
try { (() => {
/* Кошница, рендиране на продукти и общи взаимодействия */
const CART_KEY = 'as_cart_v1';
const SHIPPING_FLAT = 4.90;
const FREE_SHIPPING = 60;
const cartRead = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
};
const cartWrite = items => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  paintCount();
};
const cartCount = () => cartRead().reduce((n, i) => n + i.qty, 0);
const cartSubtotal = () => cartRead().reduce((s, i) => {
  const p = bySlug(i.slug);
  return s + (p ? p.price * i.qty : 0);
}, 0);
function addToCart(slug, qty = 1) {
  const items = cartRead();
  const found = items.find(i => i.slug === slug);
  if (found) found.qty += qty;else items.push({
    slug,
    qty
  });
  cartWrite(items);
  const p = bySlug(slug);
  toast('Добавено в количката: ' + p.brand + ' · ' + p.size);
}
function setQty(slug, qty) {
  let items = cartRead();
  if (qty <= 0) items = items.filter(i => i.slug !== slug);else {
    const f = items.find(i => i.slug === slug);
    if (f) f.qty = qty;
  }
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
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = '<i data-lucide="check-circle-2"></i><span></span>';
  t.querySelector('span').textContent = msg;
  if (window.lucide) lucide.createIcons();
  requestAnimationFrame(() => t.classList.add('on'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 2600);
}
function cardHTML(p) {
  const tags = (p.badges || []).map(b => `<span class="tag accent" style="background:${p.accent}">${b}</span>`).join('');
  return `<article class="card">
<a class="shot" href="product.html?p=${p.slug}" style="background:${p.tint}"><img src="assets/products/${p.slug}.jpg" alt="${p.brand} ${p.name}" loading="lazy"><span class="tags">${tags}</span></a>
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
const REVEAL_SEL = '.card,.cat,.pillar,.usp,.step,.dcard,.bcard,.overlay-sheet,.sec-head,.benefits li,.faq details';
let observer;
function initReveal(scope) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!observer) observer = new IntersectionObserver(es => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: .06
  });
  const root = scope || document;
  root.querySelectorAll(REVEAL_SEL).forEach((el, i) => {
    if (el.hasAttribute('data-reveal')) return;
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = i % 4 * 70 + 'ms';
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
  if (add) {
    e.preventDefault();
    addToCart(add.dataset.add, 1);
  }
});
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  paintCount();
  initReveal();
  const f = document.querySelector('footer.site .wrap');
  if (f && !f.querySelector('.blossom')) {
    const b = document.createElement('img');
    b.src = 'assets/sakura-bloom.png';
    b.alt = '';
    b.className = 'blossom';
    document.querySelector('footer.site').appendChild(b);
  }
  const burger = document.querySelector('.burger');
  if (burger) burger.addEventListener('click', () => {
    const nav = document.querySelector('nav.main');
    if (!nav) return;
    const open = nav.style.display === 'flex';
    nav.style.display = open ? '' : 'flex';
    if (!open) {
      nav.style.position = 'absolute';
      nav.style.top = '82px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.flexDirection = 'column';
      nav.style.background = '#fff';
      nav.style.padding = '18px 22px';
      nav.style.borderBottom = '1px solid rgba(10,9,8,.12)';
      nav.style.margin = '0';
    }
  });
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "assets/shop.js", error: String((e && e.message) || e) }); }

})();
