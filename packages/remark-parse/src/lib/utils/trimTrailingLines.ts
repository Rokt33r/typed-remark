const line = '\n'

/* Remove final newline characters from `value`. */
export function trimTrailingLines (value: string) {
  let index = value.length

  while (value.charAt(--index) === line) { /* empty */ }

  return value.slice(0, index + 1)
}
