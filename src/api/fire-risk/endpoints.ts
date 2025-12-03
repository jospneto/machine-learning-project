/**
 * Funções para chamar os endpoints da API de Risco de Fogo
 * Usando fetch nativo para rotas internas do Next.js
 */

import type {
  ModelComparison,
  WeekPrediction,
  FireIncident,
  FireRiskPredictionRequest,
  FireRiskPredictionResponse,
  MapDataPoint,
} from './types';

// URLs dos endpoints internos
const ENDPOINTS = {
  metrics: '/api/fire-risk/metrics',
  weekPredictions: '/api/fire-risk/predictions/week',
  historicalData: '/api/fire-risk/historical',
  predict: '/api/fire-risk/predict',
  mapData: '/api/fire-risk/map-data',
} as const;

/**
 * Helper para obter a URL base
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

/**
 * Helper para fazer requisições GET internas
 */
async function fetchInternal<T>(endpoint: string): Promise<T> {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Busca métricas dos modelos de ML
 */
export async function getModelMetrics(): Promise<ModelComparison> {
  return fetchInternal<ModelComparison>(ENDPOINTS.metrics);
}

/**
 * Busca predições para a próxima semana
 */
export async function getWeekPredictions(): Promise<WeekPrediction[]> {
  return fetchInternal<WeekPrediction[]>(ENDPOINTS.weekPredictions);
}

/**
 * Busca dados históricos de incêndios
 */
export async function getHistoricalData(params?: {
  municipio?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<FireIncident[]> {
  const searchParams = new URLSearchParams();
  if (params?.municipio) searchParams.set('municipio', params.municipio);
  if (params?.startDate) searchParams.set('startDate', params.startDate);
  if (params?.endDate) searchParams.set('endDate', params.endDate);
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const query = searchParams.toString();
  const endpoint = query ? `${ENDPOINTS.historicalData}?${query}` : ENDPOINTS.historicalData;

  return fetchInternal<FireIncident[]>(endpoint);
}

/**
 * Faz predição de risco para uma localização específica
 */
export async function predictLocation(
  data: FireRiskPredictionRequest,
): Promise<FireRiskPredictionResponse> {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}${ENDPOINTS.predict}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Busca dados para exibição no mapa
 */
export async function getMapData(params?: {
  bounds?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  municipio?: string;
}): Promise<MapDataPoint[]> {
  const searchParams = new URLSearchParams();
  if (params?.municipio) searchParams.set('municipio', params.municipio);
  if (params?.bounds) {
    searchParams.set('north', params.bounds.north.toString());
    searchParams.set('south', params.bounds.south.toString());
    searchParams.set('east', params.bounds.east.toString());
    searchParams.set('west', params.bounds.west.toString());
  }

  const query = searchParams.toString();
  const endpoint = query ? `${ENDPOINTS.mapData}?${query}` : ENDPOINTS.mapData;

  return fetchInternal<MapDataPoint[]>(endpoint);
}
