# 🚀 COMO USAR - Sistema de Predição de Risco de Fogo

## ⚡ 4 Passos para Começar

### 1️⃣ Clonar e Instalar Dependências

```bash
# Clonar repositório
git clone <url-do-repositorio>
cd machine-learning-project

# Instalar dependências Node.js
yarn install
```

### 2️⃣ Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
# URLs
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# Autenticação - IMPORTANTE!
AUTH_SECRET=gere_uma_chave_secreta_aqui
AUTH_TRUST_HOST=true
```

> ⚠️ **IMPORTANTE**: `AUTH_TRUST_HOST=true` é **obrigatório** para rodar em localhost sem erros.

### 3️⃣ Executar Aplicação

```bash
yarn dev
```

O servidor iniciará em `http://localhost:3000` (ou próxima porta disponível).

### 4️⃣ Acessar Dashboard

Abra no navegador: **http://localhost:3000/fire-risk**

---

## 🎯 O Que Você Verá

### 1. Dashboard Interativo com Tema Galáxia/Fogo

```
┌─────────────────────────────────────────────────────┐
│  🔥 Predição de Risco de Fogo - Mossoró/RN          │
│  ✨ Background animado com estrelas                 │
└─────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┐
│   🧠 Neural  │   🎯 KNN     │  🌲 Random   │
│   Network    │              │   Forest     │
│              │              │              │
│ R²:   52.6%  │ R²:   51.2%  │ R²:  71.0%   │
│ RMSE: 8.39   │ RMSE: 8.51   │ RMSE: 6.56   │
│ MAE:  6.51   │ MAE:  7.08   │ MAE:  5.42   │
└──────────────┴──────────────┴──────────────┘

┌─────────────────────┬─────────────────────┐
│                     │                     │
│   🎯 FORMULÁRIO    │   📈 GRÁFICO        │
│   DE PREDIÇÃO       │   7 DIAS            │
│                     │                     │
│   • Lat/Long       │   • 3 modelos       │
│   • Dias sem chuva │   • Tendência       │
│   • Precipitação   │   • Comparação      │
│                     │                     │
└─────────────────────┴─────────────────────┘

┌─────────────────────┬─────────────────────┐
│                     │                     │
│  🌲 FEATURE         │   🎯 RADAR          │
│  IMPORTANCE         │   COMPARAÇÃO        │
│                     │                     │
│   • Dias sem chuva  │   • R² Score        │
│   • Precipitação    │   • RMSE            │
│   • FRP             │   • Generalização   │
│                     │                     │
└─────────────────────┴─────────────────────┘
```

### 2. Funcionalidades Disponíveis

**Formulário de Predição:**
- 📍 **Coordenadas** - Latitude e longitude
- 🏙️ **Município** - Nome da cidade
- ☔ **Dias sem Chuva** - Fator mais importante!
- 🌧️ **Precipitação** - Em milímetros
- 🔥 **FRP** - Potência radiativa

**Gráficos:**
- 📈 **Hover** nas linhas → Ver valores exatos
- 📊 **Legenda** clicável → Mostrar/ocultar modelos
- 📉 **Estatísticas** na parte inferior

**Níveis de Risco:**
- 🟢 **Verde** = Baixo (0-25%)
- 🟡 **Amarelo** = Médio (25-50%)
- 🔴 **Vermelho** = Alto (50-75%)
- ⚫ **Crítico** = (75-100%)

---

## 📊 Treinar Modelos com Dados Reais (Opcional)

### Passo 1: Instalar Python

```bash
pip install -r src/scripts/requirements.txt
```

### Passo 2: Baixar Dados

1. Acesse: https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/
2. Configure filtros:
   - **País:** Brasil
   - **Estado:** Rio Grande do Norte
   - **Período:** Últimos meses
3. Clique em **"Exportar" → CSV**
4. Salve como: `src/scripts/bdqueimadas.csv`

### Passo 3: Treinar Modelos

```bash
cd src/scripts
python fire_risk_prediction.py
```

**Resultado esperado:**
```
🔥 Sistema de Predição de Risco de Fogo - Mossoró/RN
==================================================
📊 Carregando dados do BDQueimadas...
✅ Dados carregados: 500 registros

🧠 Treinando Rede Neural (MLP)...
✅ Neural Network: R² = 0.526

🎯 Treinando K-Nearest Neighbors (KNN)...
✅ KNN: R² = 0.512

🌲 Treinando Random Forest...
✅ Random Forest: R² = 0.710

💾 Salvando resultados em ./output...
✅ Concluído!
```

### Passo 4: Recarregar Dashboard

```bash
# Pare o servidor (Ctrl+C) e reinicie
yarn dev
```

---

## 🎓 Entendendo os Modelos

### 🧠 Neural Network (MLP)

| Aspecto | Valor |
|---------|-------|
| **Arquitetura** | 3 camadas ocultas (100, 50, 25) |
| **R² Score** | 52.6% |
| **Características** | Captura padrões não-lineares |

**Quando usar:** Dados complexos com relações não-lineares

### 🎯 K-Nearest Neighbors (KNN)

| Aspecto | Valor |
|---------|-------|
| **Tipo** | Baseado em similaridade |
| **R² Score** | 51.2% |
| **Otimização** | Grid Search |

**Atenção:** Apresenta overfitting (R²=100% treino) - memoriza dados

### 🌲 Random Forest ⭐ MELHOR MODELO

| Aspecto | Valor |
|---------|-------|
| **Árvores** | 100 árvores de decisão |
| **R² Score** | **71.0%** |
| **Feature Top** | Dias sem Chuva (57.5%) |

**Recomendado:** Melhor equilíbrio entre precisão e interpretabilidade

---

## 📈 Feature Importance

| Feature | Importância | Descrição |
|---------|-------------|-----------|
| ☔ Dias sem Chuva | **57.5%** | Fator mais crítico |
| 🌧️ Precipitação | 23.4% | Reduz risco |
| 🔥 FRP | 8.9% | Potência radiativa |
| 📍 Latitude | 2.5% | Localização |
| 📍 Longitude | 2.4% | Localização |
| Outros | 5.3% | Dia, mês, hora, etc. |

**Conclusão:** As **condições climáticas** (dias sem chuva e precipitação) são os principais indicadores de risco de fogo.

---

## 📈 Interpretando Métricas

### R² (Coeficiente de Determinação)

| Valor | Qualidade |
|-------|-----------|
| > 90% | Excelente |
| 70-90% | Muito bom |
| 50-70% | Bom |
| < 50% | Precisa melhorar |

### RMSE (Root Mean Squared Error)

- **Menor = Melhor**
- Representa o erro médio em % de risco
- RMSE = 6.56 → Erro médio de ~6.5%

### MAE (Mean Absolute Error)

- **Menor = Melhor**
- Média dos erros absolutos
- MAE = 5.42 → Em média, erra 5.4%

---

## ❓ Solução de Problemas

### Erro: "UntrustedHost"

```
[auth][error] UntrustedHost: Host must be trusted
```

✅ **Solução:** Adicione no `.env.local`:
```env
AUTH_TRUST_HOST=true
```

### Porta em uso

```
Port 3000 is in use, using 3001 instead
```

✅ **Normal!** Acesse a porta mostrada no terminal.

### Gráficos vazios

✅ **Verifique** se os arquivos existem em `output/`:
- `model_metrics.json`
- `week_predictions.json`

### Erro de tipos TypeScript

```bash
yarn type-check
```

---

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
yarn dev              # Inicia servidor

# Build
yarn build            # Build produção
yarn start            # Inicia produção

# Qualidade
yarn lint             # Verifica erros
yarn type-check       # Verifica tipos

# Python ML
cd src/scripts
python fire_risk_prediction.py  # Treina modelos
```

---

## 🔌 APIs Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/fire-risk/metrics` | GET | Métricas dos modelos |
| `/api/fire-risk/predictions/week` | GET | Predições 7 dias |
| `/api/fire-risk/predict` | POST | Predição por localização |

### Exemplo de Predição (POST)

```json
// Request
POST /api/fire-risk/predict
{
  "latitude": -5.1894,
  "longitude": -37.3444,
  "municipio": "Mossoró",
  "diaSemChuva": 15,
  "precipitacao": 0,
  "frp": 20
}

// Response
{
  "predictions": {
    "neural_network": 68.5,
    "knn": 52.3,
    "random_forest": 58.7,
    "average": 59.8,
    "risk_level": "high"
  }
}
```

---

## 🎯 Checklist de Apresentação

### Preparação
- [ ] `.env.local` configurado
- [ ] `yarn dev` funcionando
- [ ] Dashboard acessível

### Demonstração
- [ ] Mostrar cards de métricas
- [ ] Explicar R², RMSE, MAE
- [ ] Usar formulário de predição
- [ ] Mostrar gráfico de predições
- [ ] Explicar feature importance
- [ ] Apresentar conclusão (Random Forest melhor)

### Perguntas Esperadas
- **"Qual o melhor modelo?"** → Random Forest (R²=71%)
- **"O que mais influencia o risco?"** → Dias sem Chuva (57.5%)
- **"Como funciona a predição?"** → Demonstrar no formulário

---

## 🎉 Pronto!

**URLs importantes:**
- 🌐 Dashboard: `http://localhost:3000/fire-risk`
- 📊 API Métricas: `http://localhost:3000/api/fire-risk/metrics`
- 📈 API Predições: `http://localhost:3000/api/fire-risk/predictions/week`

---

**💪 Boa sorte com seu projeto de Machine Learning!**

*Desenvolvido com ❤️ para predição de risco de incêndios florestais*
