import { useInfiniteQuery } from '@tanstack/react-query';

import { defineInfiniteQuery } from '@/lib/react-query';

import { EXAMPLE_QUERY_KEYS } from '../config';
import { getExamples } from '../endpoints';
import { GetExamplesParams, GetExamplesResponse } from '../types';

export const useGetInfiniteExamples = defineInfiniteQuery<
  GetExamplesResponse,
  Omit<GetExamplesParams, 'skip'>
>(({ options, params }) =>
  useInfiniteQuery({
    ...options,
    queryKey: EXAMPLE_QUERY_KEYS.getInfiniteExamples(params),
    queryFn: ({ pageParam }) =>
      getExamples({
        ...params,
        skip: pageParam,
        take: params.take ?? 10,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const fetchedCount = allPages.reduce((acc, page) => acc + page.data.length, 0);
      const total = lastPage.total_items;

      return fetchedCount < total ? fetchedCount : undefined;
    },
  }),
);
