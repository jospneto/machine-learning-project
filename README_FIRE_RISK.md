# 🔥 Sistema de Predição de Risco de Fogo - Mossoró/RN

Sistema avançado de monitoramento e predição de risco de incêndio para a cidade de Mossoró e região do Rio Grande do Norte, utilizando Machine Learning e dados do BDQueimadas (INPE).

## 📋 Visão Geral

Este projeto implementa três modelos de Machine Learning para prever o risco de fogo:

| Modelo                     | R² Score  | Descrição                                                            |
| -------------------------- | --------- | -------------------------------------------------------------------- |
| 🧠 **Rede Neural (MLP)**   | 52.6%     | Multi-Layer Perceptron com 3 camadas ocultas (100, 50, 25 neurônios) |
| 🎯 **K-Nearest Neighbors** | 51.2%     | Algoritmo otimizado via Grid Search                                  |
| 🌲 **Random Forest**       | **71.0%** | Ensemble com 100 árvores de decisão - **Melhor modelo**              |

### 📊 Feature Importance (Random Forest)

| Feature                     | Importância |
| --------------------------- | ----------- |
| ☔ Dias sem Chuva           | **57.5%**   |
| 🌧️ Precipitação             | 23.4%       |
| 🔥 FRP (Potência Radiativa) | 8.9%        |
| 📍 Latitude                 | 2.5%        |
| 📍 Longitude                | 2.4%        |
| Outros                      | 5.3%        |

---

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
yarn install
```

### 2. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
# URLs
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# Autenticação - OBRIGATÓRIO para desenvolvimento
AUTH_SECRET=gere_uma_chave_com_openssl_rand_base64_32
AUTH_TRUST_HOST=true

# Google OAuth (opcional)
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

> ⚠️ **Importante**: `AUTH_TRUST_HOST=true` é **obrigatório** para rodar em localhost sem erros de autenticação.

### 3. Executar

```bash
yarn dev
```

### 4. Acessar Dashboard

Abra: **http://localhost:3000/fire-risk**

---

## 🎨 Interface do Dashboard

### Visual Design

- 🌌 **Tema Galáxia/Fogo** - Paleta de cores escura com degradês roxo/laranja/vermelho
- ✨ **Background animado** - Estrelas cintilantes renderizadas com Canvas
- 🌈 **Gradientes dinâmicos** - Cards e botões com efeitos de glow
- 💫 **Animações suaves** - Framer Motion para transições elegantes

### Componentes Principais

1. **📊 ModelMetricsCards** - Cards com R², RMSE, MAE de cada modelo
2. **🎯 PredictionForm** - Formulário para calcular risco em tempo real
3. **📈 ModelComparisonChart** - Gráfico de área com predições semanais
4. **🌲 FeatureImportanceChart** - Barras horizontais com importância das features
5. **🎯 ModelRadarChart** - Gráfico radar de comparação multi-dimensional
6. **📉 MetricsComparisonChart** - Barras verticais comparando métricas
7. **✨ StarryBackground** - Canvas animado com estrelas

---

## 📁 Estrutura do Projeto

```
machine-learning-project/
├── output/                           # Resultados do ML
│   ├── model_metrics.json            # Métricas R², RMSE, MAE
│   ├── week_predictions.json         # Predições 7 dias
│   └── model_comparison.png          # Gráfico comparativo
│
├── src/
│   ├── api/fire-risk/
│   │   ├── config.ts                 # Configurações e níveis de risco
│   │   ├── endpoints.ts              # Funções de fetch
│   │   ├── types.ts                  # Tipos TypeScript
│   │   └── hooks/
│   │       ├── useGetModelMetrics.tsx
│   │       ├── useGetWeekPredictions.tsx
│   │       ├── useGetMapData.tsx
│   │       └── usePredictLocation.tsx
│   │
│   ├── app/
│   │   ├── api/fire-risk/
│   │   │   ├── metrics/route.ts      # GET /api/fire-risk/metrics
│   │   │   ├── predict/route.ts      # POST /api/fire-risk/predict
│   │   │   └── predictions/week/     # GET /api/fire-risk/predictions/week
│   │   │
│   │   └── fire-risk/
│   │       ├── layout.tsx
│   │       └── page.tsx              # Dashboard principal
│   │
│   ├── components/fire-risk/
│   │   ├── FeatureImportanceChart.tsx
│   │   ├── MetricsComparisonChart.tsx
│   │   ├── ModelComparisonChart.tsx
│   │   ├── ModelMetricsCards.tsx
│   │   ├── ModelRadarChart.tsx
│   │   ├── PredictionForm.tsx
│   │   └── StarryBackground.tsx
│   │
│   ├── scripts/
│   │   ├── fire_risk_prediction.py   # Treinamento ML
│   │   ├── projeto_fase1.ipynb       # Análise exploratória
│   │   └── requirements.txt          # Deps Python
│   │
│   └── styles/foundations/
│       ├── colors.css                # Paleta galáxia/fogo
│       └── animations.css            # Animações CSS
│
└── .env.local                        # Variáveis de ambiente
```

---

## 🔌 APIs Disponíveis

### GET `/api/fire-risk/metrics`

Retorna métricas de performance dos 3 modelos ML.

**Response:**

```json
{
  "neural_network": {
    "model_name": "Neural Network",
    "train": { "mse": 11.33, "rmse": 3.37, "mae": 2.54, "r2": 0.92 },
    "test": { "mse": 70.35, "rmse": 8.39, "mae": 6.51, "r2": 0.53 }
  },
  "knn": { ... },
  "random_forest": {
    ...,
    "feature_importance": [
      { "feature": "DiaSemChuva", "importance": 0.575 },
      { "feature": "Precipitacao", "importance": 0.234 },
      ...
    ]
  }
}
```

### GET `/api/fire-risk/predictions/week`

Retorna predições de risco para os próximos 7 dias.

**Response:**

```json
[
  {
    "date": "2025-12-03",
    "day_name": "Wednesday",
    "predictions": {
      "neural_network": 74.61,
      "knn": 48.71,
      "random_forest": 42.51
    }
  },
  ...
]
```

### POST `/api/fire-risk/predict`

Calcula risco para uma localização específica.

**Request Body:**

```json
{
  "latitude": -5.1894,
  "longitude": -37.3444,
  "municipio": "Mossoró",
  "diaSemChuva": 10,
  "precipitacao": 0,
  "frp": 15
}
```

**Response:**

```json
{
  "location": {
    "latitude": -5.1894,
    "longitude": -37.3444,
    "municipio": "Mossoró"
  },
  "predictions": {
    "neural_network": 65.2,
    "knn": 48.5,
    "random_forest": 52.3,
    "average": 55.3,
    "risk_level": "high"
  },
  "timestamp": "2025-12-03T15:30:00.000Z"
}
```

---

## 🎓 Treinamento dos Modelos (Python)

### Instalar Dependências

```bash
pip install -r src/scripts/requirements.txt
```

### Obter Dados do INPE

1. Acesse: https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/
2. Configure os filtros:
   - **País**: Brasil
   - **Estado**: Rio Grande do Norte
   - **Período**: Últimos meses/anos
3. Exporte como CSV
4. Salve como `src/scripts/bdqueimadas.csv`

### Executar Treinamento

```bash
cd src/scripts
python fire_risk_prediction.py
```

O script irá:

- ✅ Carregar e processar os dados
- ✅ Treinar os 3 modelos de ML
- ✅ Avaliar performance (R², RMSE, MAE)
- ✅ Extrair feature importance
- ✅ Gerar predições para próxima semana
- ✅ Salvar resultados em `output/`

---

## 🛠️ Tecnologias Utilizadas

### Frontend

| Tecnologia    | Versão | Uso              |
| ------------- | ------ | ---------------- |
| Next.js       | 15.x   | Framework React  |
| TypeScript    | 5.x    | Tipagem estática |
| Tailwind CSS  | 4.x    | Estilização      |
| Framer Motion | 11.x   | Animações        |
| Recharts      | 2.x    | Gráficos         |
| React Query   | 5.x    | Cache e estado   |

### Backend (API Routes)

| Tecnologia         | Uso            |
| ------------------ | -------------- |
| Next.js API Routes | Endpoints REST |
| Auth.js            | Autenticação   |

### Machine Learning

| Tecnologia   | Uso           |
| ------------ | ------------- |
| Python 3.8+  | Linguagem     |
| Scikit-learn | Modelos ML    |
| Pandas       | Processamento |
| NumPy        | Cálculos      |
| Matplotlib   | Visualização  |

---

## 📊 Níveis de Risco

| Nível      | Range   | Cor       | Descrição            |
| ---------- | ------- | --------- | -------------------- |
| 🟢 Baixo   | 0-25%   | `#10b981` | Condições favoráveis |
| 🟡 Médio   | 25-50%  | `#f59e0b` | Atenção necessária   |
| 🔴 Alto    | 50-75%  | `#ef4444` | Risco elevado        |
| ⚫ Crítico | 75-100% | `#7f1d1d` | Risco extremo        |

---

## ❓ Solução de Problemas

### Erro: "UntrustedHost"

```
[auth][error] UntrustedHost: Host must be trusted
```

✅ Adicione `AUTH_TRUST_HOST=true` no `.env.local`

### Gráficos vazios

✅ Verifique se os arquivos existem em `output/`

### Erro de tipos TypeScript

✅ Execute `yarn type-check` para verificar

### Porta em uso

✅ O Next.js automaticamente usa a próxima porta disponível

---

## 📈 Métricas de Avaliação

| Métrica  | Descrição                   | Ideal                |
| -------- | --------------------------- | -------------------- |
| **R²**   | Coeficiente de determinação | Maior é melhor (0-1) |
| **RMSE** | Erro quadrático médio       | Menor é melhor       |
| **MAE**  | Erro absoluto médio         | Menor é melhor       |

---

## 🔮 Roadmap

- [x] Dashboard com tema galáxia/fogo
- [x] Animação de estrelas
- [x] Formulário de predição em tempo real
- [x] Gráficos comparativos
- [x] Feature importance
- [x] APIs REST completas
- [ ] Mapa interativo com Mapbox
- [ ] Histórico de predições
- [ ] Alertas por email/SMS
- [ ] Dashboard administrativo
- [ ] Deploy em produção

---

## 📝 Requisitos do Sistema

| Requisito | Mínimo           | Recomendado      |
| --------- | ---------------- | ---------------- |
| RAM       | 4GB              | 8GB              |
| Disco     | 2GB              | 5GB              |
| CPU       | Dual-core 2.0GHz | Quad-core 2.5GHz |
| Node.js   | 18.x             | 20.x             |
| Python    | 3.8              | 3.11             |

---

## 📄 Licença

Projeto desenvolvido para fins educacionais (Mestrado em Aprendizado de Máquina).

---

## 📊 Fonte de Dados

**BDQueimadas - INPE**

- URL: https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/
- Satélites: AQUA, TERRA, NOAA-20, NPP-375
- Região: Mossoró/RN, Brasil

---

**⚠️ Disclaimer**: Este sistema é para fins educacionais e de pesquisa. Para decisões críticas de prevenção a incêndios, consulte órgãos oficiais como INPE, Corpo de Bombeiros e Defesa Civil.
