import { RemarkParser } from './RemarkParser'
import {
  Position,
  Point,
} from 'typed-unist'
import { parseEntities } from 'typed-parse-entities'

/* Decode `value` (at `position`) into text-nodes. */
export function decoder (this: RemarkParser, value: string, point: Point, handler: (value: string, location: Position, source?: string) => void) {
  parseEntities(value, {
    position: normalize(this.offset, point),
    warning: handleWarning.bind(this),
    text: handler,
    reference: handler,
    textContext: this,
    referenceContext: this,
  })
}

/* Decode `value` (at `position`) into a string. */
export function decodeRaw (this: RemarkParser, value: string, point: Point) {
  return parseEntities(value, {
    position: normalize(this.offset, point),
    warning: handleWarning.bind(this),
  })
}

/**
 * Handle a warning. See https://github.com/wooorm/parse-entities for the warnings.
 */
function handleWarning (this: RemarkParser, reason: string, position: Point, code: number) {
  if (code === 3) {
    return
  }

  this.file.message(reason, position)
}

/* Normalize `position` to add an `indent`. */
function normalize (
  offsets: {
    [key: number]: number
  },
  position: Point,
): Position {
  let line = position.line
  const result = []

  while (++line) {
    if (!(line in offsets)) {
      break
    }

    result.push((offsets[line] || 0) + 1)
  }

  return {
    start: position,
    end: null,
    indent: result,
  }
}
