import { TokenizeMethod, Eat } from '../tokenizer'
import { RemarkParser } from '../RemarkParser'
import { Node, Parent, Point } from 'typed-unist'
import { isDecimal } from 'typed-string-utils'
import { getIndentation } from '../utils/getIndentation'
import { removeIndentation } from '../utils/removeIndentation'
import { interrupt } from '../utils/interrupt'

const C_ASTERISK = '*'
const C_UNDERSCORE = '_'
const C_PLUS = '+'
const C_DASH = '-'
const C_DOT = '.'
const C_SPACE = ' '
const C_NEWLINE = '\n'
const C_TAB = '\t'
const C_PAREN_CLOSE = ')'
const C_X_LOWER = 'x'

const TAB_SIZE = 4
const EXPRESSION_LOOSE_LIST_ITEM = /\n\n(?!\s*$)/
const EXPRESSION_TASK_ITEM = /^\[([ \t]|x|X)][ \t]/
const EXPRESSION_BULLET = /^([ \t]*)([*+-]|\d+[.)])( {1,4}(?! )| |\t|$|(?=\n))([^\n]*)/
const EXPRESSION_PEDANTIC_BULLET = /^([ \t]*)([*+-]|\d+[.)])([ \t]+)/
const EXPRESSION_INITIAL_INDENT = /^( {1,4}|\t)?/gm

/* Map of characters which can be used to mark
 * list-items. */
const LIST_UNORDERED_MARKERS = {
  [C_ASTERISK]: true,
  [C_PLUS]: true,
  [C_DASH]: true,
}

/* Map of characters which can be used to mark
 * list-items after a digit. */
const LIST_ORDERED_MARKERS = {
  [C_DOT]: true,
}

/* Map of characters which can be used to mark
 * list-items after a digit. */
const LIST_ORDERED_COMMONMARK_MARKERS = {
  [C_DOT]: true,
  [C_PAREN_CLOSE]: true,
}

export const list: TokenizeMethod = function (this: RemarkParser, eat: Eat, value: string, silent?: boolean): Node | boolean {
  const self = this
  const commonmark = self.options.commonmark
  const pedantic = self.options.pedantic
  const tokenizers = self.blockTokenizers
  const interuptors = self.interruptList
  let markers
  let index = 0
  let length = value.length
  let start = null
  let size = 0
  let queue
  let ordered
  let character
  let marker
  let nextIndex
  let startIndex
  let prefixed
  let currentMarker
  let content: string
  let line: string
  let prevEmpty
  let empty
  let items
  let allLines: string[]
  let emptyLines: string[]
  let item
  let isLoose
  let node: Node
  let now
  let end
  let indented

  while (index < length) {
    character = value.charAt(index)

    if (character === C_TAB) {
      size += TAB_SIZE - (size % TAB_SIZE)
    } else if (character === C_SPACE) {
      size++
    } else {
      break
    }

    index++
  }

  if (size >= TAB_SIZE) {
    return
  }

  character = value.charAt(index)

  markers = commonmark ?
    LIST_ORDERED_COMMONMARK_MARKERS :
    LIST_ORDERED_MARKERS

  if (LIST_UNORDERED_MARKERS[character] === true) {
    marker = character
    ordered = false
  } else {
    ordered = true
    queue = ''

    while (index < length) {
      character = value.charAt(index)

      if (!isDecimal(character)) {
        break
      }

      queue += character
      index++
    }

    character = value.charAt(index)

    if (!queue || markers[character] !== true) {
      return
    }

    start = parseInt(queue, 10)
    marker = character
  }

  character = value.charAt(++index)

  if (character !== C_SPACE && character !== C_TAB) {
    return
  }

  if (silent) {
    return true
  }

  index = 0
  items = []
  allLines = []
  emptyLines = []

  while (index < length) {
    nextIndex = value.indexOf(C_NEWLINE, index)
    startIndex = index
    prefixed = false
    indented = false

    if (nextIndex === -1) {
      nextIndex = length
    }

    end = index + TAB_SIZE
    size = 0

    while (index < length) {
      character = value.charAt(index)

      if (character === C_TAB) {
        size += TAB_SIZE - (size % TAB_SIZE)
      } else if (character === C_SPACE) {
        size++
      } else {
        break
      }

      index++
    }

    if (size >= TAB_SIZE) {
      indented = true
    }

    if (item && size >= item.indent) {
      indented = true
    }

    character = value.charAt(index)
    currentMarker = null

    if (!indented) {
      if (LIST_UNORDERED_MARKERS[character] === true) {
        currentMarker = character
        index++
        size++
      } else {
        queue = ''

        while (index < length) {
          character = value.charAt(index)

          if (!isDecimal(character)) {
            break
          }

          queue += character
          index++
        }

        character = value.charAt(index)
        index++

        if (queue && markers[character] === true) {
          currentMarker = character
          size += queue.length + 1
        }
      }

      if (currentMarker) {
        character = value.charAt(index)

        if (character === C_TAB) {
          size += TAB_SIZE - (size % TAB_SIZE)
          index++
        } else if (character === C_SPACE) {
          end = index + TAB_SIZE

          while (index < end) {
            if (value.charAt(index) !== C_SPACE) {
              break
            }

            index++
            size++
          }

          if (index === end && value.charAt(index) === C_SPACE) {
            index -= TAB_SIZE - 1
            size -= TAB_SIZE - 1
          }
        } else if (character !== C_NEWLINE && character !== '') {
          currentMarker = null
        }
      }
    }

    if (currentMarker) {
      if (!pedantic && marker !== currentMarker) {
        break
      }

      prefixed = true
    } else {
      if (!commonmark && !indented && value.charAt(startIndex) === C_SPACE) {
        indented = true
      } else if (commonmark && item) {
        indented = size >= item.indent || size > TAB_SIZE
      }

      prefixed = false
      index = startIndex
    }

    line = value.slice(startIndex, nextIndex)
    content = startIndex === index ? line : value.slice(index, nextIndex)

    if (
      currentMarker === C_ASTERISK ||
      currentMarker === C_UNDERSCORE ||
      currentMarker === C_DASH
    ) {
      if (tokenizers.thematicBreak.call(self, eat, line, true)) {
        break
      }
    }

    prevEmpty = empty
    empty = !content.trim().length

    if (indented && item) {
      item.value = item.value.concat(emptyLines, line)
      allLines = allLines.concat(emptyLines, line)
      emptyLines = []
    } else if (prefixed) {
      if (emptyLines.length !== 0) {
        item.value.push('')
        item.trail = emptyLines.concat()
      }

      item = {
        value: [line],
        indent: size,
        trail: [],
      }

      items.push(item)
      allLines = allLines.concat(emptyLines, line)
      emptyLines = []
    } else if (empty) {
      if (prevEmpty) {
        break
      }

      emptyLines.push(line)
    } else {
      if (prevEmpty) {
        break
      }

      if (interrupt(interuptors, tokenizers, self, [eat, line, true])) {
        break
      }

      item.value = item.value.concat(emptyLines, line)
      allLines = allLines.concat(emptyLines, line)
      emptyLines = []
    }

    index = nextIndex + 1
  }

  node = eat(allLines.join(C_NEWLINE)).reset({
    type: 'list',
    ordered,
    start,
    loose: null,
    children: [],
  } as Parent)

  const exitList = this.enterList()
  const exitBlock = this.enterBlock()

  isLoose = false
  index = -1
  length = items.length

  while (++index < length) {
    item = items[index].value.join(C_NEWLINE)
    now = eat.now()

    item = eat(item)(listItem(self, item, now), node as Parent)

    // FIXME: Add list interface
    if ((item as any).loose) {
      isLoose = true
    }

    item = items[index].trail.join(C_NEWLINE)

    if (index !== length - 1) {
      item += C_NEWLINE
    }

    eat(item)
  }

  exitList()
  exitBlock();

  // FIXME: Replace list typings
  (node as any).loose = isLoose

  return node
} as TokenizeMethod

function listItem (ctx: RemarkParser, value: string, position: Point) {
  const offsets = ctx.offset
  const fn = ctx.options.pedantic ? pedanticListItem : normalListItem
  let checked = null
  let task
  let indent

  value = fn.apply(null, arguments)

  if (ctx.options.gfm) {
    task = value.match(EXPRESSION_TASK_ITEM)

    if (task) {
      indent = task[0].length
      checked = task[1].toLowerCase() === C_X_LOWER
      offsets[position.line] += indent
      value = value.slice(indent)
    }
  }

  return {
    type: 'listItem',
    loose: EXPRESSION_LOOSE_LIST_ITEM.test(value) ||
      value.charAt(value.length - 1) === C_NEWLINE,
    checked,
    children: ctx.tokenizeBlock(value, position),
  } as Node
}

/* Create a list-item using overly simple mechanics. */
function pedanticListItem (ctx: RemarkParser, value: string, position: Point) {
  const offsets = ctx.offset
  let line = position.line

  /* Remove the list-item’s bullet. */
  value = value.replace(EXPRESSION_PEDANTIC_BULLET, replacer)

  /* The initial line was also matched by the below, so
   * we reset the `line`. */
  line = position.line

  return value.replace(EXPRESSION_INITIAL_INDENT, replacer)

  /* A simple replacer which removed all matches,
   * and adds their length to `offset`. */
  function replacer ($0: string) {
    offsets[line] = (offsets[line] || 0) + $0.length
    line++

    return ''
  }
}

/* Create a list-item using sane mechanics. */
function normalListItem (ctx: RemarkParser, value: string, position: Point) {
  const offsets = ctx.offset
  let line = position.line
  let max
  let bullet: string
  let rest
  let lines
  let trimmedLines
  let index
  let length

  /* Remove the list-item’s bullet. */
  value = value.replace(EXPRESSION_BULLET, replacer)

  lines = value.split(C_NEWLINE)

  trimmedLines = removeIndentation(value, getIndentation(max).indent).split(C_NEWLINE)

  /* We replaced the initial bullet with something
   * else above, which was used to trick
   * `removeIndentation` into removing some more
   * characters when possible.  However, that could
   * result in the initial line to be stripped more
   * than it should be. */
  trimmedLines[0] = rest

  offsets[line] = (offsets[line] || 0) + bullet.length
  line++

  index = 0
  length = lines.length

  while (++index < length) {
    offsets[line] = (offsets[line] || 0) +
      lines[index].length - trimmedLines[index].length
    line++
  }

  return trimmedLines.join(C_NEWLINE)

  function replacer ($0: string, $1: string, $2: string, $3: string, $4: string) {
    bullet = $1 + $2 + $3
    rest = $4

    /* Make sure that the first nine numbered list items
     * can indent with an extra space.  That is, when
     * the bullet did not receive an extra final space. */
    if (Number($2) < 10 && bullet.length % 2 === 1) {
      $2 = C_SPACE + $2
    }

    max = $1 + C_SPACE.repeat($2.length) + $3

    return max + rest
  }
}
