/* Normalize an identifier.  Collapses multiple white space
 * characters into a single space, and removes casing. */
export function normalize (value: string) {
  return collapse(value).toLowerCase()
}

/* collapse(' \t\nbar \nbaz\t'); // ' bar baz ' */
function collapse (value: string) {
  return String(value).replace(/\s+/g, ' ')
}
