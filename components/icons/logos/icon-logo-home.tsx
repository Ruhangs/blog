'use client';

import React from 'react';

import { useTheme } from 'next-themes';

import { WEBSITE } from '@/constants';
import { cn } from '@/lib/utils';

export const IconLogoHome = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLImageElement>) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 避免水合作用不匹配，若要解决此问题，请确保仅在客户端上装载页面时呈现使用当前主题的 UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  let icon = '';

  if (!mounted) {
    return '';
  } else {
    if (resolvedTheme === 'light') {
      icon = 'light';
    } else if (resolvedTheme === 'dark') {
      icon = 'dark';
    }
  }

  return (
    <img
      {...props}
      src={icon === 'dark' ? '/images/home-light.svg' : '/images/home-dark.svg'}
      className={cn('h-8', className)}
      alt={WEBSITE}
    />
  );
};
