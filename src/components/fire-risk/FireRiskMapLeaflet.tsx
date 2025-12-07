'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { getRiskColor, getRiskLabel } from '@/api/fire-risk/config';
import { useGetMapData } from '@/api/fire-risk/hooks';
import type { MapDataPoint } from '@/api/fire-risk/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

interface FireRiskMapLeafletProps {
  className?: string;
  onPointClick?: (point: MapDataPoint) => void;
}

// Lazy load do componente de mapa para evitar SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
  ssr: false,
});
const CircleMarker = dynamic(() => import('react-leaflet').then((mod) => mod.CircleMarker), {
  ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const Tooltip = dynamic(() => import('react-leaflet').then((mod) => mod.Tooltip), { ssr: false });

// Centro padrão: Mossoró/RN
const DEFAULT_CENTER: [number, number] = [-5.1894, -37.3444];
const DEFAULT_ZOOM = 10;

export function FireRiskMapLeaflet({ className, onPointClick }: FireRiskMapLeafletProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { data: mapData, isLoading } = useGetMapData();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || isLoading) {
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
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-cosmic-600/20 p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="text-xl">🗺️</span>
            Mapa de Risco - Mossoró/RN
          </h3>
          <p className="text-sm text-neutral-400">
            Pontos de monitoramento com níveis de risco (OpenStreetMap)
          </p>
        </div>

        {/* Map Container */}
        <div className="relative min-h-[400px] flex-1">
          <MapContainer
            center={DEFAULT_CENTER}
            zoom={DEFAULT_ZOOM}
            className="h-full w-full"
            style={{ background: '#0a0a0f' }}
          >
            {/* Dark theme tile layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* Risk markers - filtrar apenas pontos com dados válidos (risco > 0) */}
            {mapData
              ?.filter((point) => point.riskLevel > 0)
              .map((point) => {
                const color = getRiskColor(point.riskLevel);
                const label = getRiskLabel(point.riskLevel);

                return (
                  <CircleMarker
                    key={point.id}
                    center={[point.latitude, point.longitude]}
                    radius={12}
                    pathOptions={{
                      fillColor: color,
                      fillOpacity: 0.8,
                      color: '#fff',
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => onPointClick?.(point),
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                      <div className="text-sm">
                        <strong>{point.municipio}</strong>
                        <br />
                        Risco: {label} ({point?.riskLevel?.toFixed(1)}%)
                      </div>
                    </Tooltip>
                    <Popup>
                      <div className="min-w-[200px] p-2">
                        <h4 className="mb-2 font-semibold">{point.municipio}</h4>
                        <div
                          className="mb-3 inline-block rounded px-2 py-1 text-sm font-medium text-white"
                          style={{ backgroundColor: color }}
                        >
                          {label}: {point?.riskLevel?.toFixed(1)}%
                        </div>

                        {point.predictions && (
                          <div className="space-y-1 text-xs">
                            <div className="font-semibold">Predições dos Modelos:</div>
                            <div className="flex justify-between">
                              <span>🧠 Neural Network:</span>
                              <span className="font-medium">
                                {point?.predictions?.neural_network?.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>🎯 KNN:</span>
                              <span className="font-medium">
                                {point?.predictions?.knn?.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>🌲 Random Forest:</span>
                              <span className="font-medium">
                                {point?.predictions?.random_forest?.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-500">
                          📍 {point?.latitude?.toFixed(4)}, {point?.longitude?.toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
          </MapContainer>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-4 bottom-4 z-[1000] rounded-lg border border-cosmic-600/30 bg-galaxy-800/95 p-4 backdrop-blur-xl"
          >
            <h4 className="mb-3 text-sm font-semibold text-white">Nível de Risco</h4>
            <div className="space-y-2">
              {[
                { level: 'low', label: 'Baixo (0-25%)', value: 10 },
                { level: 'medium', label: 'Médio (25-50%)', value: 35 },
                { level: 'high', label: 'Alto (50-75%)', value: 60 },
                { level: 'critical', label: 'Crítico (75-100%)', value: 85 },
              ].map(({ level, label, value }) => (
                <div key={level} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full border border-white/30"
                    style={{ backgroundColor: getRiskColor(value) }}
                  />
                  <span className="text-xs text-neutral-300">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Point counter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 left-4 z-[1000] rounded-lg border border-cosmic-600/30 bg-galaxy-800/95 px-4 py-2 backdrop-blur-xl"
          >
            <p className="text-sm text-white">
              <span className="font-semibold">
                {mapData?.filter((p) => p.riskLevel > 0).length || 0}
              </span>
              <span className="text-neutral-400"> municípios com dados de risco</span>
            </p>
          </motion.div>
        </div>
      </div>
    </Card>
  );
}
