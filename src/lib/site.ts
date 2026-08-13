export const site = {
  name: 'Avto Vakum',
  nameFull: 'Avto Vakum Servis',
  city: 'Qarshi',
  description:
    "Avto vakuum, kuzov kassa prav, palirovka va keramika. Qarshi markazida, kechayu kunduz. Navbatsiz qabul qilamiz — qo'ng'iroq qiling va keling.",
  url: 'https://avtovakum.uz',
  phones: [
    { display: '+998 (94) 952-07-07', href: 'tel:+998949520707' },
    { display: '+998 (90) 615-67-76', href: 'tel:+998906156776' },
  ],
  instagram: {
    handle: '@avto_vakum_senter',
    url: 'https://instagram.com/avto_vakum_senter',
  },
  telegram: {
    handle: '@avto_vakum_senter',
    url: 'https://t.me/avto_vakum_senter',
  },
  address: "Qarshi sh., Obodonlashtirish ro'parasi, svetofor oldidagi chorraha",
  hours: "Har kuni, 24 soat — dam olish kunlarisiz",
} as const;

/**
 * Physical location of the service.
 *
 * `lat`/`lng` are the source of truth — every map link below is built from
 * them, so the pin can never drift away from the address shown on the page.
 * Note Yandex takes its coordinates as lng,lat, the reverse of Google.
 */
const lat = 38.814076;
const lng = 65.799051;

export const location = {
  lat,
  lng,
  /** Full directions, as given by the owner. */
  directions:
    "Qarshi shahar, Shahar obodonlashtirish ro'parasida, svetofor oldidagi chorrahada joylashgan.",
  maps: {
    google: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    yandex: `https://yandex.uz/maps/?pt=${lng},${lat}&z=17&l=map`,
    /** Rendered as a plain image-like embed; no API key required. */
    embed: `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`,
  },
} as const;

// TODO: replace with the real craftsman's name once provided.
export const master = {
  title: 'Bosh usta',
  experienceYears: 7,
  experienceLabel: '7 yillik tajriba',
  bio: "Professional kimyo va uskunalar bilan ishlaydigan bosh usta — har bir avtomobilga alohida yondashadi.",
} as const;

export const navLinks = [
  { label: 'Ishlarimiz', href: '#ishlarimiz' },
  { label: 'Xizmatlar', href: '#xizmatlar' },
  { label: 'Nega biz', href: '#nega-biz' },
  { label: 'Aloqa', href: '#aloqa' },
  { label: 'Manzil', href: '#manzil' },
] as const;
