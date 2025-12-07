'use client';

import { useQuery } from '@tanstack/react-query';

import { getYearPredictions } from '../endpoints';
import type { YearPrediction } from '../types';

/**
 * Hook para buscar predições mensais do ano
 */
export function useGetYearPredictions() {
  return useQuery<YearPrediction[]>({
    queryKey: ['fire-risk', 'predictions', 'year'],
    queryFn: getYearPredictions,
    staleTime: 1000 * 60 * 60, // 1 hora
    refetchInterval: 1000 * 60 * 60 * 2, // Atualizar a cada 2 horas
  });
}
