import {
  ArrowRight,
  BookOpen,
  Globe,
  Layers,
  LayoutGrid,
  Package,
  PenTool,
  RefreshCw,
  Zap,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Documentation - Skir Documentation',
  description: 'Practical rules for writing future-proof schemas and robust APIs.',
}

const sections = [
  {
    title: 'Getting Started',
    description: 'Set up Skir in your project and learn the basic workflow.',
    href: '/docs/setup',
    icon: BookOpen,
  },
  {
    title: 'Project Examples',
    description: 'Explore real-world repositories and starter projects across languages.',
    href: '/docs/examples',
    icon: LayoutGrid,
  },
  {
    title: 'Language Reference',
    description: 'Complete guide to the Skir schema language syntax and features.',
    href: '/docs/language-reference',
    icon: Zap,
  },
  {
    title: 'Serialization',
    description: 'Learn about JSON and binary serialization formats.',
    href: '/docs/serialization',
    icon: Layers,
  },
  {
    title: 'Schema Evolution',
    description: 'Guidelines for evolving your schema without breaking compatibility.',
    href: '/docs/schema-evolution',
    icon: RefreshCw,
  },
  {
    title: 'Typesafe RPCs',
    description: 'Build typesafe APIs with Skir services.',
    href: '/docs/services',
    icon: Globe,
  },
  {
    title: 'External Dependencies',
    description: 'Import types from other GitHub repositories.',
    href: '/docs/dependencies',
    icon: Package,
  },
  {
    title: 'Best Practices',
    description: 'Practical rules for writing future-proof schemas and robust APIs.',
    href: '/docs/best-practices',
    icon: PenTool,
  },
]

export default function DocsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Skir is a declarative language for representing data types, constants, and APIs. Define
          your schema once in a <code className="text-primary font-mono">.skir</code> file and
          generate idiomatic, type-safe code for TypeScript, Python, Java, C++, Kotlin, and Dart.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-semibold">{section.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
              <span className="text-sm text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn more
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          )
        })}
      </div>

      <div className="p-6 rounded-lg border border-border bg-card">
        <h2 className="font-semibold mb-2">Supported Languages</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Skir generates idiomatic code for all major programming languages.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { name: 'TypeScript', href: '/docs/typescript' },
            { name: 'Python', href: '/docs/python' },
            { name: 'C++', href: '/docs/cpp' },
            { name: 'Java', href: '/docs/java' },
            { name: 'Kotlin', href: '/docs/kotlin' },
            { name: 'Dart', href: '/docs/dart' },
          ].map((lang) => (
            <Link
              key={lang.name}
              href={lang.href}
              className="px-3 py-1 text-sm rounded-full border border-border hover:border-primary/50 hover:text-primary transition-colors"
            >
              {lang.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
