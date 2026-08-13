import BeforeAfter from '@/components/BeforeAfter';
import Contact from '@/components/Contact';
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

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <BeforeAfter />
        <Services />
        <WhyUs />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
