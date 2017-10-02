import {
  Node,
  Text,
  Parent,
  Position,
  Point,
} from 'typed-unist'
import { RemarkParser } from './RemarkParser'
import { VFile } from 'typed-vfile'

export interface TokenizeMethod {
  (eat: Eat): Node | boolean
  onlyAtStart?: boolean
  notInList?: boolean
  notInBlock?: boolean
  notInLink?: boolean
  locator?: (value: string, fromIndex?: number) => number
}

export interface Eat {
  (subvalue: string): Apply
  now: () => Point
  file: VFile
}

export interface Apply {
  (node: Node, parent?: Parent): Node
  reset: Reset
  test: Test
}

interface Reset {
  (node: Node, parent: Parent): Node
  test: Test
}

type Test = () => Position

export interface Factory {
  (type: 'inline' | 'block'): Tokenize
}

export interface Tokenize {
  (this: RemarkParser, value: string, location: Point): Node[]
}

const MERGEABLE_NODES = {
  text: mergeText,
  blockquote: mergeBlockquote,
}

/* Check whether a node is mergeable with adjacent nodes. */
function mergeable (node: Node) {
  let start
  let end

  if (node.type !== 'text' || !node.position) {
    return true
  }

  start = node.position.start
  end = node.position.end

  /* Only merge nodes which occupy the same size as their
   * `value`. */
  return start.line !== end.line ||
      end.column - start.column === (node as Text).value.length
}

/* Merge two text nodes: `node` into `prev`. */
function mergeText (prev: Text, node: Text) {
  prev.value += node.value

  return prev
}

/* Merge two blockquotes: `node` into `prev`, unless in
 * CommonMark mode. */
function mergeBlockquote (prev: Parent, node: Parent) {
  if (this.options.commonmark) {
    return node
  }

  prev.children = prev.children.concat(node.children)

  return prev
}

/* Construct a tokenizer.  This creates both
 * `tokenizeInline` and `tokenizeBlock`. */
export function factory (type: 'inline' | 'block') {
  return tokenize

  /* Tokenizer for a bound `type`. */
  function tokenize (this: RemarkParser, value: string, location: Point): Node[] {
    const self: RemarkParser = this
    const offset: {
      [key: number]: number
    } = self.offset
    const tokens: Node[] = []
    const isInlineTokenizer = type === 'inline'
    const methods: string[] = isInlineTokenizer
      ? this.inlineMethods
      : this.blockMethods
    const tokenizers: {[key: string]: TokenizeMethod} = isInlineTokenizer
      ? this.inlineTokenizers
      : this.blockTokenizers
    let line: number = location.line
    let column: number = location.column
    let index: number
    let length: number
    let method: TokenizeMethod
    let name: string
    let matched: boolean
    let valueLength: number

    /* Trim white space only lines. */
    if (!value) {
      return tokens
    }

    /* Expose on `eat`. */
    const eat: Eat =
    /* Remove `subvalue` from `value`.
     * `subvalue` must be at the start of `value`. */
    function (subvalue: string): Apply {
      // FIXME: it returns another function
      const getIndent = getOffset()
      // FIXME: it returns another function
      const pos = position()
      const current = now()
      let indent: number[]

      validateEat(subvalue)

      /* Add the given arguments, add `position` to
       * the returned node, and return the node. */
      const apply: Apply = function (node: Node, parent: Parent) {
        return pos(add(pos(node), parent), indent)
      } as Apply

      /* Functions just like apply, but resets the
       * content:  the line and column are reversed,
       * and the eaten value is re-added.
       * This is useful for nodes with a single
       * type of content, such as lists and tables.
       * See `apply` above for what parameters are
       * expected. */
      const reset = function (node: Node, parent: Parent) {
        node = apply(node, parent)

        line = current.line
        column = current.column
        value = subvalue + value

        return node
      } as Reset

      apply.reset = reset
      reset.test = test
      apply.test = test

      value = value.substring(subvalue.length)

      updatePosition(subvalue)

      indent = getIndent()

      return apply

      /* Test the position, after eating, and reverse
       * to a not-eaten state. */
      function test () {
        // FIXME: Don't use as Node
        const result = pos({} as Node)

        line = current.line
        column = current.column
        value = subvalue + value

        return result.position
      }
    } as Eat
    eat.now = now
    eat.file = self.file

    /* Sync initial offset. */
    updatePosition('')

    /* Iterate over `value`, and iterate over all
     * tokenizers.  When one eats something, re-iterate
     * with the remaining value.  If no tokenizer eats,
     * something failed (should not happen) and an
     * exception is thrown. */
    while (value) {
      index = -1
      length = methods.length
      matched = false

      while (++index < length) {
        name = methods[index]
        method = tokenizers[name]

        if (
          method &&
          /* istanbul ignore next */ (!method.onlyAtStart || self.atStart) &&
          (!method.notInList || !self.inList) &&
          (!method.notInBlock || !self.inBlock) &&
          (!method.notInLink || !self.inLink)
        ) {
          valueLength = value.length

          method.apply(self, [eat, value])

          matched = valueLength !== value.length

          if (matched) {
            break
          }
        }
      }

      /* istanbul ignore if */
      if (!matched) {
        self.file.fail(new Error('Infinite loop'), eat.now())
      }
    }

    self.eof = now()

    return tokens

    /* Update line, column, and offset based on
     * `value`. */
    function updatePosition (subvalue: string) {
      let lastIndex = -1
      // FIXME: aIndex is used for avoiding shadow name lint error
      let aIndex = subvalue.indexOf('\n')

      while (aIndex !== -1) {
        line++
        lastIndex = aIndex
        aIndex = subvalue.indexOf('\n', aIndex + 1)
      }

      if (lastIndex === -1) {
        column += subvalue.length
      } else {
        column = subvalue.length - lastIndex
      }

      if (line in offset) {
        if (lastIndex !== -1) {
          column += offset[line]
        } else if (column <= offset[line]) {
          column = offset[line] + 1
        }
      }
    }

    /* Get offset.  Called before the first character is
     * eaten to retrieve the range's offsets. */
    function getOffset () {
      const indentation: number[] = []
      let pos = line + 1

      /* Done.  Called when the last character is
       * eaten to retrieve the range’s offsets. */
      return function () {
        const last = line + 1

        while (pos < last) {
          indentation.push((offset[pos] || 0) + 1)

          pos++
        }

        return indentation
      }
    }

    /* Get the current position. */
    function now (): Point {
      const pos = {
        line,
        column,
      } as Point

      pos.offset = self.toOffset(pos)

      return pos
    }

    /* Throw when a value is incorrectly eaten.
     * This shouldn’t happen but will throw on new,
     * incorrect rules. */
    function validateEat (subvalue: string) {
      /* istanbul ignore if */
      if (value.substring(0, subvalue.length) !== subvalue) {
        /* Capture stack-trace. */
        self.file.fail(
          new Error(
            'Incorrectly eaten value: please report this ' +
            'warning on http://git.io/vg5Ft',
          ),
          now(),
        )
      }
    }

    /* Mark position and patch `node.position`. */
    function position () {
      const before = now()

      return update

      /* Add the position to a node. */
      function update (node: Node, indent?: number[]): Node {
        const prev = node.position
        const start = prev ? prev.start : before
        let combined: number[] = []
        let n = prev && prev.end.line
        const l = before.line

        node.position = {
          start,
          end: now(),
        }

        /* If there was already a `position`, this
         * node was merged.  Fixing `start` wasn’t
         * hard, but the indent is different.
         * Especially because some information, the
         * indent between `n` and `l` wasn’t
         * tracked.  Luckily, that space is
         * (should be?) empty, so we can safely
         * check for it now. */
        if (prev && indent && prev.indent) {
          combined = prev.indent

          if (n < l) {
            while (++n < l) {
              combined.push((offset[n] || 0) + 1)
            }

            combined.push(before.column)
          }

          indent = combined.concat(indent)
        }

        node.position.indent = indent || []

        return node
      }
    }

    /* Add `node` to `parent`s children or to `tokens`.
     * Performs merges where possible. */
    function add (node: Node, parent: Parent) {
      const children = parent ? parent.children : tokens
      const prev = children[children.length - 1]

      if (
        prev &&
        node.type === prev.type &&
        node.type in MERGEABLE_NODES &&
        mergeable(prev) &&
        mergeable(node)
      ) {
        node = MERGEABLE_NODES[(node.type as keyof typeof MERGEABLE_NODES)].call(self, prev, node)
      }

      if (node !== prev) {
        children.push(node)
      }

      if (self.atStart && tokens.length !== 0) {
        self.atStart = false
      }

      return node
    }

  }
}
