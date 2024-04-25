'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { redirect } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';

import { buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { userAuthSchema } from '@/lib/userAuth';
import { cn } from '@/lib/utils';

type FormData = z.infer<typeof userAuthSchema>;

export function UserAuthForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  });

  // const [isLoading, setIsLoading] = React.useState<boolean>(false);
  // const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  // const searchParams = useSearchParams();

  async function handleRegister(formData: FormData) {
    console.log(await Promise.resolve(formData));
    redirect('');
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <form onSubmit={handleSubmit(handleRegister)}>
        <div className="grid gap-2 text-baseColor">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="请输入邮箱"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              // disabled={isLoading || isGitHubLoading}
              {...register('email')}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="请输入8位密码"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              // disabled={isLoading || isGitHubLoading}
              {...register('password')}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())}>
            {/* disabled={isLoading} */}
            {/* {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            登录
          </button>
        </div>
      </form>
    </div>
  );
}
