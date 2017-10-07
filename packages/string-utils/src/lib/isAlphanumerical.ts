import { isAlphabetical } from './isAlphabetical'
import { isDecimal } from './isDecimal'

/* Check if the given character code, or the character
 * code at the first character, is alphanumerical. */
export function isAlphanumerical (charOrCharCode: string | number) {
  return isAlphabetical(charOrCharCode) || isDecimal(charOrCharCode)
}
