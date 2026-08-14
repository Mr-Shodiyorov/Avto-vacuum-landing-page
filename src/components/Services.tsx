import ScrollRevealContentA, { ItemContent } from './ui/scroll-reveal-content-a';
import './services.css';

/* The showcase figures below are raw inner-SVG markup drawn in a shared
   120x120 box with a shared stroke weight, so all four read as one family.
   Motion lives entirely in services.css, keyed off the `data-active` panel
   attribute so each figure animates as it crossfades in. */

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

const services: ItemContent[] = [
  {
    title: 'Avto vakuum',
    description:
      "Salonni to'liq tozalash: gilamlar, o'rindiqlar, bagaj va yetib bo'lmaydigan burchaklar.",
    color: 'var(--color-primary)',
    viewBox: '0 0 120 120',
    icon: figureVacuum,
  },
  {
    title: 'Kuzov kassa prav',
    description: "Bo'yoqsiz vmyatina to'g'rilash va kuzov geometriyasini tiklash.",
    color: 'var(--color-accent)',
    viewBox: '0 0 120 120',
    icon: figureDent,
  },
  {
    title: 'Palirovka',
    description: "Tashqi sathni jilolash — mayda chiziqlar va xiralikni yo'qotamiz.",
    color: 'var(--color-primary-deep)',
    viewBox: '0 0 120 120',
    icon: figurePolish,
  },
  {
    title: 'Keramika',
    description: 'Keramik qoplama: uzoq muddatli himoya, chuqur yorqinlik va oson yuvish.',
    color: 'var(--color-accent-hover)',
    viewBox: '0 0 120 120',
    icon: figureCeramic,
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
