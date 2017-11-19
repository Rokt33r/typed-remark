import { repoCharacter } from '../util/repoChracter'

/**
 * Find a possible mention.
 */
export function locateMention (value: string, fromIndex: number): number {
  const index = value.indexOf('@', fromIndex)

  if (index !== -1 && repoCharacter(value.charCodeAt(index - 1))) {
    return locateMention(value, index + 1)
  }

  return index
}
