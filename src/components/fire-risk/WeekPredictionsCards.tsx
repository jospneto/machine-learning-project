'use client';

import { motion } from 'framer-motion';

import { useGetWeekPredictions } from '@/api/fire-risk/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface WeekPredictionsCardsProps {
  className?: string;
}

const RISK_STYLES = {
  CRÍTICO: {
    bg: 'from-red-600/30 to-red-900/20',
    border: 'border-red-500/50',
    text: 'text-red-400',
    icon: '🔥',
  },
  ALTO: {
    bg: 'from-orange-600/30 to-orange-900/20',
    border: 'border-orange-500/50',
    text: 'text-orange-400',
    icon: '⚠️',
  },
  MODERADO: {
    bg: 'from-yellow-600/30 to-yellow-900/20',
    border: 'border-yellow-500/50',
    text: 'text-yellow-400',
    icon: '🟡',
  },
  BAIXO: {
    bg: 'from-green-600/30 to-green-900/20',
    border: 'border-green-500/50',
    text: 'text-green-400',
    icon: '✅',
  },
  MÍNIMO: {
    bg: 'from-cyan-600/30 to-cyan-900/20',
    border: 'border-cyan-500/50',
    text: 'text-cyan-400',
    icon: '💧',
  },
};

export function WeekPredictionsCards({ className }: WeekPredictionsCardsProps) {
  const { data: weekPredictions, isLoading } = useGetWeekPredictions();

  if (isLoading) {
    return (
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 ${className}`}>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-[180px] bg-cosmic-600/20" />
        ))}
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-white">
          <span className="text-xl">📆</span>
          Previsão Semanal
        </h3>
        <p className="text-sm text-neutral-400">
          Risco de fogo para os próximos 7 dias em Mossoró/RN
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {weekPredictions?.map((prediction, index) => {
          const isToday = prediction.date === today;
          const riskStyle = RISK_STYLES[prediction.risk_level] || RISK_STYLES.MODERADO;
          const avgRisk = prediction.average_prediction * 100;

          return (
            <motion.div
              key={prediction.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`relative overflow-hidden border bg-gradient-to-br backdrop-blur-xl transition-all hover:scale-[1.02] ${riskStyle.bg} ${riskStyle.border} ${isToday ? 'ring-2 ring-cosmic-400 ring-offset-2 ring-offset-galaxy-900' : ''}`}
              >
                {isToday && (
                  <div className="absolute top-2 right-2">
                    <span className="rounded-full bg-cosmic-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      HOJE
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <div className="mb-3">
                    <p className="text-xs font-medium text-neutral-400">
                      {new Date(prediction.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </p>
                    <p className="font-semibold text-white">{prediction.day_name}</p>
                  </div>

                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl">{riskStyle.icon}</span>
                    <div>
                      <p className={`text-2xl font-bold ${riskStyle.text}`}>
                        {avgRisk.toFixed(0)}%
                      </p>
                      <p className={`text-xs font-medium ${riskStyle.text}`}>
                        {prediction.risk_level}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-white/10 pt-2 text-[10px]">
                    <div className="flex justify-between text-neutral-400">
                      <span>Dias s/ chuva</span>
                      <span className="text-fire-400">{prediction.features_used.DiaSemChuva}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>FRP</span>
                      <span className="text-cosmic-400">{prediction.features_used.FRP}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
