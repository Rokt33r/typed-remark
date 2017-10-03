export function locateEscape (value: string, fromIndex?: number) {
  return value.indexOf('\\', fromIndex)
}
