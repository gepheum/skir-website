#!/bin/bash

set -e

echo "🔍 Running pre-commit checks..."

# Check for TypeScript type errors
echo "📝 Checking TypeScript types..."
npx tsc --noEmit

# Run ESLint
echo "🔧 Running ESLint..."
npm run lint

# Run build to ensure everything compiles
echo "🏗️  Building project..."
npm run build

echo "✅ All checks passed! Proceeding with commit..."
