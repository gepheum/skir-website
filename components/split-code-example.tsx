'use client'

import { skirLanguage } from '@/lib/skir-language'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp'
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp'
import dart from 'react-syntax-highlighter/dist/esm/languages/hljs/dart'
import go from 'react-syntax-highlighter/dist/esm/languages/hljs/go'
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java'
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin'
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python'
import rust from 'react-syntax-highlighter/dist/esm/languages/hljs/rust'
import swift from 'react-syntax-highlighter/dist/esm/languages/hljs/swift'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs'

const ghibliDaySyntax: { [key: string]: CSSProperties } = {
  hljs: {
    display: 'block',
    overflowX: 'auto',
    background: '#FFF8DC',
    color: '#36454F',
  },
  'hljs-comment': { color: '#8FBC8F', fontStyle: 'italic' },
  'hljs-quote': { color: '#8FBC8F', fontStyle: 'italic' },
  'hljs-keyword': { color: '#2D5016', fontWeight: '700' },
  'hljs-selector-tag': { color: '#2D5016', fontWeight: '700' },
  'hljs-literal': { color: '#FFB6C1' },
  'hljs-number': { color: '#FFB6C1' },
  'hljs-string': { color: '#FFA07A' },
  'hljs-doctag': { color: '#FFA07A' },
  'hljs-title': { color: '#87CEEB' },
  'hljs-section': { color: '#87CEEB' },
  'hljs-type': { color: '#483D8B', fontWeight: '700' },
  'hljs-class .hljs-title': { color: '#483D8B', fontWeight: '700' },
  'hljs-attr': { color: '#8B4513' },
  'hljs-attribute': { color: '#87CEEB' },
  'hljs-variable': { color: '#A0522D' },
  'hljs-template-variable': { color: '#A0522D' },
  'hljs-name': { color: '#2D5016' },
  'hljs-tag': { color: '#2D5016' },
  'hljs-operator': { color: '#696969' },
  'hljs-punctuation': { color: '#696969' },
  'hljs-link': { color: '#87CEEB', textDecoration: 'underline' },
  'hljs-subst': { color: '#36454F' },
}

const ghibliNightSyntax: { [key: string]: CSSProperties } = {
  hljs: {
    display: 'block',
    overflowX: 'auto',
    background: '#191970',
    color: '#F5F5F5',
  },
  'hljs-comment': { color: '#8FBC8F', fontStyle: 'italic' },
  'hljs-quote': { color: '#8FBC8F', fontStyle: 'italic' },
  'hljs-keyword': { color: '#8FBC8F', fontWeight: '700' },
  'hljs-selector-tag': { color: '#8FBC8F', fontWeight: '700' },
  'hljs-literal': { color: '#FFB6C1' },
  'hljs-number': { color: '#FFB6C1' },
  'hljs-string': { color: '#FFA07A' },
  'hljs-doctag': { color: '#FFA07A' },
  'hljs-title': { color: '#87CEEB' },
  'hljs-section': { color: '#87CEEB' },
  'hljs-type': { color: '#6B5B95', fontWeight: '700' },
  'hljs-class .hljs-title': { color: '#6B5B95', fontWeight: '700' },
  'hljs-attr': { color: '#B0E0E6' },
  'hljs-attribute': { color: '#87CEEB' },
  'hljs-variable': { color: '#D2691E' },
  'hljs-template-variable': { color: '#D2691E' },
  'hljs-name': { color: '#8FBC8F' },
  'hljs-tag': { color: '#8FBC8F' },
  'hljs-operator': { color: '#A9A9A9' },
  'hljs-punctuation': { color: '#A9A9A9' },
  'hljs-link': { color: '#87CEEB', textDecoration: 'underline' },
  'hljs-subst': { color: '#F5F5F5' },
}

SyntaxHighlighter.registerLanguage('skir', skirLanguage)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('csharp', csharp)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('go', go)
SyntaxHighlighter.registerLanguage('kotlin', kotlin)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('dart', dart)
SyntaxHighlighter.registerLanguage('swift', swift)
SyntaxHighlighter.registerLanguage('rust', rust)

export type CodeTabId = string

type CodeTab = {
  id: CodeTabId
  label: string
  language?: string
}

type SplitCodeExampleProps = {
  skirCode: string
  codeExamples: Record<string, string>
  tabs?: CodeTab[]
  leftTitle?: string
  initialTab?: CodeTabId
  className?: string
}

const defaultTabs: CodeTab[] = [
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'csharp', label: 'C#', language: 'csharp' },
  { id: 'cpp', label: 'C++' },
  { id: 'go', label: 'Go' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'swift', label: 'Swift' },
  { id: 'rust', label: 'Rust' },
  { id: 'dart', label: 'Dart' },
  { id: 'moonbit', label: 'MoonBit', language: 'plaintext' },
]

export function SplitCodeExample({
  skirCode,
  codeExamples,
  tabs = defaultTabs,
  leftTitle = '.skir',
  initialTab = 'typescript',
  className,
}: SplitCodeExampleProps) {
  const fallbackTab = tabs[0]?.id ?? 'typescript'
  const [activeTab, setActiveTab] = useState<CodeTabId>(initialTab ?? fallbackTab)
  const activeTabConfig = tabs.find((tab) => tab.id === activeTab)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isGhibliWidget = className?.includes('ghibli-example-widget') ?? false

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use light theme during SSR for deterministic rendering before hydration.
  const resolvedTheme = !mounted || theme === 'light' ? 'light' : 'dark'
  const syntaxTheme = isGhibliWidget
    ? resolvedTheme === 'light'
      ? ghibliDaySyntax
      : ghibliNightSyntax
    : resolvedTheme === 'light'
      ? atomOneLight
      : atomOneDark

  return (
    <div
      className={cn(
        'split-code-example rounded-lg border border-border overflow-hidden bg-card',
        className,
      )}
    >
      <div className="flex h-[540px]">
        <div className="split-code-example__schema-pane w-[45%] border-r border-border flex flex-col">
          <div className="split-code-example__schema-title px-4 py-3 text-sm font-medium border-b border-border bg-secondary/30 text-primary">
            {leftTitle}
          </div>
          <div className="split-code-example__schema-code overflow-x-auto overflow-y-auto flex-1">
            <SyntaxHighlighter
              language="skir"
              style={syntaxTheme}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: 'transparent',
                height: '100%',
                boxSizing: 'border-box',
                padding: '1rem',
              }}
              codeTagProps={{
                style: {
                  fontSize: '0.875rem',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
              }}
            >
              {skirCode}
            </SyntaxHighlighter>
          </div>
        </div>

        <div className="split-code-example__target-pane w-[55%] flex flex-col">
          <div className="split-code-example__tabs-row relative border-b border-border bg-secondary/30">
            <div className="overflow-x-auto thin-scrollbar">
              <div className="flex min-w-max">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    data-active={activeTab === tab.id}
                    className={cn(
                      'split-code-example__tab shrink-0 cursor-pointer whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary bg-card'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="split-code-example__tabs-fade-left pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-secondary/80 to-transparent" />
            <div className="split-code-example__tabs-fade-right pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-secondary/80 to-transparent" />
          </div>

          <div
            key={activeTab}
            className="split-code-example__target-code overflow-x-auto overflow-y-auto flex-1"
          >
            <SyntaxHighlighter
              language={activeTabConfig?.language ?? activeTab}
              style={syntaxTheme}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: 'transparent',
                height: '100%',
                boxSizing: 'border-box',
                padding: '1rem',
              }}
              codeTagProps={{
                style: {
                  fontSize: '0.875rem',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                },
              }}
            >
              {codeExamples[activeTab]}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  )
}
