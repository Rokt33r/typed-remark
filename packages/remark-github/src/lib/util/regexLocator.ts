import { usernameCharacter } from './usernameCharacter'

const C_AT = '@'
const C_HASH = '#'

const CC_HASH = C_HASH.charCodeAt(0)
const CC_AT = C_AT.charCodeAt(0)

/* Create a bound regex locator. */
export function locatorFactory (regex: RegExp) {
  return locator

  /* Find the place where a regex begins. */
  function locator (value: string, fromIndex: number): number {
    let result
    let prev

    regex.lastIndex = fromIndex

    result = regex.exec(value)

    if (result) {
      result = regex.lastIndex - result[0].length
      prev = value.charCodeAt(result - 1)

      if (
        usernameCharacter(prev) ||
        prev === CC_HASH ||
        prev === CC_AT
      ) {
        /* Find the next possible value. */
        return locator(value, regex.lastIndex)
      }

      return result
    }

    return -1
  }
}
