import { CodeExample } from '@/components/code-example'
import { FeatureCard } from '@/components/feature-card'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { LanguageCard } from '@/components/language-card'
import { RpcExample } from '@/components/rpc-example'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  FileCode2,
  Github as GitHubIcon,
  Globe,
  Layers,
  Package,
  RefreshCw,
  Shield,
  Terminal,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        {/* Background gradient effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-8">
              <span className="text-primary font-medium">v1.0</span>
              <span className="text-muted-foreground">Like Protocol Buffer, but better</span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-balance">
              The <span className="text-primary">single source of truth</span>
              <br /> for your data types
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
              Skir is a declarative language for defining data types, constants, and services. Write
              your schema once in a <code className="text-primary font-mono">.skir</code> file and
              generate idiomatic, type-safe code in TypeScript, Python, Java, C++, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="text-base">
                <Link href="/docs/getting-started">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
                <a href="https://github.com/gepheum/skir" target="_blank" rel="noopener noreferrer">
                  <GitHubIcon className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>

            {/* Quick start terminal */}
            <div className="max-w-md mx-auto mb-16">
              <div className="bg-card border border-border rounded-lg p-4 font-mono text-sm">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4" />
                  <span>Quick Start</span>
                </div>
                <code className="text-primary">npx skir init</code>
              </div>
            </div>

            {/* Quick Example GIF */}
            <div className="max-w-[1000px] mx-auto rounded-xl overflow-hidden border border-border shadow-2xl">
              <Image
                src="/skir-website/quick-example.gif"
                alt="Skir Quick Example showing VS Code editing and code generation"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                Code generation done right
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                One YAML file. One command. Watch mode recompiles automatically.
                <br />
                The generated code feels native to each language and is easy to use.
                <br />
                The workflow is stupid simple.
              </p>
            </div>

            <CodeExample />
          </div>
        </div>
      </section>

      {/* Schema Evolution Section */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Serialize now, deserialize in 100 years
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              Modifying schemas in a long-lived or distributed system is risky—one wrong move can
              break clients or make it impossible to deserialize old data.
              <br />
              Skir has simple guidelines and built-in checks to evolve your schema safely.
            </p>

            <div className="max-w-[760px] mx-auto rounded-xl overflow-hidden border border-border shadow-2xl">
              <Image
                src="/skir-website/schema-evolution.gif"
                alt="Schema Evolution showing breaking change detection"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* RPC Example Section */}
      <section className="py-16 md:py-24 border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              RPCs with end-to-end type safety
            </h2>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              Define your RPC methods in Skir and invoke them like local functions{' '}
              <em>a la gRPC</em>. No more API contract mismatches between your frontend and backend
              or across microservices. Client and server are always in sync.
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <RpcExample />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose Skir?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built for modern development with a focus on developer experience and type safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Multi-Language Support"
              description="First-class support for TypeScript, Python, C++, Java, Kotlin, and Dart. Generate native, idiomatic code for each language."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="End-to-End Type Safety"
              description="Generated code is fully type-safe. Catch errors at compile time, not at runtime. No more broken API contracts."
            />
            <FeatureCard
              icon={<RefreshCw className="h-6 w-6" />}
              title="Schema Evolution"
              description="Simple guidelines and built-in checks ensure you can evolve your schema without breaking backward compatibility."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Effortless Serialization"
              description="Serialize to JSON or binary format automatically. Never write parsing code manually again."
            />
            <FeatureCard
              icon={<Layers className="h-6 w-6" />}
              title="RPC Interfaces"
              description="Define typesafe interfaces between frontend and backend or between microservices with end-to-end type safety."
            />
            <FeatureCard
              icon={<Package className="h-6 w-6" />}
              title="Built-in Package Manager"
              description="Import types from GitHub repositories to share common data structures across projects."
            />
          </div>
        </div>
      </section>

      {/* Language Support Section */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supported Languages</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Generate production-ready code for all major programming languages.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <LanguageCard name="TypeScript" icon="🟦" href="/docs/typescript" />
            <LanguageCard name="Python" icon="🐍" href="/docs/python" />
            <LanguageCard name="C++" icon="⚡" href="/docs/cpp" />
            <LanguageCard name="Java" icon="☕" href="/docs/java" />
            <LanguageCard name="Kotlin" icon="💜" href="/docs/kotlin" />
            <LanguageCard name="Dart" icon="🎯" href="/docs/dart" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Set up your first Skir project in minutes. Manage your entire project configuration
              from a single YAML file.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/docs/getting-started">
                  Read the Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/docs/protobuf">
                  <FileCode2 className="mr-2 h-4 w-4" />
                  Coming from Protobuf?
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
