import React from 'react';

import { cn } from '@/lib/utils';

export const IconEvaPhone = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[eva--phone-call-outline]', className)}
    ></span>
  );
};
