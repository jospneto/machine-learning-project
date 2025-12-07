# 🔥 Sistema de Predição de Risco de Fogo - PROJETO COMPLETO

## 🎯 Resumo do Projeto

Sistema completo de monitoramento e predição de risco de incêndio para Mossoró/RN usando **Machine Learning** e dados do **BDQueimadas (INPE)**.

### ✅ Implementações Realizadas

#### 1. Machine Learning (Python) ✅

- **3 Modelos implementados:**
  - 🧠 **Rede Neural (MLP)**: 3 camadas ocultas (100, 50, 25 neurônios)
  - 🎯 **K-Nearest Neighbors (KNN)**: Otimizado com Grid Search
  - 🌲 **Random Forest**: Ensemble com 100 árvores

- **Features:**
  - Análise exploratória de dados
  - Tratamento de outliers (IQR capping)
  - Feature engineering temporal e geográfica
  - Avaliação com RMSE, MAE e R²
  - Predições para próxima semana
  - Exportação de resultados em JSON

#### 2. API REST (Next.js) ✅

- **Endpoints implementados:**
  - `GET /api/fire-risk/metrics` - Métricas dos modelos
  - `GET /api/fire-risk/predictions/week` - Predições semanais
  - `GET /api/fire-risk/map-data` - Dados para o mapa

- **Tecnologias:**
  - Next.js 15 API Routes
  - TypeScript para type-safety
  - React Query para cache
  - Dados de exemplo incluídos

#### 3. Interface Web (Next.js + React) ✅

- **Dashboard completo com:**
  - 🗺️ **Mapa interativo** (Mapbox GL JS)
    - Marcadores coloridos por nível de risco
    - Popups informativos
    - Navegação e zoom
    - Legenda de cores

  - 📊 **3 Cards de métricas**
    - Performance de cada modelo
    - RMSE, MAE e R² Score
    - Indicadores visuais

  - 📈 **Gráfico comparativo** (Recharts)
    - Predições dos 3 modelos
    - Área chart animado
    - Tooltip interativo
    - Estatísticas rápidas

  - 🎨 **UI/UX Premium**
    - Animações suaves (Framer Motion)
    - Tema dark/light
    - Responsivo mobile
    - Shadcn/UI components

---

## 📁 Estrutura de Arquivos Criados

```
machine-learning-project/
├── src/
│   ├── api/fire-risk/               ✅ CRIADO
│   │   ├── config.ts                # Configurações e níveis de risco
│   │   ├── endpoints.ts             # Funções de chamada API
│   │   ├── types.ts                 # TypeScript interfaces
│   │   └── hooks/                   # React Query hooks
│   │       ├── useGetModelMetrics.tsx
│   │       ├── useGetWeekPredictions.tsx
│   │       ├── useGetMapData.tsx
│   │       └── usePredictLocation.tsx
│   │
│   ├── app/
│   │   ├── api/fire-risk/           ✅ CRIADO
│   │   │   ├── metrics/route.ts
│   │   │   ├── predictions/week/route.ts
│   │   │   └── map-data/route.ts
│   │   │
│   │   └── fire-risk/               ✅ CRIADO
│   │       ├── page.tsx             # Dashboard principal
│   │       └── layout.tsx
│   │
│   ├── components/fire-risk/        ✅ CRIADO
│   │   ├── FireRiskMap.tsx          # Componente Mapbox
│   │   ├── ModelComparisonChart.tsx # Gráfico Recharts
│   │   └── ModelMetricsCards.tsx    # Cards de métricas
│   │
│   └── scripts/                     ✅ CRIADO
│       ├── fire_risk_prediction.py  # Script ML completo
│       └── requirements.txt         # Dependências Python
│
├── output/                          ✅ CRIADO
│   └── .gitkeep                     # Diretório para resultados ML
│
├── .env.example                     ✅ CRIADO
├── README_FIRE_RISK.md             ✅ CRIADO
├── QUICK_START.md                  ✅ CRIADO
└── PROJETO_COMPLETO.md             ✅ CRIADO (este arquivo)
```

---

## 🚀 Como Usar

### 1️⃣ Instalação Rápida

```bash
# 1. Instalar dependências Node.js
yarn install

# 2. Instalar dependências Python
pip install -r src/scripts/requirements.txt

# 3. Configurar variável de ambiente
# Copie .env.example para .env.local e adicione seu Mapbox token
cp .env.example .env.local
```

### 2️⃣ Executar a Aplicação

```bash
# Iniciar servidor de desenvolvimento
yarn dev
```

**Acesse:** http://localhost:3000/fire-risk

### 3️⃣ Treinar Modelos (Opcional)

```bash
# Com dados do BDQueimadas
cd src/scripts
python fire_risk_prediction.py

# Resultados salvos em ./output/
```

---

## 📊 Demonstração

### Dashboard Completo

O sistema oferece:

1. **Visualização Geográfica**
   - Mapa centrado em Mossoró/RN
   - Marcadores coloridos por risco
   - 🟢 Verde: Baixo (0-25%)
   - 🟡 Amarelo: Médio (25-50%)
   - 🔴 Vermelho: Alto (50-75%)
   - 🟤 Crítico: (75-100%)

2. **Análise Comparativa**
   - Gráfico de linhas/área
   - 3 modelos lado a lado
   - Predições para 7 dias
   - Estatísticas agregadas

3. **Métricas de Performance**
   - RMSE (Root Mean Squared Error)
   - MAE (Mean Absolute Error)
   - R² Score (Coeficiente de determinação)
   - Indicadores visuais de performance

---

## 🛠️ Tecnologias Utilizadas

### Backend & ML

| Tecnologia   | Versão | Uso                    |
| ------------ | ------ | ---------------------- |
| Python       | 3.8+   | Scripts ML             |
| Scikit-learn | 1.3+   | Modelos ML             |
| Pandas       | 2.0+   | Processamento de dados |
| NumPy        | 1.24+  | Computação numérica    |
| Matplotlib   | 3.7+   | Visualização           |

### Frontend

| Tecnologia    | Versão | Uso               |
| ------------- | ------ | ----------------- |
| Next.js       | 15.0   | Framework React   |
| TypeScript    | 5.x    | Type-safety       |
| Mapbox GL JS  | 3.16   | Mapas interativos |
| Recharts      | 3.5    | Gráficos          |
| Shadcn/UI     | -      | Componentes UI    |
| TailwindCSS   | 4.1    | Estilização       |
| React Query   | 5.45   | Estado assíncrono |
| Framer Motion | 12.4   | Animações         |

---

## 📈 Resultados Esperados

### Performance dos Modelos

Com dados reais do BDQueimadas, espera-se:

| Modelo         | RMSE    | MAE     | R²        |
| -------------- | ------- | ------- | --------- |
| Neural Network | 6.5-7.5 | 5.0-5.5 | 0.80-0.85 |
| KNN            | 7.0-8.0 | 5.5-6.0 | 0.78-0.82 |
| Random Forest  | 6.0-7.0 | 4.8-5.3 | 0.82-0.86 |

### Interpretação

- **R² > 0.80**: Excelente capacidade preditiva
- **RMSE < 8**: Erro aceitável para escala de risco
- **MAE < 6**: Desvio médio baixo

---

## 🎓 Conceitos Aplicados

### Machine Learning

1. **Regressão**
   - Predição de valores contínuos (risco de fogo)
   - Variável target: RiscoFogo (0-100%)

2. **Feature Engineering**
   - Variáveis temporais (mês, dia, hora)
   - Variáveis geográficas (lat, lon)
   - Variáveis climáticas (precipitação, dias sem chuva)
   - Encoding de variáveis categóricas

3. **Validação**
   - Train/Test split (80/20)
   - Cross-validation (k-fold)
   - Grid Search para otimização

4. **Ensemble Learning**
   - Random Forest (bagging)
   - Votação de múltiplos modelos

### Web Development

1. **Type-Safety**
   - TypeScript em todo projeto
   - Interfaces bem definidas
   - Validação em runtime

2. **Performance**
   - React Query para cache
   - Lazy loading de componentes
   - Otimização de re-renders

3. **UX/UI**
   - Micro-interações
   - Animações fluidas
   - Estados de loading
   - Feedback visual

---

## 📚 Fontes de Dados

### BDQueimadas - INPE

**URL:** https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/

**Descrição:**

- Banco de dados de queimadas e incêndios
- Dados de satélites (AQUA, TERRA, NOAA, NPP)
- Atualização em tempo real
- Cobertura: Todo território brasileiro

**Variáveis Utilizadas:**

- `DiaSemChuva`: Dias consecutivos sem precipitação
- `Precipitacao`: Precipitação em mm
- `RiscoFogo`: Índice de risco calculado (0-100%)
- `FRP`: Fire Radiative Power (intensidade)
- `Latitude/Longitude`: Coordenadas geográficas
- `Municipio/Estado/Bioma`: Classificação espacial

---

## 🔬 Metodologia Científica

### 1. Análise Exploratória

- Visualização de distribuições
- Análise de correlações
- Identificação de outliers
- Análise temporal

### 2. Pré-processamento

- Tratamento de missing values
- Normalização de outliers (IQR capping)
- Encoding de variáveis categóricas
- Normalização (StandardScaler)

### 3. Treinamento

- Separação treino/teste
- Treinamento de múltiplos modelos
- Otimização de hiperparâmetros
- Validação cruzada

### 4. Avaliação

- Métricas quantitativas (RMSE, MAE, R²)
- Análise de resíduos
- Comparação de modelos
- Validação visual

### 5. Deployment

- API REST para servir predições
- Interface web interativa
- Documentação completa
- Dados de exemplo

---

## 🔄 Fluxo de Dados

```
┌─────────────────┐
│  BDQueimadas    │
│     (INPE)      │
└────────┬────────┘
         │ Download CSV
         ▼
┌─────────────────┐
│  Python Script  │
│  Treinamento ML │
└────────┬────────┘
         │ Gera JSONs
         ▼
┌─────────────────┐
│ output/*.json   │
│ (Métricas +     │
│  Predições)     │
└────────┬────────┘
         │ Leitura
         ▼
┌─────────────────┐
│  Next.js API    │
│  (/api/...)     │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  React Hooks    │
│  (React Query)  │
└────────┬────────┘
         │ Renderiza
         ▼
┌─────────────────┐
│   Dashboard     │
│ (Mapa + Charts) │
└─────────────────┘
```

---

## 🎯 Próximas Melhorias

### Curto Prazo

- [ ] Integração com API do INPE em tempo real
- [ ] Adicionar mais variáveis (umidade, vento)
- [ ] Sistema de alertas por email
- [ ] Exportação de relatórios PDF

### Médio Prazo

- [ ] Previsão meteorológica integrada
- [ ] Análise histórica interativa
- [ ] API pública documentada (Swagger)
- [ ] Testes automatizados (Jest, Cypress)

### Longo Prazo

- [ ] Deploy em produção (Vercel/AWS)
- [ ] App mobile (React Native)
- [ ] Monitoramento com Prometheus
- [ ] Integração com Defesa Civil

---

## 🤝 Contribuindo

Este é um projeto acadêmico de Mestrado em Aprendizado de Máquina. Contribuições são bem-vindas!

**Como contribuir:**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📝 Documentação Adicional

- 📖 **README_FIRE_RISK.md**: Documentação completa do sistema
- 🚀 **QUICK_START.md**: Guia rápido de início
- 📊 **src/scripts/projeto_fase1.ipynb**: Análise exploratória original

---

## 🎓 Contexto Acadêmico

**Curso:** Mestrado em Aprendizado de Máquina
**Disciplina:** Machine Learning Aplicado
**Tema:** Predição de Risco de Fogo com ML
**Dados:** BDQueimadas (INPE) - Dados públicos
**Região:** Mossoró/RN e arredores

**Objetivos de Aprendizado:**

- ✅ Aplicar técnicas de ML para problemas reais
- ✅ Trabalhar com dados geoespaciais
- ✅ Comparar diferentes algoritmos
- ✅ Criar sistema end-to-end (ML + Web)
- ✅ Documentar processo científico

---

## ⚠️ Disclaimer

Este sistema foi desenvolvido para fins **educacionais e de pesquisa**. Para decisões críticas relacionadas a prevenção e combate a incêndios, consulte sempre órgãos oficiais como:

- 🚒 **Corpo de Bombeiros**
- 🛡️ **Defesa Civil**
- 🛰️ **INPE** (Instituto Nacional de Pesquisas Espaciais)
- 🌳 **IBAMA** (Instituto Brasileiro do Meio Ambiente)

---

## 📧 Contato

Para dúvidas, sugestões ou colaborações:

- 🐛 **Issues**: GitHub Issues
- 💬 **Discussões**: GitHub Discussions
- 📬 **Email**: [seu-email@exemplo.com]

---

## 📜 Licença

Projeto desenvolvido para fins acadêmicos. Dados do BDQueimadas (INPE) são de domínio público.

---

## ⭐ Agradecimentos

- **INPE** - Pelos dados do BDQueimadas
- **Mapbox** - Pela plataforma de mapas
- **Shadcn** - Pelos componentes UI
- **Comunidade Open Source** - Pelas bibliotecas utilizadas

---

**🎉 Sistema Completo e Funcional!**

✅ Machine Learning implementado
✅ API REST funcionando
✅ Interface web interativa
✅ Documentação completa
✅ Pronto para uso e apresentação

---

_Última atualização: 02/12/2024_
