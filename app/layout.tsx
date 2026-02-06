import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skir - Like Protocol Buffer, but better',
  description:
    'A declarative language for representing data types, constants, and services. Define your schema once and generate idiomatic, type-safe code for TypeScript, Python, Java, C++, Kotlin, and Dart.',
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
    'schema',
    'codegen',
  ],
  authors: [{ name: 'Gepheum' }],
  openGraph: {
    title: 'Skir - Like Protocol Buffer, but better',
    description: 'A descriptive language for representing data types, constants, and services.',
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
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
