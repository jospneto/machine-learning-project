# Feature Flags

Este projeto utiliza o [Flags SDK](https://flags-sdk.dev/frameworks/next) para implementar feature flags, permitindo controlar funcionalidades baseadas em ambiente, A/B testing e proteção de rotas.

## Configuração

As feature flags estão configuradas no arquivo `src/lib/flags.ts` e seguem o padrão oficial do Flags SDK para Next.js.

### Estrutura Base

```typescript
import { flag } from 'flags/next';
import { DEPLOY_ENVIRONMENT } from '.';

export enum ENVIRONMENTS {
  PRODUCTION = 'production',
  HOMOLOG = 'homolog',
  STAGE = 'stage',
  DEVELOPMENT = 'development',
}
```

## Helper para Flags de Ambiente

O projeto inclui um helper para facilitar a criação de flags baseadas em ambiente:

```typescript
export const createEnvironmentFlag = (key: string, environments: ENVIRONMENTS[] = []) => {
  return flag({
    key,
    decide: () => environments.includes(DEPLOY_ENVIRONMENT as ENVIRONMENTS),
  });
};
```

## Tipos de Feature Flags

### 1. Flags Baseadas em Ambiente (Recomendado)

Para funcionalidades específicas de ambiente usando o helper:

```typescript
export const enableProtectedRoute = createEnvironmentFlag('protected-route', [
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.STAGE,
]);

export const enableExampleFeature = createEnvironmentFlag('example-feature', [
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.STAGE,
]);
```

### 2. Flags Simples (Sempre Ativas)

Para funcionalidades que devem estar sempre disponíveis:

```typescript
export const enableDarkMode = flag({
  key: 'dark-mode',
  decide: () => true,
});
```

### 3. Flags com A/B Testing

Para testar funcionalidades com uma porcentagem dos usuários:

```typescript
export const enableAnalytics = flag({
  key: 'analytics',
  decide: () => {
    // 50% dos usuários recebem a funcionalidade
    return Math.random() > 0.5;
  },
});
```

### 4. Flags Manuais (Quando Necessário)

Para casos específicos que precisam de lógica customizada:

```typescript
export const enableCustomLogic = flag({
  key: 'custom-logic',
  decide: () => {
    return [ENVIRONMENTS.DEVELOPMENT, ENVIRONMENTS.HOMOLOG].includes(
      DEPLOY_ENVIRONMENT as ENVIRONMENTS,
    );
  },
});
```

## Como Usar Feature Flags

### Em Componentes React

```typescript
import { enableDarkMode, enableProtectedRoute } from '@/lib/flags';

export default function MyComponent() {
  const isDarkModeEnabled = enableDarkMode();
  const isProtectedRouteEnabled = enableProtectedRoute();

  return (
    <div>
      {isDarkModeEnabled && (
        <button>Toggle Dark Mode</button>
      )}

      {isProtectedRouteEnabled && (
        <div>Protected Features Section</div>
      )}
    </div>
  );
}
```

### Em Server Components (App Router)

```typescript
import { enableAnalytics } from '@/config/flags';

export default async function ServerComponent() {
  const isAnalyticsEnabled = await enableAnalytics();

  return (
    <div>
      {isAnalyticsEnabled && (
        <script src="/analytics.js" />
      )}
      <h1>Minha Página</h1>
    </div>
  );
}
```

### Proteção de Rotas

O projeto inclui um exemplo de rota protegida por feature flag em `/feature-protected`.

#### Proteção no Componente

```typescript
import { redirect } from 'next/navigation';
import { enableProtectedRoute } from '@/config/flags';

export default function ProtectedPage() {
  if (!enableProtectedRoute()) {
    redirect('/');
  }

  return <div>Conteúdo da página protegida</div>;
}
```

#### Proteção no Middleware (Integrada com Auth)

A proteção também está integrada no callback `authorized` do NextAuth em `src/lib/auth/config.ts`:

```typescript
authorized({ auth, request: { nextUrl } }) {
  // Feature flag protection for feature-protected routes
  if (nextUrl.pathname.startsWith('/feature-protected')) {
    if (!enableProtectedRoute()) {
      return Response.redirect(new URL('/', nextUrl));
    }
    // Se a feature estiver habilitada, ainda verifica autenticação
    return isLoggedIn;
  }

  // Outras verificações de auth...
}
```

## Boas Práticas

### 1. Use o Helper `createEnvironmentFlag`

```typescript
// ✅ Recomendado - usando o helper
export const enableNewFeature = createEnvironmentFlag('new-feature', [
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.STAGE,
]);

// ❌ Evitar - implementação manual desnecessária
export const enableNewFeature = flag({
  key: 'new-feature',
  decide: () =>
    [ENVIRONMENTS.DEVELOPMENT, ENVIRONMENTS.STAGE].includes(DEPLOY_ENVIRONMENT as ENVIRONMENTS),
});
```

### 2. Nomenclatura

- Use nomes descritivos: `enableDarkMode` ao invés de `darkMode`
- Prefixe com `enable` para boolean flags
- Use kebab-case para as keys: `'dark-mode'`

### 3. Ambientes

- **DEVELOPMENT**: Para funcionalidades em desenvolvimento ativo
- **STAGE**: Para funcionalidades prontas para teste interno
- **HOMOLOG**: Para funcionalidades em homologação/teste final
- **PRODUCTION**: Para funcionalidades prontas para usuários finais

### 4. Fluxo de Rollout Recomendado

```typescript
// Fase 1: Desenvolvimento
export const enableNewFeature = createEnvironmentFlag('new-feature', [ENVIRONMENTS.DEVELOPMENT]);

// Fase 2: Teste interno
export const enableNewFeature = createEnvironmentFlag('new-feature', [
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.STAGE,
]);

// Fase 3: Homologação
export const enableNewFeature = createEnvironmentFlag('new-feature', [
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.STAGE,
  ENVIRONMENTS.HOMOLOG,
]);

// Fase 4: Produção
export const enableNewFeature = createEnvironmentFlag('new-feature', [
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.STAGE,
  ENVIRONMENTS.HOMOLOG,
  ENVIRONMENTS.PRODUCTION,
]);

// Fase 5: Remoção da flag (feature permanente)
// Remover a flag e deixar apenas o código ativo
```

## Debugging

### Flags Explorer (Vercel Toolbar)

O Flags SDK automaticamente integra com o Flags Explorer do Vercel Toolbar, permitindo:

- Override de flags durante desenvolvimento
- Teste de diferentes estados sem alterar código
- Visualização de todas as flags ativas

### Console Debugging

```typescript
// Para debug, você pode logar o estado das flags
console.log('Dark Mode:', enableDarkMode());
console.log('Protected Route:', enableProtectedRoute());
console.log('Analytics:', enableAnalytics());
```

## Exemplos Avançados

### Flag com Lógica Personalizada

```typescript
export const enablePremiumFeatures = flag({
  key: 'premium-features',
  decide: () => {
    // Lógica personalizada baseada em ambiente e hora
    const isProd = DEPLOY_ENVIRONMENT === ENVIRONMENTS.PRODUCTION;
    const isBusinessHours = new Date().getHours() >= 9 && new Date().getHours() <= 17;

    return isProd && isBusinessHours;
  },
});
```

### Flag para Rollout Gradual

```typescript
export const enableGradualRollout = flag({
  key: 'gradual-rollout',
  decide: () => {
    // Rollout gradual baseado na data
    const rolloutDate = new Date('2024-01-01');
    const now = new Date();

    return now >= rolloutDate;
  },
});
```

### Combinando Helper com Lógica Adicional

```typescript
// Para casos onde você precisa do helper + lógica extra
export const enableComplexFeature = flag({
  key: 'complex-feature',
  decide: () => {
    const environmentCheck = [ENVIRONMENTS.STAGE, ENVIRONMENTS.HOMOLOG].includes(
      DEPLOY_ENVIRONMENT as ENVIRONMENTS,
    );
    const timeCheck = new Date().getDay() !== 0; // Não aos domingos

    return environmentCheck && timeCheck;
  },
});
```

## Migração e Limpeza

Quando uma feature flag não for mais necessária:

1. **Remova a flag** do arquivo `flags.ts`
2. **Remova as condicionais** dos componentes
3. **Mantenha apenas o código da funcionalidade ativa**
4. **Teste** para garantir que nada quebrou

```typescript
// Antes (com flag)
{enableNewFeature() && <NewComponent />}

// Depois (feature permanente)
<NewComponent />
```

## Troubleshooting

### Flag não está funcionando

1. Verifique se a flag está exportada corretamente
2. Confirme se está importando da localização correta
3. Verifique a lógica do `decide()` ou os ambientes no helper
4. Teste em diferentes ambientes

### Erro de tipo TypeScript

```typescript
// ✅ Correto
const isEnabled = enableMyFlag();

// ❌ Incorreto
const isEnabled = enableMyFlag; // Faltou os parênteses
```

### Helper não funciona como esperado

```typescript
// ✅ Correto - array de ambientes
export const myFlag = createEnvironmentFlag('my-flag', [
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.STAGE,
]);

// ❌ Incorreto - passando string ao invés de array
export const myFlag = createEnvironmentFlag('my-flag', ENVIRONMENTS.DEVELOPMENT);
```
