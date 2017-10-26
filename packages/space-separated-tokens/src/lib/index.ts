const empty = ''
const space = ' '
const whiteSpace = /[ \t\n\r\f]+/g

export function parse (value: string): string | string[] {
  const input = value.trim()

  if (input === empty) {
    return []
  }

  return input.split(whiteSpace)
}

export function stringify (values: string[]): string {
  return (values.join(space)).trim()
}
