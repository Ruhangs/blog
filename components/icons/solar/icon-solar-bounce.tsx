import React from 'react';

import { cn } from '@/lib/utils';

export const IconSolarBounceSquare = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[ep--success-filled]', className)}
    ></span>
  );
};
