import { BackToTop } from '@/components/back-to-top';
import { Fingerprint } from '@/components/fingerprint';
import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-190px)]">{children}</main>
      <Footer />
      {/* 收集访客信息 */}
      <Fingerprint />
      <BackToTop />
    </>
  );
}
