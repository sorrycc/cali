import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  entry: ['./src/index.ts'],
  noExternal: [/(.*)/],
  splitting: false,
  // Workaround for https://github.com/egoist/tsup/issues/927
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
})
