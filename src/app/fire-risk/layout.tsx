import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Monitoramento de Risco de Fogo | Mossoró/RN',
  description:
    'Sistema de predição de risco de fogo baseado em Machine Learning utilizando dados do BDQueimadas (INPE)',
};

export default function FireRiskLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
