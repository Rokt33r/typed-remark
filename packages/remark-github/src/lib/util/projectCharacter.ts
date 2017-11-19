import {
  isDecimal,
  isAlphabetical,
} from 'typed-string-utils'

const CC_DOT = '.'.charCodeAt(0)
const CC_DASH = '-'.charCodeAt(0)

/* Check whether `code` is a valid project name character. */
export function projectCharacter (code: number): boolean {
  return code === CC_DOT ||
    code === CC_DASH ||
    isDecimal(code) ||
    isAlphabetical(code)
}
