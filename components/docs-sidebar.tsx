'use client'

import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Setup & Workflow', href: '/docs/getting-started' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { title: 'Language Reference', href: '/docs/language-reference' },
      { title: 'Serialization Formats', href: '/docs/serialization' },
      { title: 'Schema Evolution', href: '/docs/schema-evolution' },
      { title: 'Skir Services', href: '/docs/rpc' },
      { title: 'External Dependencies', href: '/docs/dependencies' },
    ],
  },
  {
    title: 'Generated Code',
    items: [
      { title: 'TypeScript', href: '/docs/typescript' },
      { title: 'Python', href: '/docs/python' },
      { title: 'C++', href: '/docs/cpp' },
      { title: 'Java', href: '/docs/java' },
      { title: 'Kotlin', href: '/docs/kotlin' },
      { title: 'Dart', href: '/docs/dart' },
    ],
  },
  {
    title: 'Comparisons',
    items: [{ title: 'Coming from Protobuf', href: '/docs/protobuf' }],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(
    navigation.map((section) => section.title),
  )

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    )
  }

  return (
    <aside className="hidden md:block w-64 shrink-0">
      <div className="sticky top-24">
        <nav className="space-y-6">
          {navigation.map((section) => (
            <div key={section.title}>
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className="flex items-center justify-between w-full text-sm font-semibold text-foreground mb-2 hover:text-primary transition-colors"
              >
                {section.title}
                {openSections.includes(section.title) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              {openSections.includes(section.title) && (
                <ul className="space-y-1 ml-2 border-l border-border pl-4">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'block text-sm py-1 transition-colors',
                          pathname === item.href
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
