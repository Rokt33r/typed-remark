/* Map of characters, and their column length,
 * which can be used as indentation. */
const characters = {' ': 1, '\t': 4}

/* Gets indentation information for a line. */
export function getIndentation (value: string) {
  let index = 0
  let indent = 0
  let character = value.charAt(index)
  const stops: {[indent: number]: number} = {}
  let size: number

  while (character in characters) {
    size = characters[character as keyof typeof characters]

    indent += size

    if (size > 1) {
      indent = Math.floor(indent / size) * size
    }

    stops[indent] = index

    character = value.charAt(++index)
  }

  return {
    indent,
    stops,
  }
}
