import { useRequest } from 'ahooks';

import { getUV } from '../actions';

export const useGetUV = () => {
  return useRequest(() => getUV());
};
