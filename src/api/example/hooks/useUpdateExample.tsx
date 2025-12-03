import { useMutation, useQueryClient } from '@tanstack/react-query';

import { defineMutation } from '@/lib/react-query';

import { EXAMPLE_MUTATION_KEYS, EXAMPLE_QUERY_KEYS } from '../config';
import { updateExample } from '../endpoints';
import { GetExampleByIdResponse, UpdateExampleBody, UpdateExampleResponse } from '../types';

export const useUpdateExample = defineMutation<UpdateExampleResponse, UpdateExampleBody>(
  ({ options }) => {
    const queryClient = useQueryClient();

    return useMutation({
      ...options,
      mutationKey: EXAMPLE_MUTATION_KEYS.updateExample(),
      mutationFn: ({ exampleId, ...example }) => updateExample({ exampleId, ...example }),
      onSuccess:
        options?.onSuccess ??
        ((response, { exampleId }) => {
          queryClient.invalidateQueries({
            queryKey: EXAMPLE_QUERY_KEYS.getExamples({ exact: false }),
          });

          queryClient.setQueryData<GetExampleByIdResponse>(
            EXAMPLE_QUERY_KEYS.getExampleById({ exampleId }),
            () => response,
          );
        }),
    });
  },
);
