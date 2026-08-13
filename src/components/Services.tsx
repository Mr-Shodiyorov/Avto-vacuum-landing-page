import ScrollRevealContentA, { ItemContent } from './ui/scroll-reveal-content-a';
import './services.css';

const services: ItemContent[] = [
  {
    title: 'Avto vakuum',
    description:
      "Salonni to'liq tozalash: gilamlar, o'rindiqlar, bagaj va yetib bo'lmaydigan burchaklar.",
    color: 'var(--color-primary)',
    icon: '<rect x="3" y="12" width="14" height="11" rx="3" fill="currentColor"></rect><circle cx="19" cy="7" r="4" stroke="currentColor" stroke-width="2"></circle><path d="M10 12V9h5" stroke="currentColor" stroke-width="2"></path>',
  },
  {
    title: 'Kuzov kassa prav',
    description: "Bo'yoqsiz vmyatina to'g'rilash va kuzov geometriyasini tiklash.",
    color: 'var(--color-accent)',
    icon: '<rect x="3" y="8" width="20" height="10" rx="3" stroke="currentColor" stroke-width="2"></rect><circle cx="13" cy="13" r="3" fill="currentColor"></circle>',
  },
  {
    title: 'Palirovka',
    description: "Tashqi sathni jilolash — mayda chiziqlar va xiralikni yo'qotamiz.",
    color: 'var(--color-primary-deep)',
    icon: '<circle cx="11" cy="14" r="7" stroke="currentColor" stroke-width="2"></circle><path d="M19 3.5l1.4 3.1L23.5 8l-3.1 1.4L19 12.5l-1.4-3.1L14.5 8l3.1-1.4L19 3.5Z" fill="currentColor"></path>',
  },
  {
    title: 'Keramika',
    description: 'Keramik qoplama: uzoq muddatli himoya, chuqur yorqinlik va oson yuvish.',
    color: 'var(--color-accent-hover)',
    icon: '<path d="M13 2.5 22 6v7c0 5-4 8.6-9 10.5C8 21.6 4 18 4 13V6l9-3.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path><circle cx="13" cy="12" r="3" fill="currentColor"></circle>',
  },
];

export default function Services() {
  return (
    <section className="services" id="xizmatlar">
      <div className="container">
        <div className="services__head" data-reveal>
          <div className="services__heading-group">
            <span className="eyebrow">XIZMATLAR</span>
            <h2 className="section-heading">To&apos;rtta asosiy xizmat</h2>
          </div>
          <p className="services__note">
            Narxni telefon orqali aniqlashtiramiz — avtomobil rusumi va holatiga qarab.
          </p>
        </div>
      </div>

      <ScrollRevealContentA items={services} />
    </section>
  );
}
