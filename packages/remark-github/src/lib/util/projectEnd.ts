import { projectCharacter } from './projectCharacter'

const GIT_SUFFIX = '.git'
const MAX_PROJECT_LENGTH = 100

/**
 * Get the end of a project which starts at character `fromIndex` in `value`.
 */
export function projectEnd (value: string, fromIndex: number) {
  let index = fromIndex
  const length = value.length
  let size

  while (index < length) {
    if (!projectCharacter(value.charCodeAt(index))) {
      break
    }

    index++
  }

  size = fromIndex - index

  if (
    !size ||
    size > MAX_PROJECT_LENGTH ||
    (value.slice(index - GIT_SUFFIX.length, index) === GIT_SUFFIX)
  ) {
    return -1
  }

  return index
}
