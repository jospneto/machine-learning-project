import { defineQueryKey, defineMutationKey } from '@/lib/react-query/utils';
import { defineRoute } from '@/utils/functions';

import {
  DeleteExampleParams,
  GetExampleByIdParams,
  GetExamplesParams,
  UpdateExampleBody,
} from './types';

export const EXAMPLE_ENDPOINTS = {
  getExamples: defineRoute(() => '/examples'),
  getExampleById: defineRoute<GetExampleByIdParams>(({ exampleId }) => `/examples/${exampleId}`),
  createExample: defineRoute(() => '/examples'),
  updateExample: defineRoute<Pick<UpdateExampleBody, 'exampleId'>>(
    ({ exampleId }) => `/examples/${exampleId}`,
  ),
  deleteExample: defineRoute<Pick<DeleteExampleParams, 'exampleId'>>(
    ({ exampleId }) => `/examples/${exampleId}`,
  ),
} as const;

export const EXAMPLE_QUERY_KEYS = {
  getExamples: defineQueryKey<GetExamplesParams>('examples'),
  getExampleById: defineQueryKey<GetExampleByIdParams>('example-by-id'),
  getInfiniteExamples: defineQueryKey<Omit<GetExamplesParams, 'skip'>>('infinite-examples'),
} as const;

export const EXAMPLE_MUTATION_KEYS = {
  createExample: defineMutationKey('create-example'),
  updateExample: defineMutationKey('update-example'),
  deleteExample: defineMutationKey('delete-example'),
} as const;
