import { useRequest } from 'ahooks';

import { showErrorToast, showSuccessToast } from '@/components/ui/toast';

import { createComment } from '../actions';

export const useCreateComment = () => {
  return useRequest(createComment, {
    manual: true,
    loadingDelay: 300,
    onSuccess() {
      showSuccessToast('评论成功');
    },
    onError(error) {
      showErrorToast(`评论失败: ${error.message}`);
    },
  });
};
