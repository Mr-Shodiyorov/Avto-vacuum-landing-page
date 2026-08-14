import ScrollRevealContentA, { ItemContent } from './ui/scroll-reveal-content-a';
import { services } from '@/lib/services';
import './services.css';

const items: ItemContent[] = services.map((service) => ({
  title: service.title,
  description: service.cardDescription,
  color: service.color,
  viewBox: service.viewBox,
  icon: service.icon,
  href: `/xizmatlar/${service.slug}/`,
}));

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

      <ScrollRevealContentA items={items} />
    </section>
  );
}
