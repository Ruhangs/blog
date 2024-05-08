import { useRequest } from 'ahooks';

import { getPV } from '../actions';

export const useGetPV = () => {
  return useRequest(() => getPV());
};
