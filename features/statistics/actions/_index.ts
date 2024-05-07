'use server';

import { UMAMI_API_CLIENT_ENDPOINT, UMAMI_WEBSIT_ID } from '@/config';

import { prisma } from '@/lib/prisma';

const nowTime = new Date().getTime();

interface MetricType {
  x: string;
  y: number;
}

interface authType {
  token: string;
  user: userType;
}

interface userType {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  isAdmin: boolean;
}

interface valueType {
  value: number;
  change: number;
}

interface infoType {
  pageviews: valueType;
  visitors: valueType;
  visits: valueType;
  bounces: valueType;
  totaltime: valueType;
}

const getAuth = async () => {
  const res = await fetch(`${UMAMI_API_CLIENT_ENDPOINT}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
      password: '19981207rhs',
    }),
  });
  const data = (await res.json()) as authType;
  return data.token;
};

// 获取创建时间
export async function getInitTime() {
  const token = await getAuth();
  const res = await fetch(
    `${UMAMI_API_CLIENT_ENDPOINT}/websites/${UMAMI_WEBSIT_ID}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (res.status === 200) {
    const data = (await res.json()) as { createdAt: string };
    return data.createdAt;
  }
}

// 获取在线人数
export const getOnlinePerson = async () => {
  const token = await getAuth();
  const res = await fetch(
    `${UMAMI_API_CLIENT_ENDPOINT}/websites/${UMAMI_WEBSIT_ID}/active`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (res.status === 200) {
    const data = (await res.json()) as { x: number };
    return data.x;
  }
  return 0;
};

// 获取网站所有信息
export const getWebsiteAllInfo = async () => {
  const token = await getAuth();
  const res = await fetch(
    `${UMAMI_API_CLIENT_ENDPOINT}/websites/${UMAMI_WEBSIT_ID}/stats?startAt=${0}&endAt=${nowTime}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (res.status === 200) {
    const data = (await res.json()) as infoType;
    return data;
  }
  return null;
};

export const getInfoByUrl = async () => {
  const uvMap: Record<string, number> = {};
  const token = await getAuth();
  const res = await fetch(
    `${UMAMI_API_CLIENT_ENDPOINT}/websites/${UMAMI_WEBSIT_ID}/metrics?startAt=${0}&endAt=${nowTime}&type=url`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    },
  );
  if (res.status === 200) {
    const arr = (await res.json()) as MetricType[];
    for (const element of arr) {
      if (!element.x.match('#heading')) {
        const res = await fetch(
          `${UMAMI_API_CLIENT_ENDPOINT}/websites/${UMAMI_WEBSIT_ID}/stats?startAt=${0}&endAt=${nowTime}&url=${element.x}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.status === 200) {
          const data = (await res.json()) as infoType;
          uvMap[element.x] = data?.visitors.value ? data?.visitors.value : 0;
        }
      }
    }
  }
  return uvMap;
};

export const getInfoOfTypeApi = async (type: string) => {
  const ans = [];
  const token = await getAuth();
  const res = await fetch(
    `${UMAMI_API_CLIENT_ENDPOINT}/websites/${UMAMI_WEBSIT_ID}/metrics?startAt=${0}&endAt=${nowTime}&type=${type}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (res.status === 200) {
    const arr = (await res.json()) as MetricType[];
    if (type === 'url') {
      for (const element of arr) {
        if (!element.x.match('#heading')) {
          ans.push(element);
        }
      }
    } else {
      return arr;
    }
  }
  return ans;
};

export const getSimpleVisitorCount = async (url: string): Promise<number> => {
  const token = await getAuth();
  const res = await fetch(
    `${UMAMI_API_CLIENT_ENDPOINT}/websites/${UMAMI_WEBSIT_ID}/stats?startAt=${0}&endAt=${nowTime}&url=${url}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    },
  );
  if (res.status === 200) {
    const data = (await res.json()) as infoType;
    return data.visitors.value ?? 0;
  }
  return 0;
};

export const getAnalysis = async () => {
  const info = await getWebsiteAllInfo();
  return info;
};

export const getInfoOfType = async () => {
  const url = await getInfoOfTypeApi('url');
  const referrer = await getInfoOfTypeApi('referrer');
  const browser = await getInfoOfTypeApi('browser');
  const os = await getInfoOfTypeApi('os');
  const device = await getInfoOfTypeApi('device');
  const city = await getInfoOfTypeApi('city');

  return { url, referrer, browser, os, device, city };
};

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
