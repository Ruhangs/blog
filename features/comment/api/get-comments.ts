import { useRequest } from 'ahooks';

import { getCommentsByRefId } from '../actions';

export const useGetComments = (id: string, ready: boolean) => {
  return useRequest(() => getCommentsByRefId(id), {
    ready,
    loadingDelay: 300,
  });
};
