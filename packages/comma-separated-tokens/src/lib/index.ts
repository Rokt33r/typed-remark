const C_COMMA: string = ','
const C_SPACE: string = ' '
const EMPTY: string = ''

export interface StringifyOptions {
  padLeft?: boolean
  padRight?: boolean
}

/* Parse comma-separated tokens to an array. */
export function parse (input: string): string[] {
  const values: string[] = []
  let index: number = input.indexOf(C_COMMA)
  let lastIndex: number = 0
  let end: boolean = false
  let val: string

  while (!end) {
    if (index === -1) {
      index = input.length
      end = true
    }

    val = input.slice(lastIndex, index).trim()

    if (val || !end) {
      values.push(val)
    }

    lastIndex = index + 1
    index = input.indexOf(C_COMMA, lastIndex)
  }

  return values
}

/* Compile an array to comma-separated tokens.
 * `options.padLeft` (default: `true`) pads a space left of each
 * token, and `options.padRight` (default: `false`) pads a space
 * to the right of each token. */
export function stringify (values: string[], options?: StringifyOptions): string {
  const settings = options || {}
  const left = settings.padLeft

  /* Ensure the last empty entry is seen. */
  if (values[values.length - 1] === EMPTY) {
    values = values.concat(EMPTY)
  }

  return values
    .join(
      (settings.padRight ? C_SPACE : EMPTY)
      + C_COMMA
      + (left || left === undefined || left === null ? C_SPACE : EMPTY),
    )
    .trim()
}
