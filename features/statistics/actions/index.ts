'use server';

// import { redis } from '@/lib/redis';
import { kv as redis } from '@vercel/kv';

// import dayjs from 'dayjs';
import {
  REDIS_BLOG_UNIQUE_VISITOR,
  REDIS_PAGE_URL,
  REDIS_PAGE_VIEW,
  REDIS_SNIPPET_UNIQUE_VISITOR, // REDIS_BLOG_UNIQUE_VISITOR,
  // REDIS_PAGE_VIEW,
  // REDIS_PAGE_VIEW_TODAY, // REDIS_SNIPPET_UNIQUE_VISITOR,
  REDIS_UNIQUE_VISITOR, // REDIS_UNIQUE_VISITOR_TODAY,
  REDIS_VISITOR_BROWSER,
  REDIS_VISITOR_DEVICE,
  REDIS_VISITOR_GEO,
  REDIS_VISITOR_OS,
  REDIS_VISITOR_REFERER,
} from '@/constants';
import { prisma } from '@/lib/prisma';

// export const recordPV = async () => {
//   const todayKey = dayjs().format('YYYY-MM-DD');
//   // 当天总浏览量
//   await redis.incr(`${REDIS_PAGE_VIEW_TODAY}:${todayKey}`);
//   // 总浏览量
//   const pv = await redis.get(REDIS_PAGE_VIEW);

//   if (pv) {
//     await redis.incr(REDIS_PAGE_VIEW);
//   } else {
//     await redis.set(REDIS_PAGE_VIEW, 1);
//   }
// };

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

  const url = await redis.hgetall(REDIS_PAGE_URL);
  const referrer = await redis.hgetall(REDIS_VISITOR_REFERER);
  const browser = await redis.hgetall(REDIS_VISITOR_BROWSER);
  const os = await redis.hgetall(REDIS_VISITOR_OS);
  const device = await redis.hgetall(REDIS_VISITOR_DEVICE);
  const city = await redis.hgetall(REDIS_VISITOR_GEO);
  const visitorCount = (await redis.smembers(REDIS_UNIQUE_VISITOR)).length;
  const pageViewCount = await redis.get(REDIS_PAGE_VIEW);

  return {
    blogCount,
    snippetCount,
    tagCount,
    noteCount,
    visitorCount,
    pageViewCount,
    url,
    referrer,
    browser,
    os,
    device,
    city,
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
