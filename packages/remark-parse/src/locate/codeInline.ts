export function locateInlineCode (value: string, fromIndex?: number) {
  return value.indexOf('`', fromIndex)
}
