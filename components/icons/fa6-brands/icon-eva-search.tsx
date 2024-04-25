import React from 'react';

import { cn } from '@/lib/utils';

export const IconEvaSearch = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[eva--search-fill]', className)}
    ></span>
  );
};
