# Task 00 — Project Scaffolding

## Goal

Set up the Next.js 16 project with all tooling, dependencies, and configuration.

## Steps

### 1. Create the project

```bash
npx create-next-app@latest . \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*"
```

### 2. Install dependencies

```bash
# Database
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit

# UI (shadcn detects Tailwind v4 automatically)
npx shadcn@latest init  # New York style, Neutral base, CSS variables: yes
npx shadcn@latest add button card input dialog sonner skeleton badge scroll-area tooltip separator

# Icons
npm install @phosphor-icons/react

# Utilities
npm install zod
```

### 3. Set up Prettier

```bash
npm install -D prettier
```

`.prettierrc`:

```json
{ "semi": true, "singleQuote": false, "tabWidth": 2, "trailingComma": "all", "printWidth": 100 }
```

`.prettierignore`:

```
node_modules
.next
drizzle
```

### 4. Set up ESLint with eslint-config-loderunner

Remove the default ESLint config from create-next-app. Install the config + its peer deps:

```bash
npm install -D eslint-config-loderunner \
  @eslint/js typescript-eslint \
  eslint-config-prettier \
  eslint-plugin-react eslint-plugin-react-hooks \
  eslint-plugin-import eslint-import-resolver-typescript
```

Create `eslint.config.mjs`:

```js
import baseConfig from "eslint-config-loderunner/base";
import typescriptConfig from "eslint-config-loderunner/typescript";
import reactConfig from "eslint-config-loderunner/react";
import importConfig from "eslint-config-loderunner/import";
import formattingConfig from "eslint-config-loderunner/formatting";

export default [
  { ignores: [".next/", "node_modules/", "drizzle/"] },
  ...baseConfig,
  ...typescriptConfig,
  ...reactConfig,
  ...importConfig,
  ...formattingConfig, // MUST BE LAST
];
```

### 5. npm scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint --max-warnings=0",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "check": "prettier --check . && eslint --max-warnings=0 && tsc --noEmit"
  }
}
```

### 6. Configure Next.js

`next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org", pathname: "/t/p/**" }],
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
```

### 7. Tailwind v4 theme

Update `globals.css` — add indigo/amber theme tokens via `@theme inline`. Map shadcn CSS variables to the indigo/amber palette. No dark mode needed.

### 8. Environment variables

`.env.local.example`:

```
DATABASE_URL=postgresql://...
TMDB_API_KEY=your_tmdb_api_read_access_token
```

`src/lib/env.ts` — Zod validation of `DATABASE_URL` and `TMDB_API_KEY`.

### 9. Drizzle config

`drizzle.config.ts` at project root. `src/lib/db/index.ts` with neon-http client. Placeholder `src/lib/db/schema.ts`.

### 10. Placeholder files

Create all directories and placeholder files matching the project structure in AGENTS.md.

### 11. Format and validate

```bash
npx prettier --write .
npm run check
```

## Done when

- [ ] `npm run dev` starts clean
- [ ] `npm run check` passes
- [ ] All placeholder files exist
