'use client';

import { useRouter } from 'next/navigation';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function GoBack() {
  const router = useRouter();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="inline-flex max-w-[100px] text-primary font-bold text-2xl  mt-4 pb-4 items-end cursor-pointer"
          onClick={handleBack}
        >
          <div className="flex items-center justify-center">
            <div className="animate-slide-left">
              <div className=" text-sm">{'《'}</div>
            </div>
            <div className="animate-slide-left animate-delay-1000">
              <div className=" text-sm">{'《'}</div>
            </div>
            <div className="animate-slide-left animate-delay-[2000ms]">
              <div className=" text-sm">{'《'}</div>
            </div>
            <div className="animate-slide-left animate-delay-[3000ms]">
              <div className=" text-sm">{'《'}</div>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>返回上一页</TooltipContent>
    </Tooltip>
  );

  function handleBack() {
    router.back();
  }
}
