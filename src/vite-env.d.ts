/**
 * `vite/client` covers Vite's own import suffixes (`?raw`, `?url`, assets) and is
 * pulled in via `types: ["vite/client"]` in tsconfig.app.json, so this file only
 * declares the app's own non-JS modules.
 *
 * The value is `unknown` on purpose: `src/data/publications.ts` must narrow and
 * validate it, so a schema mistake in the TOML cannot slip through as `any`.
 * (Keep this file free of top-level imports/exports, or it stops being ambient.)
 */
declare module '*.toml' {
  const data: unknown
  export default data
}
