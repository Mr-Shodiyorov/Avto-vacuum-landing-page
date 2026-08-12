export const site = {
  name: 'Avto Vakum',
  nameFull: 'Avto Vakum Servis',
  city: 'Toshkent',
  description:
    "Avto vakuum, kuzov kassa prav, palirovka va keramika. Toshkent markazida, kechayu kunduz. Navbatsiz qabul qilamiz — qo'ng'iroq qiling va keling.",
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
  address: "Toshkent sh., [ko'cha nomi], [uy raqami]",
  hours: "Har kuni, 24 soat — dam olish kunlarisiz",
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
] as const;
