import { cache } from 'react';

import { UMAMI_WEBSIT_ID } from '@/config';

import { client } from '@/lib/analysis';
import { prisma } from '@/lib/prisma';

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
  const { ok, data, status } = await client.getWebsiteStats(UMAMI_WEBSIT_ID!, {
    startAt: createdAt ? new Date(createdAt).getTime() : 0,
    endAt: nowTime,
  });
  if (ok) {
    if (status === 200) {
      return {
        pageviews: data?.pageviews.value ?? 0,
        visitors: data?.visitors.value ?? 0,
        bounces: data?.bounces.value ?? 0,
        totaltime: data?.totaltime.value ?? 0,
      };
    }
  }
  return {
    pageviews: 0,
    visitors: 0,
    bounces: 0,
    totaltime: 0,
  };
});

export const getPV = cache(async () => {
  const createdAt = await getInitTime();
  const { ok, data, status } = await client.getWebsiteStats(UMAMI_WEBSIT_ID!, {
    startAt: createdAt ? new Date(createdAt).getTime() : 0,
    endAt: nowTime,
  });
  if (ok) {
    if (status === 200) {
      return data?.pageviews.value ?? 0;
    }
  }
  return 0;
});

export const getUV = cache(async () => {
  const createdAt = await getInitTime();
  const { ok, data, status } = await client.getWebsiteStats(UMAMI_WEBSIT_ID!, {
    startAt: createdAt ? new Date(createdAt).getTime() : 0,
    endAt: nowTime,
  });
  if (ok) {
    if (status === 200) {
      return data?.visitors.value ?? 0;
    }
  }
  return 0;
});

export const getInfoOfTypeApi = cache(async (type: string) => {
  const createdAt = await getInitTime();
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
      console.log(data);
      return data as unknown as MetricUrlType[];
    }
  }
  return [];
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

  const url = await getInfoOfTypeApi('url');
  const referrer = await getInfoOfTypeApi('referrer');
  const browser = await getInfoOfTypeApi('browser');
  const os = await getInfoOfTypeApi('os');
  const device = await getInfoOfTypeApi('device');
  const city = await getInfoOfTypeApi('city');

  const info = await getWebsiteAllInfo();

  return {
    blogCount,
    snippetCount,
    tagCount,
    noteCount,
    info,
    url,
    referrer,
    browser,
    os,
    device,
    city,
  };
};
