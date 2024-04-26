import Script from 'next/script';

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
        src="http://124.222.214.229:8000/script.js"
        data-website-id="fd604f32-e803-44a0-b8fc-c52c947b781f"
      ></Script>
      <main className="min-h-[calc(100vh-190px)]">{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
