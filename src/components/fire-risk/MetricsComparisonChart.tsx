'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useGetModelMetrics } from '@/api/fire-risk/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricsComparisonChartProps {
  className?: string;
  metricType?: 'r2' | 'rmse' | 'mae';
}

const MODEL_COLORS = {
  'Neural Network': '#3b82f6',
  KNN: '#10b981',
  'Random Forest': '#f59e0b',
};

const METRIC_CONFIG = {
  r2: {
    title: 'R² Score - Coeficiente de Determinação',
    subtitle: 'Quanto mais alto, melhor o modelo explica a variância dos dados',
    icon: '📊',
    format: (v: number) => `${(v * 100).toFixed(1)}%`,
    yAxisLabel: 'R² (%)',
    multiplier: 100,
  },
  rmse: {
    title: 'RMSE - Erro Quadrático Médio',
    subtitle: 'Quanto menor, mais preciso o modelo',
    icon: '📉',
    format: (v: number) => v.toFixed(2),
    yAxisLabel: 'RMSE',
    multiplier: 1,
  },
  mae: {
    title: 'MAE - Erro Absoluto Médio',
    subtitle: 'Média dos erros absolutos das predições',
    icon: '📈',
    format: (v: number) => v.toFixed(2),
    yAxisLabel: 'MAE',
    multiplier: 1,
  },
};

export function MetricsComparisonChart({
  className,
  metricType = 'r2',
}: MetricsComparisonChartProps) {
  const { data: metrics, isLoading } = useGetModelMetrics();

  const chartData = useMemo(() => {
    if (!metrics) return [];

    const config = METRIC_CONFIG[metricType];

    return [
      {
        name: 'Neural Network',
        train: metrics.neural_network.train[metricType] * config.multiplier,
        test: metrics.neural_network.test[metricType] * config.multiplier,
        icon: '🧠',
      },
      {
        name: 'KNN',
        train: metrics.knn.train[metricType] * config.multiplier,
        test: metrics.knn.test[metricType] * config.multiplier,
        icon: '🎯',
      },
      {
        name: 'Random Forest',
        train: metrics.random_forest.train[metricType] * config.multiplier,
        test: metrics.random_forest.test[metricType] * config.multiplier,
        icon: '🌲',
      },
    ];
  }, [metrics, metricType]);

  if (isLoading) {
    return (
      <Card className={`border-cosmic-600/20 bg-galaxy-800/50 backdrop-blur-xl ${className}`}>
        <Skeleton className="h-full w-full bg-cosmic-600/20" />
      </Card>
    );
  }

  const config = METRIC_CONFIG[metricType];

  return (
    <Card
      className={`overflow-hidden border-cosmic-600/20 bg-galaxy-800/50 backdrop-blur-xl ${className}`}
    >
      <div className="flex h-full flex-col p-6">
        <div className="mb-6">
          <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-white">
            <span className="text-xl">{config.icon}</span>
            {config.title}
          </h3>
          <p className="text-sm text-neutral-400">{config.subtitle}</p>
        </div>

        <div className="min-h-[280px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tickFormatter={(value, index) => `${chartData[index]?.icon || ''} ${value}`}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                label={{
                  value: config.yAxisLabel,
                  angle: -90,
                  position: 'insideLeft',
                  style: { fontSize: '11px', fill: '#6b7280' },
                }}
                domain={metricType === 'r2' ? [0, 100] : undefined}
                tickLine={false}
                axisLine={{ stroke: '#374151' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-cosmic-600/30 bg-galaxy-800/95 p-4 shadow-2xl backdrop-blur-xl">
                      <p className="mb-3 font-semibold text-white">
                        {data.icon} {data.name}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-cosmic-400" />
                          <span className="text-neutral-400">Treino:</span>
                          <span className="ml-auto font-semibold text-cosmic-300">
                            {config.format(data.train / config.multiplier)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-fire-400" />
                          <span className="text-neutral-400">Teste:</span>
                          <span className="ml-auto font-semibold text-fire-300">
                            {config.format(data.test / config.multiplier)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
                formatter={(value) => <span className="text-neutral-300">{value}</span>}
              />
              <Bar dataKey="train" name="Treino" radius={[4, 4, 0, 0]} opacity={0.6}>
                {chartData.map((entry) => (
                  <Cell
                    key={`train-${entry.name}`}
                    fill={MODEL_COLORS[entry.name as keyof typeof MODEL_COLORS]}
                  />
                ))}
              </Bar>
              <Bar dataKey="test" name="Teste" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={`test-${entry.name}`}
                    fill={MODEL_COLORS[entry.name as keyof typeof MODEL_COLORS]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
