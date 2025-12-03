import { useQuery } from '@tanstack/react-query';

import { defineQuery } from '@/lib/react-query';

import { EXAMPLE_QUERY_KEYS } from '../config';
import { getExamples } from '../endpoints';
import { GetExamplesParams, GetExamplesResponse } from '../types';

export const useGetExamples = defineQuery<GetExamplesResponse, GetExamplesParams>(
  ({ options, params }) =>
    useQuery({
      ...options,
      queryKey: EXAMPLE_QUERY_KEYS.getExamples(params),
      queryFn: () => getExamples(params),
    }),
);
