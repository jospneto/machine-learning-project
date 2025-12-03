import { useQuery } from '@tanstack/react-query';

import { defineQuery } from '@/lib/react-query';

import { EXAMPLE_QUERY_KEYS } from '../config';
import { getExampleById } from '../endpoints';
import { GetExampleByIdResponse, GetExampleByIdParams } from '../types';

export const useGetExampleById = defineQuery<GetExampleByIdResponse, GetExampleByIdParams>(
  ({ options, params }) =>
    useQuery({
      ...options,
      queryKey: EXAMPLE_QUERY_KEYS.getExampleById(params),
      queryFn: () => getExampleById(params),
    }),
);
