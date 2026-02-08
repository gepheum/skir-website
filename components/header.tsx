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
  items?: { name: string; href: string }[]
}

const navigation: NavigationItem[] = [
  { name: 'Docs', href: '/docs' },
  { name: 'Getting started', href: '/docs/setup' },
  { name: 'Language reference', href: '/docs/language-reference' },
  {
    name: 'Generated code',
    items: [
      { name: 'C++', href: '/docs/cpp' },
      { name: 'Dart', href: '/docs/dart' },
      { name: 'Java', href: '/docs/java' },
      { name: 'Kotlin', href: '/docs/kotlin' },
      { name: 'Python', href: '/docs/python' },
      { name: 'TypeScript', href: '/docs/typescript' },
    ],
  },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/skir-icon-32x32.png"
              alt="Skir"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-xl font-bold">Skir</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) =>
              item.items ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
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
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ),
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon" className="hidden md:flex">
            <a href="https://github.com/gepheum/skir" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>

          <Button asChild className="hidden md:flex">
            <Link href="/docs/setup">Get Started</Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navigation.map((item) =>
              item.items ? (
                <div key={item.name} className="space-y-3">
                  <div className="text-sm font-medium text-foreground">{item.name}</div>
                  <div className="pl-4 space-y-3 border-l border-border ml-1">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href!}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ),
            )}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <ThemeToggle />
              <Button asChild variant="outline" size="sm">
                <a href="https://github.com/gepheum/skir" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button asChild size="sm">
                <Link href="/docs/setup" onClick={() => setMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
