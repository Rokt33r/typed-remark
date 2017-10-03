/**
 * FIXME: This function already exists in parse-entities/utils
 * Should consider extract this function into NPM package
 */

/* Check if the given character code, or the character
 * code at the first character, is alphabetical. */
export function isAlphabetical (charOrCharCode: string | number) {
  const code = typeof charOrCharCode === 'string'
    ? charOrCharCode.charCodeAt(0)
    : charOrCharCode

  return (code >= 97 && code <= 122) || /* a-z */
    (code >= 65 && code <= 90) /* A-Z */
}
