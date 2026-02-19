import { Github as GitHubIcon } from 'lucide-react'
import Link from 'next/link'

const footerLinks = {
  documentation: [
    { name: 'Getting Started', href: '/docs/setup' },
    { name: 'Language Reference', href: '/docs/language-reference' },
    { name: 'Serialization', href: '/docs/serialization' },
    { name: 'Schema Evolution', href: '/docs/schema-evolution' },
  ],
  languages: [
    { name: 'TypeScript', href: '/docs/typescript' },
    { name: 'Python', href: '/docs/python' },
    { name: 'C++', href: '/docs/cpp' },
    { name: 'Java', href: '/docs/java' },
    { name: 'Kotlin', href: '/docs/kotlin' },
    { name: 'Dart', href: '/docs/dart' },
  ],
  resources: [
    { name: 'Skir Services', href: '/docs/services' },
    { name: 'External Dependencies', href: '/docs/dependencies' },
    { name: 'Coming from Protobuf', href: '/docs/protobuf' },
    { name: 'GitHub', href: 'https://github.com/gepheum/skir', external: true },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
                S
              </div>
              <span className="text-xl font-bold">Skir</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">Like Protocol Buffer, but better.</p>
            <a
              href="https://github.com/gepheum/skir"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GitHubIcon className="h-4 w-4" />
              <span>gepheum/skir</span>
            </a>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Documentation</h3>
            <ul className="space-y-2">
              {footerLinks.documentation.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Languages</h3>
            <ul className="space-y-2">
              {footerLinks.languages.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>Released under the MIT License. Copyright 2024-present Gepheum.</p>
        </div>
      </div>
    </footer>
  )
}
