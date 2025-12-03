import { defineEndpoint } from '@/utils/functions';

/**
 * Configuração dos endpoints da API de Risco de Fogo
 */

export const FIRE_RISK_ENDPOINTS = {
  // Métricas dos modelos
  getModelMetrics: defineEndpoint(async () => '/api/fire-risk/metrics'),

  // Predições da semana
  getWeekPredictions: defineEndpoint(async () => '/api/fire-risk/predictions/week'),

  // Dados históricos de incêndios
  getHistoricalData: defineEndpoint(async () => '/api/fire-risk/historical'),

  // Predição para localização específica
  predictLocation: defineEndpoint(async () => '/api/fire-risk/predict'),

  // Dados para o mapa
  getMapData: defineEndpoint(async () => '/api/fire-risk/map-data'),
} as const;

// Configurações do Mapbox
export const MAPBOX_CONFIG = {
  // Substitua com sua API key do Mapbox
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',

  // Centro em Mossoró/RN
  defaultCenter: {
    longitude: -37.3444,
    latitude: -5.1894,
  } satisfies { longitude: number; latitude: number },

  defaultZoom: 10,

  style: 'mapbox://styles/mapbox/dark-v11',
} as const;

// Níveis de risco
export const RISK_LEVELS = {
  low: {
    min: 0,
    max: 25,
    color: '#10b981', // green
    label: 'Baixo',
  },
  medium: {
    min: 25,
    max: 50,
    color: '#f59e0b', // amber
    label: 'Médio',
  },
  high: {
    min: 50,
    max: 75,
    color: '#ef4444', // red
    label: 'Alto',
  },
  critical: {
    min: 75,
    max: 100,
    color: '#7f1d1d', // dark red
    label: 'Crítico',
  },
} as const;

export type RiskLevel = keyof typeof RISK_LEVELS;

export function getRiskLevel(value: number): RiskLevel {
  if (value < 25) return 'low';
  if (value < 50) return 'medium';
  if (value < 75) return 'high';
  return 'critical';
}

export function getRiskColor(value: number): string {
  const level = getRiskLevel(value);
  return RISK_LEVELS[level].color;
}

export function getRiskLabel(value: number): string {
  const level = getRiskLevel(value);
  return RISK_LEVELS[level].label;
}
