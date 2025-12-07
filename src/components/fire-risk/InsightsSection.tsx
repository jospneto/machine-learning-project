'use client';

import { useMemo } from 'react';

import { useGetModelMetrics } from '@/api/fire-risk/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface InsightsSectionProps {
  className?: string;
}

export function InsightsSection({ className }: InsightsSectionProps) {
  const { data: metrics, isLoading } = useGetModelMetrics();

  const insights = useMemo(() => {
    if (!metrics) return null;

    const nn = metrics.neural_network;
    const knn = metrics.knn;
    const rf = metrics.random_forest;

    // Encontrar o melhor modelo (maior R²)
    const models = [
      { name: 'Neural Network', key: 'neural_network', metrics: nn, icon: '🧠', color: 'blue' },
      { name: 'KNN', key: 'knn', metrics: knn, icon: '🎯', color: 'emerald' },
      { name: 'Random Forest', key: 'random_forest', metrics: rf, icon: '🌲', color: 'amber' },
    ];

    const bestModel = models.reduce((best, model) =>
      model.metrics.test.r2 > best.metrics.test.r2 ? model : best,
    );

    // Feature importance (se disponível)
    const topFeature = rf.feature_importance?.[0];

    // Buscar feature DiaSemChuva especificamente
    const diasSemChuvaFeature = rf.feature_importance?.find((f) => f.feature === 'DiaSemChuva');

    // Calcular importância total das features climáticas
    const climaticFeatures = ['Mes', 'DiaSemChuva', 'Precipitacao'];
    const climaticImportance =
      rf.feature_importance
        ?.filter((f) => climaticFeatures.includes(f.feature))
        .reduce((acc, f) => acc + f.importance, 0) || 0;

    return {
      models,
      bestModel,
      topFeature,
      diasSemChuvaFeature,
      climaticImportance: (climaticImportance * 100).toFixed(1),
      nnR2: (nn.test.r2 * 100).toFixed(1),
      knnR2: (knn.test.r2 * 100).toFixed(1),
      rfR2: (rf.test.r2 * 100).toFixed(1),
      knnTrainR2: (knn.train.r2 * 100).toFixed(0),
      topFeatureImportance: topFeature ? (topFeature.importance * 100).toFixed(1) : null,
      diasSemChuvaImportance: diasSemChuvaFeature
        ? (diasSemChuvaFeature.importance * 100).toFixed(1)
        : null,
    };
  }, [metrics]);

  if (isLoading) {
    return (
      <Card className={`border-cosmic-600/30 bg-galaxy-800/50 backdrop-blur-xl ${className}`}>
        <div className="p-8">
          <Skeleton className="mb-6 h-8 w-64 bg-cosmic-600/20" />
          <div className="grid gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 bg-cosmic-600/20" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (!insights) return null;

  return (
    <Card
      className={`overflow-hidden border-cosmic-600/30 bg-gradient-to-br from-galaxy-800/80 to-cosmic-900/50 backdrop-blur-xl ${className}`}
    >
      <div className="p-8">
        <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
          <span className="text-amber-400">💡</span> Insights e Conclusões
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Neural Network */}
          <div className="group space-y-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 transition-all hover:border-blue-500/40 hover:bg-blue-500/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧠</span>
              <h3 className="font-semibold text-white">Neural Network</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              R² de <strong className="text-blue-400">{insights.nnR2}%</strong> no teste. Captura
              padrões não-lineares nos dados, mas apresenta maior variância nas predições.
            </p>
          </div>

          {/* KNN */}
          <div className="group space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <h3 className="font-semibold text-white">KNN</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              R² de <strong className="text-emerald-400">{insights.knnR2}%</strong> no teste.
              {Number(insights.knnTrainR2) >= 95 ? (
                <>
                  {' '}
                  Apresenta overfitting significativo (R²={insights.knnTrainR2}% treino), indicando
                  memorização dos dados.
                </>
              ) : (
                <> Bom equilíbrio entre treino e teste.</>
              )}
            </p>
          </div>

          {/* Random Forest */}
          <div className="group space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 transition-all hover:border-amber-500/40 hover:bg-amber-500/10">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌲</span>
              <h3 className="font-semibold text-white">Random Forest</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              {insights.bestModel.key === 'random_forest' && (
                <strong className="text-amber-400">Melhor modelo</strong>
              )}{' '}
              com R² de <strong className="text-amber-400">{insights.rfR2}%</strong>.
              {insights.topFeature && (
                <>
                  {' '}
                  Identifica &quot;{insights.topFeature.feature}&quot; como feature principal (
                  {insights.topFeatureImportance}%).
                </>
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-cosmic-500/30 bg-gradient-to-r from-cosmic-600/10 to-fire-600/10 p-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <span className="text-xl">🏆</span> Recomendação Final
          </h3>
          <p className="leading-relaxed text-neutral-300">
            O <strong className="text-amber-400">{insights.bestModel.name}</strong> é o modelo
            recomendado para produção, oferecendo o melhor equilíbrio entre acurácia (R²={' '}
            <strong className="text-amber-400">
              {(insights.bestModel.metrics.test.r2 * 100).toFixed(1)}%
            </strong>
            ) e interpretabilidade. A análise de feature importance confirma que{' '}
            <strong className="text-fire-400">condições climáticas</strong> respondem por{' '}
            <strong className="text-fire-400">{insights.climaticImportance}%</strong> da predição,
            sendo <strong className="text-ember-400">sazonalidade (mês)</strong> e{' '}
            <strong className="text-ember-400">dias sem chuva</strong> os principais indicadores de
            risco de incêndio na região de Mossoró/RN.
          </p>
        </div>
      </div>
    </Card>
  );
}
