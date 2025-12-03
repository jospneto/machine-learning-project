'use client';

import { useQuery } from '@tanstack/react-query';

import { getWeekPredictions } from '../endpoints';
import type { WeekPrediction } from '../types';

/**
 * Hook para buscar predições da próxima semana
 */
export function useGetWeekPredictions() {
  return useQuery<WeekPrediction[]>({
    queryKey: ['fire-risk', 'predictions', 'week'],
    queryFn: getWeekPredictions,
    staleTime: 1000 * 60 * 15, // 15 minutos
    refetchInterval: 1000 * 60 * 30, // Atualizar a cada 30 minutos
  });
}
