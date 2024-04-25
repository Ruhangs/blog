'use client';

import React from 'react';

import { useTheme } from 'next-themes';

import { type VariantProps } from 'class-variance-authority';

import { Button, type buttonVariants } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

import {
  IconMingcuteLoadingLine,
  IconSolarMonitorBold,
  IconSolarMoonStars,
  IconSolarSun,
} from '../icons';

const themeOptions = [
  {
    value: 'light',
    label: '浅色',
    icon: <IconSolarSun className="text-base" />,
  },
  {
    value: 'dark',
    label: '深色',
    icon: <IconSolarMoonStars className="text-base" />,
  },
  {
    value: 'system',
    label: '系统',
    icon: <IconSolarMonitorBold className="text-base" />,
  },
];

export type Props = VariantProps<typeof buttonVariants>;

export function SwitchTheme(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 避免水合作用不匹配，若要解决此问题，请确保仅在客户端上装载页面时呈现使用当前主题的 UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  let icon = '';

  if (!mounted) {
    return null;
  } else {
    if (resolvedTheme === 'light' || theme === 'light') {
      icon = 'light';
    } else if (resolvedTheme === 'dark' || theme === 'dark') {
      icon = 'dark';
    } else {
      icon = '';
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          aria-label="切换主题"
          variant="ghost"
          size={'icon'}
          {...props}
        >
          {icon === '' ? (
            <IconMingcuteLoadingLine className="animate-spin text-base" />
          ) : icon === 'dark' ? (
            <IconSolarMoonStars className="text-base" />
          ) : (
            <IconSolarSun className="text-base" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] p-0">
        <Command>
          <CommandGroup>
            {themeOptions.map((el) => (
              <CommandItem
                key={el.value}
                value={el.value}
                onSelect={(currentValue) => {
                  setTheme(currentValue);
                  setOpen(false);
                }}
              >
                <div className="flex items-center  gap-2">
                  <div
                    className={cn(
                      theme === el.value ? 'opacity-100' : 'opacity-50',
                      'flex items-center',
                    )}
                  >
                    {el.icon}
                  </div>
                  <div
                    className={cn(
                      'text-sm',
                      theme === el.value ? 'opacity-100' : 'opacity-50',
                    )}
                  >
                    {el.label}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
