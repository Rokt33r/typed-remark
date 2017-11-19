import { usernameCharacter } from './usernameCharacter'

const MAX_USER_LENGTH = 39

const CC_DASH = '-'.charCodeAt(0)

/**
 * Get the end of a username which starts at character
 * `fromIndex` in `value`.
 */
export function usernameEnd (value: string, fromIndex: number) {
  let index = fromIndex
  const length = value.length
  let size

  /* First character of username cannot be a dash. */
  if (value.charCodeAt(index) === CC_DASH) {
    return -1
  }

  while (index < length) {
    if (!usernameCharacter(value.charCodeAt(index))) {
      break
    }

    index++
  }

  size = index - fromIndex

  /* Last character of username cannot be a dash. */
  if (
    !size ||
    size > MAX_USER_LENGTH ||
    value.charCodeAt(index - 1) === CC_DASH
  ) {
    return -1
  }

  return index
}
