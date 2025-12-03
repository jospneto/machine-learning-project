'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import {
  FeatureImportanceChart,
  FireRiskMap3D,
  FireRiskMapLeaflet,
  MetricsComparisonChart,
  ModelComparisonChart,
  ModelMetricsCards,
  ModelRadarChart,
  PredictionForm,
  StarryBackground,
} from '@/components/fire-risk';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

type MapType = '2d' | '3d';

export default function FireRiskDashboard() {
  const [mapType, setMapType] = useState<MapType>('3d');

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-galaxy-900 via-cosmic-900 to-galaxy-800">
      {/* Starry Background */}
      <StarryBackground />

      {/* Gradient Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-galaxy-900/80 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cosmic-600/20 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fire-600/10 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cosmic-500/30 bg-cosmic-600/10 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-fire-500" />
            <span className="text-sm font-medium text-cosmic-300">
              Sistema de Monitoramento Ativo
            </span>
          </div>

          <h1 className="mb-4 bg-gradient-to-r from-fire-400 via-ember-400 to-cosmic-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            🔥 Predição de Risco de Fogo
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-neutral-400">
            Sistema inteligente de predição baseado em Machine Learning utilizando dados do{' '}
            <span className="text-cosmic-400">BDQueimadas (INPE)</span> para a região de{' '}
            <span className="font-semibold text-ember-400">Mossoró/RN</span>
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300">
              🧠 Neural Network
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
              🎯 K-Nearest Neighbors
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-300">
              🌲 Random Forest
            </div>
          </div>
        </motion.header>

        {/* Métricas dos Modelos - Cards */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-6"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-white">
              <span className="text-fire-400">📊</span> Performance dos Modelos
            </h2>
            <p className="text-neutral-400">Métricas de avaliação no conjunto de teste</p>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ModelMetricsCards />
          </motion.div>
        </motion.section>

        {/* Mapa de Risco */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-6"
        >
          <motion.div
            variants={fadeInUp}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-white">
                <span className="text-fire-400">🗺️</span> Mapa de Risco de Fogo
              </h2>
              <p className="text-neutral-400">
                Visualização geográfica dos pontos de monitoramento
              </p>
            </div>

            {/* Toggle de tipo de mapa */}
            <div className="flex gap-2 rounded-lg border border-cosmic-600/30 bg-galaxy-800/50 p-1">
              <Button
                variant={mapType === '3d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMapType('3d')}
                className={
                  mapType === '3d'
                    ? 'bg-gradient-to-r from-cosmic-600 to-cosmic-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }
              >
                🌐 3D (Three.js)
              </Button>
              <Button
                variant={mapType === '2d' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMapType('2d')}
                className={
                  mapType === '2d'
                    ? 'bg-gradient-to-r from-cosmic-600 to-cosmic-500 text-white'
                    : 'text-neutral-400 hover:text-white'
                }
              >
                🗺️ 2D (OpenStreetMap)
              </Button>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            {mapType === '3d' ? (
              <FireRiskMap3D className="h-[500px]" />
            ) : (
              <FireRiskMapLeaflet className="h-[500px]" />
            )}
          </motion.div>
        </motion.section>

        {/* Predição + Gráfico de Predições */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid gap-6 lg:grid-cols-2"
        >
          <motion.div variants={fadeInUp}>
            <PredictionForm className="h-full" />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ModelComparisonChart className="h-full min-h-[500px]" />
          </motion.div>
        </motion.section>

        {/* Gráficos de Comparação */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid gap-6 lg:grid-cols-2"
        >
          <motion.div variants={fadeInUp}>
            <FeatureImportanceChart className="h-[480px]" />
          </motion.div>
          <motion.div variants={fadeInUp}>
            <ModelRadarChart className="h-[480px]" />
          </motion.div>
        </motion.section>

        {/* Métricas de Erro */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="space-y-6"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="mb-1 flex items-center gap-2 text-2xl font-semibold text-white">
              <span className="text-fire-400">📉</span> Análise de Erros
            </h2>
            <p className="text-neutral-400">
              Comparação de RMSE e MAE entre os modelos (menor é melhor)
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="grid gap-6 lg:grid-cols-2">
            <MetricsComparisonChart metricType="rmse" className="h-[400px]" />
            <MetricsComparisonChart metricType="mae" className="h-[400px]" />
          </motion.div>
        </motion.section>

        {/* R² Score Comparison */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <MetricsComparisonChart metricType="r2" className="h-[420px]" />
        </motion.section>

        {/* Insights e Conclusões */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={fadeInUp}
        >
          <Card className="overflow-hidden border-cosmic-600/30 bg-gradient-to-br from-galaxy-800/80 to-cosmic-900/50 backdrop-blur-xl">
            <div className="p-8">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
                <span className="text-amber-400">💡</span> Insights e Conclusões
              </h2>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="group space-y-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 transition-all hover:border-blue-500/40 hover:bg-blue-500/10">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🧠</span>
                    <h3 className="font-semibold text-white">Neural Network</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-400">
                    R² de <strong className="text-blue-400">52.6%</strong> no teste. Captura padrões
                    não-lineares nos dados, mas apresenta maior variância nas predições.
                  </p>
                </div>

                <div className="group space-y-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎯</span>
                    <h3 className="font-semibold text-white">KNN</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-400">
                    R² de <strong className="text-emerald-400">51.2%</strong> no teste. Apresenta
                    overfitting significativo (R²=100% treino), indicando memorização dos dados.
                  </p>
                </div>

                <div className="group space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 transition-all hover:border-amber-500/40 hover:bg-amber-500/10">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🌲</span>
                    <h3 className="font-semibold text-white">Random Forest</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-neutral-400">
                    <strong className="text-amber-400">Melhor modelo</strong> com R² de{' '}
                    <strong className="text-amber-400">71.0%</strong>. Identifica &quot;Dias sem
                    Chuva&quot; como feature principal (57.5%).
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-cosmic-500/30 bg-gradient-to-r from-cosmic-600/10 to-fire-600/10 p-6">
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
                  <span className="text-xl">🏆</span> Recomendação Final
                </h3>
                <p className="leading-relaxed text-neutral-300">
                  O <strong className="text-amber-400">Random Forest</strong> é o modelo recomendado
                  para produção, oferecendo o melhor equilíbrio entre acurácia e interpretabilidade.
                  A análise de feature importance confirma que{' '}
                  <strong className="text-fire-400">condições climáticas</strong> (dias sem chuva e
                  precipitação) são os principais indicadores de risco de incêndio na região de
                  Mossoró/RN.
                </p>
              </div>
            </div>
          </Card>
        </motion.section>

        {/* Footer Info */}
        <motion.footer
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="border-t border-cosmic-600/20 pt-8"
        >
          <Card className="border-cosmic-600/20 bg-galaxy-800/30 backdrop-blur-xl">
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
                    <span>🤖</span> Modelos de Machine Learning
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-400">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">•</span>
                      <span>
                        <strong className="text-neutral-300">MLP Neural Network:</strong> 3 camadas
                        ocultas (100, 50, 25 neurônios)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>
                        <strong className="text-neutral-300">K-Nearest Neighbors:</strong> Otimizado
                        via Grid Search
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>
                        <strong className="text-neutral-300">Random Forest:</strong> Ensemble com
                        100 árvores de decisão
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
                    <span>📡</span> Fonte de Dados
                  </h3>
                  <ul className="space-y-2 text-sm text-neutral-400">
                    <li className="flex items-start gap-2">
                      <span className="text-fire-400">•</span>
                      <span>
                        <strong className="text-neutral-300">BDQueimadas (INPE):</strong> Banco de
                        dados oficial de queimadas
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cosmic-400">•</span>
                      <span>
                        <strong className="text-neutral-300">Satélites:</strong> AQUA, TERRA,
                        NOAA-20, NPP-375
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-ember-400">•</span>
                      <span>
                        <strong className="text-neutral-300">Período:</strong> Dados históricos de
                        2020 a 2024
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 border-t border-cosmic-600/20 pt-6 text-center text-sm text-neutral-500">
                Sistema desenvolvido para análise preditiva de risco de incêndios florestais •{' '}
                <span className="text-cosmic-400">Mossoró/RN</span>
              </div>
            </div>
          </Card>
        </motion.footer>
      </div>
    </div>
  );
}
