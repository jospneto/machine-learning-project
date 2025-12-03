'use client';

import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { getMapData } from '../endpoints';
import type { MapDataPoint } from '../types';

interface UseGetMapDataOptions
  extends Omit<UseQueryOptions<MapDataPoint[]>, 'queryKey' | 'queryFn'> {
  queryKey?: [string, string, Record<string, any>];
}

/**
 * Hook para buscar dados do mapa
 */
export function useGetMapData(options?: UseGetMapDataOptions) {
  const queryKey = options?.queryKey || ['fire-risk', 'map-data', {}];
  const params = queryKey[2];

  return useQuery<MapDataPoint[]>({
    ...options,
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey,
    queryFn: () => getMapData(params),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 1000 * 60 * 10, // Atualizar a cada 10 minutos
  });
}
