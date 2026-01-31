"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

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
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-foreground">
          <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
        </pre>
      </div>
    </div>
  )
}
