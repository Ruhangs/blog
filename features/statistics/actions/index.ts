import { cache } from 'react';

import { UMAMI_WEBSIT_ID } from '@/config';

import { client } from '@/lib/analysis';
import { prisma } from '@/lib/prisma';

// 获取网站博客等数量
export const getStatistics = async () => {
  const blogCount = await prisma.blog.count({
    where: { published: true },
  });
  const tagCount = await prisma.tag.count();

  const snippetCount = await prisma.snippet.count({
    where: { published: true },
  });

  const noteCount = await prisma.note.count({
    where: { published: true },
  });

  return { blogCount, snippetCount, tagCount, noteCount };
};

const nowTime = new Date().getTime();

interface MetricUrlType {
  x: string;
  y: number;
}

// 获取创建时间
export const getInitTime = cache(async () => {
  const { ok, data } = await client.getWebsite(UMAMI_WEBSIT_ID!);
  if (ok) {
    return data?.createdAt;
  }
});

export const getWebsiteAllInfo = cache(async () => {
  const createdAt = await getInitTime();
  const { ok, data } = await client.getWebsiteStats(UMAMI_WEBSIT_ID!, {
    startAt: createdAt ? new Date(createdAt).getTime() : 0,
    endAt: nowTime,
  });
  if (ok) {
    return data;
  }
});

export const getInfo = cache(async (type: string) => {
  const createdAt = await getInitTime();

  const uvMap: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { ok, data, status } = await client.getWebsiteMetrics(
    UMAMI_WEBSIT_ID!,
    {
      startAt: createdAt ? new Date(createdAt).getTime() : 0,
      endAt: nowTime,
      type: type,
    },
  );
  if (ok) {
    if (status === 200) {
      const arr = data as unknown as MetricUrlType[];
      for (const element of arr) {
        if (!element.x.match('#heading')) {
          const { ok, data, status } = await client.getWebsiteStats(
            UMAMI_WEBSIT_ID!,
            {
              startAt: createdAt ? new Date(createdAt).getTime() : 0,
              endAt: nowTime,
              url: element.x,
            },
          );
          if (ok) {
            if (status === 200) {
              uvMap[element.x] = data?.visitors.value
                ? data?.visitors.value
                : 0;
            }
          }
        }
      }
    }
  }
  return uvMap;
});

export const getInfoOfTypeApi = cache(async (type: string) => {
  const createdAt = await getInitTime();
  const res = [];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { ok, data, status } = await client.getWebsiteMetrics(
    UMAMI_WEBSIT_ID!,
    {
      startAt: createdAt ? new Date(createdAt).getTime() : 0,
      endAt: nowTime,
      type: type,
    },
  );
  if (ok) {
    if (status === 200) {
      const arr = data as unknown as MetricUrlType[];
      if (type === 'url') {
        for (const element of arr) {
          if (!element.x.match('#heading')) {
            res.push(element);
          }
        }
      } else {
        return data as unknown as MetricUrlType[];
      }
    }
  }
  return res;
});

export const getSimpleVisitorCount = cache(
  async (url: string): Promise<number> => {
    const createdAt = await getInitTime();

    const { ok, data } = await client.getWebsiteStats(UMAMI_WEBSIT_ID!, {
      startAt: createdAt ? new Date(createdAt).getTime() : 0,
      endAt: new Date().getTime(),
      url: url,
    });
    if (ok) {
      return data?.visitors.value ? data?.visitors.value : 0;
    }
    return 0;
  },
);

export const getOnlinePerson = cache(async () => {
  const { ok, data } = await client.getWebsiteActive(UMAMI_WEBSIT_ID!);
  if (ok) {
    return data?.x;
  }
});

export const getAnalysis = cache(async () => {
  const info = await getWebsiteAllInfo();
  return info;
});

export const getInfoOfType = cache(async () => {
  const url = await getInfoOfTypeApi('url');
  const referrer = await getInfoOfTypeApi('referrer');
  const browser = await getInfoOfTypeApi('browser');
  const os = await getInfoOfTypeApi('os');
  const device = await getInfoOfTypeApi('device');
  const city = await getInfoOfTypeApi('city');

  return { url, referrer, browser, os, device, city };
});
