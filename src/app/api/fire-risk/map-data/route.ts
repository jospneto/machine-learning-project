/**
 * API Route: GET /api/fire-risk/map-data
 * Retorna dados para visualização no mapa
 */

import { NextResponse } from 'next/server';

// Gerar pontos aleatórios em torno de Mossoró para simulação
function generateMapPoints() {
  const centerLat = -5.1894;
  const centerLng = -37.3444;
  const points: {
    id: string;
    latitude: number;
    longitude: number;
    riskLevel: number;
    municipio: string;
    dataHora: string;
    predictions:
      | { neural_network: number; knn: number; random_forest: number }
      | { neural_network: number; knn: number; random_forest: number };
  }[] = [];

  // Pontos predefinidos em Mossoró e região
  const basePoints = [
    { name: 'Centro', lat: -5.1894, lng: -37.3444, baseRisk: 45 },
    { name: 'Alto de São Manoel', lat: -5.175, lng: -37.335, baseRisk: 52 },
    { name: 'Nova Betânia', lat: -5.198, lng: -37.358, baseRisk: 38 },
    { name: 'Abolição', lat: -5.205, lng: -37.32, baseRisk: 61 },
    { name: 'Santo Antônio', lat: -5.165, lng: -37.365, baseRisk: 29 },
    { name: 'Barrocas', lat: -5.22, lng: -37.33, baseRisk: 55 },
    { name: 'Aeroporto', lat: -5.21, lng: -37.37, baseRisk: 72 },
    { name: 'Boa Vista', lat: -5.18, lng: -37.31, baseRisk: 48 },
    { name: 'Paredões', lat: -5.24, lng: -37.35, baseRisk: 67 },
    { name: 'Belo Horizonte', lat: -5.155, lng: -37.325, baseRisk: 35 },
    { name: 'Rincão', lat: -5.195, lng: -37.29, baseRisk: 58 },
    { name: 'Dom Jaime Câmara', lat: -5.215, lng: -37.385, baseRisk: 44 },
    { name: 'Alto do Sumaré', lat: -5.17, lng: -37.375, baseRisk: 76 },
    { name: 'Vingt Rosado', lat: -5.185, lng: -37.395, baseRisk: 41 },
    { name: 'Costa e Silva', lat: -5.23, lng: -37.31, baseRisk: 63 },
  ];

  basePoints.forEach((point, index) => {
    // Adicionar variação aleatória ao risco
    const riskVariation = (Math.random() - 0.5) * 10;
    const riskLevel = Math.min(100, Math.max(0, point.baseRisk + riskVariation));

    // Gerar predições baseadas no risco
    const nnVariation = (Math.random() - 0.5) * 8;
    const knnVariation = (Math.random() - 0.5) * 10;
    const rfVariation = (Math.random() - 0.5) * 6;

    points.push({
      id: `mosoro-${index + 1}`,
      latitude: point.lat,
      longitude: point.lng,
      riskLevel: Math.round(riskLevel * 10) / 10,
      municipio: `MOSSORÓ - ${point.name}`,
      dataHora: new Date().toISOString(),
      predictions: {
        neural_network: Math.round((riskLevel + nnVariation) * 10) / 10,
        knn: Math.round((riskLevel + knnVariation) * 10) / 10,
        random_forest: Math.round((riskLevel + rfVariation) * 10) / 10,
      },
    });
  });

  // Adicionar alguns pontos em municípios vizinhos
  const nearbyMunicipios = [
    { name: 'AREIA BRANCA', lat: -4.95, lng: -37.12, risk: 68 },
    { name: 'GROSSOS', lat: -4.98, lng: -37.15, risk: 54 },
    { name: 'TIBAU', lat: -4.84, lng: -37.25, risk: 71 },
    { name: 'BARAÚNA', lat: -5.07, lng: -37.61, risk: 82 },
    { name: 'GOVERNADOR DIX-SEPT ROSADO', lat: -5.45, lng: -37.52, risk: 59 },
    { name: 'UPANEMA', lat: -5.64, lng: -37.26, risk: 64 },
    { name: 'APODI', lat: -5.66, lng: -37.8, risk: 47 },
    { name: 'FELIPE GUERRA', lat: -5.6, lng: -37.69, risk: 73 },
  ];

  nearbyMunicipios.forEach((mun, index) => {
    const riskVariation = (Math.random() - 0.5) * 15;
    const riskLevel = Math.min(100, Math.max(0, mun.risk + riskVariation));

    points.push({
      id: `nearby-${index + 1}`,
      latitude: mun.lat,
      longitude: mun.lng,
      riskLevel: Math.round(riskLevel * 10) / 10,
      municipio: mun.name,
      dataHora: new Date().toISOString(),
      predictions: {
        neural_network: Math.round((riskLevel + (Math.random() - 0.5) * 10) * 10) / 10,
        knn: Math.round((riskLevel + (Math.random() - 0.5) * 12) * 10) / 10,
        random_forest: Math.round((riskLevel + (Math.random() - 0.5) * 8) * 10) / 10,
      },
    });
  });

  return points;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const municipio = searchParams.get('municipio');

    // Gerar dados do mapa
    const mapData = generateMapPoints();

    // Filtrar por município se especificado
    const filteredData = municipio
      ? mapData.filter((point) => point.municipio.toLowerCase().includes(municipio.toLowerCase()))
      : mapData;

    return NextResponse.json(filteredData);
  } catch (error) {
    console.error('Error fetching map data:', error);
    return NextResponse.json({ error: 'Failed to fetch map data' }, { status: 500 });
  }
}
