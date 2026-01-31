"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { skirLanguage } from '@/lib/skir-language'

const tabs = [
  { id: "skir", label: ".skir" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
]

const codeExamples = {
  skir: `// shapes.skir

struct Point {
  x: int32;
  y: int32;
  label: string;
}

struct Shape {
  points: [Point];
  /// A short string describing this shape.
  label: string;
}

const TOP_RIGHT_CORNER: Point = {
  x = 600,
  y = 400,
  label = "top-right corner",
};

/// Returns true if no part of the shape's boundary curves inward.
method IsConvex(Shape): bool = 12345;`,

  typescript: `// Generated TypeScript code
import { Point, Shape } from "./skirout/shapes";

// Create a frozen (immutable) Point
const point = Point.create({
  x: 3,
  y: 4,
  label: "P"
});

// Serialize to JSON
const json = Point.serializer.toJsonCode(point);
console.log(json); // [3, 4, "P"]

// Deserialize from JSON
const restored = Point.serializer.fromJsonCode(json);
console.log(restored.label); // "P"`,

  python: `# Generated Python code
from skirout.shapes_skir import Point, Shape

# Create a frozen (immutable) Point
point = Point(x=3, y=4, label="P")

# Serialize to JSON
json = Point.serializer.to_json(point)
print(json)  # [3, 4, "P"]

# Deserialize from JSON
restored = Point.serializer.from_json(json)
print(restored.label)  # "P"`,
}

export function CodeExample() {
  const [activeTab, setActiveTab] = useState("skir")

  // Register Skir language
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).hljs) {
      (window as any).hljs.registerLanguage('skir', skirLanguage);
    }
  }, []);

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      {/* Tabs */}
      <div className="flex border-b border-border bg-secondary/30">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary bg-card"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={activeTab}
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
          {codeExamples[activeTab as keyof typeof codeExamples]}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
