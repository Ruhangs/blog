// import Redis, { type Redis as RedisInstanceType } from 'ioredis';
// import { REDIS_KYE_PREFIX } from '@/constants';
// const globalForRedis = global as unknown as { redis: RedisInstanceType };
// // 测试
// export const redis =
//   globalForRedis.redis ||
//   new Redis({
//     host: REDIS_HOST ?? '127.0.0.1',
//     port: Number(REDIS_PORT) || 6379,
//     password: REDIS_PASSWORD,
//     keyPrefix: REDIS_KYE_PREFIX,
//   });
// globalForRedis.redis = redis;
import { type VercelKV, createClient } from '@vercel/kv';

import { KV_REST_API_TOKEN, KV_REST_API_URL } from '@/config';

const globalForRedis = global as unknown as { redis: VercelKV };

export const redis =
  globalForRedis.redis ??
  createClient({
    url: KV_REST_API_URL,
    token: KV_REST_API_TOKEN,
  });

globalForRedis.redis = redis;
