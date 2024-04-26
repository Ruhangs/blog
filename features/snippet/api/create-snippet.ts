import { useRequest } from 'ahooks';

import { showErrorToast, showSuccessToast } from '@/components/ui/toast';

import { createSnippet } from '../actions';

export const useCreateSnippet = () => {
  return useRequest(createSnippet, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('项目文档已创建');
    },
    onError(error) {
      showErrorToast(`项目文档创建失败: ${error.message}`);
    },
  });
};
