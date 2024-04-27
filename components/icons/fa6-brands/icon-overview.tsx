'use client';

import React from 'react';

import { WEBSITE } from '@/constants';
import { cn } from '@/lib/utils';

export const IconOverview = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLImageElement>) => {
  return (
    <img
      {...props}
      src={'/images/overview.svg'}
      className={cn('h-8', className)}
      alt={WEBSITE}
    />
  );
};
