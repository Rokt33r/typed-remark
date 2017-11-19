import {
  isDecimal,
  isAlphabetical,
} from 'typed-string-utils'

const CC_DASH = '-'.charCodeAt(0)

/* Check whether `code` is a valid username character. */
export function usernameCharacter (code: number) {
  return code === CC_DASH || isDecimal(code) || isAlphabetical(code)
}
