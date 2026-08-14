/**
 * Single source of truth for the 4 services: the homepage "Xizmatlar"
 * showcase (`src/components/Services.tsx`) and each dedicated page under
 * `/xizmatlar/[slug]` both read from this file, so a service's name, icon,
 * and colour never drift between the two surfaces.
 */

// Suction: nozzle over a seat, loose dust drawn up into the mouth.
const figureVacuum = `
  <g class="svc-fig svc-fig--vac" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <path class="svc-draw svc-draw--d2" d="M18 98V62c0-5 4-9 9-9h1c5 0 9 4 9 9v14h14c5 0 9 4 9 9v13" opacity="0.5" pathLength="1"></path>
    <path class="svc-draw" d="M14 98h92" pathLength="1"></path>
    <g class="svc-vac__nozzle">
      <path d="M70 82 76 66h14l6 16Z"></path>
      <path d="M83 66V54c0-12 6-19 17-22"></path>
    </g>
    <g class="svc-vac__dust" fill="currentColor" stroke="none">
      <circle cx="74" cy="91" r="2.3"></circle>
      <circle cx="84" cy="95" r="1.8"></circle>
      <circle cx="92" cy="90" r="2.6"></circle>
      <circle cx="79" cy="88" r="1.5"></circle>
    </g>
  </g>`;

// Dent pull: body panel whose dent contours settle inward and flatten.
const figureDent = `
  <g class="svc-fig svc-fig--dent" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <rect class="svc-draw" x="12" y="32" width="96" height="62" rx="12" stroke-width="2.4" pathLength="1"></rect>
    <rect x="72" y="57" width="24" height="8" rx="4" stroke-width="2.2" opacity="0.45"></rect>
    <g class="svc-dent__rings" stroke-width="2.2">
      <ellipse cx="46" cy="63" rx="19" ry="13"></ellipse>
      <ellipse cx="46" cy="63" rx="12.5" ry="8.5"></ellipse>
      <ellipse cx="46" cy="63" rx="6" ry="4"></ellipse>
    </g>
    <path class="svc-dent__pull" stroke-width="2.4" d="M46 26V16m-5 5 5-5 5 5"></path>
  </g>`;

// Polish: buffer pad turning under its handle while highlights glint.
const figurePolish = `
  <g class="svc-fig svc-fig--pol" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
    <path class="svc-draw" d="M16 102h88" stroke-width="2.4" pathLength="1"></path>
    <path d="M60 30V14m-11 0h22" stroke-width="2.4"></path>
    <g class="svc-pol__pad" stroke-width="2.4">
      <circle cx="60" cy="58" r="27"></circle>
      <circle cx="60" cy="58" r="13" opacity="0.5"></circle>
      <g stroke-width="2.2" opacity="0.65">
        <path d="M68 44.1 72 37.2"></path>
        <path d="M68 71.9 72 78.8"></path>
        <path d="M44 58H36"></path>
      </g>
      <circle cx="50" cy="40.7" r="2.4" fill="currentColor" stroke="none"></circle>
    </g>
    <g fill="currentColor" stroke="none">
      <path class="svc-pol__glint" d="M98 26 100.2 31.8 106 34 100.2 36.2 98 42 95.8 36.2 90 34 95.8 31.8Z"></path>
      <path class="svc-pol__glint" d="M22 36 23.7 40.3 28 42 23.7 43.7 22 48 20.3 43.7 16 42 20.3 40.3Z"></path>
      <path class="svc-pol__glint" d="M88 83 89.4 86.6 93 88 89.4 89.4 88 93 86.6 89.4 83 88 86.6 86.6Z"></path>
    </g>
  </g>`;

// Ceramic: shell draws itself, an inner coat sets, then a sheen sweeps over.
const figureCeramic = `
  <g class="svc-fig svc-fig--cer" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <defs>
      <clipPath id="svcCeramicShell">
        <path d="M60 12 100 28v28c0 23-17 37-40 46-23-9-40-23-40-46V28L60 12Z"></path>
      </clipPath>
    </defs>
    <g clip-path="url(#svcCeramicShell)">
      <rect class="svc-cer__sheen" x="8" y="-36" width="104" height="24" fill="currentColor" stroke="none" opacity="0.22"></rect>
    </g>
    <path class="svc-draw" d="M60 12 100 28v28c0 23-17 37-40 46-23-9-40-23-40-46V28L60 12Z" stroke="currentColor" stroke-width="2.4" pathLength="1"></path>
    <path class="svc-cer__coat" d="M60 26 88 37v19c0 16-12 26-28 33-16-7-28-17-28-33V37L60 26Z" stroke="currentColor" stroke-width="2" opacity="0.4"></path>
    <path class="svc-cer__bead" d="M60 48c5 6 8 10 8 13.5a8 8 0 0 1-16 0c0-3.5 3-7.5 8-13.5Z" stroke="currentColor" stroke-width="2.2"></path>
  </g>`;

export interface ServiceDef {
  slug: string;
  /** Short name used everywhere: nav, homepage card, H1, title tag. */
  title: string;
  /** One-liner for the homepage scroll showcase card. */
  cardDescription: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** 2-4 short paragraphs of real, specific copy for the dedicated page. */
  paragraphs: string[];
  /**
   * Lowercase substrings matched against a gallery card's `title` to decide
   * whether that before/after pair belongs on this service's page. There is
   * no `service` column on `before_after_cards` (see supabase/migrations) —
   * this is a best-effort match against the free-text title admins already
   * type in, not a guarantee every card is correctly attributed.
   */
  keywords: string[];
  color: string;
  icon: string;
  viewBox: string;
}

export const services: ServiceDef[] = [
  {
    slug: 'avto-vakuum',
    title: 'Avto vakum',
    cardDescription:
      "Salonni to'liq tozalash: gilamlar, o'rindiqlar, bagaj va yetib bo'lmaydigan burchaklar.",
    metaTitle: 'Avto vakum xizmati Qarshi — Avto Vakum',
    metaDescription:
      "Qarshida professional avto vakum xizmati — salon, gilam, o'rindiq va bagajni to'liq tozalaymiz. 24/7 ishlaymiz, hoziroq qo'ng'iroq qiling!",
    h1: 'Avto vakum — Qarshi',
    paragraphs: [
      "Avto vakum — avtomobil salonini to'liq, chuqur tozalash xizmati: gilamlar, o'rindiqlar (mato va charm), panel oralig'i, eshik kissalari, bagaj va qo'l yetmaydigan burchaklar — barchasi kuchli sanoat uskunalari va professional kimyo yordamida tozalanadi.",
      "Ish quruq va nam tozalashni birlashtiradi: avval changyutgich bilan yirik iflos olib tashlanadi, so'ng maxsus kimyoviy vositalar bilan dog'lar va hidlar yo'qotiladi. O'rtacha bitta avtomobilga ~40 daqiqa ketadi — salon holatiga qarab farq qilishi mumkin.",
      "Har kuni foydalanadigan haydovchilardan tortib, uzoq yo'l safaridan qaytganlar yoki avtomobilini sotishdan oldin tartibga keltirmoqchi bo'lganlargacha — hammaga mos. Tozalash tugagach salon yangi mashinadek hidlaydi va ko'rinadi.",
      "Qarshi markazida, svetofor oldidagi chorrahada joylashganmiz va 24 soat, dam olish kunlarisiz ishlaymiz — navbatsiz qabul qilamiz.",
    ],
    keywords: ['vakum', 'vakuum', 'salon'],
    color: 'var(--color-primary)',
    icon: figureVacuum,
    viewBox: '0 0 120 120',
  },
  {
    slug: 'kuzov-kassa-prav',
    title: 'Kuzov kassa prav',
    cardDescription: "Bo'yoqsiz vmyatina to'g'rilash va kuzov geometriyasini tiklash.",
    metaTitle: 'Kuzov kassa prav Qarshi — Avto Vakum',
    metaDescription:
      "Qarshida bo'yoqsiz kuzov kassa prav — vmyatinalarni bo'yoqni buzmasdan to'g'irlaymiz. Tez, sifatli, 24/7 xizmat. Qo'ng'iroq qiling!",
    h1: 'Kuzov kassa prav — Qarshi',
    paragraphs: [
      "Kuzov kassa prav (bo'yoqsiz vmyatina to'g'irlash) — kuzovdagi botiq va urilish izlarini bo'yoqni buzmasdan, orqa tomondan maxsus asboblar bilan asta-sekin tortib yoki bosib tekislash usuli.",
      "Bo'yoq qatlami saqlanib qolgani uchun avtomobilning zavod bo'yog'i buzilmaydi — bu ham tashqi ko'rinishni, ham avtomobil qiymatini saqlab qoladi, va odatiy bo'yash xizmatiga qaraganda ancha tezroq hamda arzonroq.",
      "Do'kon eshigidan kelgan kichik botiqlardan tortib, do'l yoki to'qnashuv natijasidagi kattaroq shikastgacha — ko'pchilik holatlarni tuzatamiz. Kichik ishlar bir necha soatda, murakkabroqlari bir kun ichida tugaydi.",
      "Qarshida 7 yildan ortiq tajribaga ega ustalarimiz bu ishni sinchkovlik bilan bajaradi. Manzilimiz — svetofor oldidagi chorraha, 24/7 ochiqmiz.",
    ],
    keywords: ['kuzov', 'kassa prav', 'rixtovka', "ta'mirlash", 'vmyatina', 'botiq'],
    color: 'var(--color-accent)',
    icon: figureDent,
    viewBox: '0 0 120 120',
  },
  {
    slug: 'palirovka',
    title: 'Palirovka',
    cardDescription: "Tashqi sathni jilolash — mayda chiziqlar va xiralikni yo'qotamiz.",
    metaTitle: 'Palirovka Qarshi — Avto Vakum',
    metaDescription:
      "Qarshida professional palirovka xizmati — mayda chiziqlar va xiralikni yo'qotib, kuzovga asl yaltiroqlikni qaytaramiz. 24/7 ishlaymiz.",
    h1: 'Palirovka — Qarshi',
    paragraphs: [
      "Palirovka — avtomobil kuzovining tashqi sathini bosqichma-bosqich jilolab, mayda chiziqlar (swirl), oksidlanish izlari va xiralikni yo'qotish xizmati. Natijada bo'yoq asl chuqur rangi va yaltiroqligini qaytaradi.",
      'Ish maxsus polirol pastalar va mashinali buferlar bilan bir necha bosqichda olib boriladi — dag\'al abraziv qatlamdan boshlab, nozik yakuniy jilo bilan tugaydi. Har bir panel alohida, diqqat bilan ishlanadi.',
      'Vaqt o\'tishi bilan quyosh, avtomoyka cho\'tkalari va kundalik ishlatish kuzovda mayda chiziqlar qoldiradi — palirovka bu izlarni olib tashlab, mashinani "yangidek" ko\'rinishga qaytaradi. Odatda keramik qoplashdan oldin ham bajariladi.',
      "Ish taxminan 1 kun davom etadi, avtomobil holatiga qarab. Qarshi markazida joylashganmiz, 24/7 qabul qilamiz — qo'ng'iroq qiling va vaqtni birga kelishib olamiz.",
    ],
    keywords: ['palirovka', 'jilo'],
    color: 'var(--color-primary-deep)',
    icon: figurePolish,
    viewBox: '0 0 120 120',
  },
  {
    slug: 'keramika',
    title: 'Keramika',
    cardDescription: 'Keramik qoplama: uzoq muddatli himoya, chuqur yorqinlik va oson yuvish.',
    metaTitle: 'Keramika qoplama Qarshi — Avto Vakum',
    metaDescription:
      "Qarshida keramik qoplash xizmati — bo'yoqqa uzoq muddatli himoya va chuqur yaltiroqlik beramiz. Kir yuvish osonlashadi. 24/7 qabul qilamiz.",
    h1: 'Keramika qoplama — Qarshi',
    paragraphs: [
      "Keramik qoplama — bo'yoq ustiga qo'llaniladigan nano-qatlam bo'lib, kuzovni suv, kir, UV nurlari va kimyoviy ta'sirlardan uzoq muddat himoya qiladi. Qoplama bo'yoqqa mustahkam yopishib, chuqur, oynadek yaltiroqlik beradi.",
      'Qoplangan kuzovga suv tomchilari yopishmay sirg\'alib tushadi — bu avtomobilni yuvishni sezilarli darajada osonlashtiradi va kirning yopishishini kamaytiradi.',
      "Eng yaxshi natija uchun keramika odatda palirovkadan keyin qo'llaniladi — sath avval tekislanadi, so'ng qoplama tekis va bir xilda yotadi. Qoplama oylab, ba'zan yillab davom etadigan himoya beradi.",
      "Qarshida, svetofor oldidagi markazimizda, professional kimyo va uskunalar bilan ishlaymiz. 24/7 ochiqmiz — narx va vaqtni telefon orqali kelishib olamiz.",
    ],
    keywords: ['keramika', 'qoplama'],
    color: 'var(--color-accent-hover)',
    icon: figureCeramic,
    viewBox: '0 0 120 120',
  },
];

export function getService(slug: string): ServiceDef | undefined {
  return services.find((service) => service.slug === slug);
}
