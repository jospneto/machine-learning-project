import { BaseEntity, GetManyResponse } from '@/types';

export type Example = BaseEntity;

export type GetExamplesResponse = GetManyResponse<Example>;

export type GetExamplesParams = {
  skip: number;
  take: number;
};

export type GetExampleByIdParams = {
  exampleId: string;
};

export type DeleteExampleParams = {
  exampleId: string;
};

export type GetExampleByIdResponse = Example;

export type CreateExampleBody = Omit<Example, 'id' | 'createdAt' | 'updatedAt'>;

export type CreateExampleResponse = Example;

export type UpdateExampleBody = Partial<Omit<Example, 'id' | 'createdAt' | 'updatedAt'>> & {
  exampleId: Example['id'];
};

export type UpdateExampleResponse = Example;
