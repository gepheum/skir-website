'use client'

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'

SyntaxHighlighter.registerLanguage('typescript', typescript)

const code = `import { ServiceClient } from "skir-client";
import { IsConvex, Shape } from "./skirout/shapes";

const serviceClient = new ServiceClient("http://localhost:8080/myapi");

const emShape = Shape.create({
  points: [
    {x: 0, y: 0, label: "A"},
    {x: 2, y: 5, label: "B"},
    {x: 2, y: 2, label: "C"},
    {x: 4, y: 5, label: "D"},
    {x: 4, y: 0, label: "E"},
  ],
  label: "M",
});

// Invoke the IsConvex method remotely
const isConvex: boolean = await serviceClient.invokeRemote(IsConvex, emShape);

console.log(isConvex);  // false`

export function RpcExample() {
  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      <div className="px-4 py-3 text-sm font-medium border-b border-border bg-secondary/30 text-primary">
        client.ts
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language="typescript"
          style={atomOneDark}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: 'transparent',
            padding: '1.5rem',
          }}
          codeTagProps={{
            style: {
              fontSize: '0.875rem',
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
