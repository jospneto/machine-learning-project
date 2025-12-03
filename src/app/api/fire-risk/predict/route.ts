/**
 * API Route: POST /api/fire-risk/predict
 * Faz predição de risco de fogo para uma localização específica
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

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();

    // Validar campos obrigatórios
    if (body.latitude === undefined || body.longitude === undefined) {
      return NextResponse.json(
        { error: 'Latitude e longitude são obrigatórios' },
        { status: 400 }
      );
    }

    // Carregar métricas dos modelos para simular predição
    const metricsPath = path.join(process.cwd(), 'output', 'model_metrics.json');
    let modelAccuracy = {
      neural_network: 0.526,
      knn: 0.512,
      random_forest: 0.71,
    };

    if (fs.existsSync(metricsPath)) {
      const metricsData = JSON.parse(fs.readFileSync(metricsPath, 'utf-8'));
      modelAccuracy = {
        neural_network: metricsData.neural_network.test.r2,
        knn: metricsData.knn.test.r2,
        random_forest: metricsData.random_forest.test.r2,
      };
    }

    // Simular predição baseada nos parâmetros de entrada
    // Em um cenário real, isso chamaria o modelo Python
    const diaSemChuva = body.diaSemChuva ?? 10;
    const precipitacao = body.precipitacao ?? 0;
    const frp = body.frp ?? 15;

    // Fator base de risco baseado em dias sem chuva (feature mais importante: 57.5%)
    const baseRisk = Math.min(100, (diaSemChuva / 30) * 100 * 0.575);

    // Fator de precipitação (reduz risco)
    const precipFactor = Math.max(0, 1 - precipitacao / 50) * 0.234;

    // Fator FRP (aumenta risco)
    const frpFactor = Math.min(1, frp / 100) * 0.089;

    // Calcular predições para cada modelo com variação baseada na acurácia
    const basePrediction = baseRisk * precipFactor + frpFactor * 100;

    const predictions = {
      neural_network: Math.min(100, Math.max(0, basePrediction * (0.9 + Math.random() * 0.2) * (1 + modelAccuracy.neural_network * 0.3))),
      knn: Math.min(100, Math.max(0, basePrediction * (0.85 + Math.random() * 0.2) * (1 + modelAccuracy.knn * 0.2))),
      random_forest: Math.min(100, Math.max(0, basePrediction * (0.95 + Math.random() * 0.1) * (1 + modelAccuracy.random_forest * 0.1))),
    };

    const average = (predictions.neural_network + predictions.knn + predictions.random_forest) / 3;

    const response = {
      location: {
        latitude: body.latitude,
        longitude: body.longitude,
        municipio: body.municipio || 'Mossoró',
      },
      predictions: {
        neural_network: predictions.neural_network,
        knn: predictions.knn,
        random_forest: predictions.random_forest,
        average,
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

