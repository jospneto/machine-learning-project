<img src="./public/react-leap-banner.png" style="width: 100%; margin-bottom: 10px; border-radius: 10px;" />

# 🔥 Sistema de Predição de Risco de Fogo - Mossoró/RN

Sistema inteligente de predição de risco de incêndios florestais baseado em Machine Learning, utilizando dados do **BDQueimadas (INPE)**.

<p style="font-size: 13px; font-style: italic;">Desenvolvido com Next.js, React, TypeScript e Python</p>

---

## 🌟 Visão Geral

Este projeto implementa um dashboard interativo para monitoramento e predição de risco de fogo na região de Mossoró/RN, comparando 3 modelos de Machine Learning:

| Modelo | R² Score | Descrição |
|--------|----------|-----------|
| 🧠 **Neural Network** | 52.6% | MLP com 3 camadas ocultas (100, 50, 25 neurônios) |
| 🎯 **KNN** | 51.2% | K-Nearest Neighbors otimizado via Grid Search |
| 🌲 **Random Forest** | **71.0%** | Ensemble com 100 árvores - **Melhor modelo** |

---

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
yarn install
```

### 2. Configurar Ambiente

Crie `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development
AUTH_SECRET=sua_chave_secreta_aqui
AUTH_TRUST_HOST=true
```

> ⚠️ `AUTH_TRUST_HOST=true` é **obrigatório** para desenvolvimento local.

### 3. Executar

```bash
yarn dev
```

### 4. Acessar Dashboard

Abra: **http://localhost:3000/fire-risk**

---

## 🎨 Features do Dashboard

### Visual
- 🌌 **Tema Galáxia/Fogo** com degradês e animações
- ✨ **Background animado** com estrelas cintilantes
- 🎯 **Cards interativos** com gradientes e efeitos de glow

### Funcionalidades
- 📊 **Métricas em tempo real** dos 3 modelos ML
- 🎯 **Predição interativa** - Calcule risco para qualquer localização
- 📈 **Gráfico de predições** para os próximos 7 dias
- 🌲 **Feature Importance** do Random Forest
- 🎯 **Gráfico Radar** de comparação multi-dimensional
- 📉 **Análise de erros** (RMSE, MAE, R²)

---

## 📚 Documentação

| Arquivo | Descrição |
|---------|-----------|
| [QUICK_START.md](./QUICK_START.md) | Guia rápido de instalação |
| [README_FIRE_RISK.md](./README_FIRE_RISK.md) | Documentação técnica detalhada |
| [CHECKLIST.md](./CHECKLIST.md) | Checklist de implementação |
| [docs/](./docs/) | Documentação da arquitetura |

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **Framer Motion** - Animações
- **Recharts** - Gráficos
- **React Query** - Gerenciamento de estado

### Backend (API Routes)
- **Next.js API Routes** - Endpoints REST
- **Auth.js** - Autenticação

### Machine Learning
- **Python 3.8+**
- **Scikit-learn** - Modelos ML
- **Pandas/NumPy** - Processamento de dados

---

## 📁 Estrutura

```
📦 machine-learning-project
├── 📂 output/                    # Dados dos modelos ML
├── 📂 src/
│   ├── 📂 api/fire-risk/         # Hooks e configurações
│   ├── 📂 app/
│   │   ├── 📂 api/fire-risk/     # API Routes
│   │   └── 📂 fire-risk/         # Dashboard page
│   ├── 📂 components/fire-risk/  # Componentes React
│   ├── 📂 scripts/               # Scripts Python ML
│   └── 📂 styles/                # CSS/Tailwind
└── 📄 .env.local                 # Variáveis de ambiente
```

---

## 🔌 APIs

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/fire-risk/metrics` | GET | Métricas dos modelos |
| `/api/fire-risk/predictions/week` | GET | Predições 7 dias |
| `/api/fire-risk/predict` | POST | Predição por localização |

---

## 🛠️ Comandos

```bash
yarn dev          # Desenvolvimento
yarn build        # Build produção
yarn lint         # Verificar código
yarn type-check   # Verificar tipos
```

---

## 📊 Treinar Modelos (Opcional)

```bash
# Instalar dependências Python
pip install -r src/scripts/requirements.txt

# Executar treinamento
cd src/scripts
python fire_risk_prediction.py
```

---

## 🤝 Contribuindo

1. Fork o repositório
2. Crie sua branch: `git checkout -b feat/minha-feature`
3. Commit: `git commit -m 'Add feature'`
4. Push: `git push origin feat/minha-feature`
5. Abra um Pull Request

---

## 📄 Licença

[MIT](https://choosealicense.com/licenses/mit/)

---

## 🙏 Créditos

- **Dados**: [BDQueimadas - INPE](https://terrabrasilis.dpi.inpe.br/queimadas/bdqueimadas/)
- **Satélites**: AQUA, TERRA, NOAA-20, NPP-375
- **Região**: Mossoró/RN, Brasil

---

<p align="center">
  <strong>🔥 Feito com ❤️ para predição de riscos de incêndio 🔥</strong>
</p>
