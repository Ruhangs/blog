'use client';

import React from 'react';

import { type Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { IconSolarArrowRightUpLinear } from '@/components/icons';
import { SwitchTheme } from '@/components/switch-theme';

import { EMPTY_TEXT, PATHS } from '@/constants';
import { SignOutButton } from '@/features/auth';
import { isAdmin } from '@/lib/utils';

import { Sidebar } from './sidebar';

const Desc = ({ session }: { session: Session | null }) => {
  return isAdmin(session?.user?.email) ? (
    <div className="flex justify-center flex-col items-center translate-y-[-15px]">
      <p className="bg-background text-foreground inline-flex items-center rounded-full border px-1.5 mt-1 text-xs font-semibold transition-colors">
        管理员
      </p>
    </div>
  ) : (
    <div className="flex justify-center flex-col items-center translate-y-[-15px] ">
      <p className="bg-background text-foreground inline-flex items-center rounded-full border px-1.5 mt-1 text-xs font-semibold transition-colors">
        游客
      </p>
    </div>
  );
};

export const Sidenav = () => {
  const { data: session } = useSession();

  return (
    <aside className="w-16 lg:w-[256px] transition-all h-screen flex-col flex items-center justify-between py-6 2xl:py-12 bg-foreground">
      <div>
        <Avatar className="w-14 h-14 mx-auto border border-muted-foreground/10">
          <AvatarImage
            src={session?.user?.image ?? '/images/unLogin.jpg'}
            alt={session?.user?.name ?? EMPTY_TEXT}
          />
          <AvatarFallback>{EMPTY_TEXT}</AvatarFallback>
        </Avatar>
        <Desc session={session} />
        <h4 className="hidden text-center lg:block text-lg font-semibold tracking-tight text-primary-foreground">
          {session?.user?.name ?? EMPTY_TEXT}
        </h4>
        <div className="w-full flex-col flex items-center mt-6 2xl:mt-12 space-y-4">
          <Sidebar />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center lg:grid  w-full space-y-2">
        {/* <Tooltip>
          <TooltipTrigger>
            
          </TooltipTrigger>
          <TooltipContent
            className="lg:hidden"
            sideOffset={10}
            align="start"
            side={'right'}
          >
            {'退出登录'}
          </TooltipContent>
        </Tooltip> */}

        <SignOutButton />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              className="lg:!w-full text-primary-foreground bg-muted-foreground/10 hover:bg-muted-foreground/20"
            >
              <Link href={PATHS.SITE_HOME} target="_blank">
                <span className="hidden lg:inline-block">回到博客首页</span>
                <IconSolarArrowRightUpLinear />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            className="lg:hidden"
            sideOffset={10}
            align="start"
            side={'right'}
          >
            {'回到博客首页'}
          </TooltipContent>
        </Tooltip>
        <div className="w-full h-12 grid place-content-center">
          <SwitchTheme variant={'outline'} />
        </div>
      </div>
    </aside>
  );
};
