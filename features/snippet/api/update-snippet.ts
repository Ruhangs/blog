import { useRequest } from 'ahooks';

import { showErrorToast, showSuccessToast } from '@/components/ui/toast';

import { toggleSnippetPublished, updateSnippet } from '../actions';

export const useUpdateSnippet = () => {
  return useRequest(updateSnippet, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('项目文档已更新');
    },
    onError(error) {
      showErrorToast(`项目文档更新: ${error.message}`);
    },
  });
};

export const useToggleSnippetPublish = () => {
  return useRequest(toggleSnippetPublished, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('项目文档发布状态已更新');
    },
    onError(error) {
      showErrorToast(`项目文档发布状态更新失败: ${error.message}`);
    },
  });
};
