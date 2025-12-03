//https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
export async function register() {
  (await import('@/lib/env')).envValidator();
}
