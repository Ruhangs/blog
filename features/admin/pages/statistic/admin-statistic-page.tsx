'use client';

import React, { useState } from 'react';

import { useAsyncEffect } from 'ahooks';

import {
  IconSolarBook,
  IconSolarCodeSquare,
  IconSolarHashtagSquare,
  IconSolarNotesBold,
  IconSolarViewSquare,
  IconSolarVisitorSquare,
} from '@/components/icons';
import { PageHeader } from '@/components/page-header';

import { PATHS } from '@/constants';
import { getStatistics } from '@/features/statistics';

import { AdminContentLayout } from '../../components';
import { Card } from '../../components/statistic/card';
import StatisticSketelon from '../../components/statistic/statisticSketelon';
import { type StatisticsCardProps } from '../../types';

interface InfoType {
  blogCount: number;
  snippetCount: number;
  tagCount: number;
  noteCount: number;
  visitorCount: number;
  pageViewCount: number;
  url: Record<string, unknown>;
  referrer: Record<string, unknown>;
  browser: Record<string, unknown>;
  os: Record<string, unknown>;
  device: Record<string, unknown>;
  city: Record<string, unknown>;
}

export const AdminStatisticPage = () => {
  const [info, setInfo] = useState<InfoType>();

  useAsyncEffect(async () => {
    const res = await getStatistics();
    setInfo(res);
  }, []);

  const statistics: StatisticsCardProps[] = [
    {
      title: '博客',
      count: info ? info.blogCount : 0,
      icon: <IconSolarBook className="text-muted-foreground text-2xl" />,
    },
    {
      title: '项目文档',
      count: info ? info.snippetCount : 0,
      icon: <IconSolarCodeSquare className="text-muted-foreground text-2xl" />,
    },
    {
      title: '标签',
      count: info ? info.tagCount : 0,
      icon: (
        <IconSolarHashtagSquare className="text-muted-foreground text-2xl" />
      ),
    },
    {
      title: '笔记',
      count: info ? info.noteCount : 0,
      icon: <IconSolarNotesBold className="text-muted-foreground text-2xl" />,
    },
  ];

  const analysis: StatisticsCardProps[] = [
    {
      title: '浏览量',
      count: info ? info.pageViewCount : 0,
      icon: <IconSolarViewSquare className="text-muted-foreground text-2xl" />,
    },
    {
      title: '访客',
      count: info ? info.visitorCount : 0,
      icon: (
        <IconSolarVisitorSquare className="text-muted-foreground text-2xl" />
      ),
    },
    // {
    //   title: '跳出率',
    //   count: info.bounces,
    //   icon: (
    //     <IconSolarBounceSquare className="text-muted-foreground text-2xl" />
    //   ),
    // },
    // {
    //   title: '总访问时间',
    //   count: info.totaltime,
    //   icon: <IconSolarTimeSquare className="text-muted-foreground text-2xl" />,
    // },
  ];

  return (
    <AdminContentLayout
      pageHeader={
        <PageHeader
          breadcrumbList={[PATHS.ADMIN_HOME, PATHS.ADMIN_STATISTIC]}
        />
      }
    >
      {info ? (
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
                  <div className="text-2xl font-bold">{el.count}</div>
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
                  <div className="text-2xl font-bold">{el.count}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid gap-4 mt-4  lg:grid-cols-3">
            <Card title={'网页'} type={'浏览量'} info={info.url} />
            <Card title={'来源'} type={'浏览量'} info={info.referrer} />
            <Card title={'城市'} type={'访客'} info={info.city} />
          </div>
          <div className="grid gap-4 mt-4  lg:grid-cols-3">
            <Card title={'浏览器'} type={'访客'} info={info.browser} />
            <Card title={'操作系统'} type={'访客'} info={info.os} />
            <Card title={'设备'} type={'访客'} info={info.device} />
          </div>
        </div>
      ) : (
        <StatisticSketelon></StatisticSketelon>
      )}
    </AdminContentLayout>
  );
};
