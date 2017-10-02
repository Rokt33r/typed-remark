/**
 * FIXME: This function already exists in parse-entities/utils
 * Should consider extract this function into NPM package
 */

 /* Check if the given character code, or the character
 * code at the first character, is decimal. */
export function isDecimal (charOrCharCode: string | number): boolean {
  const code = typeof charOrCharCode === 'string'
    ? charOrCharCode.charCodeAt(0)
    : charOrCharCode

  return code >= 48 && code <= 57 /* 0-9 */
}
