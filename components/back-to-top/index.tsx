'use client';

import React from 'react';

import { useMemoizedFn, useScroll } from 'ahooks';

// import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { IconBackToTop } from '../icons';

type BackToTopProps = {
  scrollRef?: React.MutableRefObject<HTMLDivElement | null>;
};

export const BackToTop = ({ scrollRef }: BackToTopProps) => {
  // 特别注意：useScroll 用的是 document 而不是 document.documentElement
  // useScroll 如果设置的是 document.documentElement，scroll.top 一直为 0
  const scroll = useScroll(() => scrollRef?.current ?? document);

  const handleClick = useMemoizedFn(() => {
    if (scrollRef?.current) {
      scrollRef?.current.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 这里回到顶部使用 document.documentElement，因为 document 上没有 scrollTo 这个方法
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  });

  return (
    <button
      className={cn('fixed bottom-8 right-8 max-lg:hidden', {
        hidden: (scroll?.top ?? 0) < 100,
      })}
      // size={'icon'}
      onClick={handleClick}
    >
      {/* <IconSolarAltArrowUpLinear className="text-2xl" /> */}
      <IconBackToTop className="text-2xl custom-svg" />
    </button>
  );
};
