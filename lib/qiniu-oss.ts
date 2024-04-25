import qiniu from 'qiniu';

import { OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, OSS_BUCKET } from '@/config';

// const globalForQuniuOSS = global as unknown as { qiniuOSS: unknown };

// export const aliOSS =
//   globalForAliOSS.aliOSS ??
//   new OSS({
//     accessKeyId: OSS_ACCESS_KEY_ID ?? '',
//     accessKeySecret: OSS_ACCESS_KEY_SECRET ?? '',
//     region: OSS_REGION ?? '',
//     bucket: OSS_BUCKET ?? '',
//   });

interface PutPolicyOptions {
  scope: string;

  [key: string]: string;
}

export const qiniuMac = new qiniu.auth.digest.Mac(
  OSS_ACCESS_KEY_ID,
  OSS_ACCESS_KEY_SECRET,
);

// if (NODE_ENV !== 'production') globalForQuniuOSS.qiniuOSS = qiniuMac;

// 准备上传的策略
const options: PutPolicyOptions = {
  scope: OSS_BUCKET ?? '',
};
const putPolicy = new qiniu.rs.PutPolicy(options);
export const uploadToken = putPolicy.uploadToken(qiniuMac);

export interface ConfigOptions {
  /**
   * @default false
   */
  useHttpsDomain?: boolean;

  /**
   * @default true
   */
  useCdnDomain?: boolean;

  /**
   * @default null
   */
  zone?: Zone;

  /**
   * @default -1
   */
  zoneExpire?: number;
}

interface Zone {
  ioHost: string;
  rsHost: string;
  rsfHost: string;
  apiHost: string;
}
