import Script from 'next/script';

import { TRCKING_PATH, UMAMI_WEBSIT_ID } from '@/config';

import ParticlesBackground from '@/components/ParticlesBackground';
import { BackToTop } from '@/components/back-to-top';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Navbar />
      <ParticlesBackground />
      <Script
        defer
        src={TRCKING_PATH}
        data-website-id={UMAMI_WEBSIT_ID}
      ></Script>
      <main className="min-h-[calc(100vh-190px)]">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
