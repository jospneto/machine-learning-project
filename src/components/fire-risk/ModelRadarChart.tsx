'use client';

import { useMemo } from 'react';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { useGetModelMetrics } from '@/api/fire-risk/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ModelRadarChartProps {
  className?: string;
}

export function ModelRadarChart({ className }: ModelRadarChartProps) {
  const { data: metrics, isLoading } = useGetModelMetrics();

  const chartData = useMemo(() => {
    if (!metrics) return [];

    const maxRmse = Math.max(
      metrics.neural_network.test.rmse,
      metrics.knn.test.rmse,
      metrics.random_forest.test.rmse,
    );
    const maxMae = Math.max(
      metrics.neural_network.test.mae,
      metrics.knn.test.mae,
      metrics.random_forest.test.mae,
    );

    return [
      {
        metric: 'R² Score',
        'Neural Network': metrics.neural_network.test.r2 * 100,
        KNN: metrics.knn.test.r2 * 100,
        'Random Forest': metrics.random_forest.test.r2 * 100,
      },
      {
        metric: 'Precisão RMSE',
        'Neural Network': ((maxRmse - metrics.neural_network.test.rmse) / maxRmse) * 100,
        KNN: ((maxRmse - metrics.knn.test.rmse) / maxRmse) * 100,
        'Random Forest': ((maxRmse - metrics.random_forest.test.rmse) / maxRmse) * 100,
      },
      {
        metric: 'Precisão MAE',
        'Neural Network': ((maxMae - metrics.neural_network.test.mae) / maxMae) * 100,
        KNN: ((maxMae - metrics.knn.test.mae) / maxMae) * 100,
        'Random Forest': ((maxMae - metrics.random_forest.test.mae) / maxMae) * 100,
      },
      {
        metric: 'Generalização',
        'Neural Network': Math.max(
          0,
          100 - Math.abs(metrics.neural_network.train.r2 - metrics.neural_network.test.r2) * 200,
        ),
        KNN: Math.max(0, 100 - Math.abs(metrics.knn.train.r2 - metrics.knn.test.r2) * 200),
        'Random Forest': Math.max(
          0,
          100 - Math.abs(metrics.random_forest.train.r2 - metrics.random_forest.test.r2) * 200,
        ),
      },
    ];
  }, [metrics]);

  if (isLoading) {
    return (
      <Card className={`border-cosmic-600/20 bg-galaxy-800/50 backdrop-blur-xl ${className}`}>
        <Skeleton className="h-full w-full bg-cosmic-600/20" />
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
            <span className="text-xl">🎯</span>
            Comparação Multi-dimensional
          </h3>
          <p className="text-sm text-neutral-400">Análise de performance normalizada dos modelos</p>
        </div>

        <div className="min-h-[320px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#374151" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="metric"
                style={{ fontSize: '11px' }}
                tick={{ fill: '#9ca3af' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                style={{ fontSize: '10px' }}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: '#6b7280' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  return (
                    <div className="rounded-xl border border-cosmic-600/30 bg-galaxy-800/95 p-4 shadow-2xl backdrop-blur-xl">
                      <p className="mb-3 font-semibold text-white">{payload[0].payload.metric}</p>
                      <div className="space-y-2 text-sm">
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-neutral-400">{entry.name}:</span>
                            <span className="ml-auto font-semibold text-white">
                              {Number(entry.value).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                formatter={(value) => <span className="text-neutral-300">{value}</span>}
              />
              <Radar
                name="🧠 Neural Network"
                dataKey="Neural Network"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="🎯 KNN"
                dataKey="KNN"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Radar
                name="🌲 Random Forest"
                dataKey="Random Forest"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-4 border-t border-cosmic-600/20 pt-4">
          <p className="text-xs text-neutral-500">
            💡 <strong className="text-neutral-400">Dica:</strong> Modelos com área maior têm melhor
            performance geral. A métrica Generalização indica a capacidade de evitar overfitting.
          </p>
        </div>
      </div>
    </Card>
  );
}
