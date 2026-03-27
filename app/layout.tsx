import { ThemeProvider } from '@/components/theme-provider'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import React from 'react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Skir - A modern alternative to Protocol Buffer',
  description:
    'A declarative language for representing data types, constants, and APIs. Define your schema once and generate idiomatic, type-safe code for TypeScript, Python, Java, C++, Kotlin, Dart, Swift, Go, and Rust.',
  keywords: [
    'skir',
    'protocol buffer',
    'protobuf',
    'serialization',
    'rpc',
    'typescript',
    'python',
    'java',
    'c++',
    'kotlin',
    'dart',
    'swift',
    'rust',
    'schema',
    'codegen',
  ],
  authors: [{ name: 'Gepheum' }],
  icons: {
    icon: [
      { url: '/iceberg-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/iceberg-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/iceberg-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/iceberg-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/iceberg-apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Skir - A modern alternative to Protocol Buffer',
    description: 'A descriptive language for representing data types, constants, and APIs.',
    type: 'website',
  },
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
