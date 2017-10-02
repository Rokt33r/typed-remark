import { getIndentation } from './getIndentation'

const C_SPACE = ' '
const C_NEWLINE = '\n'
const C_TAB = '\t'

/* Remove the minimum indent from every line in `value`.
 * Supports both tab, spaced, and mixed indentation (as
 * well as possible). */
export function removeIndentation (value: string, maximum: number) {
  const values = value.split(C_NEWLINE)
  let position = values.length + 1
  let minIndent = Infinity
  const matrix = []
  let index
  let indentation
  let stops
  let padding

  values.unshift(C_SPACE.repeat(maximum) + '!')

  while (position--) {
    indentation = getIndentation(values[position])

    matrix[position] = indentation.stops

    if (values[position].trim().length === 0) {
      continue
    }

    if (indentation.indent) {
      if (indentation.indent > 0 && indentation.indent < minIndent) {
        minIndent = indentation.indent
      }
    } else {
      minIndent = Infinity

      break
    }
  }

  if (minIndent !== Infinity) {
    position = values.length

    while (position--) {
      stops = matrix[position]
      index = minIndent

      while (index && !(index in stops)) {
        index--
      }

      if (
        values[position].trim().length !== 0 &&
        minIndent &&
        index !== minIndent
      ) {
        padding = C_TAB
      } else {
        padding = ''
      }

      values[position] = padding + values[position].slice(
        index in stops ? stops[index] + 1 : 0,
      )
    }
  }

  values.shift()

  return values.join(C_NEWLINE)
}
