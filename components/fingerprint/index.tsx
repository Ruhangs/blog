'use client';

import { usePathname } from 'next/navigation';

import { useAsyncEffect } from 'ahooks';

import { sleep } from '@/utils';

export const Fingerprint = () => {
  const pathname = usePathname();
  useAsyncEffect(async () => {
    await fetch('/api/active', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await sleep(3 * 1000);
    await fetch('/api/stat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page: pathname }),
    });
  }, [pathname]);

  return null;
};
