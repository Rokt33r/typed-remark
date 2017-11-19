import {
  isHexadecimal,
  isDecimal,
} from 'typed-string-utils'
import {
  repoCharacter
} from '../util/repoChracter'

/* Find a possible reference. */
export function locateRepoReference (value: string, fromIndex: number): number {
  const hash = value.indexOf('@', fromIndex)
  const issue = value.indexOf('#', fromIndex)
  let index
  let start
  let test

  if (hash === -1) {
    index = issue
  } else if (issue === -1) {
    index = hash
  } else {
    index = (hash > issue ? issue : hash)
  }

  start = index

  if (start === -1) {
    return index
  }

  while (index >= fromIndex) {
    if (!repoCharacter(value.charCodeAt(index - 1))) {
      break
    }

    index--
  }

  if (index < start && index >= fromIndex) {
    test = start === hash ? isHexadecimal : isDecimal

    if (
      test(value.charCodeAt(start + 1)) &&
      !repoCharacter(value.charCodeAt(index - 1))
    ) {
      return index
    }
  }

  /* Find the next possible value. */
  return locateRepoReference(value, start + 1)
}
