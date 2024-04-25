import React from 'react';

import { cn } from '@/lib/utils';

export const IconEvaList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[solar--hamburger-menu-bold-duotone]', className)}
    ></span>
  );
};
