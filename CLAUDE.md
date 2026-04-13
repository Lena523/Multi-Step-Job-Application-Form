# Multi-Step Job Application Form

## Project Overview

A React 19 + TypeScript multi-step job application form built with Vite. Currently in early development — the toolchain is fully set up but the form itself is not yet implemented.

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript ~5.9
- **Build Tool**: Vite 7
- **Test Runner**: Vitest 4 (with jsdom environment)
- **DOM Testing**: @testing-library/react 16 + @testing-library/jest-dom
- **Linting**: ESLint 9 (flat config)
- **Formatting**: Prettier 3

## Project Structure

```
src/
├── main.tsx          # React DOM root mount
├── App.tsx           # Main App component
├── App.css           # App-level styles
├── index.css         # Global styles
├── setupTests.ts     # Vitest/jest-dom setup
├── assets/           # Static assets
├── components/       # React components
└── tests/            # Test files
```

## Development Commands

```bash
npm run dev           # Start Vite dev server
npm run build         # Type-check + production build
npm run test          # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with v8 coverage
npm run lint          # Run ESLint on src/
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Prettier format all files
```

## Code Style

- **Formatting**: 4-space indentation, single quotes, no semicolons, trailing commas (ES5)
- **Imports**: Grouped and alphabetically sorted (enforced by eslint-plugin-import)
- **Tests**: Located in `src/tests/`, file naming: `*.test.tsx` or `*.spec.tsx`

## Known Issues

- `vite.config.ts` references `setupFiles: './src/setupTests.js'` but the actual file is `setupTests.ts` (minor extension mismatch — works at runtime)
