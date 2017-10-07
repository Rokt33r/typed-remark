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
