import React from 'react';

import { cn } from '@/lib/utils';

export const IconEvaUpload = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      {...props}
      className={cn('icon-[eva--cloud-upload-outline]', className)}
    ></span>
  );
};
