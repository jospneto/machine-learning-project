'use client';

import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG, getRiskColor, getRiskLabel } from '@/api/fire-risk/config';
import { useGetMapData } from '@/api/fire-risk/hooks';
import type { MapDataPoint } from '@/api/fire-risk/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

mapboxgl.accessToken =
  MAPBOX_CONFIG.accessToken || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

interface FireRiskMapProps {
  className?: string;
  onPointClick?: (point: MapDataPoint) => void;
}

export function FireRiskMap({ className, onPointClick }: FireRiskMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { data: mapData, isLoading } = useGetMapData({
    queryKey: ['fire-risk', 'map-data', {}],
    enabled: mapLoaded,
  });

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: [MAPBOX_CONFIG.defaultCenter.longitude, MAPBOX_CONFIG.defaultCenter.latitude],
      zoom: MAPBOX_CONFIG.defaultZoom,
    });

    // Adicionar controles de navegação
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Adicionar controle de escala
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-left',
    );

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Atualizar marcadores quando os dados mudarem
  useEffect(() => {
    if (!map.current || !mapData) return;

    // Remover marcadores antigos
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Adicionar novos marcadores
    mapData.forEach((point) => {
      const color = getRiskColor(point.riskLevel);
      const label = getRiskLabel(point.riskLevel);

      // Criar elemento do marcador
      const el = document.createElement('div');
      el.className = 'fire-risk-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = color;
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.2s ease';

      // Efeito hover
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '1000';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
      });

      // Criar popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(`
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 14px;">
            ${point.municipio}
          </h3>
          <div style="margin-bottom: 8px;">
            <span style="
              display: inline-block;
              padding: 2px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 500;
              background-color: ${color}20;
              color: ${color};
              border: 1px solid ${color};
            ">
              Risco: ${label} (${point.riskLevel.toFixed(1)}%)
            </span>
          </div>
          ${
            point.predictions
              ? `
            <div style="font-size: 11px; color: #666; margin-top: 8px;">
              <div><strong>Predições:</strong></div>
              <div>• Neural Network: ${point.predictions.neural_network.toFixed(1)}%</div>
              <div>• KNN: ${point.predictions.knn.toFixed(1)}%</div>
              <div>• Random Forest: ${point.predictions.random_forest.toFixed(1)}%</div>
            </div>
          `
              : ''
          }
        </div>
      `);

      // Criar marcador
      const marker = new mapboxgl.Marker(el)
        .setLngLat([point.longitude, point.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      // Evento de click
      el.addEventListener('click', () => {
        onPointClick?.(point);
      });

      markersRef.current.push(marker);
    });
  }, [mapData, onPointClick]);

  if (isLoading && !mapLoaded) {
    return (
      <Card className={className}>
        <Skeleton className="h-full w-full" />
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="relative h-full w-full">
        <div ref={mapContainer} className="h-full w-full rounded-lg" />

        {/* Legenda */}
        <div className="absolute right-4 bottom-4 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
          <h4 className="mb-3 text-sm font-semibold">Nível de Risco</h4>
          <div className="space-y-2">
            {Object.entries({
              low: 'Baixo (0-25%)',
              medium: 'Médio (25-50%)',
              high: 'Alto (50-75%)',
              critical: 'Crítico (75-100%)',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-full border-2 border-white shadow"
                  style={{
                    backgroundColor: getRiskColor(
                      key === 'low' ? 10 : key === 'medium' ? 35 : key === 'high' ? 60 : 85,
                    ),
                  }}
                />
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contador de pontos */}
        {mapData && (
          <div className="absolute top-4 left-4 rounded-lg bg-white px-4 py-2 shadow-lg dark:bg-gray-800">
            <p className="text-sm">
              <span className="font-semibold">{mapData.length}</span> pontos de monitoramento
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
