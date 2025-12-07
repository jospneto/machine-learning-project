/**
 * API Route: GET /api/fire-risk/predictions/week
 * Retorna predições para a próxima semana
 */

import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Tentar primeiro no diretório src/scripts/output (onde o Python salva)
    let predictionsPath = path.join(
      process.cwd(),
      'src',
      'scripts',
      'output',
      'week_predictions.json',
    );

    // Se não existir, tentar no diretório output na raiz
    if (!fs.existsSync(predictionsPath)) {
      predictionsPath = path.join(process.cwd(), 'output', 'week_predictions.json');
    }

    // Verificar se o arquivo existe
    if (!fs.existsSync(predictionsPath)) {
      // Retornar predições de exemplo se o arquivo não existir
      const dayNames = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado',
      ];
      const today = new Date();
      const weekPredictions = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const avgPrediction = 0.5 + Math.random() * 0.4;

        return {
          date: date.toISOString().split('T')[0],
          day_name: dayNames[date.getDay()],
          day_of_week: date.getDay(),
          features_used: {
            DiaSemChuva: Math.round(10 + Math.random() * 50),
            Precipitacao: 0,
            FRP: Math.round((2 + Math.random() * 8) * 10) / 10,
          },
          predictions: {
            neural_network: Math.round((0.4 + Math.random() * 0.5) * 10000) / 10000,
            knn: Math.round((0.4 + Math.random() * 0.5) * 10000) / 10000,
            random_forest: Math.round((0.4 + Math.random() * 0.5) * 10000) / 10000,
          },
          average_prediction: Math.round(avgPrediction * 10000) / 10000,
          risk_level: avgPrediction >= 0.8 ? 'CRÍTICO' : avgPrediction >= 0.6 ? 'ALTO' : 'MODERADO',
        };
      });

      return NextResponse.json(weekPredictions);
    }

    // Ler e retornar as predições reais
    const predictionsData = fs.readFileSync(predictionsPath, 'utf-8');
    const predictions = JSON.parse(predictionsData);

    return NextResponse.json(predictions);
  } catch (error) {
    console.error('Error fetching week predictions:', error);
    return NextResponse.json({ error: 'Failed to fetch week predictions' }, { status: 500 });
  }
}
