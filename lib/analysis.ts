import { getClient } from '@umami/api-client';

import { UMAMI_WEBSIT_ID } from '@/config';

export const client = getClient();

const nowTime = new Date().getTime();

interface MetricUrlType {
  x: string;
  y: number;
}

// 获取创建时间
export async function getInitTime() {
  const { ok, data } = await client.getWebsite(UMAMI_WEBSIT_ID!);
  if (ok) {
    return data?.createdAt;
  }
}

export const getWebsiteAllInfo = async () => {
  const createdAt = await getInitTime();
  const { ok, data } = await client.getWebsiteStats(UMAMI_WEBSIT_ID!, {
    startAt: createdAt ? new Date(createdAt).getTime() : 0,
    endAt: nowTime,
  });
  if (ok) {
    return data;
  }
};

export const getInfo = async (type: string) => {
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
};

export const getSimpleVisitorCount = async (url: string): Promise<number> => {
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
};

export const getOnlinePerson = async () => {
  const { ok, data } = await client.getWebsiteActive(UMAMI_WEBSIT_ID!);
  if (ok) {
    return data?.x;
  }
};
