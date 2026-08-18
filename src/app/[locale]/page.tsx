import { setRequestLocale } from 'next-intl/server';

import BeforeAfter from '@/components/BeforeAfter';
import Contact from '@/components/Contact';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';

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
    </>
  );
}
