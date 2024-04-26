'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { showErrorToast } from '@/components/ui/toast';

import { IconBarandGithub, IconMingcuteLoadingLine } from '@/components/icons';
import { NextLink } from '@/components/next-link';

import { PATHS } from '@/constants';
import { userAuthSchema } from '@/lib/userAuth';

import { signinWithGithub, signinWithPassword } from '../actions/signin';
import { Input } from '../components/input';
import { Label } from '../components/label';

type FormData = z.infer<typeof userAuthSchema>;

export const SignInPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGithubLoading, setIsGithubLoading] = React.useState<boolean>(false);
  const router = useRouter();

  async function authenticate(formData: FormData) {
    setIsLoading(true);
    const res = (await signinWithPassword(formData)) as string;
    if (res.endsWith('admin')) {
      router.replace(PATHS.ADMIN_HOME);
    } else {
      showErrorToast(res);
    }
    setIsLoading(false);
  }

  async function handleSigninWithGithub() {
    setIsGithubLoading(true);
    const res = (await signinWithGithub()) as string;
    if (res.startsWith('https://github.com/login/oauth/authorize')) {
      router.replace(res);
    } else {
      showErrorToast(res);
    }
    setIsGithubLoading(false);
  }

  return (
    <div className="w-screen h-screen grid place-content-center">
      <Card className="w-[320px] py-4 rounded-3xl sm:w-full sm:max-w-none sm:min-w-[360px] relative animate-fade">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            登录 <NextLink href={PATHS.SITE_HOME}>回到博客首页</NextLink>
          </CardTitle>
          <CardDescription>请登录(游客请选择GitHub登录)</CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="w-full grid gap-4">
            <div className="!w-full">
              <form onSubmit={handleSubmit(authenticate)}>
                <div className="grid gap-2 text-baseColor">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      id="email"
                      placeholder="请输入账号"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading || isGithubLoading}
                      {...register('email')}
                    />
                    {errors?.email && (
                      <p className="px-1 text-xs text-red-600">{'输入无效'}</p>
                    )}
                    <Label className="sr-only" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      id="password"
                      placeholder="请输入密码"
                      type="password"
                      autoCapitalize="none"
                      autoComplete="current-password"
                      autoCorrect="off"
                      disabled={isLoading || isGithubLoading}
                      {...register('password')}
                    />
                    {errors?.password && (
                      <p className="px-1 text-xs text-red-600">{'输入无效'}</p>
                    )}
                  </div>
                  <Button variant="default" className="!w-full">
                    {(isLoading || isGithubLoading) && (
                      <IconMingcuteLoadingLine className="mr-2 h-4 w-4 animate-spin text-base" />
                    )}
                    登 录
                  </Button>
                </div>
              </form>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或者
                </span>
              </div>
            </div>
            <Button
              variant="default"
              className="!w-full"
              type="button"
              onClick={handleSigninWithGithub}
            >
              {isGithubLoading ? (
                <IconMingcuteLoadingLine className="mr-2 h-4 w-4 animate-spin text-base" />
              ) : (
                <IconBarandGithub className="mr-2 text-base" />
              )}
              使用 Github 登录
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
