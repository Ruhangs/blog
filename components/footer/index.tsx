'use client';

// import Image from 'next/image';
import { useState } from 'react';

import { usePathname } from 'next/navigation';

import { useAsyncEffect } from 'ahooks';

import { navItems } from '@/components/navbar/config';
import { NextLink } from '@/components/next-link';

import {
  BEI_AN_LINK,
  BEI_AN_NUMBER,
  GONG_AN_LINK,
  GONG_AN_NUMBER,
  NICKNAME,
  PATHS,
  PATHS_MAP,
} from '@/constants';
import { getPV, getUV } from '@/features/statistics';
import { cn } from '@/lib/utils';
import { formatNum, sleep } from '@/utils';

import { IconOverview } from '../icons';
import { buttonVariants } from '../ui/button';

export const Footer = () => {
  const pathname = usePathname();
  const [info, setInfo] = useState({ onlinePerson: 0, pv: 0, uv: 0 });
  useAsyncEffect(async () => {
    // TODO 记录
    await sleep(1 * 1000);
    const res = await fetch(process.env.NEXT_PUBLIC_URL + '/api/active', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const info = (await res.json()) as { active: number };
      const onlinePerson = info.active;
      const pv = (await getPV()) as number;
      const uv = await getUV();
      setInfo({ onlinePerson, pv, uv });
    }
  }, [pathname]);

  return (
    <footer className="w-full flex flex-col pt-8 pb-4 max-w-screen-xl mx-auto text-muted-foreground">
      <ul className="max-md:w-3/4 mx-auto flex flex-wrap space-x-2 items-center justify-center">
        {navItems.map((el, idx) => (
          <li className="max-md:h-5" key={el.link}>
            {Boolean(idx) && <span className="mr-2">·</span>}
            <NextLink aria-label={el.label} href={el.link} className="px-0">
              {el.label}
            </NextLink>
          </li>
        ))}
        <li className="max-md:h-5">
          <span className="mr-2">·</span>
          <NextLink
            aria-label={PATHS_MAP[PATHS.SITEMAP]}
            href={PATHS.SITEMAP}
            className="px-0 "
          >
            {PATHS_MAP[PATHS.SITEMAP]}
          </NextLink>
        </li>
        <li className="max-md:h-5">
          <span className="max-sm:hidden mr-2">·</span>
          <span
            className={cn(
              buttonVariants({ variant: 'link' }),
              '!no-underline px-0 text-muted-foreground',
            )}
          >
            PV({formatNum(info.pv)})
          </span>
        </li>
        <li className="max-md:h-5">
          <span className="mr-2">·</span>
          <span
            className={cn(
              buttonVariants({ variant: 'link' }),
              '!no-underline px-0 text-muted-foreground',
            )}
          >
            UV({formatNum(info.uv)})
          </span>
        </li>
        <li className="max-md:h-5">
          <span
            className={cn(
              buttonVariants({ variant: 'link' }),
              '!no-underline px-0 text-muted-foreground',
            )}
          >
            <IconOverview />
            当前{info.onlinePerson}人正在浏览
          </span>
        </li>
      </ul>
      <div className="max-md:mt-3 w-full text-sm flex  md:flex-row items-center justify-center space-y-0 md:space-y-0 space-x-1 md:space-x-2 ">
        <span>Copyringht &copy; {new Date().getFullYear()}</span>
        <span className="inline-block">{NICKNAME}</span>
        <span className="hidden md:inline-block">·</span>
        <NextLink
          target="_blank"
          aria-label={BEI_AN_NUMBER}
          href={BEI_AN_LINK}
          className="px-0 py-0 h-5 md:h-10 font-normal md:font-medium"
        >
          {BEI_AN_NUMBER}
        </NextLink>
        {/* <span className="hidden md:inline-block">·</span> */}
        <NextLink
          target="_blank"
          aria-label={GONG_AN_NUMBER}
          href={GONG_AN_LINK}
          className="px-0 py-0 h-5 md:h-10 font-normal md:font-medium"
        >
          {/* 公安备案图标 */}
          {/* <Image
            width={18}
            height={18}
            src="/images/gongan.png"
            alt={GONG_AN_NUMBER}
            className="mr-1 -translate-y-[1px]"
          /> */}
          <span>{GONG_AN_NUMBER}</span>
        </NextLink>
      </div>
    </footer>
  );
};
