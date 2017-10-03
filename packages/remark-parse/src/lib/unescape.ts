import { RemarkParser } from './RemarkParser'

/* De-escape a string using the expression at `key` */
export function unescape (this: RemarkParser, value: string): string {
  let prev = 0
  let index = value.indexOf('\\')
  const queue = []
  let character

  while (index !== -1) {
    queue.push(value.slice(prev, index))
    prev = index + 1
    character = value.charAt(prev)

    /* If the following character is not a valid escape,
      * add the slash. */
    if (!character || this.escape.indexOf(character) === -1) {
      queue.push('\\')
    }

    index = value.indexOf('\\', prev)
  }

  queue.push(value.slice(prev))

  return queue.join('')
}
