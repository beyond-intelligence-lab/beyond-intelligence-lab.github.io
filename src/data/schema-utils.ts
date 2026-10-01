/**
 * Small helpers shared by the TOML schemas. Kept dependency-free so
 * `vite.config.ts` can import them and run validation at build time too.
 */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Returns the string when it is usable, `null` otherwise (so callers can report). */
export function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null
}

export type Fail = (where: string, message: string) => void

/**
 * Collect everything wrong with a hand-edited file, then throw once: one run
 * reports all the mistakes rather than only the first.
 */
export function reportProblems(problems: readonly string[], label: string): void {
  if (problems.length > 0) {
    throw new Error(`${label} 有问题：\n${problems.map((problem) => `  - ${problem}`).join('\n')}`)
  }
}
