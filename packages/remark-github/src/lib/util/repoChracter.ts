import {
  isDecimal,
  isAlphabetical
} from 'typed-string-utils'

const CC_DASH = '-'.charCodeAt(0)
const CC_SLASH = '/'.charCodeAt(0)
const CC_DOT = '.'.charCodeAt(0)

/* Check whether `code` is a repo character. */
export function repoCharacter (code: number): boolean {
  return code === CC_SLASH ||
    code === CC_DOT ||
    code === CC_DASH ||
    isDecimal(code) ||
    isAlphabetical(code)
}
