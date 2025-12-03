/**
 * API Route: GET /api/fire-risk/predictions/week
 * Retorna predições para a próxima semana
 */

import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Caminho para o arquivo de predições gerado pelo script Python
    const predictionsPath = path.join(process.cwd(), 'output', 'week_predictions.json');

    // Verificar se o arquivo existe
    if (!fs.existsSync(predictionsPath)) {
      // Retornar predições de exemplo se o arquivo não existir
      const today = new Date();
      const weekPredictions = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        return {
          date: date.toISOString().split('T')[0],
          day_name: date.toLocaleDateString('pt-BR', { weekday: 'long' }),
          predictions: {
            neural_network: 30 + Math.random() * 40,
            knn: 28 + Math.random() * 42,
            random_forest: 32 + Math.random() * 38,
          },
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
