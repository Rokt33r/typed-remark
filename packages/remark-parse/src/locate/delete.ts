export function locateDelete (value: string, fromIndex?: number) {
  return value.indexOf('~~', fromIndex)
}
