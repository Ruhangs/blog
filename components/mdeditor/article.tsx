'use client';

import React from 'react';
import Markdown from 'react-markdown';

import { Terminal } from 'lucide-react';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

import CopyButton from '@/components/ui/copyButton';

import '@/styles/article.css';

import 'highlight.js/styles/atom-one-dark.css';

interface Props {
  content: string;
}

export default function Article({ content }: Props) {
  return (
    <div className={'markdown'}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre: ({ children }) => <pre className="not-prose">{children}</pre>,
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className ?? '');
            // id若以数字开头，选择器无法找到对应的dom
            const id = 'copy' + Math.random().toString(36).substr(2, 9);
            return match?.length ? (
              <div id="code" className="not-prose rounded-md border">
                <div className="flex h-12 items-center justify-between bg-backgraundSecond px-4 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <Terminal size={18} />
                    <p className="text-sm text-foreground ">{match[1]}</p>
                  </div>
                  <CopyButton id={id} />
                </div>
                <div className="overflow-x-auto py-4 px-4 text-lg">
                  <div id={id}>{children}</div>
                </div>
              </div>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
