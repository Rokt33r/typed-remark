import { getEntityPrefixLength } from './getEntityPrefixLength'

const PUNCTUATION = /[-!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~_]/

/**
 * For shortcut and collapsed reference links, the contents
 * is also an identifier, so we need to restore the original
 * encoding and escaping that were present in the source
 * string.
 *
 * This function takes the unescaped & unencoded value from
 * shortcut's child nodes and the identifier and encodes
 * the former according to the latter.
 */
export function copyIdentifierEncoding (value: string, identifier: string) {
  const length = value.length
  const count = identifier.length
  const result = []
  let position = 0
  let index = 0
  let start

  while (index < length) {
    /* Take next non-punctuation characters from `value`. */
    start = index

    while (index < length && !PUNCTUATION.test(value.charAt(index))) {
      index += 1
    }

    result.push(value.slice(start, index))

    /* Advance `position` to the next punctuation character. */
    while (position < count && !PUNCTUATION.test(identifier.charAt(position))) {
      position += 1
    }

    /* Take next punctuation characters from `identifier`. */
    start = position

    while (position < count && PUNCTUATION.test(identifier.charAt(position))) {
      if (identifier.charAt(position) === '&') {
        position += getEntityPrefixLength(identifier.slice(position))
      }

      position += 1
    }

    result.push(identifier.slice(start, position))

    /* Advance `index` to the next non-punctuation character. */
    while (index < length && PUNCTUATION.test(value.charAt(index))) {
      index += 1
    }
  }

  return result.join('')
}
