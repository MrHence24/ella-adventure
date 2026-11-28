# Development Guide

## Running Tests
Unit tests use Node.js's built-in test runner (`node:test`):
```bash
npm ci
npm test
```

## Local Dev Server
```bash
npm run dev
```

## Production Build
```bash
npm run build
npm run preview
```
The production bundle is output to `dist/` with relative paths (`base: './'`) so it can be hosted from any subpath or GitHub Pages repository.
