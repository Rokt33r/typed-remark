import voids from 'typed-html-void-elements'
import { StringifyEntitiesOptions } from 'typed-stringify-entities'
import * as omission from './omission'
import { one } from './one'
import { Node } from 'typed-unist'

export interface ToHTMLOptions {
  entities: StringifyEntitiesOptions
  quote: string
  quoteSmart: boolean
  allowParseErrors: boolean
  allowDangerousCharacters: boolean
  allowDangerousHTML: boolean
  omitOptionalTags: boolean
  collapseEmptyAttributes: boolean
  closeSelfClosing: boolean
  preferUnquoted: boolean
  tightAttributes: boolean
  tightCommaSeparatedLists: boolean
  tightSelfClosing: boolean
  voids: string[]
}

export interface ToHTMLContext {
  NAME: string[]
  UNQUOTED: string[]
  DOUBLE_QUOTED: string[]
  SINGLE_QUOTED: string[]
  omit: boolean | typeof omission
  quote: string
  alternative: string
  unquoted: boolean
  tight: boolean
  tightLists: boolean
  tightClose: boolean
  collapseEmpty: boolean
  dangerous: boolean
  voids: string[]
  entities: StringifyEntitiesOptions
  close: boolean
}

/* Characters. */
const NULL = '\0'
const AMP = '&'
const SPACE = ' '
const TAB = '\t'
const GR = '`'
const DQ = '"'
const SQ = '\''
const EQ = '='
const LT = '<'
const GT = '>'
const SO = '/'
const LF = '\n'
const CR = '\r'
const FF = '\f'

/* https://html.spec.whatwg.org/#attribute-name-state */
const NAME = [AMP, SPACE, TAB, LF, CR, FF, SO, GT, EQ]
const CLEAN_NAME = NAME.concat(NULL, DQ, SQ, LT)

/* In safe mode, all attribute values contain DQ (`"`),
 * SQ (`'`), and GR (`` ` ``), as those can create XSS
 * issues in older browsers:
 * - https://html5sec.org/#59
 * - https://html5sec.org/#102
 * - https://html5sec.org/#108 */
const QUOTES = [DQ, SQ, GR]

/* https://html.spec.whatwg.org/#attribute-value-(unquoted)-state */
const UQ_VALUE = [AMP, SPACE, TAB, LF, CR, FF, GT]
const UQ_VALUE_CLEAN = UQ_VALUE.concat(NULL, DQ, SQ, LT, EQ, GR)

/* https://html.spec.whatwg.org/#attribute-value-(single-quoted)-state */
const SQ_VALUE = [AMP, SQ]
const SQ_VALUE_CLEAN = SQ_VALUE.concat(NULL)

/* https://html.spec.whatwg.org/#attribute-value-(double-quoted)-state */
const DQ_VALUE = [AMP, DQ]
const DQ_VALUE_CLEAN = DQ_VALUE.concat(NULL)

/* Stringify the given HAST node. */
export function toHTML (node: Node, options: Partial<ToHTMLOptions> = {}) {
  const settings: Partial<ToHTMLOptions> = options
  const quote = settings.quote || DQ
  const smart = settings.quoteSmart
  const errors = settings.allowParseErrors
  const characters = settings.allowDangerousCharacters
  const alternative = quote === DQ ? SQ : DQ
  const name = errors ? NAME : CLEAN_NAME
  const unquoted = errors ? UQ_VALUE : UQ_VALUE_CLEAN
  const singleQuoted = errors ? SQ_VALUE : SQ_VALUE_CLEAN
  const doubleQuoted = errors ? DQ_VALUE : DQ_VALUE_CLEAN

  if (quote !== DQ && quote !== SQ) {
    throw new Error(
      'Invalid quote `' + quote + '`, expected `' +
      SQ + '` or `' + DQ + '`',
    )
  }

  return one({
    NAME: name.concat(characters ? [] : QUOTES),
    UNQUOTED: unquoted.concat(characters ? [] : QUOTES),
    DOUBLE_QUOTED: doubleQuoted.concat(characters ? [] : QUOTES),
    SINGLE_QUOTED: singleQuoted.concat(characters ? [] : QUOTES),
    omit: settings.omitOptionalTags && omission,
    quote,
    alternative: smart ? alternative : null,
    unquoted: Boolean(settings.preferUnquoted),
    tight: settings.tightAttributes,
    tightLists: settings.tightCommaSeparatedLists,
    tightClose: settings.tightSelfClosing,
    collapseEmpty: settings.collapseEmptyAttributes,
    dangerous: settings.allowDangerousHTML,
    voids: settings.voids || voids.concat(),
    entities: settings.entities || {},
    close: settings.closeSelfClosing,
  }, node)
}
