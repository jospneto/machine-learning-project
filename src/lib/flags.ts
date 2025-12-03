/**
 * Sistema de Feature Flags customizado
 * Implementação simples sem dependências externas
 */

import { ENVIRONMENT as DEPLOY_ENVIRONMENT } from '../config';

export enum ENVIRONMENTS {
  PRODUCTION = 'production',
  HOMOLOG = 'homolog',
  STAGE = 'stage',
  DEVELOPMENT = 'development',
}

/**
 * Tipo base para feature flags
 */
type FlagDecider = () => boolean;

interface FlagConfig {
  key: string;
  decide: FlagDecider;
}

/**
 * Cria um objeto de flag que retorna o resultado de decide()
 */
const createFlag = (config: FlagConfig) => config.decide();

/**
 * Helper function to create environment-based feature flags
 * @param key - Unique identifier for the feature
 * @param environments - Array of environments where the feature should be enabled
 */
export const createEnvironmentFlag = (key: string, environments: ENVIRONMENTS[] = []) =>
  createFlag({
    key,
    decide: () => environments.includes(DEPLOY_ENVIRONMENT as ENVIRONMENTS),
  });

export const enableExampleFeature = createEnvironmentFlag('example-feature', [
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.STAGE,
]);

export const enableProtectedRoute = createEnvironmentFlag('protected-route', [
  ENVIRONMENTS.DEVELOPMENT,
  ENVIRONMENTS.STAGE,
]);

export const enableDarkMode = createFlag({
  key: 'dark-mode',
  decide: () => true,
});

export const enableAnalytics = createFlag({
  key: 'analytics',
  decide: () =>
    // You can implement A/B testing logic here
    // Example: 50% of users get the feature
    Math.random() > 0.5,
});
