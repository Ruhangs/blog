import React from 'react';

import { cn } from '@/lib/utils';

export const IconSkillGmailLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[eva--email-outline]', className)}
    ></span>
  );
};
