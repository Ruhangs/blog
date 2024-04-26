import React from 'react';

import { cn } from '@/lib/utils';

export const IconSkillGithubActionDark = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[skill-icons--githubactions-dark]', className)}
    ></span>
  );
};

export const IconSkillGithubActionLight = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[skill-icons--githubactions-light]', className)}
    ></span>
  );
};
