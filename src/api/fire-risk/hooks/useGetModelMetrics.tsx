'use client';

import { useQuery } from '@tanstack/react-query';

import { getModelMetrics } from '../endpoints';
import type { ModelComparison } from '../types';

/**
 * Hook para buscar métricas dos modelos de ML
 */
export function useGetModelMetrics() {
  return useQuery<ModelComparison>({
    queryKey: ['fire-risk', 'metrics'],
    queryFn: getModelMetrics,
    staleTime: 1000 * 60 * 30, // 30 minutos
  });
}
