import { isHexadecimal } from 'typed-string-utils'

const MAX_SHA_LENGTH = 40
const MINUSCULE_SHA_LENGTH = 4
const MIN_SHA_LENGTH = 7

/* Get the end of a SHA which starts at character
 * `fromIndex` in `value`. */
export function shaEnd (value: string, fromIndex: number, allowShort?: boolean): number {
  let index = fromIndex
  let length = value.length
  let size

  /* No reason walking too far. */

  if (length > index + MAX_SHA_LENGTH) {
    length = index + MAX_SHA_LENGTH
  }

  while (index < length) {
    if (!isHexadecimal(value.charCodeAt(index))) {
      break
    }

    index++
  }

  size = index - fromIndex

  if (
    size < (allowShort ? MINUSCULE_SHA_LENGTH : MIN_SHA_LENGTH) ||
    (size === MAX_SHA_LENGTH && isHexadecimal(value.charCodeAt(index)))
  ) {
    return -1
  }

  return index
}
