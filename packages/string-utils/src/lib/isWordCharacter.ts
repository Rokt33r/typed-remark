const re = /\w/

/* Check if the given character code, or the character
 * code at the first character, is a word character. */
export function isWordCharacter (charOrCharCode: string | number): boolean {
  const character = typeof charOrCharCode === 'number'
    ? String.fromCharCode(charOrCharCode)
    : charOrCharCode.charAt(0)

  return re.test(character)
}
