import React from 'react';

// import { IllustrationConstruction } from '@/components/illustrations';
import { PageHeader } from '@/components/page-header';

import { PATHS } from '@/constants';

import { AdminContentLayout } from '../../components';
import { Chat } from '../../components/chat/chat';

export const AdminHomePage = () => {
  return (
    <AdminContentLayout
      pageHeader={<PageHeader breadcrumbList={[PATHS.ADMIN_HOME]} />}
    >
      <Chat
        endpoint="api/chat"
        emoji="👨‍🎓"
        titleText="小阮同学"
        placeholder="我是小阮同学，你可以问我计算机相关的任何问题"
      />
      {/* <div className="grid place-content-center mt-[18vh]">
        <IllustrationConstruction className="w-[320px] h-[320px]" />
        <h3 className="text-2xl font-semibold tracking-tight text-center">
          开发中
        </h3>
      </div> */}
    </AdminContentLayout>
  );
};
