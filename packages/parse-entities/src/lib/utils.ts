/* Check if the given character code, or the character
 * code at the first character, is decimal. */
export function isDecimal (charOrCharCode: string | number): boolean {
  const code = typeof charOrCharCode === 'string'
    ? charOrCharCode.charCodeAt(0)
    : charOrCharCode

  return code >= 48 && code <= 57 /* 0-9 */
}

/* Check if the given character code, or the character
 * code at the first character, is hexadecimal. */
export function isHexadecimal (charOrCharCode: string | number) {
  const code = typeof charOrCharCode === 'string'
    ? charOrCharCode.charCodeAt(0)
    : charOrCharCode

  return (code >= 97 /* a */ && code <= 102 /* z */) ||
    (code >= 65 /* A */ && code <= 70 /* Z */) ||
    (code >= 48 /* A */ && code <= 57 /* Z */)
}

/* Check if the given character code, or the character
 * code at the first character, is alphabetical. */
export function isAlphabetical (charOrCharCode: string | number) {
  const code = typeof charOrCharCode === 'string'
    ? charOrCharCode.charCodeAt(0)
    : charOrCharCode

  return (code >= 97 && code <= 122) || /* a-z */
    (code >= 65 && code <= 90) /* A-Z */
}

/* Check if the given character code, or the character
 * code at the first character, is alphanumerical. */
export function isAlphanumerical (charOrCharCode: string | number) {
  return isAlphabetical(charOrCharCode) || isDecimal(charOrCharCode)
}
