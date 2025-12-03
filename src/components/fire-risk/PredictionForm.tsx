'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { usePredictLocation } from '@/api/fire-risk/hooks';
import type { FireRiskPredictionRequest } from '@/api/fire-risk/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface PredictionFormProps {
  className?: string;
}

const RISK_COLORS = {
  low: { bg: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
  medium: { bg: 'from-amber-500/20 to-amber-600/20', border: 'border-amber-500/50', text: 'text-amber-400' },
  high: { bg: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
  critical: { bg: 'from-red-600/20 to-red-900/20', border: 'border-red-500/50', text: 'text-red-400' },
};

const RISK_LABELS = {
  low: 'Baixo',
  medium: 'Médio',
  high: 'Alto',
  critical: 'Crítico',
};

export function PredictionForm({ className }: PredictionFormProps) {
  const [formData, setFormData] = useState<FireRiskPredictionRequest>({
    latitude: -5.1894,
    longitude: -37.3444,
    municipio: 'Mossoró',
    diaSemChuva: 10,
    precipitacao: 0,
    frp: 15,
  });

  const { mutate: predict, data: prediction, isPending, reset } = usePredictLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    predict(formData);
  };

  const handleInputChange = (field: keyof FireRiskPredictionRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (prediction) reset();
  };

  const riskStyle = prediction ? RISK_COLORS[prediction.predictions.risk_level] : null;

  return (
    <Card className={`overflow-hidden border-cosmic-600/30 bg-galaxy-800/50 backdrop-blur-xl ${className}`}>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold text-white">
            <span className="text-2xl">🎯</span>
            Predição de Risco por Localização
          </h3>
          <p className="text-sm text-neutral-400">
            Insira os parâmetros para calcular o risco de fogo em tempo real
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400">Latitude</label>
              <Input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                className="border-cosmic-600/30 bg-galaxy-700/50 text-white placeholder:text-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400">Longitude</label>
              <Input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                className="border-cosmic-600/30 bg-galaxy-700/50 text-white placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-400">Município</label>
            <Input
              value={formData.municipio}
              onChange={(e) => handleInputChange('municipio', e.target.value)}
              className="border-cosmic-600/30 bg-galaxy-700/50 text-white placeholder:text-neutral-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400">Dias sem Chuva</label>
              <Input
                type="number"
                value={formData.diaSemChuva}
                onChange={(e) => handleInputChange('diaSemChuva', parseInt(e.target.value))}
                className="border-cosmic-600/30 bg-galaxy-700/50 text-white placeholder:text-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400">Precipitação (mm)</label>
              <Input
                type="number"
                step="0.1"
                value={formData.precipitacao}
                onChange={(e) => handleInputChange('precipitacao', parseFloat(e.target.value))}
                className="border-cosmic-600/30 bg-galaxy-700/50 text-white placeholder:text-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-400">FRP (MW)</label>
              <Input
                type="number"
                step="0.1"
                value={formData.frp}
                onChange={(e) => handleInputChange('frp', parseFloat(e.target.value))}
                className="border-cosmic-600/30 bg-galaxy-700/50 text-white placeholder:text-neutral-500"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-cosmic-600 to-cosmic-500 font-semibold text-white transition-all duration-300 hover:from-cosmic-500 hover:to-cosmic-400 hover:shadow-lg hover:shadow-cosmic-500/25"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Calculando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                🔥 Calcular Risco de Fogo
              </span>
            )}
          </Button>
        </form>

        {/* Resultado da Predição */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <div className={`rounded-xl border bg-gradient-to-br p-6 ${riskStyle?.bg} ${riskStyle?.border}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">Resultado da Análise</h4>
                  <Badge className={`${riskStyle?.text} border-current bg-transparent`}>
                    Risco {RISK_LABELS[prediction.predictions.risk_level]}
                  </Badge>
                </div>

                {/* Risco Médio */}
                <div className="mb-6 text-center">
                  <div className={`text-5xl font-bold ${riskStyle?.text}`}>
                    {prediction.predictions.average.toFixed(1)}%
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">Risco Médio dos Modelos</p>
                </div>

                {/* Predições por Modelo */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-galaxy-900/50 p-3 text-center">
                    <div className="mb-1 text-xl">🧠</div>
                    <div className="text-lg font-semibold text-blue-400">
                      {prediction.predictions.neural_network.toFixed(1)}%
                    </div>
                    <div className="text-xs text-neutral-500">Neural Network</div>
                  </div>
                  <div className="rounded-lg bg-galaxy-900/50 p-3 text-center">
                    <div className="mb-1 text-xl">🎯</div>
                    <div className="text-lg font-semibold text-emerald-400">
                      {prediction.predictions.knn.toFixed(1)}%
                    </div>
                    <div className="text-xs text-neutral-500">KNN</div>
                  </div>
                  <div className="rounded-lg bg-galaxy-900/50 p-3 text-center">
                    <div className="mb-1 text-xl">🌲</div>
                    <div className="text-lg font-semibold text-amber-400">
                      {prediction.predictions.random_forest.toFixed(1)}%
                    </div>
                    <div className="text-xs text-neutral-500">Random Forest</div>
                  </div>
                </div>

                <div className="mt-4 text-center text-xs text-neutral-500">
                  📍 {prediction.location.municipio} ({prediction.location.latitude.toFixed(4)}, {prediction.location.longitude.toFixed(4)})
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

