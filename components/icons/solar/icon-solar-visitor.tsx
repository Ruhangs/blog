import React from 'react';

import { cn } from '@/lib/utils';

export const IconSolarVisitorSquare = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span {...props} className={cn('icon-[bi--person-fill]', className)}></span>
  );
};
