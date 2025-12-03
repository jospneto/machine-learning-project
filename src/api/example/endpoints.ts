import httpClient from '@/lib/httpClient';
import { defineEndpoint } from '@/utils/functions';

import { EXAMPLE_ENDPOINTS } from './config';
import {
  CreateExampleBody,
  CreateExampleResponse,
  DeleteExampleParams,
  GetExampleByIdParams,
  GetExampleByIdResponse,
  GetExamplesParams,
  GetExamplesResponse,
  UpdateExampleBody,
  UpdateExampleResponse,
} from './types';

export const getExamples = defineEndpoint<GetExamplesResponse, GetExamplesParams>(
  async (searchParams) => {
    const response = await httpClient
      .authorized()
      .get(EXAMPLE_ENDPOINTS.getExamples(), { searchParams });
    const data = await response.json<GetExamplesResponse>();
    return data;
  },
);

export const getExampleById = defineEndpoint<GetExampleByIdResponse, GetExampleByIdParams>(
  async ({ exampleId }) => {
    const response = await httpClient
      .authorized()
      .get(EXAMPLE_ENDPOINTS.getExampleById({ exampleId }));
    const data = await response.json<GetExampleByIdResponse>();
    return data;
  },
);

export const createExample = defineEndpoint<CreateExampleResponse, CreateExampleBody>(
  async (example) => {
    const response = await httpClient.authorized().post(EXAMPLE_ENDPOINTS.createExample(), {
      json: example,
    });
    const data = await response.json<CreateExampleResponse>();
    return data;
  },
);

export const updateExample = defineEndpoint<UpdateExampleResponse, UpdateExampleBody>(
  async ({ exampleId, ...example }) => {
    const response = await httpClient
      .authorized()
      .put(EXAMPLE_ENDPOINTS.updateExample({ exampleId }), {
        json: example,
      });
    const data = await response.json<UpdateExampleResponse>();
    return data;
  },
);

export const deleteExample = defineEndpoint<void, DeleteExampleParams>(async ({ exampleId }) => {
  await httpClient.authorized().delete(EXAMPLE_ENDPOINTS.deleteExample({ exampleId }));
});
