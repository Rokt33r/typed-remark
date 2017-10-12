const ws = /[ \t]*\n+[ \t]*/g
const newline = '\n'

export function collapseLines (value: string) {
  return value.replace(ws, newline)
}
