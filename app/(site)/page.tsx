// import { IntroScrollMouse } from '@/components/intro-scroll-mouse';
import Image from 'next/image';

import { HeroSection } from '@/features/home';

export const revalidate = 60;

export default function Page() {
  return (
    <div className="h-[calc(100vh-64px)] grid place-content-center relative">
      <div className="md:flex justify-between md:max-w-screen-lg xl:max-w-screen-xl">
        <HeroSection />
        <div className="max-xl:hidden w-[250px] h-full ml-24 flex justify-center items-center">
          <Image
            className="right rounded-full animate-fade-left animate-ease-in-out"
            alt="头像"
            src={'/images/avatar.jpg'}
            width={250}
            height={250}
          />
        </div>
      </div>
      {/* <div className="grid place-content-center absolute bottom-8 md:bottom-12 inset-x-0">
        <IntroScrollMouse />
      </div> */}
    </div>
  );
}
