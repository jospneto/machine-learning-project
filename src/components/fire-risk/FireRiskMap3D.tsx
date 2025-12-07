'use client';

/* eslint-disable react/no-unknown-property */
import { Float, OrbitControls, Stars, Text } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

import { getRiskColor, getRiskLabel } from '@/api/fire-risk/config';
import { useGetMapData } from '@/api/fire-risk/hooks';
import type { MapDataPoint } from '@/api/fire-risk/types';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface FireRiskMap3DProps {
  className?: string;
  onPointClick?: (point: MapDataPoint) => void;
}

// Normalizar coordenadas para o espaço 3D
function normalizeCoords(lat: number, lng: number, centerLat: number, centerLng: number) {
  const scale = 20;
  const x = (lng - centerLng) * scale;
  const z = (lat - centerLat) * scale;
  return { x, z };
}

// Componente de ponto de risco
function RiskPoint({
  point,
  centerLat,
  centerLng,
  onClick,
  isSelected,
}: {
  point: MapDataPoint;
  centerLat: number;
  centerLng: number;
  onClick: () => void;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { x, z } = normalizeCoords(point.latitude, point.longitude, centerLat, centerLng);
  const color = getRiskColor(point.riskLevel);
  const height = (point.riskLevel / 100) * 3 + 0.5;

  useFrame((state) => {
    if (meshRef.current) {
      // Animação de pulso baseada no risco
      const pulse = Math.sin(state.clock.elapsedTime * 2 + point.riskLevel / 20) * 0.1;
      meshRef.current.scale.y = 1 + (hovered ? 0.2 : pulse);
    }
    if (glowRef.current) {
      // Rotação do glow
      glowRef.current.rotation.y += 0.01;
      // Opacidade pulsante
      const opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = hovered ? 0.6 : opacity;
    }
  });

  return (
    <group position={[x, 0, z]}>
      {/* Base glow */}
      <mesh ref={glowRef} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.6, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Coluna de risco */}
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.15, 0.25, height, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Esfera no topo */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, height + 0.2, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered || isSelected ? 1 : 0.5}
          />
        </mesh>
      </Float>

      {/* Label ao passar o mouse */}
      {(hovered || isSelected) && (
        <Text
          position={[0, height + 0.8, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {`${point.municipio}\n${getRiskLabel(point.riskLevel)}: ${point.riskLevel.toFixed(0)}%`}
        </Text>
      )}
    </group>
  );
}

// Grade do terreno
function TerrainGrid() {
  return (
    <group>
      {/* Grid principal */}
      <gridHelper args={[30, 30, '#2d0a4e', '#1a1a2e']} position={[0, 0, 0]} />

      {/* Plano base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0a0a0f" opacity={0.8} transparent />
      </mesh>
    </group>
  );
}

// Cena 3D
function Scene({
  mapData,
  onPointClick,
  selectedPoint,
}: {
  mapData: MapDataPoint[];
  onPointClick: (point: MapDataPoint) => void;
  selectedPoint: MapDataPoint | null;
}) {
  // Calcular centro baseado nos dados
  const center = useMemo(() => {
    if (!mapData.length) return { lat: -5.1894, lng: -37.3444 };
    const sumLat = mapData.reduce((acc, p) => acc + p.latitude, 0);
    const sumLng = mapData.reduce((acc, p) => acc + p.longitude, 0);
    return {
      lat: sumLat / mapData.length,
      lng: sumLng / mapData.length,
    };
  }, [mapData]);

  return (
    <>
      {/* Iluminação */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, -5, 0]} intensity={0.3} color="#ef4444" />

      {/* Estrelas de fundo */}
      <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />

      {/* Terreno */}
      <TerrainGrid />

      {/* Pontos de risco - filtrar apenas com dados válidos */}
      {mapData
        .filter((point) => point.riskLevel > 0)
        .map((point) => (
          <RiskPoint
            key={point.id}
            point={point}
            centerLat={center.lat}
            centerLng={center.lng}
            onClick={() => onPointClick(point)}
            isSelected={selectedPoint?.id === point.id}
          />
        ))}

      {/* Controles de órbita */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function FireRiskMap3D({ className, onPointClick }: FireRiskMap3DProps) {
  const [selectedPoint, setSelectedPoint] = useState<MapDataPoint | null>(null);
  const { data: mapData, isLoading } = useGetMapData();

  const handlePointClick = (point: MapDataPoint) => {
    setSelectedPoint(point);
    onPointClick?.(point);
  };

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
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-cosmic-600/20 p-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="text-xl">🌐</span>
            Visualização 3D - Risco de Fogo
          </h3>
          <p className="text-sm text-neutral-400">
            Mapa interativo tridimensional com colunas de risco (arraste para rotacionar)
          </p>
        </div>

        {/* 3D Canvas */}
        <div className="relative min-h-[400px] flex-1">
          <Canvas
            camera={{ position: [10, 10, 10], fov: 50 }}
            style={{ background: 'linear-gradient(to bottom, #0a0a0f, #1e0533)' }}
          >
            <Scene
              mapData={mapData || []}
              onPointClick={handlePointClick}
              selectedPoint={selectedPoint}
            />
          </Canvas>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-4 bottom-4 z-10 rounded-lg border border-cosmic-600/30 bg-galaxy-800/95 p-4 backdrop-blur-xl"
          >
            <h4 className="mb-3 text-sm font-semibold text-white">Altura = Risco</h4>
            <div className="space-y-2">
              {[
                { label: 'Baixo', color: '#10b981', height: 'Curto' },
                { label: 'Médio', color: '#f59e0b', height: 'Médio' },
                { label: 'Alto', color: '#ef4444', height: 'Alto' },
                { label: 'Crítico', color: '#7f1d1d', height: 'Muito Alto' },
              ].map(({ label, color, height }) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full border border-white/30"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-neutral-300">
                    {label} ({height})
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Instruções */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 z-10 rounded-lg border border-cosmic-600/30 bg-galaxy-800/95 px-4 py-2 backdrop-blur-xl"
          >
            <p className="text-xs text-neutral-400">
              🖱️ Arraste para rotacionar • 🔍 Scroll para zoom • 📍 Clique nos pontos
            </p>
          </motion.div>

          {/* Selected point info */}
          {selectedPoint && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-4 z-10 rounded-lg border border-cosmic-600/30 bg-galaxy-800/95 p-4 backdrop-blur-xl"
            >
              <h4 className="mb-2 font-semibold text-white">{selectedPoint.municipio}</h4>
              <div
                className="mb-2 inline-block rounded px-2 py-1 text-sm font-medium text-white"
                style={{ backgroundColor: getRiskColor(selectedPoint.riskLevel) }}
              >
                {getRiskLabel(selectedPoint.riskLevel)}: {selectedPoint.riskLevel.toFixed(1)}%
              </div>

              {selectedPoint.predictions && (
                <div className="mt-2 space-y-1 text-xs text-neutral-300">
                  <div className="flex justify-between gap-4">
                    <span>🧠 Neural Network:</span>
                    <span>{selectedPoint.predictions.neural_network.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>🎯 KNN:</span>
                    <span>{selectedPoint.predictions.knn.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>🌲 Random Forest:</span>
                    <span>{selectedPoint.predictions.random_forest.toFixed(1)}%</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedPoint(null)}
                className="mt-3 text-xs text-cosmic-400 hover:text-cosmic-300"
              >
                ✕ Fechar
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
}
