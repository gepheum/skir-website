'use client'

import { skirLanguage } from '@/lib/skir-language'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import cpp from 'react-syntax-highlighter/dist/esm/languages/hljs/cpp'
import dart from 'react-syntax-highlighter/dist/esm/languages/hljs/dart'
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java'
import kotlin from 'react-syntax-highlighter/dist/esm/languages/hljs/kotlin'
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('skir', skirLanguage)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('kotlin', kotlin)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('dart', dart)

export type CodeTabId = 'typescript' | 'python' | 'cpp' | 'kotlin' | 'java' | 'dart'

type CodeTab = {
  id: CodeTabId
  label: string
}

type SplitCodeExampleProps = {
  skirCode: string
  codeExamples: Record<CodeTabId, string>
  tabs?: CodeTab[]
  leftTitle?: string
  initialTab?: CodeTabId
}

const defaultTabs: CodeTab[] = [
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' },
  { id: 'kotlin', label: 'Kotlin' },
  { id: 'java', label: 'Java' },
  { id: 'dart', label: 'Dart' },
]

export function SplitCodeExample({
  skirCode,
  codeExamples,
  tabs = defaultTabs,
  leftTitle = '.skir',
  initialTab = 'typescript',
}: SplitCodeExampleProps) {
  const fallbackTab = tabs[0]?.id ?? 'typescript'
  const [activeTab, setActiveTab] = useState<CodeTabId>(initialTab ?? fallbackTab)

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div className="flex h-[540px]">
        <div className="w-[45%] border-r border-border flex flex-col">
          <div className="px-4 py-3 text-sm font-medium border-b border-border bg-secondary/30 text-primary">
            {leftTitle}
          </div>
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <SyntaxHighlighter
              language="skir"
              style={atomOneDark}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: 'transparent',
                height: '100%',
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

        <div className="w-[55%] flex flex-col">
          <div className="flex border-b border-border bg-secondary/30">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-card'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto overflow-y-auto flex-1">
            <SyntaxHighlighter
              language={activeTab}
              style={atomOneDark}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                background: 'transparent',
                height: '100%',
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
