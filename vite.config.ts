import { readFile } from 'node:fs/promises'

import react from '@vitejs/plugin-react'
import { parse } from 'smol-toml'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

import { parseGroupData } from './src/data/group-schema.ts'
import { parseNewsData } from './src/data/news-schema.ts'
import { parsePublicationData } from './src/data/publication-schema.ts'

/**
 * `import data from './x.toml'` becomes a plain JS module, resolved at build
 * time, so no TOML parser is ever shipped to the browser (`smol-toml` stays a
 * devDependency and must not be imported from `src/`).
 *
 * Uses `load` + an explicit `moduleType: 'js'` — the same shape Vite's own
 * `vite:asset` returns for `?raw` — rather than `transform`, which would let the
 * raw TOML reach the bundler's parser.
 *
 * Files listed in `validators` are checked here too, so malformed data fails
 * `pnpm build` (and CI) instead of throwing in the browser after a deploy.
 */
function tomlPlugin(validators: Record<string, (raw: unknown) => unknown>): Plugin {
  return {
    name: 'bil:toml',
    load: {
      filter: { id: /\.toml$/ },
      async handler(id) {
        const data = parse(await readFile(id, 'utf-8'))
        validators[id.split('/').pop() ?? '']?.(data)
        this.addWatchFile(id)
        return {
          code: `export default ${JSON.stringify(data)}`,
          map: { mappings: '' },
          moduleType: 'js',
        }
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Served from the domain root (beyond-intelligence-lab.github.io), so no sub-path.
  base: '/',
  plugins: [
    react(),
    tomlPlugin({
      'publications.toml': parsePublicationData,
      'group.toml': parseGroupData,
      'news.toml': parseNewsData,
    }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
