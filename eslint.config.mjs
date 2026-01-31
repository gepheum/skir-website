import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      ".git/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Add minimal rules or leave empty for now
    },
  },
];
