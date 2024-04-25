'use client';

import React, { memo } from 'react';

import Vditor from 'vditor';

import { uploadFile } from '@/features/upload';
import '@/styles/vditor.css';

import {
  hideToast,
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from '../ui/toast';

type props = {
  body?: string;
  setContent: (value: string) => void;
};

const Editor = ({ body, setContent }: props) => {
  const [vd, setVd] = React.useState<Vditor>();

  React.useEffect(() => {
    console.log('初始化');
    const vditor = new Vditor('vditor', {
      after: () => {
        vditor.setValue(body ?? '');
        setVd(vditor);
      },
      input: setContent,
      placeholder: '请在此输入正文...',
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        '|',
        'line',
        'quote',
        'list',
        'ordered-list',
        'check',
        'outdent',
        'indent',
        'code',
        'inline-code',
        'link',
        'table',
        'upload',
        '|',
        'insert-after',
        'insert-before',
        'undo',
        'redo',
        'preview',
        'outline',
        'fullscreen',
      ],
      toolbarConfig: {
        pin: true,
      },
      outline: {
        enable: false,
        position: 'right',
      },
      upload: {
        handler: async (files: File[]) => {
          const file = files[0];
          if (file) {
            const fd = new FormData();
            fd.append('file', file);

            const toastID = showLoadingToast('上传中');
            const { url, error } = await uploadFile(fd);
            hideToast(toastID);

            if (error) {
              showErrorToast(error);
              return '';
            }

            if (url) {
              showSuccessToast('上传成功');
              vditor.insertValue(`\n![](${url})\n`);
              return '';
            }

            return '';
          } else {
            return '';
          }
        },
        multiple: false,
      },
      counter: {
        enable: true,
      },
      mode: 'ir',
    });
    return () => {
      vd?.destroy();
      setVd(undefined);
    };
  }, [body]);

  return <div id="vditor" className="vditor" />;
};

export const VEditor = memo(Editor);
