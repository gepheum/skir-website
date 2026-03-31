import { CodeExample } from '@/components/code-example'
import { FeatureCard } from '@/components/feature-card'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { LanguageCard } from '@/components/language-card'
import { RpcExample } from '@/components/rpc-example'
import { Button } from '@/components/ui/button'
import { ArrowRight, Github as GitHubIcon, Package, Terminal, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function WaveDivider({ colorClass, flip = false }: { colorClass: string; flip?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${flip ? 'top-0 -translate-y-px rotate-180' : 'bottom-0 translate-y-px'} ${colorClass}`}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-16 w-full md:h-24">
        <path
          fill="currentColor"
          d="M0,96L48,90.7C96,85,192,75,288,58.7C384,43,480,21,576,16C672,11,768,21,864,37.3C960,53,1056,75,1152,85.3C1248,96,1344,96,1392,96L1440,96L1440,121L1392,121C1344,121,1248,121,1152,121C1056,121,960,121,864,121C768,121,672,121,576,121C480,121,384,121,288,121C192,121,96,121,48,121L0,121Z"
        />
      </svg>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-22 pt-20 md:px-5 md:pb-28 md:pt-26">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[620px] w-[840px] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]" />
          <div className="absolute left-8 top-28 h-40 w-40 rounded-full bg-accent/35 blur-3xl" />
          <div className="friendly-grid absolute inset-x-0 top-0 h-[480px] opacity-40" />
        </div>

        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="soft-surface mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2">
              <span className="text-primary font-medium">v1.1</span>
              <span className="text-muted-foreground">A modern alternative to Protocol Buffer</span>
            </div>

            <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              The <span className="text-primary">single source of truth</span>
              <br /> for your data types
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              Skir is a declarative language for defining data types, constants, and APIs. Write
              your schema once in a <code className="text-primary font-mono">.skir</code> file and
              generate idiomatic, type-safe code in TypeScript, Python, Java, Go, C++, and more.
            </p>

            <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6 text-base">
                <Link href="/docs/setup">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full bg-transparent text-base"
              >
                <a href="https://github.com/gepheum/skir" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>

            {/* Quick start terminal */}
            <div className="mx-auto mb-12 max-w-md">
              <div className="soft-surface rounded-lg p-4 font-mono text-sm">
                <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                  <Terminal className="h-4 w-4" />
                  <span>Quick Start</span>
                </div>
                <code className="text-primary">npx skir init</code>
              </div>
            </div>

            {/* Quick Example GIF */}
            <div className="soft-surface mx-auto max-w-[1000px] overflow-hidden rounded-xl p-2">
              <Image
                src="/quick-example.gif"
                alt="Skir Quick Example showing VS Code editing and code generation"
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-full rounded-lg"
              />
            </div>
          </div>
        </div>
        <WaveDivider colorClass="text-background" />
      </section>

      {/* Code Example Section */}
      <section className="relative overflow-hidden px-4 py-14 md:px-5 md:py-20">
        <WaveDivider colorClass="text-background" flip />
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
                Code generation done right
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                One YAML file. One command. Watch mode recompiles automatically.
                <br />
                The generated code feels native to each language and is easy to use.
                <br />
                The workflow is dead simple.
              </p>
            </div>

            <CodeExample />
          </div>
        </div>
      </section>

      {/* Schema Evolution Section */}
      <section className="border-t border-border py-14 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
              Serialize now, deserialize in 100 years
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
              Modifying schemas in a long-lived or distributed system is risky—one wrong move can
              break clients or make it impossible to deserialize old data.
              <br />
              Skir has simple guidelines and built-in checks to evolve your schema safely.
            </p>

            <div className="soft-surface mx-auto max-w-[760px] overflow-hidden rounded-xl p-2">
              <Image
                src="/schema-evolution.gif"
                alt="Schema Evolution showing breaking change detection"
                width={0}
                height={0}
                sizes="100vw"
                className="h-auto w-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* RPC Example Section */}
      <section className="border-t border-border bg-card/30 py-14 md:py-20">
        <div className="container mx-auto">
          <div className="mb-12 max-w-6xl mx-auto text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
              RPCs with end-to-end type safety
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
              Define your API methods in Skir and invoke them like local functions{' '}
              <em>a la gRPC</em>. No more API contract mismatches between your frontend and backend
              or across microservices. Client and server are always in sync.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <RpcExample />
          </div>
        </div>
      </section>

      {/* Ask Claude Section */}
      <section className="border-t border-border bg-card/30 py-14 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-8 text-balance text-3xl font-bold md:text-4xl">
              Ask Claude — or your favorite AI
            </h2>

            <div className="soft-surface mb-6 rounded-xl p-6">
              <div className="text-muted-foreground mb-2">Prompt:</div>
              <p className="text-lg italic text-foreground">
                Create a full-stack application with a Kotlin backend and a TypeScript frontend,
                connected via Skir (https://skir.build/) for data exchange.
              </p>
            </div>

            <div className="flex justify-center">
              <Button asChild variant="outline" size="lg" className="rounded-full text-base">
                <a
                  href="https://github.com/gepheum/skir-lost-and-found-example"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubIcon className="mr-2 h-4 w-4" />
                  See the actual project created with this prompt
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border py-14 md:py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">More features</h2>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Serialization to JSON or binary"
              description="Choose between dense JSON for web APIs and databases, readable JSON for debugging, or binary for raw performance."
            />
            <FeatureCard
              icon={<Package className="h-6 w-6" />}
              title="Built-in package manager"
              description="Stop copying files. Import types directly from any GitHub repository. Share common data structures across projects."
            />
            <FeatureCard
              icon={<Terminal className="h-6 w-6" />} // Using Terminal for Dev Experience
              title="First-class developer experience"
              description={
                <>
                  A powerful{' '}
                  <a
                    href="https://marketplace.visualstudio.com/items?itemName=TylerFibonacci.skir-language"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    VS Code extension
                  </a>{' '}
                  with all the features you need. Real-time validation, code completion, automatic
                  code formatting and more.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* Language Support Section */}
      <section className="border-t border-border py-14 md:py-20">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Supported languages</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Generate production-ready code for all major programming languages.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <LanguageCard name="TypeScript" icon="🟦" href="/docs/typescript" />
            <LanguageCard name="Python" icon="🐍" href="/docs/python" />
            <LanguageCard name="C++" icon="⚡" href="/docs/cpp" />
            <LanguageCard name="Go" icon="🐹" href="/docs/go" />
            <LanguageCard name="Java" icon="☕" href="/docs/java" />
            <LanguageCard name="Kotlin" icon="💜" href="/docs/kotlin" />
            <LanguageCard name="Dart" icon="🎯" href="/docs/dart" />
            <LanguageCard name="Swift" icon="🕊️" href="/docs/swift" />
            <LanguageCard name="Rust" icon="🦀" href="/docs/rust" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-14 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">
              Ready to get started?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Set up your first Skir project in minutes. Manage your entire project configuration
              from a single YAML file.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/docs/setup">
                  Read the Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
