'use client';

import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import {
  IconSolarBook,
  IconSolarCodeSquare,
  IconSolarHashtagSquare,
  IconSolarNotesBold,
  IconSolarViewSquare,
  IconSolarVisitorSquare,
} from '@/components/icons';

import { type StatisticsCardProps } from '../../types';

interface propsType {
  title: string;
  type: string;
  info: Record<string, unknown>;
}

const CardSkeleton = ({ title, type }: propsType) => {
  return (
    <div className="border bg-card text-card-foreground rounded-lg p-6">
      <div className="flex items-center justify-between pb-2">
        <h3 className="tracking-tight font-bold">{title}</h3>
        <h3 className="tracking-tight font-bold">{type}</h3>
      </div>
      <ul className="max-h-60 overflow-y-auto space-y-4 scrollbar pr-1">
        <li>
          <Skeleton className="flex items-center justify-between h-[20px] w-full"></Skeleton>
        </li>
        <li>
          <Skeleton className="flex items-center justify-between h-[20px] w-3/4"></Skeleton>
        </li>
        <li>
          <Skeleton className="flex items-center justify-between h-[20px] w-1/4"></Skeleton>
        </li>
        <li>
          <Skeleton className="flex items-center justify-between h-[20px] w-1/2"></Skeleton>
        </li>
      </ul>
    </div>
  );
};

export default function Sketelon() {
  const statistics: StatisticsCardProps[] = [
    {
      title: '博客',
      count: 0,
      icon: <IconSolarBook className="text-muted-foreground text-2xl" />,
    },
    {
      title: '项目文档',
      count: 0,
      icon: <IconSolarCodeSquare className="text-muted-foreground text-2xl" />,
    },
    {
      title: '标签',
      count: 0,
      icon: (
        <IconSolarHashtagSquare className="text-muted-foreground text-2xl" />
      ),
    },
    {
      title: '笔记',
      count: 0,
      icon: <IconSolarNotesBold className="text-muted-foreground text-2xl" />,
    },
  ];
  const analysis: StatisticsCardProps[] = [
    {
      title: '浏览量',
      count: 0,
      icon: <IconSolarViewSquare className="text-muted-foreground text-2xl" />,
    },
    {
      title: '访客',
      count: 0,
      icon: (
        <IconSolarVisitorSquare className="text-muted-foreground text-2xl" />
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto scrollbarhidden">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statistics.map((el) => (
          <div
            key={el.title}
            className="border bg-card text-card-foreground rounded-lg"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight font-medium">{el.title}</h3>
              {el.icon}
            </div>
            <div className="p-6 pt-0">
              <Skeleton className="text-2xl h-[20px] w-1/2 font-bold"></Skeleton>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-2">
        {analysis.map((el) => (
          <div
            key={el.title}
            className="border bg-card text-card-foreground rounded-lg"
          >
            <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight font-medium">{el.title}</h3>
              {el.icon}
            </div>
            <div className="p-6 pt-0">
              <Skeleton className="text-2xl h-[20px] w-1/2 font-bold"></Skeleton>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 mt-4  lg:grid-cols-3">
        <CardSkeleton title={'网页'} type={'浏览量'} info={{}} />
        <CardSkeleton title={'来源'} type={'浏览量'} info={{}} />
        <CardSkeleton title={'城市'} type={'访客'} info={{}} />
      </div>
      <div className="grid gap-4 mt-4  lg:grid-cols-3">
        <CardSkeleton title={'浏览器'} type={'访客'} info={{}} />
        <CardSkeleton title={'操作系统'} type={'访客'} info={{}} />
        <CardSkeleton title={'设备'} type={'访客'} info={{}} />
      </div>
    </div>
  );
}
