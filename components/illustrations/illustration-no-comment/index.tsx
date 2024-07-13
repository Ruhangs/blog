import React from 'react';

import { cn } from '@/lib/utils';

import { IllustrationNoComment } from './illustration-no-comment';

export function IllustrationNoComments(props: React.SVGProps<SVGSVGElement>) {
  return (
    // <IllustrationNoAccessDark
    //   {...props}
    //   className={cn(props.className, 'hidden dark:block')}
    // />
    <IllustrationNoComment {...props} className={cn(props.className)} />
  );
}
