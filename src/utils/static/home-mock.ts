import {
  Zap,
  KeyRound,
  Code2,
  Database,
  TestTube,
  Layers,
  Moon,
  Shield,
  Workflow,
  FileJson,
  Blocks,
  Component,
} from 'lucide-react';

export const features = [
  {
    icon: Zap,
    title: 'React Query v5',
    description:
      'Gerenciamento de estado server-side com TanStack Query, incluindo cache inteligente e revalidação automática',
  },
  {
    icon: Component,
    title: 'Sistema de UI Completo',
    description: 'Radix UI + shadcn/ui com componentes acessíveis, animações e temas customizáveis',
  },
  {
    icon: KeyRound,
    title: 'Autenticação',
    description: 'NextAuth v5 com suporte a múltiplos providers, sessões e proteção de rotas',
  },
  {
    icon: Code2,
    title: 'Type Safety First',
    description:
      'TypeScript, ESLint, e Prettier configurados para máxima segurança e produtividade',
  },
  {
    icon: Database,
    title: 'Gerenciamento de Estado',
    description: 'Zustand para estado global simples e poderoso, integrado com persistência',
  },
  {
    icon: TestTube,
    title: 'Testing Ready',
    description:
      'Cypress configurado para testes E2E com suporte a TypeScript e comandos customizados',
  },
  {
    icon: Layers,
    title: 'Arquitetura Modular',
    description:
      'Estrutura de módulos organizada com separação clara de responsabilidades e fácil manutenção',
  },
  {
    icon: Moon,
    title: 'Tema Adaptativo',
    description:
      'Sistema de temas com next-themes, suporte a modo escuro e customização via Tailwind',
  },
  {
    icon: Shield,
    title: 'Validação de Dados',
    description: 'Zod integrado para validação de tipos em runtime e parse de dados de API',
  },
  {
    icon: Workflow,
    title: 'API Generator',
    description: 'Gerador de módulos de API com React Query, tipos e hooks prontos para uso',
  },
  {
    icon: FileJson,
    title: 'HTTP Client Robusto',
    description: 'Cliente HTTP com Ky, interceptors para autenticação e tratamento de erros',
  },
  {
    icon: Blocks,
    title: 'Feature Flags',
    description: 'Sistema de feature flags integrado para controle granular de funcionalidades',
  },
] as const;
