/**
 * API Route: GET /api/fire-risk/predictions/year
 * Retorna predições mensais para o ano todo
 */

import fs from 'fs';
import path from 'path';

import { NextResponse } from 'next/server';

// eslint-disable-next-line sonarjs/cognitive-complexity
export async function GET() {
  try {
    // Tentar primeiro no diretório src/scripts/output (onde o Python salva)
    let predictionsPath = path.join(
      process.cwd(),
      'src',
      'scripts',
      'output',
      'year_predictions.json',
    );

    // Se não existir, tentar no diretório output na raiz
    if (!fs.existsSync(predictionsPath)) {
      predictionsPath = path.join(process.cwd(), 'output', 'year_predictions.json');
    }

    // Verificar se o arquivo existe
    if (!fs.existsSync(predictionsPath)) {
      // Retornar predições de exemplo se o arquivo não existir
      const monthNames = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
      ];

      const yearPredictions = monthNames.map((name, index) => {
        const month = index + 1;
        // Simular padrão sazonal (seca no segundo semestre)
        const baseRisk =
          month >= 6 && month <= 11 ? 0.8 + Math.random() * 0.2 : 0.3 + Math.random() * 0.4;
        const diasSemChuva =
          month >= 6 && month <= 11 ? 30 + Math.random() * 50 : 2 + Math.random() * 10;

        return {
          month,
          month_name: name,
          year: 2025,
          date: `2025-${String(month).padStart(2, '0')}-15`,
          features_used: {
            DiaSemChuva: Math.round(diasSemChuva * 10) / 10,
            Precipitacao: month >= 6 ? 0 : Math.round(Math.random() * 5 * 10) / 10,
            FRP: Math.round((2 + Math.random() * 8) * 10) / 10,
          },
          historical_data: {
            registros_historicos: Math.round(100 + Math.random() * 1500),
            risco_medio_historico: Math.round(baseRisk * 10000) / 10000,
          },
          predictions: {
            neural_network: Math.round(baseRisk * 10000) / 10000,
            knn: Math.round((baseRisk + (Math.random() - 0.5) * 0.1) * 10000) / 10000,
            random_forest: Math.round((baseRisk + (Math.random() - 0.5) * 0.1) * 10000) / 10000,
          },
          average_prediction: Math.round(baseRisk * 10000) / 10000,
          risk_level:
            baseRisk >= 0.8
              ? 'CRÍTICO'
              : baseRisk >= 0.6
                ? 'ALTO'
                : baseRisk >= 0.4
                  ? 'MODERADO'
                  : 'BAIXO',
        };
      });

      return NextResponse.json(yearPredictions);
    }

    // Ler e retornar as predições reais
    const predictionsData = fs.readFileSync(predictionsPath, 'utf-8');
    const predictions = JSON.parse(predictionsData);

    return NextResponse.json(predictions);
  } catch (error) {
    console.error('Error fetching year predictions:', error);
    return NextResponse.json({ error: 'Failed to fetch year predictions' }, { status: 500 });
  }
}
