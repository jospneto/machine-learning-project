'use client';

import { useMutation } from '@tanstack/react-query';

import { predictLocation } from '../endpoints';
import type { FireRiskPredictionRequest, FireRiskPredictionResponse } from '../types';

/**
 * Hook para fazer predição de risco para uma localização específica
 */
export function usePredictLocation() {
  return useMutation<FireRiskPredictionResponse, Error, FireRiskPredictionRequest>({
    mutationFn: predictLocation,
  });
}
