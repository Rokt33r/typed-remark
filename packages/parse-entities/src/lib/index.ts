import {
  isDecimal,
  isHexadecimal,
  isAlphanumerical,
} from './utils'
import characterEntities from 'typed-character-entities'
import characterEntitiesLegacy from 'typed-character-entities-legacy'
import characterReferenceInvalid from 'typed-character-reference-invalid'
import {
  Position,
  Point,
} from 'typed-unist'

const own = {}.hasOwnProperty
const fromCharCode = String.fromCharCode
const noop = Function.prototype

export interface Options<C> {
  warning?: (this: C, reason: string, location: Position, code: number) => void
  reference?: (this: C, value: string, location: Position, source: string) => void
  text?: (this: C, value: string, location: Position) => void
  warningContext?: C
  textContext?: C
  referenceContext?: C
  position?: Position | Point
  additional?: string
  attribute?: boolean
  nonTerminated?: boolean
}

interface Settings<C> extends Options<C> {
  indent: number[]
  position: Point
}

/* Default settings. */
const defaults: Options<any> = {
  position: {
    line: null,
    column: null,
  },
  attribute: false,
  nonTerminated: true,
}

/* Reference types. */
const NAMED = 'named'
const HEXADECIMAL = 'hexadecimal'
const DECIMAL = 'decimal'

/* Map of bases. */
const BASE = {
  [HEXADECIMAL]: 16,
  [DECIMAL]: 10,
}

/* Map of types to tests. Each type of character reference
 * accepts different characters. This test is used to
 * detect whether a reference has ended (as the semicolon
 * is not strictly needed). */
const TESTS = {
  [NAMED]: isAlphanumerical,
  [DECIMAL]: isDecimal,
  [HEXADECIMAL]: isHexadecimal,
}

/* Warning messages. */
const NAMED_NOT_TERMINATED = 1
const NUMERIC_NOT_TERMINATED = 2
const NAMED_EMPTY = 3
const NUMERIC_EMPTY = 4
const NAMED_UNKNOWN = 5
const NUMERIC_DISALLOWED = 6
const NUMERIC_PROHIBITED = 7

const MESSAGES = {
  [NAMED_NOT_TERMINATED]: 'Named character references must be terminated by a semicolon',
  [NUMERIC_NOT_TERMINATED]: 'Numeric character references must be terminated by a semicolon',
  [NAMED_EMPTY]: 'Named character references cannot be empty',
  [NUMERIC_EMPTY]: 'Numeric character references cannot be empty',
  [NAMED_UNKNOWN]: 'Named character references must be known',
  [NUMERIC_DISALLOWED]: 'Numeric character references cannot be disallowed',
  [NUMERIC_PROHIBITED]: 'Numeric character references cannot be outside the permissible Unicode range',
}

/* Wrap to ensure clean parameters are given to `parse`. */
export function parseEntities<C> (value: string, options?: Options<C>) {
  options = {
    ...defaults,
    ...options,
  }

  const isPosition = (options.position as Position).indent || (options.position as Position).start
  const settings: Settings<C> = {
    ...options,
    indent: isPosition ? (options.position as Position).indent : [],
    position: isPosition ? (options.position as Position).start : (options.position as Point),
  }

  return parse(value, settings)
}

/* Parse entities. */
function parse<C> (value: string, settings: Settings<C>) {
  const additional = settings.additional
  const nonTerminated = settings.nonTerminated
  const handleText = settings.text
  const handleReference = settings.reference
  const handleWarning = settings.warning
  const textContext = settings.textContext
  const referenceContext = settings.referenceContext
  const warningContext = settings.warningContext
  const pos = settings.position
  const indent = settings.indent || []

  let length = value.length
  let index = 0
  let lines = -1
  let column = pos.column || 1
  let line = pos.line || 1
  let queue = ''
  const result: string[] = []
  let entityCharacters
  let terminated
  let characters: string
  let character
  let reference
  let following
  let warning
  let reason
  let output
  let entity
  let begin
  let start
  let type
  let test
  let prev: Point
  let next: Point
  let diff
  let end

  /* Cache the current point. */
  prev = now()

  /* Wrap `handleWarning`. */
  warning = handleWarning ? parseError : noop

  /* Ensure the algorithm walks over the first character
   * and the end (inclusive). */
  index--
  length++

  while (++index < length) {
    /* If the previous character was a newline. */
    if (character === '\n') {
      column = indent[lines] || 1
    }

    character = at(index)

    /* Handle anything other than an ampersand,
     * including newlines and EOF. */
    if (character !== '&') {
      if (character === '\n') {
        line++
        lines++
        column = 0
      }

      if (character) {
        queue += character
        column++
      } else {
        flush()
      }
    } else {
      following = at(index + 1)

      /* The behaviour depends on the identity of the next
       * character. */
      if (
        following === '\t' || /* Tab */
        following === '\n' || /* Newline */
        following === '\f' || /* Form feed */
        following === ' ' || /* Space */
        following === '<' || /* Less-than */
        following === '&' || /* Ampersand */
        following === '' ||
        (additional && following === additional)
      ) {
        /* Not a character reference. No characters
         * are consumed, and nothing is returned.
         * This is not an error, either. */
        queue += character
        column++

        continue
      }

      start = index + 1
      begin = start
      end = start

      /* Numerical entity. */
      if (following !== '#') {
        type = NAMED
      } else {
        end = ++begin

        /* The behaviour further depends on the
         * character after the U+0023 NUMBER SIGN. */
        following = at(end)

        if (following === 'x' || following === 'X') {
          /* ASCII hex digits. */
          type = HEXADECIMAL
          end = ++begin
        } else {
          /* ASCII digits. */
          type = DECIMAL
        }
      }

      entityCharacters = ''
      entity = ''
      characters = ''
      test = TESTS[type]
      end--

      while (++end < length) {
        following = at(end)

        if (!test(following)) {
          break
        }

        characters += following

        /* Check if we can match a legacy named
         * reference.  If so, we cache that as the
         * last viable named reference.  This
         * ensures we do not need to walk backwards
         * later. */
        if (type === NAMED && own.call(characterEntitiesLegacy, characters)) {
          entityCharacters = characters
          entity = (characterEntitiesLegacy as {[key: string]: string})[characters]
        }
      }

      terminated = at(end) === ';'

      if (terminated) {
        end++

        if (type === NAMED && own.call(characterEntities, characters)) {
          entityCharacters = characters
          entity = (characterEntities as {[key: string]: string})[characters]
        }
      }

      diff = 1 + end - start

      if (!terminated && !nonTerminated) {
        /* Empty. */
      } else if (!characters) {
        /* An empty (possible) entity is valid, unless
         * its numeric (thus an ampersand followed by
         * an octothorp). */
        if (type !== NAMED) {
          warning(NUMERIC_EMPTY, diff)
        }
      } else if (type === NAMED) {
        /* An ampersand followed by anything
         * unknown, and not terminated, is invalid. */
        if (terminated && !entity) {
          warning(NAMED_UNKNOWN, 1)
        } else {
          /* If theres something after an entity
           * name which is not known, cap the
           * reference. */
          if (entityCharacters !== characters) {
            end = begin + entityCharacters.length
            diff = 1 + end - begin
            terminated = false
          }

          /* If the reference is not terminated,
           * warn. */
          if (!terminated) {
            reason = entityCharacters ? NAMED_NOT_TERMINATED : NAMED_EMPTY

            if (!settings.attribute) {
              warning(reason, diff)
            } else {
              following = at(end)

              if (following === '=') {
                warning(reason, diff)
                entity = null
              } else if (isAlphanumerical(following)) {
                entity = null
              } else {
                warning(reason, diff)
              }
            }
          }
        }

        reference = entity
      } else {
        if (!terminated) {
          /* All non-terminated numeric entities are
           * not rendered, and trigger a warning. */
          warning(NUMERIC_NOT_TERMINATED, diff)
        }

        /* When terminated and number, parse as
         * either hexadecimal or decimal. */
        reference = parseInt(characters, BASE[type])

        /* Trigger a warning when the parsed number
         * is prohibited, and replace with
         * replacement character. */
        if (prohibited(reference)) {
          warning(NUMERIC_PROHIBITED, diff)
          reference = '\uFFFD'
        } else if (reference in characterReferenceInvalid) {
          /* Trigger a warning when the parsed number
           * is disallowed, and replace by an
           * alternative. */
          warning(NUMERIC_DISALLOWED, diff)
          reference = (characterReferenceInvalid as {[key: string]: string})[reference]
        } else {
          /* Parse the number. */
          output = ''

          /* Trigger a warning when the parsed
           * number should not be used. */
          if (disallowed(reference)) {
            warning(NUMERIC_DISALLOWED, diff)
          }

          /* Stringify the number. */
          if (reference > 0xFFFF) {
            reference -= 0x10000
            output += fromCharCode((reference >>> (10 & 0x3FF)) | 0xD800)
            reference = 0xDC00 | (reference & 0x3FF)
          }

          reference = output + fromCharCode(reference)
        }
      }

      /* If we could not find a reference, queue the
       * checked characters (as normal characters),
       * and move the pointer to their end. This is
       * possible because we can be certain neither
       * newlines nor ampersands are included. */
      if (!reference) {
        characters = value.slice(start - 1, end)
        queue += characters
        column += characters.length
        index = end - 1
      } else {
        /* Found it! First eat the queued
         * characters as normal text, then eat
         * an entity. */
        flush()

        prev = now()
        index = end - 1
        column += end - start + 1
        result.push(reference)
        next = now()
        next.offset++

        if (handleReference) {
          handleReference.call(referenceContext, reference, {
            start: prev,
            end: next,
          }, value.slice(start - 1, end))
        }

        prev = next
      }
    }
  }

  /* Return the reduced nodes, and any possible warnings. */
  return result.join('')

  /* Get current position. */
  function now (): Point {
    return {
      line,
      column,
      offset: index + (pos.offset || 0),
    }
  }

  /* “Throw” a parse-error: a warning. */
  function parseError (code: number, offset: number) {
    const position = now()

    position.column += offset
    position.offset += offset

    handleWarning.call(warningContext, MESSAGES[code], position, code)
  }

  /* Get character at position. */
  function at (position: number): string {
    return value.charAt(position)
  }

  /* Flush `queue` (normal text). Macro invoked before
   * each entity and at the end of `value`.
   * Does nothing when `queue` is empty. */
  function flush (): void {
    if (queue) {
      result.push(queue)

      if (handleText) {
        handleText.call(textContext, queue, {start: prev, end: now()})
      }

      queue = ''
    }
  }
}

/* Check if `character` is outside the permissible unicode range. */
function prohibited (code: number): boolean {
  return (code >= 0xD800 && code <= 0xDFFF) || (code > 0x10FFFF)
}

/* Check if `character` is disallowed. */
function disallowed (code: number): boolean {
  if (
    (code >= 0x0001 && code <= 0x0008) ||
    code === 0x000B ||
    (code >= 0x000D && code <= 0x001F) ||
    (code >= 0x007F && code <= 0x009F) ||
    (code >= 0xFDD0 && code <= 0xFDEF) ||
    (code & 0xFFFF) === 0xFFFF ||
    (code & 0xFFFF) === 0xFFFE
  ) {
    return true
  }

  return false
}
