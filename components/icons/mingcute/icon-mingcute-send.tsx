import React from 'react';

import { cn } from '@/lib/utils';

export const IconMingcuteSendLine = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[mingcute--send-plane-line]', className)}
    ></span>
  );
};
