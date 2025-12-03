import { useMutation, useQueryClient } from '@tanstack/react-query';

import { defineMutation } from '@/lib/react-query';

import { EXAMPLE_MUTATION_KEYS, EXAMPLE_QUERY_KEYS } from '../config';
import { createExample } from '../endpoints';
import { CreateExampleBody, CreateExampleResponse, GetExampleByIdResponse } from '../types';

export const useCreateExample = defineMutation<CreateExampleResponse, CreateExampleBody>(
  ({ options }) => {
    const queryClient = useQueryClient();

    return useMutation({
      ...options,
      mutationKey: EXAMPLE_MUTATION_KEYS.createExample(),
      mutationFn: (example) => createExample(example),
      onSuccess:
        options?.onSuccess ??
        ((response) => {
          queryClient.invalidateQueries({
            queryKey: EXAMPLE_QUERY_KEYS.getExamples({ exact: false }),
          });

          queryClient.setQueryData<GetExampleByIdResponse>(
            EXAMPLE_QUERY_KEYS.getExampleById({ exampleId: response.id }),
            () => response,
          );
        }),
    });
  },
);
