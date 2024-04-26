import { useRequest } from 'ahooks';

import { showErrorToast, showSuccessToast } from '@/components/ui/toast';

import { deleteSnippetByID } from '../actions';

export const useDeleteSnippet = () => {
  return useRequest(deleteSnippetByID, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('项目文档已删除');
    },
    onError(error) {
      showErrorToast(`项目文档删除失败: ${error.message}`);
    },
  });
};
