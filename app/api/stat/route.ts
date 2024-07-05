// app/api/stats/route.js
import { type NextRequest, NextResponse, userAgent } from 'next/server';

import dayjs from 'dayjs';
import IPinfoWrapper, { type IPinfo } from 'node-ipinfo';

import { GEO_TOKEN } from '@/config';

import {
  REDIS_BLOG_UNIQUE_VISITOR,
  REDIS_PAGE_URL,
  REDIS_PAGE_VIEW,
  REDIS_PAGE_VIEW_TODAY,
  REDIS_SNIPPET_UNIQUE_VISITOR,
  REDIS_UNIQUE_VISITOR,
  REDIS_UNIQUE_VISITOR_TODAY,
  REDIS_VISITOR_BROWSER,
  REDIS_VISITOR_DEVICE,
  REDIS_VISITOR_GEO,
  REDIS_VISITOR_OS,
  REDIS_VISITOR_REFERER,
} from '@/constants';
import { redis } from '@/lib/redis';
import { getDevice } from '@/utils';

const ipinfoWrapper = new IPinfoWrapper(GEO_TOKEN!);

type bodyType = {
  page: string;
};

// 今日日期用于统计今天的访问量
const todayKey = dayjs().format('YYYY-MM-DD');

export async function POST(request: NextRequest) {
  const { headers } = request;
  const xForwardedFor = headers.get('x-forwarded-for');
  let ip = '未知';
  if (typeof xForwardedFor === 'string') {
    ip = xForwardedFor.split(',')[0]?.trim() ?? '未知';
  }
  const geo: IPinfo = await ipinfoWrapper.lookupIp(ip);
  const { page } = (await request.json()) as bodyType;
  // 当天总浏览量
  await redis.incr(`${REDIS_PAGE_VIEW_TODAY}:${todayKey}`);
  // 总浏览量
  const pv = await redis.get(REDIS_PAGE_VIEW);

  if (pv) {
    await redis.incr(REDIS_PAGE_VIEW);
  } else {
    await redis.set(REDIS_PAGE_VIEW, 1);
  }

  const visitors = await redis.smembers(REDIS_UNIQUE_VISITOR);
  if (!visitors.includes(ip + '-' + todayKey)) {
    // 获取位置
    if (geo) {
      const { city, country, region, bogon } = geo;
      const str = bogon ? '未知' : `${country}-${region}-${city}`;
      const num = await redis.hget(REDIS_VISITOR_GEO, str);
      const count = (num as number) + 1;
      if (num) {
        await redis.hset(REDIS_VISITOR_GEO, { [str]: count });
      } else {
        await redis.hset(REDIS_VISITOR_GEO, { [str]: 1 });
      }
    }
    // 获取系统
    const { browser, os } = userAgent(request);

    if (os.name) {
      const num = await redis.hget(REDIS_VISITOR_OS, os.name);
      const count = (num as number) + 1;
      if (num) {
        await redis.hset(REDIS_VISITOR_OS, { [os.name]: count });
      } else {
        await redis.hset(REDIS_VISITOR_OS, { [os.name]: 1 });
      }
    }
    // 获取设备
    const ua = headers.get('User-Agent');
    if (ua) {
      const device = getDevice(ua);
      const num = await redis.hget(REDIS_VISITOR_DEVICE, device);
      const count = (num as number) + 1;
      if (num) {
        await redis.hset(REDIS_VISITOR_DEVICE, { [device]: count });
      } else {
        await redis.hset(REDIS_VISITOR_DEVICE, { [device]: 1 });
      }
    }
    // 获取浏览器
    if (browser.name) {
      const num = await redis.hget(REDIS_VISITOR_BROWSER, browser.name);
      const count = (num as number) + 1;
      if (num) {
        await redis.hset(REDIS_VISITOR_BROWSER, { [browser.name]: count });
      } else {
        await redis.hset(REDIS_VISITOR_BROWSER, { [browser.name]: 1 });
      }
    }
  }

  // 获取页面访问量
  if (page) {
    const num = await redis.hget(REDIS_PAGE_URL, page);
    const count = (num as number) + 1;
    if (num) {
      await redis.hset(REDIS_PAGE_URL, { [page]: count });
    } else {
      await redis.hset(REDIS_PAGE_URL, { [page]: 1 });
    }
  }

  // 获取来源
  const referer = headers.get('origin');
  if (referer) {
    const num = await redis.hget(REDIS_VISITOR_REFERER, referer);
    const count = (num as number) + 1;
    if (num) {
      await redis.hset(REDIS_VISITOR_REFERER, { [referer]: count });
    } else {
      await redis.hset(REDIS_VISITOR_REFERER, { [referer]: 1 });
    }
  }

  // 当天总访问量
  await redis.sadd(
    `${REDIS_UNIQUE_VISITOR_TODAY}:${todayKey}`,
    ip + '-' + todayKey ?? '未知',
  );
  // 总访问量
  await redis.sadd(REDIS_UNIQUE_VISITOR, ip + '-' + todayKey ?? '未知');

  const url = await redis.hgetall(REDIS_PAGE_URL);
  const referrer = await redis.hgetall(REDIS_VISITOR_REFERER);
  const browser = await redis.hgetall(REDIS_VISITOR_BROWSER);
  const os = await redis.hgetall(REDIS_VISITOR_OS);
  const device = await redis.hgetall(REDIS_VISITOR_DEVICE);
  const city = await redis.hgetall(REDIS_VISITOR_GEO);
  const visitorCount = (await redis.smembers(REDIS_UNIQUE_VISITOR)).length;
  const pageViewCount = await redis.get(REDIS_PAGE_VIEW);

  return new Response(
    JSON.stringify({
      message: '统计信息已更新',
      info: {
        visitorCount,
        pageViewCount,
        url,
        referrer,
        browser,
        os,
        device,
        city,
      },
    }),
    { status: 200 },
  );
}

export async function PUT(request: NextRequest) {
  const xForwardedFor = request.headers.get('x-forwarded-for');
  let ip = '未知';
  if (typeof xForwardedFor === 'string') {
    ip = xForwardedFor.split(',')[0]?.trim() ?? '未知';
  }
  const { type, id } = (await request.json()) as { type: string; id: string };
  // 文章访问量
  if (type === 'blog') {
    await redis.sadd(
      `${REDIS_BLOG_UNIQUE_VISITOR}:${id}`,
      ip + '-' + todayKey ?? '未知',
    );
  } else {
    await redis.sadd(
      `${REDIS_SNIPPET_UNIQUE_VISITOR}:${id}`,
      ip + '-' + todayKey ?? '未知',
    );
  }
  return new Response(
    JSON.stringify({
      message: '统计信息已更新',
    }),
    { status: 200 },
  );
}

export async function GET() {
  const url = await redis.hgetall(REDIS_PAGE_URL);
  const referrer = await redis.hgetall(REDIS_VISITOR_REFERER);
  const browser = await redis.hgetall(REDIS_VISITOR_BROWSER);
  const os = await redis.hgetall(REDIS_VISITOR_OS);
  const device = await redis.hgetall(REDIS_VISITOR_DEVICE);
  const city = await redis.hgetall(REDIS_VISITOR_GEO);
  const visitorCount = (await redis.smembers(REDIS_UNIQUE_VISITOR)).length;
  const pageViewCount = await redis.get(REDIS_PAGE_VIEW);

  return NextResponse.json(
    {
      info: {
        visitorCount,
        pageViewCount,
        url,
        referrer,
        browser,
        os,
        device,
        city,
      },
    },
    { status: 200 },
  );
}
