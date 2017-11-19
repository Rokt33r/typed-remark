import { isDecimal } from 'typed-string-utils'

/* Get the end of an issue which starts at character
 * `fromIndex` in `value`. */
export function issueEnd (value: string, fromIndex: number): number {
  let index = fromIndex
  const length = value.length

  while (index < length) {
    if (!isDecimal(value.charCodeAt(index))) {
      break
    }

    index++
  }

  if (index - fromIndex === 0) {
    return -1
  }

  return index
}
