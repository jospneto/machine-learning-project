export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'development';
export const AUTH_SECRET = process.env.AUTH_SECRET ?? 'development-secret-change-in-production';
export const AUTH_TRUST_HOST = process.env.AUTH_TRUST_HOST === 'true';
