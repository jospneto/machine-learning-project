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

import { useGetYearPredictions } from '@/api/fire-risk/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface YearPredictionsChartProps {
  className?: string;
}

const RISK_COLORS = {
  CRÍTICO: '#ef4444',
  ALTO: '#f97316',
  MODERADO: '#eab308',
  BAIXO: '#22c55e',
  MÍNIMO: '#06b6d4',
};

const RISK_BG_COLORS = {
  CRÍTICO: 'bg-red-500/20 border-red-500/40 text-red-400',
  ALTO: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
  MODERADO: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400',
  BAIXO: 'bg-green-500/20 border-green-500/40 text-green-400',
  MÍNIMO: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
};

export function YearPredictionsChart({ className }: YearPredictionsChartProps) {
  const { data: yearPredictions, isLoading } = useGetYearPredictions();

  const chartData = useMemo(() => {
    if (!yearPredictions) return [];

    return yearPredictions.map((prediction) => ({
      name: prediction.month_name.substring(0, 3),
      fullName: prediction.month_name,
      month: prediction.month,
      neural_network: prediction.predictions.neural_network * 100,
      knn: prediction.predictions.knn * 100,
      random_forest: prediction.predictions.random_forest * 100,
      average: prediction.average_prediction * 100,
      risk_level: prediction.risk_level,
      diasSemChuva: prediction.features_used.DiaSemChuva,
      registros: prediction.historical_data.registros_historicos,
      riscoHistorico: prediction.historical_data.risco_medio_historico * 100,
    }));
  }, [yearPredictions]);

  const currentMonth = new Date().getMonth() + 1;

  const stats = useMemo(() => {
    if (!chartData.length) return null;

    const avgRisk = chartData.reduce((acc, d) => acc + d.average, 0) / chartData.length;
    const criticalMonths = chartData.filter((d) => d.risk_level === 'CRÍTICO').length;
    const maxMonth = chartData.reduce(
      (max, d) => (d.average > max.average ? d : max),
      chartData[0],
    );
    const minMonth = chartData.reduce(
      (min, d) => (d.average < min.average ? d : min),
      chartData[0],
    );

    return { avgRisk, criticalMonths, maxMonth, minMonth };
  }, [chartData]);

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
            <span className="text-xl">📅</span>
            Predições Anuais - 2025
          </h3>
          <p className="text-sm text-neutral-400">Risco de fogo previsto para cada mês do ano</p>
        </div>

        <div className="min-h-[350px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;

                  return (
                    <div className="rounded-xl border border-cosmic-600/30 bg-galaxy-800/95 p-4 shadow-2xl backdrop-blur-xl">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <p className="font-semibold text-white">{data.fullName} 2025</p>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_BG_COLORS[data.risk_level as keyof typeof RISK_BG_COLORS]}`}
                        >
                          {data.risk_level}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-neutral-400">🧠 Neural Network</span>
                          <span className="font-semibold text-blue-400">
                            {data.neural_network.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-neutral-400">🎯 KNN</span>
                          <span className="font-semibold text-emerald-400">
                            {data.knn.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-neutral-400">🌲 Random Forest</span>
                          <span className="font-semibold text-amber-400">
                            {data.random_forest.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 border-t border-cosmic-600/30 pt-3 text-xs text-neutral-500">
                        <div className="flex justify-between">
                          <span>Dias sem chuva:</span>
                          <span className="text-fire-400">{data.diasSemChuva} dias</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Registros históricos:</span>
                          <span className="text-cosmic-400">{data.registros}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    average: '📊 Média dos Modelos',
                  };
                  return <span className="text-neutral-300">{labels[value] || value}</span>;
                }}
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="average" name="average" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={RISK_COLORS[entry.risk_level as keyof typeof RISK_COLORS]}
                    opacity={entry.month === currentMonth ? 1 : 0.7}
                    stroke={entry.month === currentMonth ? '#fff' : 'transparent'}
                    strokeWidth={entry.month === currentMonth ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estatísticas resumidas */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-cosmic-600/20 pt-6 sm:grid-cols-4">
            <div className="text-center">
              <p className="mb-1 text-xs text-neutral-500">Média Anual</p>
              <p className="bg-gradient-to-r from-cosmic-400 to-cosmic-300 bg-clip-text text-xl font-bold text-transparent">
                {stats.avgRisk.toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs text-neutral-500">Meses Críticos</p>
              <p className="text-xl font-bold text-red-400">{stats.criticalMonths}</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs text-neutral-500">Maior Risco</p>
              <p className="text-xl font-bold text-fire-400">
                {stats.maxMonth.fullName.substring(0, 3)}
              </p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs text-neutral-500">Menor Risco</p>
              <p className="text-xl font-bold text-emerald-400">
                {stats.minMonth.fullName.substring(0, 3)}
              </p>
            </div>
          </div>
        )}

        {/* Legenda de níveis de risco */}
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Object.entries(RISK_COLORS).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1.5 text-xs text-neutral-400">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
              <span>{level}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
