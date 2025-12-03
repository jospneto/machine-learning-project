import { useMutation, useQueryClient } from '@tanstack/react-query';

import { defineMutation } from '@/lib/react-query';

import { EXAMPLE_MUTATION_KEYS, EXAMPLE_QUERY_KEYS } from '../config';
import { deleteExample } from '../endpoints';
import { DeleteExampleParams } from '../types';

export const useDeleteExample = defineMutation<void, DeleteExampleParams>(({ options }) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationKey: EXAMPLE_MUTATION_KEYS.deleteExample(),
    mutationFn: ({ exampleId }) => deleteExample({ exampleId }),
    onSuccess:
      options?.onSuccess ??
      ((_, { exampleId }) => {
        queryClient.invalidateQueries({
          queryKey: EXAMPLE_QUERY_KEYS.getExamples({ exact: false }),
        });

        queryClient.setQueryData(EXAMPLE_QUERY_KEYS.getExampleById({ exampleId }), () => undefined);
      }),
  });
});
