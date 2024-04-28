import React from 'react';

import { cn } from '@/lib/utils';

export const IconSolarViewSquare = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span {...props} className={cn('icon-[raphael--view]', className)}></span>
  );
};
