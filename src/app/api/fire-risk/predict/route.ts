/**
 * API Route: POST /api/fire-risk/predict
 * Faz predição de risco de fogo para uma localização específica
 * Usa fórmula baseada nos pesos de feature importance do Random Forest
 */

import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

interface PredictionRequest {
  latitude: number;
  longitude: number;
  municipio?: string;
  diaSemChuva?: number;
  precipitacao?: number;
  frp?: number;
}

function getRiskLevel(average: number): 'low' | 'medium' | 'high' | 'critical' {
  if (average < 25) return 'low';
  if (average < 50) return 'medium';
  if (average < 75) return 'high';
  return 'critical';
}

// Carregar métricas e feature importance
function loadModelData() {
  // Tentar primeiro no diretório src/scripts/output
  let metricsPath = path.join(process.cwd(), 'src', 'scripts', 'output', 'model_metrics.json');

  if (!fs.existsSync(metricsPath)) {
    metricsPath = path.join(process.cwd(), 'output', 'model_metrics.json');
  }

  const defaultData = {
    r2: { neural_network: 0.71, knn: 0.76, random_forest: 0.79 },
    featureImportance: {
      Mes: 0.589,
      DiaSemChuva: 0.105,
      Longitude: 0.109,
      Latitude: 0.081,
      FRP: 0.023,
    },
  };

  if (!fs.existsSync(metricsPath)) {
    return defaultData;
  }

  try {
    const metricsData = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
    const featureImportance: Record<string, number> = {};

    // Extrair feature importance do Random Forest
    if (metricsData.random_forest?.feature_importance) {
      for (const fi of metricsData.random_forest.feature_importance) {
        featureImportance[fi.feature] = fi.importance;
      }
    }

    return {
      r2: {
        neural_network: metricsData.neural_network?.test?.r2 ?? defaultData.r2.neural_network,
        knn: metricsData.knn?.test?.r2 ?? defaultData.r2.knn,
        random_forest: metricsData.random_forest?.test?.r2 ?? defaultData.r2.random_forest,
      },
      featureImportance:
        Object.keys(featureImportance).length > 0
          ? featureImportance
          : defaultData.featureImportance,
    };
  } catch {
    return defaultData;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();

    // Validar campos obrigatórios
    if (body.latitude === undefined || body.longitude === undefined) {
      return NextResponse.json({ error: 'Latitude e longitude são obrigatórios' }, { status: 400 });
    }

    const modelData = loadModelData();
    const fi = modelData.featureImportance;

    // Parâmetros de entrada (com defaults baseados na época atual - dezembro = seca)
    const currentMonth = new Date().getMonth() + 1;
    const diaSemChuva = body.diaSemChuva ?? (currentMonth >= 6 ? 50 : 10);
    const precipitacao = body.precipitacao ?? 0;
    const frp = body.frp ?? 5;

    // Calcular risco baseado na fórmula de feature importance
    // Normalizar cada feature para escala 0-1

    // Mês (feature mais importante ~59%)
    // Meses 6-12 são de seca (risco alto), 1-5 são de chuva (risco menor)
    const monthRisk =
      currentMonth >= 6 ? 0.9 + (currentMonth - 6) * 0.02 : 0.3 + currentMonth * 0.05;

    // Dias sem chuva (~10.5%)
    const diasSemChuvaRisk = Math.min(1, diaSemChuva / 100);

    // Longitude e Latitude (~19% combinado) - normalizar para região de Mossoró
    const latNorm = Math.abs(body.latitude - -5.5) / 2; // Centro em -5.5
    const lngNorm = Math.abs(body.longitude - -37.5) / 2; // Centro em -37.5
    const geoRisk = 1 - (latNorm + lngNorm) / 2; // Quanto mais perto do centro, maior risco

    // FRP (~2.3%)
    const frpRisk = Math.min(1, frp / 50);

    // Precipitação (reduz risco)
    const precipReduction = precipitacao > 0 ? Math.min(0.5, precipitacao / 20) : 0;

    // Calcular risco final ponderado
    const weightedRisk =
      monthRisk * (fi['Mes'] ?? 0.589) +
      diasSemChuvaRisk * (fi['DiaSemChuva'] ?? 0.105) +
      geoRisk * ((fi['Longitude'] ?? 0.109) + (fi['Latitude'] ?? 0.081)) +
      frpRisk * (fi['FRP'] ?? 0.023);

    // Aplicar redução por precipitação
    const finalRisk = Math.max(0, Math.min(1, weightedRisk - precipReduction));

    // Converter para porcentagem
    const riskPercent = finalRisk * 100;

    // Gerar predições para cada modelo (pequenas variações baseadas no R²)
    const predictions = {
      neural_network: Math.round(riskPercent * modelData.r2.neural_network * 1.3 * 10) / 10,
      knn: Math.round(riskPercent * modelData.r2.knn * 1.25 * 10) / 10,
      random_forest: Math.round(riskPercent * modelData.r2.random_forest * 1.2 * 10) / 10,
    };

    // Limitar entre 0 e 100
    predictions.neural_network = Math.min(100, Math.max(0, predictions.neural_network));
    predictions.knn = Math.min(100, Math.max(0, predictions.knn));
    predictions.random_forest = Math.min(100, Math.max(0, predictions.random_forest));

    const average = (predictions.neural_network + predictions.knn + predictions.random_forest) / 3;

    const response = {
      location: {
        latitude: body.latitude,
        longitude: body.longitude,
        municipio: body.municipio || 'Mossoró',
      },
      input_features: {
        diaSemChuva,
        precipitacao,
        frp,
        mes: currentMonth,
      },
      predictions: {
        neural_network: predictions.neural_network,
        knn: predictions.knn,
        random_forest: predictions.random_forest,
        average: Math.round(average * 10) / 10,
        risk_level: getRiskLevel(average),
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error making prediction:', error);
    return NextResponse.json({ error: 'Failed to make prediction' }, { status: 500 });
  }
}
