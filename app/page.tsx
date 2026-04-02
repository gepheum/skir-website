import { CodeExample } from '@/components/code-example'
import { FeatureCard } from '@/components/feature-card'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { HoverVideo } from '@/components/hover-video'
import { LanguageCard } from '@/components/language-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Github as GitHubIcon, Package, Terminal, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FaJava } from 'react-icons/fa6'
import {
  SiCplusplus,
  SiDart,
  SiGo,
  SiKotlin,
  SiPython,
  SiRust,
  SiSwift,
  SiTypescript,
} from 'react-icons/si'

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
            <a
              href="https://github.com/gepheum/skir"
              target="_blank"
              rel="noopener noreferrer"
              className="soft-surface mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors hover:text-foreground"
            >
              <span className="text-primary font-medium">v1.2</span>
              <span className="text-muted-foreground">A modern alternative to Protocol Buffer</span>
            </a>

            <h1 className="mb-6 text-balance text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              End-to-end type safety
              <br /> <span className="text-primary">made easy</span>
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

            {/* Quick Example Video */}
            <div className="mx-auto max-w-[1000px]">
              <HoverVideo src="/greet.mp4" />
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
                One schema, nine languages, zero friction
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                One YAML file. One command.
                <br />
                No manual reruns: watch mode refreshes generated code on every change.
                <br />
                Zero-install compiler (<code>npx</code>), easy to integrate into any workflow.
              </p>
            </div>

            <CodeExample />
          </div>
        </div>
      </section>

      <section className="border-t border-border py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-2xl font-bold md:text-3xl">
              It&apos;s a fact: AI does better with types
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              A 2025
              <a
                href="https://arxiv.org/pdf/2504.09246?"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline decoration-muted-foreground/50 transition-colors hover:text-foreground"
              >
                study
              </a>{' '}
              reports that nearly 94% of common LLM coding errors are type-related. It helps explain
              why typed ecosystems such as TypeScript have been gaining momentum relative to dynamic
              alternatives. Don&apos;t believe it?
              <a
                href="https://gemini.google.com/share/ea387c7e27e9"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 underline decoration-muted-foreground/50 transition-colors hover:text-foreground"
              >
                Ask AI
              </a>
              .
            </p>
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

            <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 md:gap-3">
              <div className="soft-surface w-[45%] overflow-hidden rounded-xl p-2">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Before
                </div>
                <Image
                  src="/shapes-before.png"
                  alt="Schema before evolution changes"
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 45vw, 420px"
                  className="h-auto w-full rounded-lg"
                />
              </div>
              <div className="soft-surface w-[45%] overflow-hidden rounded-xl p-2">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  After
                </div>
                <Image
                  src="/shapes-after.png"
                  alt="Schema after evolution changes"
                  width={0}
                  height={0}
                  sizes="(max-width: 768px) 45vw, 420px"
                  className="h-auto w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RPC Example Section */}
      <section className="border-t border-border bg-card/30 py-14 md:py-20">
        <div className="container mx-auto">
          <div className="mb-12 max-w-6xl mx-auto text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Typesafe RPCs</h2>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
              SkirRPC is a lightweight HTTP protocol for typesafe cross-service or frontend↔backend
              communication. It integrates with your existing web framework. Your client and server
              use the same generated method definitions, so contract mismatches are caught before
              runtime.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <HoverVideo src="/rpc-studio.mp4" />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Every SkirRPC service ships with a built-in studio app for browsing and testing its
              methods.
            </p>
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

            <div className="soft-surface mb-6 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="text-muted-foreground mb-2">Prompt:</div>
              <p className="text-lg italic text-foreground">
                Create a full-stack application with a Kotlin backend and a TypeScript frontend,
                connected via Skir for data exchange.
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
                  Project created with this prompt
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
              title="GitHub imports"
              description="Don't copy files. Import types directly from any GitHub repository. Share common data structures across projects."
            />
            <FeatureCard
              icon={<SiRust className="h-6 w-6" />}
              title="Rust-like enums"
              description={
                <>
                  Skir <code>enum</code>s have variants. Each variant can be a simple constant or
                  carry typed data, giving you a clean way to model polymorphism.
                </>
              }
            />
            <FeatureCard
              icon={<Package className="h-6 w-6" />}
              title="Immutable data types"
              description="Except in C++, Skir generates deeply immutable types with all fields required at construction time."
            />
            <FeatureCard
              icon={<Terminal className="h-6 w-6" />} // Using Terminal for Dev Experience
              title="First-class IDE support"
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
            <FeatureCard
              icon={<Terminal className="h-6 w-6" />}
              title="Easy to extend"
              description="Code generators are regular NPM modules, so you can add custom ones without hacking the compiler."
            />
            <FeatureCard
              icon={<Package className="h-6 w-6" />}
              title="Constants you can share"
              description={
                <>
                  Define constants in your <code>.skir</code> files. They ship in generated code, so
                  services share the same values without runtime config reads.
                </>
              }
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Schemas you can serialize"
              description={
                <>
                  Skir schemas can be serialized and deserialized as JSON, enabling advanced
                  tooling. This powers the studio app and the{' '}
                  <a
                    href="https://skir.build/converter.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    converter app
                  </a>
                  .
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
            <LanguageCard
              name="TypeScript"
              icon={<SiTypescript className="text-[#3178C6]" />}
              href="/docs/typescript"
            />
            <LanguageCard
              name="Python"
              icon={<SiPython className="text-[#3776AB]" />}
              href="/docs/python"
            />
            <LanguageCard
              name="C++"
              icon={<SiCplusplus className="text-[#00599C]" />}
              href="/docs/cpp"
            />
            <LanguageCard name="Go" icon={<SiGo className="text-[#00ADD8]" />} href="/docs/go" />
            <LanguageCard
              name="Java"
              icon={<FaJava className="text-[#E76F00]" />}
              href="/docs/java"
            />
            <LanguageCard
              name="Kotlin"
              icon={<SiKotlin className="text-[#7F52FF]" />}
              href="/docs/kotlin"
            />
            <LanguageCard
              name="Dart"
              icon={<SiDart className="text-[#0175C2]" />}
              href="/docs/dart"
            />
            <LanguageCard
              name="Swift"
              icon={<SiSwift className="text-[#F05138]" />}
              href="/docs/swift"
            />
            <LanguageCard
              name="Rust"
              icon={<SiRust className="text-[#000000] dark:text-[#DEA584]" />}
              href="/docs/rust"
            />
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
