# 🔥 Predição de Risco de Fogo - Mossoró/RN
## Sequência Lógica dos Slides para Apresentação

---

## SLIDE 1: Capa
**Título:** Predição de Risco de Incêndio com Machine Learning

**Subtítulo:** Análise preditiva utilizando dados do BDQueimadas (INPE) para a região de Mossoró/RN

**Informações:**
- Disciplina: Aprendizado de Máquina
- Aluno: José Neto
- Instituição: [Sua Universidade]
- Data: Dezembro/2025

---

## SLIDE 2: Problema
**Título:** O Problema dos Incêndios Florestais

**Conteúdo:**
- 🔥 Incêndios florestais causam danos ambientais, econômicos e sociais
- 🌵 Região Nordeste (Caatinga) é particularmente vulnerável durante períodos de seca
- ⏰ Necessidade de **previsão antecipada** para ações preventivas
- 📊 Dados históricos disponíveis, mas subutilizados

**Pergunta central:**
> "É possível prever o risco de incêndio utilizando dados climáticos e geográficos?"

---

## SLIDE 3: Objetivo
**Título:** Objetivos do Projeto

**Objetivo Geral:**
- Desenvolver modelos de Machine Learning para predição de risco de fogo na região de Mossoró/RN

**Objetivos Específicos:**
1. Analisar dados históricos do BDQueimadas (INPE)
2. Treinar e comparar 3 modelos de ML (MLP, KNN, Random Forest)
3. Identificar variáveis mais influentes no risco de incêndio
4. Criar sistema de predição para próximos dias/meses

---

## SLIDE 4: Base de Dados
**Título:** Fonte de Dados - BDQueimadas (INPE)

**Sobre a base:**
- 📡 **Fonte:** Instituto Nacional de Pesquisas Espaciais (INPE)
- 🛰️ **Satélites:** AQUA, TERRA, NOAA-20, NPP-375
- 📍 **Região:** Rio Grande do Norte (foco em Mossoró)
- 📅 **Período:** Janeiro a Dezembro de 2025
- 📊 **Registros:** ~7.600 focos de incêndio

**Variáveis disponíveis:**
| Variável | Descrição |
|----------|-----------|
| DataHora | Data e hora do registro |
| Latitude/Longitude | Coordenadas geográficas |
| Município | Nome do município |
| DiaSemChuva | Dias consecutivos sem precipitação |
| Precipitação | Volume de chuva (mm) |
| RiscoFogo | Índice de risco (0-1) |
| FRP | Fire Radiative Power |
| Bioma | Tipo de vegetação |

---

## SLIDE 5: Pré-processamento
**Título:** Tratamento dos Dados

**Etapas realizadas:**

1. **Limpeza de dados:**
   - Remoção de valores inválidos (-999)
   - 519 registros removidos por RiscoFogo inválido
   - 654 valores de DiaSemChuva tratados

2. **Tratamento de outliers:**
   - Técnica de capping usando IQR (Interquartile Range)
   - Normalização de valores extremos

3. **Feature Engineering:**
   - Extração de features temporais (Mês, Dia, DiaSemana, Hora)
   - Encoding de variáveis categóricas (Bioma, Município)

4. **Normalização:**
   - StandardScaler para padronização das features

**Resultado:** 7.100 registros válidos para treinamento

---

## SLIDE 6: Variáveis Utilizadas
**Título:** Features do Modelo

**Features de entrada (X):**

| Feature | Tipo | Descrição |
|---------|------|-----------|
| DiaSemChuva | Numérica | Dias consecutivos sem chuva |
| Precipitação | Numérica | Volume de precipitação |
| FRP | Numérica | Potência radiativa do fogo |
| Latitude | Numérica | Coordenada geográfica |
| Longitude | Numérica | Coordenada geográfica |
| Mês | Numérica | Mês do ano (1-12) |
| Dia | Numérica | Dia do mês |
| DiaSemana | Numérica | Dia da semana (0-6) |
| Hora | Numérica | Hora do registro |
| Bioma_encoded | Categórica | Tipo de bioma codificado |
| Município_encoded | Categórica | Município codificado |

**Variável alvo (y):**
- **RiscoFogo:** Índice de risco de incêndio (0 a 1)

---

## SLIDE 7: Modelos de Machine Learning
**Título:** Modelos Implementados

### 🧠 1. Rede Neural (MLP)
- **Arquitetura:** 3 camadas ocultas (100, 50, 25 neurônios)
- **Ativação:** ReLU
- **Otimizador:** Adam
- **Early Stopping:** 20 épocas sem melhora

### 🎯 2. K-Nearest Neighbors (KNN)
- **Otimização:** Grid Search
- **Melhores parâmetros encontrados:**
  - K = 9 vizinhos
  - Métrica: Manhattan
  - Pesos: Distância

### 🌲 3. Random Forest
- **Configuração:**
  - 100 árvores de decisão
  - Profundidade máxima: 10
  - Min samples split: 5

---

## SLIDE 8: Divisão dos Dados
**Título:** Estratégia de Treinamento

**Divisão:**
```
┌─────────────────────────────────────────┐
│           Dataset Total                  │
│           7.100 registros                │
└─────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌─────────┐       ┌─────────┐
│ Treino  │       │  Teste  │
│  80%    │       │   20%   │
│ 5.680   │       │  1.420  │
└─────────┘       └─────────┘
```

**Validação:**
- Cross-validation (5 folds) no Grid Search do KNN
- Early stopping com validation split (10%) na Rede Neural

---

## SLIDE 9: Métricas de Avaliação
**Título:** Métricas Utilizadas

| Métrica | Fórmula | Interpretação |
|---------|---------|---------------|
| **R² (Coeficiente de Determinação)** | 1 - (SS_res / SS_tot) | Quanto maior, melhor (0-1) |
| **RMSE (Root Mean Square Error)** | √(Σ(y-ŷ)²/n) | Quanto menor, melhor |
| **MAE (Mean Absolute Error)** | Σ|y-ŷ|/n | Quanto menor, melhor |

**Por que essas métricas?**
- R²: Indica o quanto o modelo explica a variância dos dados
- RMSE: Penaliza erros grandes mais severamente
- MAE: Erro médio em unidades originais

---

## SLIDE 10: Resultados - Comparação
**Título:** Resultados dos Modelos

### Métricas no Conjunto de Teste:

| Modelo | R² | RMSE | MAE |
|--------|-----|------|-----|
| 🧠 Neural Network | 71.0% | 0.133 | 0.059 |
| 🎯 KNN | 75.9% | 0.121 | 0.049 |
| 🌲 **Random Forest** | **79.0%** | **0.113** | **0.046** |

### Visualização:
```
R² Score (Teste)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Neural Network  ████████████████░░░░  71.0%
KNN             ██████████████████░░  75.9%
Random Forest   ████████████████████  79.0% ⭐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**🏆 Vencedor: Random Forest**

---

## SLIDE 11: Feature Importance
**Título:** Variáveis Mais Influentes

### Análise do Random Forest:

```
Feature Importance (%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗓️ Mês              ██████████████████████████  58.9%
☔ Dias sem Chuva   █████░░░░░░░░░░░░░░░░░░░░░   9.6%
📍 Longitude        ████░░░░░░░░░░░░░░░░░░░░░░   8.6%
📅 Dia              ████░░░░░░░░░░░░░░░░░░░░░░   8.5%
📍 Latitude         ███░░░░░░░░░░░░░░░░░░░░░░░   6.8%
🔥 FRP              █░░░░░░░░░░░░░░░░░░░░░░░░░   2.3%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Interpretação:
- **Mês (sazonalidade):** Principal indicador - meses secos (jun-dez) têm maior risco
- **Dias sem chuva:** Segundo fator mais importante - indica estiagem prolongada
- **Localização geográfica:** Algumas áreas são mais propensas a incêndios

---

## SLIDE 12: Análise Sazonal
**Título:** Padrão Sazonal do Risco

### Risco de Fogo por Mês (2025):

| Mês | Dias s/ Chuva | Risco Médio | Nível |
|-----|---------------|-------------|-------|
| Jan | 2 dias | 54% | 🟡 Moderado |
| Fev | 2 dias | 56% | 🟡 Moderado |
| Mar | 4 dias | 32% | 🟡 Moderado |
| Abr | 3 dias | 56% | 🟠 Alto |
| Mai | 6 dias | 80% | 🟠 Alto |
| **Jun** | **11 dias** | **92%** | 🔴 **Crítico** |
| **Jul** | **10 dias** | **98%** | 🔴 **Crítico** |
| **Ago** | **13 dias** | **98%** | 🔴 **Crítico** |
| **Set** | **38 dias** | **99%** | 🔴 **Crítico** |
| **Out** | **54 dias** | **100%** | 🔴 **Crítico** |
| **Nov** | **84 dias** | **100%** | 🔴 **Crítico** |
| **Dez** | **80 dias** | **100%** | 🔴 **Crítico** |

### Conclusão:
> Período de junho a dezembro apresenta risco **CRÍTICO** de incêndios

---

## SLIDE 13: Predições Geradas
**Título:** Sistema de Predição

### Predições Semanais (exemplo):
- Geração automática de previsões para os próximos 7 dias
- Baseado nas condições climáticas atuais do mês

### Predições Anuais:
- Análise mensal do risco esperado
- Identificação de períodos críticos para prevenção

### Aplicação Prática:
- 🚒 Alertar bombeiros em períodos de alto risco
- 🌱 Planejar ações de reflorestamento
- 📢 Conscientizar população sobre queimadas

---

## SLIDE 14: Dashboard Desenvolvido
**Título:** Visualização Interativa

### Funcionalidades do Dashboard:

1. **Mapa de Risco 3D/2D**
   - Visualização geográfica dos focos
   - Cores indicando nível de risco

2. **Cards de Métricas**
   - Performance de cada modelo
   - R², RMSE, MAE em tempo real

3. **Gráficos Comparativos**
   - Comparação entre modelos
   - Feature Importance visual

4. **Predições**
   - Previsão semanal
   - Análise anual por mês

**Tecnologias:** Next.js, React, Three.js, Recharts, TailwindCSS

---

## SLIDE 15: Limitações
**Título:** Limitações do Estudo

1. **Dados históricos limitados:**
   - Apenas dados de 2025
   - Ideal: múltiplos anos para capturar variações

2. **Viés nos dados:**
   - Maioria dos registros tem RiscoFogo = 1.0
   - Poucos exemplos de baixo risco

3. **Variáveis externas não consideradas:**
   - Velocidade do vento
   - Umidade relativa do ar
   - Temperatura ambiente

4. **Generalização:**
   - Modelo treinado para RN
   - Pode não generalizar para outras regiões

---

## SLIDE 16: Trabalhos Futuros
**Título:** Próximos Passos

1. **Expandir base de dados:**
   - Incluir dados de múltiplos anos
   - Adicionar variáveis meteorológicas

2. **Novos modelos:**
   - Gradient Boosting (XGBoost, LightGBM)
   - Redes Neurais Recorrentes (LSTM) para séries temporais

3. **Deploy em produção:**
   - API para consulta em tempo real
   - Integração com sistemas de alerta

4. **Aplicativo móvel:**
   - Notificações de risco para região
   - Denúncia de focos de incêndio

---

## SLIDE 17: Conclusão
**Título:** Conclusões

### Principais Achados:

✅ **Random Forest** apresentou melhor performance (R² = 79%)

✅ **Condições climáticas** (mês + dias sem chuva) respondem por ~68% da predição

✅ Período de **junho a dezembro** apresenta risco CRÍTICO na região

✅ Sistema de predição funcional desenvolvido com dashboard interativo

### Contribuição:
> O projeto demonstra a viabilidade de usar Machine Learning para **prevenção de incêndios florestais**, permitindo ações proativas em períodos de alto risco.

---

## SLIDE 18: Referências
**Título:** Referências

1. **BDQueimadas - INPE**
   - http://queimadas.dgi.inpe.br/queimadas/bdqueimadas

2. **Scikit-learn Documentation**
   - https://scikit-learn.org/stable/

3. **Random Forest para Predição de Incêndios**
   - Artigos científicos relacionados

4. **Feature Importance Analysis**
   - Documentação oficial do Random Forest

---

## SLIDE 19: Agradecimentos
**Título:** Obrigado!

**Contato:**
- GitHub: github.com/jospneto
- Email: [seu-email]

**Código fonte:**
- Disponível no repositório do projeto

**Demonstração:**
- Dashboard acessível em [URL do projeto]

---

## 📝 Notas para o Canva:

### Paleta de cores sugerida:
- **Vermelho fogo:** #EF4444 (risco crítico)
- **Laranja ember:** #F97316 (risco alto)
- **Amarelo:** #EAB308 (risco moderado)
- **Verde:** #22C55E (risco baixo)
- **Roxo cósmico:** #8B5CF6 (destaque)
- **Azul:** #3B82F6 (neural network)
- **Esmeralda:** #10B981 (KNN)
- **Âmbar:** #F59E0B (random forest)

### Ícones sugeridos:
- 🔥 Fogo/Risco
- 🧠 Neural Network
- 🎯 KNN
- 🌲 Random Forest
- 📊 Gráficos/Métricas
- 🗺️ Mapas
- ☔ Chuva/Clima
- 📅 Calendário/Tempo

### Dicas de design:
1. Use fundos escuros para slides de dados (tema "galaxy")
2. Gráficos com cores vibrantes sobre fundo escuro
3. Ícones grandes para representar cada modelo
4. Tabelas com cores alternadas para legibilidade
5. Destaque os números importantes em cor diferente

