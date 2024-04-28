import React from 'react';

import {
  IconSolarBook,
  IconSolarCodeSquare,
  IconSolarHashtagSquare,
  IconSolarNotesBold,
} from '@/components/icons';
import { PageHeader } from '@/components/page-header';

import { PATHS } from '@/constants';
import { getAnalysis, getStatistics } from '@/features/statistics';
import { formatShortTime } from '@/lib/utils';

import { AdminContentLayout } from '../../components';
import { type StatisticsCardProps } from '../../types';

export const AdminStatisticPage = async () => {
  const { blogCount, snippetCount, tagCount, noteCount } =
    await getStatistics();

  const info = await getAnalysis();

  const statistics: StatisticsCardProps[] = [
    {
      title: '博客',
      count: blogCount,
      icon: <IconSolarBook className="text-muted-foreground text-2xl" />,
    },
    {
      title: '项目文档',
      count: snippetCount,
      icon: <IconSolarCodeSquare className="text-muted-foreground text-2xl" />,
    },
    {
      title: '标签',
      count: tagCount,
      icon: (
        <IconSolarHashtagSquare className="text-muted-foreground text-2xl" />
      ),
    },
    {
      title: '笔记',
      count: noteCount,
      icon: <IconSolarNotesBold className="text-muted-foreground text-2xl" />,
    },
  ];

  const analysis: StatisticsCardProps[] = [
    {
      title: '浏览量',
      count: info?.pageviews.value ?? 0,
      change: info?.pageviews.change ?? 0,
      icon: <IconSolarBook className="text-muted-foreground text-2xl" />,
    },
    {
      title: '访客',
      count: info?.visitors.value ?? 0,
      change: info?.visitors.change ?? 0,
      icon: <IconSolarBook className="text-muted-foreground text-2xl" />,
    },
    {
      title: '跳出率',
      count: info?.bounces.value ?? 0,
      change: info?.bounces.change ?? 0,
      icon: <IconSolarBook className="text-muted-foreground text-2xl" />,
    },
    {
      title: '总访问时间',
      count: info?.totaltime.value ?? 0,
      change: info?.totaltime.change ?? 0,
      icon: <IconSolarBook className="text-muted-foreground text-2xl" />,
    },
  ];

  return (
    <AdminContentLayout
      pageHeader={
        <PageHeader
          breadcrumbList={[PATHS.ADMIN_HOME, PATHS.ADMIN_STATISTIC]}
        />
      }
    >
      <div className="flex-1">
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
        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-4">
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
                {el.title === '访客' || el.title === '浏览量' ? (
                  <div className="text-2xl font-bold">{el.count}</div>
                ) : el.title === '跳出率' ? (
                  <div className="text-2xl font-bold">
                    {(el.count / el.change!) * 100}%
                  </div>
                ) : (
                  <div className="text-2xl font-bold">
                    {formatShortTime(el.count)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminContentLayout>
  );
};
