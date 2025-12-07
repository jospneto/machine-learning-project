# 🔥 Guia Rápido - Sistema de Predição de Risco de Fogo

## ⚡ Início Rápido em 4 Passos

### 1️⃣ Clonar e Instalar Dependências

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd machine-learning-project

# Instalar dependências Node.js
yarn install
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
# URL base (deixe vazio para localhost)
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# Autenticação - IMPORTANTE: AUTH_TRUST_HOST=true para desenvolvimento
AUTH_SECRET=sua_chave_secreta_aqui_gere_com_openssl_rand_base64_32
AUTH_TRUST_HOST=true

# OAuth (opcional)
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

> ⚠️ **Importante**: `AUTH_TRUST_HOST=true` é necessário para rodar em localhost sem erros de autenticação.

### 3️⃣ Executar a Aplicação

```bash
yarn dev
```

O servidor iniciará em `http://localhost:3000` (ou porta disponível).

### 4️⃣ Acessar o Dashboard

Abra o navegador em: **http://localhost:3000/fire-risk**

---

## 🎯 O Que Você Verá

### Dashboard Interativo com Tema Galáxia/Fogo

- 🌌 **Background animado** com estrelas cintilantes
- 📊 **3 Cards de Métricas**: Performance dos modelos ML
- 🎯 **Formulário de Predição**: Calcule risco em tempo real
- 📈 **Gráfico de Predições**: Próximos 7 dias
- 🌲 **Feature Importance**: Variáveis mais importantes
- 🎯 **Gráfico Radar**: Comparação multi-dimensional
- 📉 **Análise de Erros**: RMSE e MAE

### Modelos de Machine Learning

| Modelo            | R² Score  | Descrição                     |
| ----------------- | --------- | ----------------------------- |
| 🧠 Neural Network | 52.6%     | MLP com 3 camadas ocultas     |
| 🎯 KNN            | 51.2%     | K-Nearest Neighbors otimizado |
| 🌲 Random Forest  | **71.0%** | Ensemble com 100 árvores      |

---

## 🛠️ Treinar Modelos com Dados Reais (Opcional)

### Instalar Dependências Python

```bash
pip install -r src/scripts/requirements.txt
```

### Obter Dados do INPE

1. Acesse: https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/
2. Filtros:
   - **País**: Brasil
   - **Estado**: Rio Grande do Norte
   - **Período**: Últimos meses/anos
3. Exporte como CSV
4. Salve como `src/scripts/bdqueimadas.csv`

### Treinar Modelos

```bash
cd src/scripts
python fire_risk_prediction.py
```

Os resultados serão salvos em `output/`:

- `model_metrics.json` - Métricas dos modelos
- `week_predictions.json` - Predições semanais
- `model_comparison.png` - Gráfico de comparação

---

## 📁 Estrutura do Projeto

```
📦 machine-learning-project
├── 📂 output/                    # Dados dos modelos ML
│   ├── model_metrics.json        # Métricas R², RMSE, MAE
│   └── week_predictions.json     # Predições semanais
├── 📂 src/
│   ├── 📂 api/fire-risk/         # Configurações e hooks da API
│   │   ├── config.ts             # Configurações e níveis de risco
│   │   ├── endpoints.ts          # Funções de fetch
│   │   ├── hooks/                # React Query hooks
│   │   └── types.ts              # Tipos TypeScript
│   ├── 📂 app/
│   │   ├── 📂 api/fire-risk/     # Rotas de API (Next.js)
│   │   │   ├── metrics/          # GET /api/fire-risk/metrics
│   │   │   ├── predict/          # POST /api/fire-risk/predict
│   │   │   └── predictions/week/ # GET /api/fire-risk/predictions/week
│   │   └── 📂 fire-risk/         # Página do dashboard
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── 📂 components/fire-risk/  # Componentes React
│   │   ├── FeatureImportanceChart.tsx
│   │   ├── MetricsComparisonChart.tsx
│   │   ├── ModelComparisonChart.tsx
│   │   ├── ModelMetricsCards.tsx
│   │   ├── ModelRadarChart.tsx
│   │   ├── PredictionForm.tsx
│   │   └── StarryBackground.tsx
│   ├── 📂 scripts/               # Scripts Python
│   │   ├── fire_risk_prediction.py
│   │   └── requirements.txt
│   └── 📂 styles/                # Estilos CSS
│       └── foundations/
│           ├── animations.css    # Animações (estrelas, glow)
│           └── colors.css        # Paleta galáxia/fogo
└── 📄 .env.local                 # Variáveis de ambiente
```

---

## 🎨 APIs Disponíveis

### GET `/api/fire-risk/metrics`

Retorna métricas de performance dos 3 modelos ML.

### GET `/api/fire-risk/predictions/week`

Retorna predições de risco para os próximos 7 dias.

### POST `/api/fire-risk/predict`

Calcula risco para localização específica.

```json
// Request Body
{
  "latitude": -5.1894,
  "longitude": -37.3444,
  "municipio": "Mossoró",
  "diaSemChuva": 10,
  "precipitacao": 0,
  "frp": 15
}
```

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
yarn dev              # Inicia servidor (hot reload)

# Build e Produção
yarn build            # Build otimizado
yarn start            # Inicia em produção

# Qualidade de Código
yarn lint             # Verifica erros ESLint
yarn type-check       # Verifica tipos TypeScript

# Python ML
cd src/scripts
python fire_risk_prediction.py  # Treina modelos
```

---

## ❓ Solução de Problemas

### Erro: "UntrustedHost" no terminal

```
[auth][error] UntrustedHost: Host must be trusted
```

✅ **Solução**: Adicione `AUTH_TRUST_HOST=true` no `.env.local`

### Erro: Porta 3000 em uso

```
Port 3000 is in use, using 3001 instead
```

✅ **Solução**: Normal! Acesse a porta alternativa mostrada no terminal.

### Gráficos não carregam

✅ **Solução**:

1. Verifique se os arquivos existem em `output/`
2. Reinicie o servidor: `Ctrl+C` → `yarn dev`

### Cores personalizadas não aparecem

✅ **Solução**: O Tailwind v4 usa `@theme` - reinicie o servidor após alterações em CSS.

---

## 📱 Funcionalidades

### ✅ Implementado

- [x] Dashboard com tema galáxia/fogo
- [x] Animação de estrelas no background
- [x] Cards de métricas animados
- [x] Gráfico de predições semanais
- [x] Formulário de predição em tempo real
- [x] Feature importance do Random Forest
- [x] Gráfico radar de comparação
- [x] Comparação RMSE e MAE
- [x] Insights e conclusões

### 🔮 Futuras Melhorias

- [ ] Mapa interativo com pontos de risco
- [ ] Histórico de predições
- [ ] Alertas por email/SMS
- [ ] Dashboard administrativo

---

## 🆘 Precisa de Ajuda?

- 📖 Documentação detalhada: `README_FIRE_RISK.md`
- 📋 Checklist do projeto: `CHECKLIST.md`
- 🐛 Reporte bugs: GitHub Issues

---

**🎉 Pronto! Agora você tem um sistema completo de predição de risco de fogo funcionando!**
