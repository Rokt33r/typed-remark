import characterEntitiesHTML4 from 'typed-character-entities-html4'
import characterEntitiesLegacy from 'typed-character-entities-legacy'
import {
  isHexadecimal,
  isAlphanumerical,
} from 'typed-string-utils'
import dangerous from './dangerous'

export interface StringifyEntitiesOptions {
  subset?: string[]
  escapeOnly?: boolean
  omitOptionalSemicolons?: boolean
  useNamedReferences?: boolean
  useShortestReferences?: boolean
  attribute?: boolean
}

const hasOwnProperty = {}.hasOwnProperty

/* List of enforced escapes. */
const escapes = ['"', '\'', '<', '>', '&', '`']

/* Map of characters to names. */
const reversedEntityMap = constructReversedMap()

/* Default escapes. */
const defaultEscapes = toExpression(escapes)

/* Surrogate pairs. */
const surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g

/* Non-ASCII characters. */
// eslint-disable-next-line no-control-regex
const bmp = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g

/* Encode special characters in `value`. */
export function stringifyEntities (value: string, options?: StringifyEntitiesOptions) {
  const settings = options || {}
  const subset = settings.subset
  const set = subset ? toExpression(subset) : defaultEscapes
  const escapeOnly = settings.escapeOnly
  const omit = settings.omitOptionalSemicolons

  value = value.replace(set, function (char, pos, val) {
    return stringifyOneEntity(char, val.charAt(pos + 1), settings)
  })

  if (subset || escapeOnly) {
    return value
  }

  return value
    .replace(surrogatePair, function (pair: string, pos, val) {
      return toHexReference(
        ((pair.charCodeAt(0) - 0xD800) * 0x400) +
        pair.charCodeAt(1) - 0xDC00 + 0x10000,
        val.charAt(pos + 2),
        omit,
      )
    })
    .replace(bmp, function (char, pos, val) {
      return stringifyOneEntity(char, val.charAt(pos + 1), settings)
    })
}

/* Shortcut to escape special characters in HTML. */
export function escape (value: string) {
  return stringifyEntities(value, {
    escapeOnly: true,
    useNamedReferences: true,
  })
}

/* Encode `char` according to `options`. */
function stringifyOneEntity (char: string, next: string, options: StringifyEntitiesOptions) {
  const shortest = options.useShortestReferences
  const omit = options.omitOptionalSemicolons
  let named
  let numeric

  if (
    (shortest || options.useNamedReferences) &&
    hasOwnProperty.call(reversedEntityMap, char)
  ) {
    named = toNamed(reversedEntityMap[char], next, omit, options.attribute)
  }

  if (shortest || !named) {
    numeric = toHexReference(char.charCodeAt(0), next, omit)
  }

  if (named && (!shortest || named.length < numeric.length)) {
    return named
  }

  return numeric
}

/* Transform `code` into an entity. */
function toNamed (name: string, next: string, omit: boolean, attribute: boolean) {
  const value = '&' + name

  if (
    omit &&
    hasOwnProperty.call(characterEntitiesLegacy, name) &&
    dangerous.indexOf(name) === -1 &&
    (!attribute || (next && next !== '=' && !isAlphanumerical(next)))
  ) {
    return value
  }

  return value + ';'
}

/* Transform `code` into a hexadecimal character reference. */
function toHexReference (code: number, next: string, omit: boolean) {
  const value = '&#x' + code.toString(16).toUpperCase()
  return omit && next && !isHexadecimal(next) ? value : value + ';'
}

/* Create an expression for `characters`. */
function toExpression (characters: string[]) {
  return new RegExp('[' + characters.join('') + ']', 'g')
}

/* Construct the map. */
function constructReversedMap () {
  const chars: {
    [key: string]: string
  } = {}

  for (const name in characterEntitiesHTML4) {
    chars[(characterEntitiesHTML4 as any)[name]] = name
  }

  return chars
}
