export function locateTag (value: string, fromIndex?: number) {
  return value.indexOf('<', fromIndex)
}
