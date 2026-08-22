import { getTranslations, setRequestLocale } from 'next-intl/server';

import ustaPhoto from '@/assets/avto-vakum-usta-qarshi.webp';
import BeforeAfter from '@/components/BeforeAfter';
import Contact from '@/components/Contact';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import { master, site } from '@/lib/site';

/**
 * Prerendered at build time and refreshed at most hourly (ISR). Admin edits do
 * not wait for that hour: every mutation in `src/app/admin/actions.ts` calls
 * `revalidatePath('/')`, which replaces this page's cached HTML immediately.
 */
export const revalidate = 3600;

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;
  // Re-asserted here (root layout already calls this) — next-intl needs it in
  // every page segment that reads translations for the route to stay static.
  setRequestLocale(locale);

  const t = await getTranslations('hero');

  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <BeforeAfter />
        <Services />
        <WhyUs />
        <Faq />
        <Contact />
      </main>
      <Footer />

      {/* The gallery photos get their own `ImageObject` entries inside
          `<BeforeAfter>` — this is the one real photo on the page they don't
          cover. Static import, so `.src` is already an immutable, same-origin,
          content-hashed path (no Supabase `X-Robots-Tag` problem to work around
          here — see `canonicalImageUrl` in `src/lib/cards.ts`). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ImageObject',
            contentUrl: `${site.url}${ustaPhoto.src}`,
            url: `${site.url}${ustaPhoto.src}`,
            caption: t('portraitAlt', { masterTitle: master.title }),
            description: t('portraitAlt', { masterTitle: master.title }),
            representativeOfPage: true,
          }),
        }}
      />
    </>
  );
}
