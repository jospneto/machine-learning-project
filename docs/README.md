# 🚀 Next Leap - Documentação Completa

> **O projeto que é um pequeno passo para desenvolvedores, um grande salto para a Loomi.**

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitetura](#-arquitetura)
- [Principais Funcionalidades](#-principais-funcionalidades)
- [Bibliotecas Homologadas](#-bibliotecas-homologadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração e Setup](#-configuração-e-setup)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 🎯 Visão Geral

O **Next Leap** é um projeto de referência criado pela Loomi que implementa as melhores práticas e ferramentas para construir aplicações React robustas, escaláveis e prontas para produção.

### Objetivos

- ✅ Servir como coleção de boas práticas para desenvolvimento React
- ✅ Demonstrar soluções para problemas reais de aplicações
- ✅ Facilitar o desenvolvimento de aplicações melhores
- ✅ Manter consistência entre projetos da Loomi

> **Nota:** Este não é um template ou boilerplate, mas sim um guia opinativo que mostra como fazer as coisas de uma determinada forma.

---

## 🛠 Stack Tecnológico

### Core Framework

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Next.js** | 15.0.2 | Framework React com SSR, SSG e App Router |
| **React** | 18 | Biblioteca para construção de interfaces |
| **TypeScript** | 5+ | Superset JavaScript com tipagem estática |

### Gerenciamento de Estado e Dados

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **TanStack Query** | 5.45.1 | Gerenciamento de estado servidor e cache |
| **Zustand** | 4.5.2 | Gerenciamento de estado global leve |
| **Ky** | 1.8.1 | Cliente HTTP moderno e extensível |

### Autenticação

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **NextAuth.js** | 5.0.0-beta.29 | Autenticação completa para Next.js |
| **AuthJS** | - | Padrão de autenticação para aplicações web |

### UI e Estilização

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Tailwind CSS** | 4.1.11 | Framework CSS utility-first |
| **Radix UI** | - | Componentes acessíveis e sem estilo |
| **Shadcn/ui** | - | Componentes React construídos com Radix UI |
| **Motion** | 12.4.7 | Biblioteca de animações (Framer Motion) |
| **Lucide React** | 0.427.0 | Ícones modernos e customizáveis |
| **next-themes** | 0.4.6 | Sistema de temas (dark/light mode) |

### Validação e Formatação

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Zod** | 3.23.8 | Validação de schemas TypeScript-first |
| **Day.js** | 1.11.13 | Biblioteca de manipulação de datas |

### Notificações

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Sonner** | 1.5.0 | Sistema de toasts elegante |

### Feature Flags

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Flags** | 4.0.1 | Sistema de feature flags |

### Testes

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Cypress** | 13.13.0 | Framework de testes end-to-end |

### Qualidade de Código

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **ESLint** | 8+ | Linter para JavaScript/TypeScript |
| **Prettier** | 3.1.1 | Formatador de código |
| **Husky** | 9.0.11 | Git hooks para qualidade de código |

---

## 🏗 Arquitetura

### Padrão de Organização

O projeto segue uma arquitetura modular e escalável baseada em:

- **App Router** do Next.js 15
- **Separação de responsabilidades** por módulos
- **API layer** centralizado e tipado
- **Componentes reutilizáveis** com Shadcn/ui

### Estrutura de Pastas

```
src/
├── api/              # Camada de API e hooks do React Query
├── app/              # Rotas e páginas (App Router)
├── components/       # Componentes reutilizáveis
├── config/           # Configurações globais
├── hooks/            # Hooks customizados
├── lib/              # Bibliotecas e utilitários
├── modules/          # Módulos da aplicação
├── providers/        # Context providers
├── styles/           # Estilos globais e variantes
├── types/            # Tipagens TypeScript
└── utils/            # Funções utilitárias
```

### Fluxo de Dados

1. **Componentes** → Consomem hooks do React Query
2. **Hooks** → Utilizam funções de endpoints
3. **Endpoints** → Fazem requisições via HTTP Client
4. **HTTP Client** → Usa Ky com hooks de autenticação
5. **React Query** → Gerencia cache e estado servidor

---

## ⚡ Principais Funcionalidades

### 🔐 Autenticação

- Autenticação completa com NextAuth.js
- Suporte a múltiplos provedores (Credentials, Google)
- Gerenciamento de sessão JWT
- Proteção de rotas via middleware
- Callbacks customizados para JWT e Session

### 📡 Gerenciamento de API

- Cliente HTTP centralizado com Ky
- Hooks automáticos de autenticação
- Tratamento de erros unificado
- Tipagem completa com TypeScript
- Abstrações para Queries e Mutations

### 🎨 Sistema de Design

- Componentes acessíveis com Radix UI
- Tema claro/escuro com next-themes
- Animações fluidas com Motion
- Design system baseado em Tailwind CSS
- Componentes customizáveis via variants

### 🚩 Feature Flags

- Sistema de feature flags integrado
- Controle de funcionalidades por ambiente
- Configuração centralizada

### 🧪 Testes

- Configuração Cypress para E2E
- Estrutura de testes organizada
- Fixtures e commands customizados

### 🔧 Qualidade de Código

- TypeScript strict mode
- ESLint com regras customizadas
- Prettier para formatação
- Husky para git hooks
- Validação automática em commits

---

## 📚 Bibliotecas Homologadas

> 📖 **Documentação Completa:** Para informações detalhadas sobre todas as bibliotecas homologadas, padrões de uso, versões recomendadas e diretrizes de implementação, consulte a [documentação oficial no Notion](https://www.notion.so/Bibliotecas-homologadas-97dcd5f998754c16aa42cd40b83c7d6f).

Abaixo estão as principais bibliotecas homologadas utilizadas no projeto Next Leap:

### UI Components

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **@radix-ui/react-*** | ✅ Homologado | Componentes base acessíveis |
| **shadcn/ui** | ✅ Homologado | Sistema de componentes |
| **lucide-react** | ✅ Homologado | Ícones |
| **sonner** | ✅ Homologado | Notificações/toasts |

### State Management

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **@tanstack/react-query** | ✅ Homologado | Estado servidor e cache |
| **zustand** | ✅ Homologado | Estado global cliente |

### HTTP Client

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **ky** | ✅ Homologado | Cliente HTTP moderno |

### Styling

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **tailwindcss** | ✅ Homologado | Framework CSS |
| **tailwind-merge** | ✅ Homologado | Merge de classes |
| **class-variance-authority** | ✅ Homologado | Variantes de componentes |
| **clsx** | ✅ Homologado | Utilitário de classes |

### Animations

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **motion** (Framer Motion) | ✅ Homologado | Animações e transições |

### Validation

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **zod** | ✅ Homologado | Validação de schemas |

### Date Handling

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **dayjs** | ✅ Homologado | Manipulação de datas |

### Authentication

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **next-auth** | ✅ Homologado | Autenticação completa |

### Theme

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **next-themes** | ✅ Homologado | Sistema de temas |

### Feature Flags

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **flags** | ✅ Homologado | Feature flags |

### Testing

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **cypress** | ✅ Homologado | Testes E2E |

### Code Quality

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **eslint** | ✅ Homologado | Linting |
| **prettier** | ✅ Homologado | Formatação |
| **husky** | ✅ Homologado | Git hooks |
| **typescript** | ✅ Homologado | Tipagem estática |

### Utilities

| Biblioteca | Status | Uso Recomendado |
|------------|--------|-----------------|
| **@svgr/webpack** | ✅ Homologado | SVG como componentes React |

---

## 📁 Estrutura do Projeto

### `/src/api`

Camada de API organizada por recursos:

```
api/
├── __common__/        # Utilitários e tipos genéricos
├── auth/              # Endpoints de autenticação
│   ├── endpoints.ts
│   ├── types.ts
└── <resource>/        # Recursos específicos
    ├── hooks/         # Hooks do React Query
    ├── endpoints.ts   # Funções de endpoints
    └── types.ts       # Tipagens
```

### `/src/app`

Rotas e páginas usando App Router:

```
app/
├── api/               # API routes
├── layout.tsx         # Layout raiz
├── page.tsx           # Página inicial
├── login/             # Página de login
└── feature-protected/ # Página protegida
```

### `/src/components`

Componentes reutilizáveis:

```
components/
├── ui/                # Componentes base (Shadcn/ui)
├── transitions/       # Componentes de transição
└── icons/             # Ícones SVG
```

### `/src/lib`

Bibliotecas e configurações:

```
lib/
├── auth/              # Configuração NextAuth
├── httpClient/        # Cliente HTTP (Ky)
├── react-query/       # Configuração TanStack Query
├── motion.ts          # Configuração Framer Motion
└── tailwind.ts        # Utilitários Tailwind
```

### `/src/modules`

Módulos da aplicação:

```
modules/
├── auth/              # Módulo de autenticação
│   └── pages/         # Páginas do módulo
└── home/              # Módulo home
    └── pages/          # Páginas do módulo
```

### `/src/providers`

Context providers globais:

```
providers/
├── GlobalProvider/    # Provider principal
├── TanstackProvider/  # Provider React Query
└── ThemeProvider/     # Provider de temas
```

---

## ⚙️ Configuração e Setup

### Pré-requisitos

- **Node.js** 18+ (recomendado versão mais recente)
- **Yarn** 1+ (gerenciador de pacotes)

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/loomi/next-leap.git
cd next-leap

# 2. Instalar dependências
yarn

# 3. Configurar variáveis de ambiente
# Copiar .env.example e preencher com as variáveis necessárias

# 4. Executar em desenvolvimento
yarn dev
```

### Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
# API
API_URL=

# Autenticação
AUTH_SECRET=
AUTH_TRUST_HOST=

# Outras configurações específicas do projeto
```

---

## 🚀 Scripts Disponíveis

### Desenvolvimento

```bash
yarn dev          # Inicia servidor de desenvolvimento
```

### Produção

```bash
yarn build        # Gera build de produção
yarn start        # Inicia servidor de produção
```

### Qualidade de Código

```bash
yarn lint         # Executa ESLint
yarn type-check   # Verifica tipos TypeScript
yarn validate     # Executa type-check, lint e prettier
```

### Testes

```bash
yarn cy           # Abre Cypress para testes E2E
```

### Utilitários

```bash
yarn icons        # Gera componentes de ícones SVG
```

### Git Hooks

```bash
yarn prepare                    # Instala Husky
yarn husky-init-commit          # Configura hook pre-commit
yarn husky-init-push            # Configura hook pre-push
```

---

## 📖 Documentação Adicional

- [Estrutura de API](./architecture/api.md)
- [Estrutura de Pastas](./folder-structure/__index__.md)
- [Autenticação](./get-started/authetication.md)
- [Feature Flags](./get-started/feature-flags.md)
- [Tema](./get-started/theme.md)
- [GitFlow](./gitflow.md)

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Clone o repositório
2. Crie uma branch: `git checkout -b feat/sua-feature`
3. Faça suas alterações
4. Teste suas alterações
5. Envie um Pull Request

---

## 📄 Licença

[MIT](https://choosealicense.com/licenses/mit/)

---

**Desenvolvido com ❤️ pela equipe Loomi**

