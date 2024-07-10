import React from 'react';

import { cn } from '@/lib/utils';

export const IconMingcuteEmojiLine = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[mingcute--emoji-2-line]', className)}
    ></span>
  );
};
