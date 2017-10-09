const TAB = 0x09
const LF = 0x0A
const CR = 0x0D

/* Replace tabs with spaces, being smart about which
 * column the tab is at and which size should be used. */
export function detab (value: string, size?: number) {
  const length = value.length
  let start = 0
  let index = -1
  let column = -1
  const tabSize = size || 4
  const results = []
  let code
  let add

  while (++index < length) {
    code = value.charCodeAt(index)

    if (code === TAB) {
      add = tabSize - ((column + 1) % tabSize)
      column += add
      results.push(value.slice(start, index) + ' '.repeat(add))
      start = index + 1
    } else if (code === LF || code === CR) {
      column = -1
    } else {
      column++
    }
  }

  results.push(value.slice(start))

  return results.join('')
}
