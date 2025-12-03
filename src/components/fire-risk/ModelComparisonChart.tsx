'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useGetWeekPredictions } from '@/api/fire-risk/hooks';
import type { ChartDataPoint } from '@/api/fire-risk/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ModelComparisonChartProps {
  className?: string;
}

export function ModelComparisonChart({ className }: ModelComparisonChartProps) {
  const { data: weekPredictions, isLoading } = useGetWeekPredictions();

  const chartData = useMemo(() => {
    if (!weekPredictions) return [];

    return weekPredictions.map((prediction): ChartDataPoint => {
      const { neural_network, knn, random_forest } = prediction.predictions;
      const average = (neural_network + knn + random_forest) / 3;

      return {
        name: new Date(prediction.date).toLocaleDateString('pt-BR', {
          weekday: 'short',
          day: 'numeric',
        }),
        neural_network,
        knn,
        random_forest,
        average,
      };
    });
  }, [weekPredictions]);

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
            <span className="text-xl">📈</span>
            Predições - Próximos 7 Dias
          </h3>
          <p className="text-sm text-neutral-400">
            Comparação das predições de risco entre os modelos de ML
          </p>
        </div>

        <div className="min-h-[300px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorNN" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorKNN" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
                label={{
                  value: 'Risco (%)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: '11px', fill: '#6b7280' },
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  return (
                    <div className="rounded-xl border border-cosmic-600/30 bg-galaxy-800/95 p-4 shadow-2xl backdrop-blur-xl">
                      <p className="mb-3 font-semibold text-white">{payload[0].payload.name}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 py-1 text-sm">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-neutral-400">
                            {entry.name === 'neural_network'
                              ? '🧠 Neural Network'
                              : entry.name === 'knn'
                                ? '🎯 KNN'
                                : '🌲 Random Forest'}
                          </span>
                          <span className="ml-auto font-semibold text-white">
                            {Number(entry.value).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    neural_network: '🧠 Neural Network',
                    knn: '🎯 KNN',
                    random_forest: '🌲 Random Forest',
                  };
                  return <span className="text-neutral-300">{labels[value] || value}</span>;
                }}
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="neural_network"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorNN)"
              />
              <Area
                type="monotone"
                dataKey="knn"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorKNN)"
              />
              <Area
                type="monotone"
                dataKey="random_forest"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRF)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Estatísticas rápidas */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-cosmic-600/20 pt-6">
          {chartData.length > 0 && (
            <>
              <div className="text-center">
                <p className="mb-1 text-xs text-neutral-500">Média 7 dias</p>
                <p className="bg-gradient-to-r from-cosmic-400 to-cosmic-300 bg-clip-text text-xl font-bold text-transparent">
                  {(chartData.reduce((acc, d) => acc + d.average, 0) / chartData.length).toFixed(1)}
                  %
                </p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-xs text-neutral-500">Pico estimado</p>
                <p className="bg-gradient-to-r from-fire-500 to-ember-400 bg-clip-text text-xl font-bold text-transparent">
                  {Math.max(...chartData.map((d) => d.average)).toFixed(1)}%
                </p>
              </div>
              <div className="text-center">
                <p className="mb-1 text-xs text-neutral-500">Tendência</p>
                <p className="text-xl font-bold">
                  {chartData[chartData.length - 1].average > chartData[0].average ? (
                    <span className="text-fire-400">📈 Alta</span>
                  ) : (
                    <span className="text-emerald-400">📉 Baixa</span>
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
