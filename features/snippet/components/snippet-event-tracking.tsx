'use client';

import { useAsyncEffect } from 'ahooks';

import { sleep } from '@/utils';

export const SnippetEventTracking = ({ snippetID }: { snippetID: string }) => {
  useAsyncEffect(async () => {
    await sleep(3 * 1000);
    await fetch('/api/stat', {
      method: 'UPDATE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type: 'project', id: snippetID }),
    });
  }, [snippetID]);

  return null;
};
