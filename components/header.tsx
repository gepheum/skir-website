'use client'

import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Github, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type NavigationItem = {
  name: string
  href?: string
  external?: boolean
  items?: { name: string; href: string }[]
}

const navigation: NavigationItem[] = [
  { name: 'Docs', href: '/docs' },
  { name: 'Quickstart', href: '/docs/setup' },
  { name: 'Language reference', href: '/docs/language-reference' },
  {
    name: 'Generated code',
    items: [
      { name: 'C++', href: '/docs/cpp' },
      { name: 'Dart', href: '/docs/dart' },
      { name: 'Go', href: '/docs/go' },
      { name: 'Java', href: '/docs/java' },
      { name: 'Kotlin', href: '/docs/kotlin' },
      { name: 'Python', href: '/docs/python' },
      { name: 'Rust', href: '/docs/rust' },
      { name: 'Swift', href: '/docs/swift' },
      { name: 'TypeScript', href: '/docs/typescript' },
    ],
  },
]

function ConverterInvaderIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      <path
        d="M6 9V6h2V4h8v2h2v3h2v8h-2v3h-2v-2h-2v2h-4v-2H8v2H6v-3H4V9h2z"
        fill="white"
        stroke="black"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="11.5" r="1.2" fill="black" />
      <circle cx="14.5" cy="11.5" r="1.2" fill="black" />
    </svg>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/octopus.svg"
              alt="Skir"
              width={32}
              height={32}
              className="rounded-full bg-primary/8 p-0.5"
            />
            <span className="text-xl font-bold">Skir</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) =>
              item.items ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex cursor-pointer items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none">
                    {item.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.items.map((subItem) => (
                      <Link key={subItem.name} href={subItem.href}>
                        <DropdownMenuItem className="cursor-pointer">
                          {subItem.name}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : item.external ? (
                <a
                  key={item.name}
                  href={item.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.name}
                </Link>
              ),
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="hidden md:flex h-10 w-10 rounded-full">
            <a
              href="/converter.html"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Converter"
              className="inline-flex items-center justify-center leading-none"
            >
              <ConverterInvaderIcon />
            </a>
          </Button>
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon" className="hidden md:flex rounded-full">
            <a href="https://github.com/gepheum/skir" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background/95 md:hidden">
          <div className="container mx-auto space-y-4 px-4 py-4">
            {navigation.map((item) =>
              item.items ? (
                <div key={item.name} className="space-y-3">
                  <div className="text-sm font-medium text-foreground">{item.name}</div>
                  <div className="ml-1 space-y-3 border-l border-border pl-4">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : item.external ? (
                <a
                  key={item.name}
                  href={item.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ),
            )}
            <div className="flex items-center gap-4 border-t border-border pt-4">
              <Button asChild variant="outline" size="sm" className="h-10 w-10 rounded-full p-0">
                <a
                  href="converter"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Converter"
                  className="inline-flex items-center justify-center leading-none"
                >
                  <ConverterInvaderIcon />
                </a>
              </Button>
              <ThemeToggle />
              <Button asChild variant="outline" size="sm">
                <a href="https://github.com/gepheum/skir" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
