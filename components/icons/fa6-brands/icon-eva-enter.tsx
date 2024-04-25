import React from 'react';

import { cn } from '@/lib/utils';

export const IconEvaEnter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[eva--corner-down-left-fill]', className)}
    ></span>
  );
};
