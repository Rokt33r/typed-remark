/* collapse(' \t\nbar \nbaz\t'); // ' bar baz ' */
export function collapseWhitespace (value: string) {
  return value.replace(/\s+/g, ' ')
}
