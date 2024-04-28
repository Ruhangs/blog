import { type ClassValue, clsx } from 'clsx';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import slugify from 'slugify';
import { twMerge } from 'tailwind-merge';

import { showErrorToast, showSuccessToast } from '@/components/ui/toast';

import { ADMIN_EMAILS } from '@/constants';

dayjs.extend(relativeTime);

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const toSlug = (s: string) => {
  if (!s) {
    return '';
  }

  return slugify(s, {
    lower: true,
  });
};

export const copyToClipboard = (text: string) => {
  // 实测 Clipboard API 在 iPhone 上不支持，可恶！
  if (navigator.clipboard) {
    navigator.clipboard
      // 去除首尾空白字符
      .writeText(text?.trim())
      .then(() => {
        showSuccessToast('已复制到粘贴板');
      })
      .catch((error) => {
        showErrorToast(error as string);
      });
  } else {
    // 以下代码来自：https://www.zhangxinxu.com/wordpress/2021/10/js-copy-paste-clipboard/
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    // 隐藏此输入框
    textarea.style.position = 'fixed';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.style.top = '10px';
    // 赋值，手动去除首尾空白字符
    textarea.value = text?.trim();
    // 选中
    textarea.select();
    // 复制
    document.execCommand('copy', true);
    showSuccessToast('已复制到粘贴板');
    // 移除输入框
    document.body.removeChild(textarea);
  }
};

export const toFromNow = (date: number | Date) => {
  return dayjs(date).locale('zh-cn').fromNow();
};

export const toSlashDateString = (date: number | Date) => {
  return dayjs(date).locale('zh-cn').format('YYYY年M月D日 dddd HH:mm:ss');
};

export const isAdmin = (email?: string | null) => {
  if (!email || !ADMIN_EMAILS?.length) {
    return false;
  }
  return ADMIN_EMAILS.includes(email);
};

export const isBrowser = () => {
  // 代码来自：https://ahooks.js.org/zh-CN/guide/blog/ssr
  /* eslint-disable @typescript-eslint/prefer-optional-chain */
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
};

export const isExistCatalogue = (source: string) => {
  const contentWithoutCode = source
    .replace(/^[^#]+\n/g, '')
    .replace(/(?:[^\n#]+)#+\s([^#\n]+)\n*/g, '')
    // .replace(/^#\s[^#\n]*\n+/, '')
    .replace(/```[^`\n]*\n+[^```]+```\n+/g, '')
    .replace(/`([^`\n]+)`/g, '$1')
    .replace(/\*\*?([^*\n]+)\*\*?/g, '$1')
    .replace(/__?([^_\n]+)__?/g, '$1')
    .trim();
  const pattOfTitle = /#+\s([^#\n]+)\n*/g;
  const matchResult = contentWithoutCode.match(pattOfTitle);

  if (!matchResult) {
    return false;
  }

  return true;
};

export function parseTime(val: number) {
  const days = ~~(val / 86400);
  const hours = ~~(val / 3600) - days * 24;
  const minutes = ~~(val / 60) - days * 1440 - hours * 60;
  const seconds = ~~val - days * 86400 - hours * 3600 - minutes * 60;
  const ms = (val - ~~val) * 1000;

  return {
    days,
    hours,
    minutes,
    seconds,
    ms,
  };
}

export function formatTime(val: number) {
  const { hours, minutes, seconds } = parseTime(val);
  const h = hours > 0 ? `${hours}:` : '';
  const m = hours > 0 ? minutes.toString().padStart(2, '0') : minutes;
  const s = seconds.toString().padStart(2, '0');

  return `${h}${m}:${s}`;
}

export function formatShortTime(val: number, formats = ['m', 's'], space = '') {
  const { days, hours, minutes, seconds, ms } = parseTime(val);
  let t = '';

  if (days > 0 && formats.indexOf('d') !== -1) t += `${days}d${space}`;
  if (hours > 0 && formats.indexOf('h') !== -1) t += `${hours}h${space}`;
  if (minutes > 0 && formats.indexOf('m') !== -1) t += `${minutes}m${space}`;
  if (seconds > 0 && formats.indexOf('s') !== -1) t += `${seconds}s${space}`;
  if (ms > 0 && formats.indexOf('ms') !== -1) t += `${ms}ms`;

  if (!t) {
    return `0${formats[formats.length - 1]}`;
  }

  return t;
}
