'use client'

import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navigation = [
  {
    title: 'Getting started',
    items: [
      { title: 'Introduction', href: '/docs' },
      { title: 'Setup & workflow', href: '/docs/setup' },
      { title: 'Project examples', href: '/docs/examples' },
    ],
  },
  {
    title: 'Core concepts',
    items: [
      { title: 'Language reference', href: '/docs/language-reference' },
      { title: 'Serialization', href: '/docs/serialization' },
      { title: 'Schema evolution', href: '/docs/schema-evolution' },
      { title: 'Skir services', href: '/docs/services' },
      { title: 'External dependencies', href: '/docs/dependencies' },
    ],
  },
  {
    title: 'Generated code',
    items: [
      { title: 'C++', href: '/docs/cpp' },
      { title: 'Dart', href: '/docs/dart' },
      { title: 'Java', href: '/docs/java' },
      { title: 'Kotlin', href: '/docs/kotlin' },
      { title: 'Python', href: '/docs/python' },
      { title: 'TypeScript', href: '/docs/typescript' },
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
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
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
