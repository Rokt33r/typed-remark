const INDENT = 4

/**
 * Pad `value` with `level * INDENT` spaces.  Respects
 * lines. Ignores empty lines.
 */
export function pad (value: string, level: number) {
  let index
  let padding

  const lines = value.split('\n')

  index = lines.length
  padding = ' '.repeat(level * INDENT)

  while (index--) {
    if (lines[index].length !== 0) {
      lines[index] = padding + lines[index]
    }
  }

  return lines.join('\n')
}
