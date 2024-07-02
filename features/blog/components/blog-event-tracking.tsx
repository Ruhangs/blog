'use client';

import { useAsyncEffect } from 'ahooks';

import { sleep } from '@/utils';

export const BlogEventTracking = ({ blogID }: { blogID: string }) => {
  useAsyncEffect(async () => {
    await sleep(3 * 1000);
    await fetch('/api/stat', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'blog', id: blogID }),
    });
  }, [blogID]);

  return null;
};
