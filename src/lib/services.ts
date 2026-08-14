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

/**
 * Structural data only — locale-independent (slug, matching keywords, icon,
 * colour). The copy (title, description, meta tags, paragraphs) lives in
 * `messages/<locale>.json` under `services.items.<slug>`, since it varies per
 * locale. `Services.tsx` and `xizmatlar/[slug]/page.tsx` combine both.
 */

export const services: ServiceDef[] = [
  {
    slug: 'avto-vakuum',
    keywords: ['vakum', 'vakuum', 'salon'],
    color: 'var(--color-primary)',
    icon: figureVacuum,
    viewBox: '0 0 120 120',
  },
  {
    slug: 'kuzov-kassa-prav',
    keywords: ['kuzov', 'kassa prav', 'rixtovka', "ta'mirlash", 'vmyatina', 'botiq'],
    color: 'var(--color-accent)',
    icon: figureDent,
    viewBox: '0 0 120 120',
  },
  {
    slug: 'palirovka',
    keywords: ['palirovka', 'jilo'],
    color: 'var(--color-primary-deep)',
    icon: figurePolish,
    viewBox: '0 0 120 120',
  },
  {
    slug: 'keramika',
    keywords: ['keramika', 'qoplama'],
    color: 'var(--color-accent-hover)',
    icon: figureCeramic,
    viewBox: '0 0 120 120',
  },
];

export function getService(slug: string): ServiceDef | undefined {
  return services.find((service) => service.slug === slug);
}
