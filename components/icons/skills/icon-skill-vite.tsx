import React from 'react';

import { cn } from '@/lib/utils';

export const IconSkillViteDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[skill-icons--vite-dark]', className)}
    ></span>
  );
};

export const IconSkillViteLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[skill-icons--vite-light]', className)}
    ></span>
  );
};
