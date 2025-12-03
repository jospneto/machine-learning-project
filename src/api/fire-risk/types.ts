/**
 * Tipos e interfaces para API de Risco de Fogo
 */

export interface FireRiskMetrics {
  model_name: string;
  train: {
    mse: number;
    rmse: number;
    mae: number;
    r2: number;
  };
  test: {
    mse: number;
    rmse: number;
    mae: number;
    r2: number;
  };
  feature_importance?: Array<{
    feature: string;
    importance: number;
  }>;
}

export interface ModelComparison {
  neural_network: FireRiskMetrics;
  knn: FireRiskMetrics;
  random_forest: FireRiskMetrics;
}

export interface WeekPrediction {
  date: string;
  day_name: string;
  predictions: {
    neural_network: number;
    knn: number;
    random_forest: number;
  };
}

export interface FireIncident {
  id: string;
  dataHora: string;
  satelite: string;
  pais: string;
  estado: string;
  municipio: string;
  bioma: string;
  diaSemChuva: number;
  precipitacao: number;
  riscoFogo: number;
  frp: number;
  latitude: number;
  longitude: number;
}

export interface FireRiskPredictionRequest {
  latitude: number;
  longitude: number;
  municipio?: string;
  diaSemChuva?: number;
  precipitacao?: number;
  frp?: number;
}

export interface FireRiskPredictionResponse {
  location: {
    latitude: number;
    longitude: number;
    municipio: string;
  };
  predictions: {
    neural_network: number;
    knn: number;
    random_forest: number;
    average: number;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
  };
  timestamp: string;
}

export interface MapDataPoint {
  id: string;
  latitude: number;
  longitude: number;
  riskLevel: number;
  municipio: string;
  dataHora: string;
  predictions?: {
    neural_network: number;
    knn: number;
    random_forest: number;
  };
}

export interface ChartDataPoint {
  name: string;
  neural_network: number;
  knn: number;
  random_forest: number;
  average: number;
}
