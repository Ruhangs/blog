'use server';

import { AuthError } from 'next-auth';

import type * as z from 'zod';

import { PATHS } from '@/constants';
import { signIn } from '@/lib/auth';
import { type userAuthSchema } from '@/lib/userAuth';

type FormData = z.infer<typeof userAuthSchema>;

export const signinWithGithub = async () => {
  try {
    const res: unknown = await signIn('github', {
      redirectTo: PATHS.ADMIN_HOME,
      redirect: false,
    });
    return res;
  } catch (error) {
    console.log('err', error);
    return '认证失败';
  }
};

export const signinWithPassword = async (formData: FormData) => {
  try {
    // redirect为true的话，不会返回结果，将自动跳转；如果redirect为false会返回url
    // 自动跳转在trycatch块中不起作用
    const res: unknown = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirectTo: PATHS.ADMIN_HOME,
      redirect: false,
    });
    return res;
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.cause?.err instanceof Error) {
        return error.cause.err.message; // return "custom error"
      }
      switch (error.type) {
        case 'CredentialsSignin':
          return '登陆失败，请检查账号或密码';
        default:
          return '登陆失败，请检查账号或密码';
      }
    }
  }
};
