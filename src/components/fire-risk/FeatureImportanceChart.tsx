'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useGetModelMetrics } from '@/api/fire-risk/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface FeatureImportanceChartProps {
  className?: string;
}

// Cores gradiente para importância (do fogo ao roxo)
const getImportanceColor = (importance: number) => {
  if (importance > 0.4) return '#ef4444'; // vermelho fogo
  if (importance > 0.2) return '#f59e0b'; // amber/ember
  if (importance > 0.05) return '#8b5cf6'; // roxo
  return '#6b7280'; // cinza neutro
};

// Labels mais legíveis para as features
const FEATURE_LABELS: Record<string, string> = {
  DiaSemChuva: '☔ Dias sem Chuva',
  Precipitacao: '🌧️ Precipitação',
  FRP: '🔥 FRP (Potência Radiativa)',
  Latitude: '📍 Latitude',
  Longitude: '📍 Longitude',
  Dia: '📅 Dia do Mês',
  Mes: '🗓️ Mês',
  Hora: '⏰ Hora',
  DiaSemana: '📆 Dia da Semana',
  Municipio_encoded: '🏙️ Município',
  Bioma_encoded: '🌿 Bioma',
};

export function FeatureImportanceChart({ className }: FeatureImportanceChartProps) {
  const { data: metrics, isLoading } = useGetModelMetrics();

  const chartData = useMemo(() => {
    if (!metrics?.random_forest?.feature_importance) return [];

    return metrics.random_forest.feature_importance
      .filter((f) => f.importance > 0)
      .sort((a, b) => b.importance - a.importance)
      .map((f) => ({
        feature: FEATURE_LABELS[f.feature] || f.feature,
        rawFeature: f.feature,
        importance: f.importance * 100,
        rawImportance: f.importance,
      }));
  }, [metrics]);

  if (isLoading) {
    return (
      <Card className={`border-cosmic-600/20 bg-galaxy-800/50 backdrop-blur-xl ${className}`}>
        <Skeleton className="h-full w-full bg-cosmic-600/20" />
      </Card>
    );
  }

  if (!chartData.length) {
    return (
      <Card className={`border-cosmic-600/20 bg-galaxy-800/50 backdrop-blur-xl ${className}`}>
        <div className="flex h-full items-center justify-center p-6 text-neutral-400">
          Dados de importância de features não disponíveis
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden border-cosmic-600/20 bg-galaxy-800/50 backdrop-blur-xl ${className}`}
    >
      <div className="flex h-full flex-col p-6">
        <div className="mb-6">
          <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-white">
            <span className="text-xl">🌲</span>
            Feature Importance - Random Forest
          </h3>
          <p className="text-sm text-neutral-400">
            Variáveis mais importantes para a predição de risco de fogo
          </p>
        </div>

        <div className="min-h-[280px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              barSize={20}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.3}
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                domain={[0, 'dataMax']}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis
                dataKey="feature"
                type="category"
                width={160}
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-cosmic-600/30 bg-galaxy-800/95 p-4 shadow-2xl backdrop-blur-xl">
                      <p className="mb-2 font-semibold text-white">{data.feature}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-400">Importância:</span>
                        <span
                          className="text-lg font-bold"
                          style={{ color: getImportanceColor(data.rawImportance) }}
                        >
                          {data.importance.toFixed(1)}%
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-neutral-500">
                        {data.rawImportance > 0.4
                          ? '🔥 Altamente influente'
                          : data.rawImportance > 0.2
                            ? '⚡ Influência moderada'
                            : '💫 Baixa influência'}
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="importance" radius={[0, 6, 6, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.rawFeature} fill={getImportanceColor(entry.rawImportance)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda */}
        <div className="mt-4 flex flex-wrap gap-4 border-t border-cosmic-600/20 pt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-fire-500" />
            <span className="text-neutral-400">Crítico (&gt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-ember-500" />
            <span className="text-neutral-400">Alto (20-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-cosmic-500" />
            <span className="text-neutral-400">Médio (5-20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-neutral-500" />
            <span className="text-neutral-400">Baixo (&lt;5%)</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
