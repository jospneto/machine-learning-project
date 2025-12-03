'use client';

import { motion, Variants } from 'framer-motion';

import { useGetModelMetrics } from '@/api/fire-risk/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export function ModelMetricsCards() {
  const { data: metrics, isLoading } = useGetModelMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-cosmic-600/20 bg-galaxy-800/50 p-6 backdrop-blur-xl">
            <Skeleton className="h-40 w-full bg-cosmic-600/20" />
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const models = [
    {
      key: 'neural_network',
      data: metrics.neural_network,
      gradient: 'from-blue-600 via-blue-500 to-cyan-400',
      bgGradient: 'from-blue-500/10 to-cyan-500/5',
      glowColor: 'shadow-blue-500/20',
      borderColor: 'border-blue-500/30',
      icon: '🧠',
      accentColor: 'text-blue-400',
    },
    {
      key: 'knn',
      data: metrics.knn,
      gradient: 'from-emerald-600 via-emerald-500 to-teal-400',
      bgGradient: 'from-emerald-500/10 to-teal-500/5',
      glowColor: 'shadow-emerald-500/20',
      borderColor: 'border-emerald-500/30',
      icon: '🎯',
      accentColor: 'text-emerald-400',
    },
    {
      key: 'random_forest',
      data: metrics.random_forest,
      gradient: 'from-amber-600 via-orange-500 to-red-500',
      bgGradient: 'from-amber-500/10 to-red-500/5',
      glowColor: 'shadow-amber-500/20',
      borderColor: 'border-amber-500/30',
      icon: '🌲',
      accentColor: 'text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {models.map(
        ({ key, data, gradient, bgGradient, glowColor, borderColor, icon, accentColor }, index) => (
          <motion.div
            key={key}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants as Variants}
          >
            <Card
              className={`group relative overflow-hidden border bg-gradient-to-br ${bgGradient} ${borderColor} bg-galaxy-800/50 p-6 backdrop-blur-xl transition-all duration-500 hover:${glowColor} hover:shadow-2xl`}
            >
              {/* Glow effect on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10`}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{icon}</div>
                    <div>
                      <h3 className="font-semibold text-white">{data.model_name}</h3>
                      <span className="text-xs text-neutral-500">Modelo ML</span>
                    </div>
                  </div>
                  <div
                    className={`h-3 w-3 rounded-full bg-gradient-to-r ${gradient} shadow-lg ${glowColor}`}
                  />
                </div>

                {/* R² Score - Principal */}
                <div className="mb-6 text-center">
                  <div
                    className={`bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-bold text-transparent`}
                  >
                    {(data.test.r2 * 100).toFixed(1)}%
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">R² Score (Teste)</p>
                </div>

                {/* Métricas */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-galaxy-900/50 px-3 py-2">
                    <span className="text-sm text-neutral-400">RMSE</span>
                    <span className={`font-semibold ${accentColor}`}>
                      {data.test.rmse.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-galaxy-900/50 px-3 py-2">
                    <span className="text-sm text-neutral-400">MAE</span>
                    <span className={`font-semibold ${accentColor}`}>
                      {data.test.mae.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-xs text-neutral-500">
                    <span>Performance</span>
                    <span>{(data.test.r2 * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-galaxy-900">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${data.test.r2 * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ),
      )}
    </div>
  );
}
