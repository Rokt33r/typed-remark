export function trimLeft (str: string) {
  return str.replace(/^[\s\uFEFF\u00A0]+/, '')
}
