import React from 'react';

import { cn } from '@/lib/utils';

export const IconSkillWebpackDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[skill-icons--webpack-dark]', className)}
    ></span>
  );
};

export const IconSkillWebpackLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[skill-icons--webpack-light]', className)}
    ></span>
  );
};
