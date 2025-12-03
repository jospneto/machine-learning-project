import { ArrowRight, Github, Download, Rocket } from 'lucide-react';
import Link from 'next/link';

import { Fade, ScaleFade, SlideFade } from '@/components/transitions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { features } from '@/utils/static/home-mock';

export const HomePage = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100">
    {/* Header */}
    <Fade>
      <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-purple-800">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-xl font-bold text-transparent">
              Next Leap
            </span>
          </div>
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="#features"
              className="text-gray-600 transition-colors hover:text-purple-600"
            >
              Features
            </Link>
            <Link
              href="#getting-started"
              className="text-gray-600 transition-colors hover:text-purple-600"
            >
              Getting Started
            </Link>
            <Button
              variant="outline"
              className="border-purple-200 bg-transparent text-purple-600 hover:bg-purple-50"
              asChild
            >
              <Link href="https://github.com/loomi/next-leap" target="_blank">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </nav>
        </div>
      </header>
    </Fade>

    {/* Hero Section */}
    <SlideFade>
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <Fade transition={{ delay: 0.2 }}>
            <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-200">
              🚀 Next.js Boilerplate
            </Badge>
          </Fade>

          <Fade transition={{ delay: 0.3, duration: 0.5 }}>
            <h1 className="mb-6 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
              Next Leap
            </h1>
          </Fade>

          <Fade transition={{ delay: 0.4 }}>
            <p className="mb-8 text-xl leading-relaxed text-gray-600 md:text-2xl">
              O boilerplate Next.js definitivo para acelerar seu desenvolvimento.
              <br />
              <span className="font-semibold text-purple-600">
                Construa aplicações modernas em minutos.
              </span>
            </p>
          </Fade>

          <ScaleFade transition={{ delay: 0.5 }}>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 text-white hover:from-purple-700 hover:to-purple-800"
                asChild
              >
                <Link href="https://github.com/loomi/next-leap/generate" target="_blank">
                  <Download className="mr-2 h-5 w-5" />
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="border-purple-200 bg-transparent px-8 py-3 text-purple-600 hover:bg-purple-50"
                asChild
              >
                <Link href="https://github.com/loomi/next-leap" target="_blank">
                  <Github className="mr-2 h-5 w-5" />
                  Ver no GitHub
                </Link>
              </Button>
            </div>
          </ScaleFade>
        </div>
      </section>
    </SlideFade>

    {/* Features Section */}
    <section id="features" className="bg-white px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <SlideFade>
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Tudo que você precisa para começar
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Next Leap vem com todas as ferramentas e configurações essenciais para o
              desenvolvimento
            </p>
          </div>
        </SlideFade>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((card, index) => (
            <ScaleFade key={card.title} transition={{ delay: 0.1 * index }}>
              <Card className="h-full border-purple-100 transition-all duration-300 ease-in-out hover:scale-105 hover:border-purple-200 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-gray-900">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </ScaleFade>
          ))}
        </div>
      </div>
    </section>

    {/* Getting Started Section */}
    <SlideFade>
      <section
        id="getting-started"
        className="bg-gradient-to-br from-purple-50 to-white px-4 py-20"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-gray-900">Comece em segundos</h2>
          <ScaleFade>
            <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-xl">
              <div className="rounded-lg bg-gray-900 p-6 text-left">
                <div className="mb-4 flex items-center">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="ml-4 text-sm text-gray-400">Terminal</span>
                </div>
                <code className="font-mono text-green-400">
                  <div className="mb-2">$ git clone git@github.com:loomi/next-leap.git</div>
                  <div>$ yarn dev</div>
                </code>
              </div>
              <p className="mt-6 text-gray-600">
                Em segundos você já tem uma aplicação Next.js completa rodando localmente!
              </p>
            </div>
          </ScaleFade>
        </div>
      </section>
    </SlideFade>

    {/* CTA Section */}
    <SlideFade orientation="horizontal">
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">Pronto para dar o próximo salto?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-purple-100">
            Junte-se ao leap team e ajude a construir e melhorar o Next Leap.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="outline"
              className="border-white bg-transparent px-8 py-3 text-white hover:bg-white hover:text-purple-600"
              asChild
            >
              <Link href="https://github.com/loomi/next-leap" target="_blank">
                <Github className="mr-2 h-5 w-5" />
                Contribuir no GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </SlideFade>

    {/* Footer */}
    <Fade>
      <footer className="border-t border-purple-100 bg-white px-4 py-12">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 flex items-center space-x-2 md:mb-0">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-purple-600 to-purple-800">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text font-semibold text-transparent">
                Next Leap
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <Link
                href="https://github.com/loomi/next-leap/tree/main/docs"
                target="_blank"
                className="transition-colors hover:text-purple-600"
              >
                Documentação
              </Link>
              <Link
                href="https://github.com/loomi/next-leap/tree/main/src/api/example"
                target="_blank"
                className="transition-colors hover:text-purple-600"
              >
                Exemplos
              </Link>
              <Link
                href="https://github.com/loomi/next-leap/discussions"
                target="_blank"
                className="transition-colors hover:text-purple-600"
              >
                Comunidade
              </Link>
              <Link
                href="https://github.com/loomi/next-leap/issues"
                target="_blank"
                className="transition-colors hover:text-purple-600"
              >
                Suporte
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-purple-100 pt-8 text-center text-sm text-gray-500">
            <p>
              &copy; 2024 Next Leap. Construído com ❤️ para a comunidade de desenvolvedores da
              Loomi.
            </p>
          </div>
        </div>
      </footer>
    </Fade>
  </div>
);
