'use client';

import React from 'react';

import { MarkdownNavbar } from '@/components/mdeditor/navbar';

import { isExistCatalogue } from '@/lib/utils';
import '@/styles/navbar.css';

import { IconEvaList } from '../icons';

interface Props {
  content: string;
}

export default function Catalogue({ content }: Props) {
  return isExistCatalogue(content) ? (
    <div className="hidden lg:block fixed right-[calc((100%-678px)/2-250px-64px)] top-24 translate-y-8">
      <div className="text-[1rem] mb-[8px] font-bold flex items-center">
        <IconEvaList className="text-[1.4rem] font-bold mr-[0.2rem]" /> 文章目录
      </div>
      <div className="w-[250px] h-[400px] overflow-y-auto scrollbar">
        <MarkdownNavbar
          className="cursor-pointer "
          source={content}
          headingTopOffset={90} //离顶部的距离
          ordered={false} //是否显示标题题号1,2等
        />
      </div>
    </div>
  ) : (
    <></>
  );
}
