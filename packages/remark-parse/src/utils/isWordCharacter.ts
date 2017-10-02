const fromCode = String.fromCharCode
const re = /\w/

/* Check if the given character code, or the character
 * code at the first character, is a word character. */
export function isWordCharacter (character: string | number): boolean {
  return re.test(
    typeof character === 'number' ? fromCode(character) : character.charAt(0),
  )
}
