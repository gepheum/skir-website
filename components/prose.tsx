"use client"

import type { ReactNode } from "react"
import React from "react"
import { cn } from "@/lib/utils"
// Use Light build to allow custom language registration
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python'
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp'
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java'
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin'
import dart from 'react-syntax-highlighter/dist/esm/languages/hljs/dart'
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml'
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash'
import cmake from 'react-syntax-highlighter/dist/esm/languages/hljs/cmake'
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json'
import { skirLanguage } from '@/lib/skir-language'

// Register all languages used in docs
SyntaxHighlighter.registerLanguage('skir', skirLanguage)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('kotlin', kotlin)
SyntaxHighlighter.registerLanguage('dart', dart)
SyntaxHighlighter.registerLanguage('yaml', yaml)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('cmake', cmake)
SyntaxHighlighter.registerLanguage('json', json)

interface ProseProps {
  children: ReactNode
  className?: string
}

export function Prose({ children, className }: ProseProps) {
  return (
    <div className={cn(
      "max-w-none",
      // Headings
      "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:first:mt-0",
      "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:pt-6 [&_h2]:border-t [&_h2]:border-border [&_h2]:first:border-0 [&_h2]:first:pt-0",
      "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-8",
      "[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-6",
      // Paragraphs
      "[&_p]:text-muted-foreground [&_p]:leading-7 [&_p]:mb-4",
      // Lists
      "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ul]:text-muted-foreground",
      "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_ol]:text-muted-foreground",
      "[&_li]:leading-7",
      // Links
      "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary/80",
      // Strong / Bold
      "[&_strong]:text-foreground [&_strong]:font-semibold",
      className
    )}>
      {children}
    </div>
  )
}

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
}

export function CodeBlock({ children, language, filename }: CodeBlockProps) {
  // Use Skir highlighting for Skir code
  const highlightLanguage = language === 'skir' ? 'skir' : language || 'plaintext'
  
  // Display name mapping for the language label
  const displayLanguage = language === 'skir' ? 'Skir' : language
  
  return (
    <div className="mb-4 rounded-lg border border-border overflow-hidden">
      {(filename || language) && (
        <div className="px-4 py-2 bg-secondary/50 border-b border-border text-sm text-muted-foreground flex items-center gap-2">
          {filename && <span className="font-medium">{filename}</span>}
          {displayLanguage && !filename && <span>{displayLanguage}</span>}
        </div>
      )}
      <SyntaxHighlighter
        language={highlightLanguage}
        style={atomOneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: 'transparent',
        }}
        codeTagProps={{
          style: {
            fontSize: '0.875rem',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

interface NoteProps {
  children: ReactNode
  type?: "info" | "warning" | "tip"
}

export function Note({ children, type = "info" }: NoteProps) {
  const styles = {
    info: "border-primary/50 bg-primary/5",
    warning: "border-yellow-500/50 bg-yellow-500/5",
    tip: "border-green-500/50 bg-green-500/5",
  }

  const labels = {
    info: "Note",
    warning: "Warning",
    tip: "Tip",
  }

  return (
    <div className={cn("rounded-lg border-l-4 p-4 mb-4", styles[type])}>
      <p className="font-semibold text-foreground mb-1">{labels[type]}</p>
      <div className="text-sm text-muted-foreground [&_p]:mb-0">{children}</div>
    </div>
  )
}

// Heading components
export function H1({ children }: { children: ReactNode }) {
  return <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0">{children}</h1>
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl font-semibold mb-4 mt-10 pt-6 border-t border-border first:border-0 first:pt-0">{children}</h2>
}

export function H3({ children }: { children: ReactNode }) {
  return <h3 className="text-xl font-semibold mb-3 mt-8">{children}</h3>
}

export function H4({ children }: { children: ReactNode }) {
  return <h4 className="text-lg font-semibold mb-2 mt-6">{children}</h4>
}

// Text components
export function P({ children }: { children: ReactNode }) {
  return <p className="text-muted-foreground leading-7 mb-4">{children}</p>
}

export function InlineCode({ children }: { children: ReactNode }) {
  return <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded">{children}</code>
}

// List components
export function List({ children, ordered = false }: { children: ReactNode, ordered?: boolean }) {
  const Component = ordered ? 'ol' : 'ul'
  const listStyle = ordered ? 'list-decimal' : 'list-disc'
  return (
    <Component className={cn(listStyle, "pl-6 mb-4 space-y-2 text-muted-foreground")}>
      {children}
    </Component>
  )
}

export function ListItem({ children }: { children: ReactNode }) {
  return <li className="leading-7">{children}</li>
}
