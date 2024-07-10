import { type NextRequest, NextResponse } from 'next/server';

import { redis } from '@/lib/redis';

export async function POST(req: NextRequest) {
  // expireTime给用户令牌设置了一个过期时间
  const expireTime = 60 * 1000;
  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (typeof xForwardedFor === 'string') {
    // 用户标识
    const ip = xForwardedFor.split(',')[0]?.trim() ?? '未知';
    // 添加用户token到有序集合中
    await redis.zadd('user.active', {
      score: Date.now() + expireTime,
      member: ip,
    });
    return new Response(
      JSON.stringify({
        message: '记录成功',
      }),
      { status: 200 },
    );
  } else {
    return new Response(
      JSON.stringify({
        message: '记录失败',
      }),
      { status: 500 },
    );
  }
}

export async function GET() {
  const actives = await redis.zrange('user.active', Date.now(), '+inf', {
    byScore: true,
  });
  await redis.zremrangebyscore('user.active', 0, Date.now());

  return NextResponse.json({ active: actives.length }, { status: 200 });
}
