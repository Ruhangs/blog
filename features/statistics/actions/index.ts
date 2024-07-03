'use server';

// import dayjs from 'dayjs';
import {
  REDIS_BLOG_UNIQUE_VISITOR,
  REDIS_PAGE_VIEW,
  REDIS_SNIPPET_UNIQUE_VISITOR,
  REDIS_UNIQUE_VISITOR,
} from '@/constants';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

interface InfoType {
  visitorCount: number;
  pageViewCount: number;
  url: Record<string, unknown>;
  referrer: Record<string, unknown>;
  browser: Record<string, unknown>;
  os: Record<string, unknown>;
  device: Record<string, unknown>;
  city: Record<string, unknown>;
}

interface DataType {
  info: InfoType;
}

//  const todayKey = dayjs().format('YYYY-MM-DD');

async function getData() {
  const res = await fetch(process.env.URL + '/api/stat', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 600 },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

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

  const data = (await getData()) as DataType;

  const message: InfoType = data.info;

  return {
    blogCount,
    snippetCount,
    tagCount,
    noteCount,
    visitorCount: message.visitorCount,
    pageViewCount: message.pageViewCount,
    url: message.url,
    referrer: message.referrer,
    browser: message.browser,
    os: message.os,
    device: message.device,
    city: message.city,
  };
};

export const getPV = async () => {
  const pageViewCount = await redis.get(REDIS_PAGE_VIEW);
  return pageViewCount;
};

export const getUV = async () => {
  const visitorCount = (await redis.smembers(REDIS_UNIQUE_VISITOR)).length;
  return visitorCount;
};

export const batchGetBlogUV = async (blogIDs?: string[]) => {
  if (!blogIDs?.length) {
    return;
  }

  const m = new Map<string, number>();

  const uvs = await Promise.all(
    blogIDs.map((el) => redis.scard(`${REDIS_BLOG_UNIQUE_VISITOR}:${el}`)),
  );
  let idx = 0;
  for (const uv of uvs) {
    m.set(blogIDs[idx]!, uv);
    idx++;
  }

  return m;
};

export const getBlogUV = async (blogID?: string) => {
  if (!blogID) {
    return;
  }
  const uv = await redis.scard(`${REDIS_BLOG_UNIQUE_VISITOR}:${blogID}`);
  return uv;
};

export const batchGetSnippetUV = async (snippetIDs?: string[]) => {
  if (!snippetIDs?.length) {
    return;
  }

  const m = new Map<string, number>();

  const uvs = await Promise.all(
    snippetIDs.map((el) =>
      redis.scard(`${REDIS_SNIPPET_UNIQUE_VISITOR}:${el}`),
    ),
  );
  let idx = 0;
  for (const uv of uvs) {
    m.set(snippetIDs[idx]!, uv);
    idx++;
  }

  return m;
};
export const getSnippetUV = async (snippetID?: string) => {
  if (!snippetID) {
    return;
  }
  const uv = await redis.scard(`${REDIS_SNIPPET_UNIQUE_VISITOR}:${snippetID}`);
  return uv;
};
