import { stringify as spaces } from 'typed-space-separated-tokens'
import { stringify as commas } from 'typed-comma-separated-tokens'
import { stringifyEntities } from 'typed-stringify-entities'
import {
  convertToKebabCase,
  ccount,
} from 'typed-string-utils'
import { getPropertyInformation, Information } from 'typed-property-information'
import { all } from './all'
import { Parent } from 'typed-unist'
import { Element } from 'typed-hast'
import { ToHTMLContext } from './'
import { opening, closing } from './omission'

/* Constants. */
const DATA = 'data'
const EMPTY = ''

/* Characters. */
const SPACE = ' '
const DQ = '"'
const SQ = '\''
const EQ = '='
const LT = '<'
const GT = '>'
const SO = '/'

/** Stringify an element `node`. */
export function element (ctx: ToHTMLContext, node: Element, index: number, parent: Parent): string {
  const name = node.tagName
  const content = all(ctx, name === 'template' ? node.content : node)
  let selfClosing = ctx.voids.indexOf(name.toLowerCase()) !== -1
  const attrs = attributes(ctx, node.properties)
  const omit = ctx.omit
  let value = ''

  /* If the node is categorised as void, but it has
   * children, remove the categorisation.  This
   * enables for example `menuitem`s, which are
   * void in W3C HTML but not void in WHATWG HTML, to
   * be stringified properly. */
  selfClosing = content ? false : selfClosing

  if (attrs || !omit || !opening(node, index, parent)) {
    value = LT + name + (attrs ? SPACE + attrs : EMPTY)

    if (selfClosing && ctx.close) {
      if (!ctx.tightClose || attrs.charAt(attrs.length - 1) === SO) {
        value += SPACE
      }

      value += SO
    }

    value += GT
  }

  value += content

  if (!selfClosing && (!omit || !closing(node, index, parent))) {
    value += LT + SO + name + GT
  }

  return value
}

/** Stringify all attributes. */
function attributes (ctx: any, props: {[key: string]: any}) {
  const values = []
  let key
  let value
  let result
  let length
  let index
  let last

  for (key in props) {
    value = props[key]

    if (value == null) {
      continue
    }

    result = attribute(ctx, key, value)

    if (result) {
      values.push(result)
    }
  }

  length = values.length
  index = -1

  while (++index < length) {
    result = values[index]
    last = ctx.tight && result.charAt(result.length - 1)

    /* In tight mode, don’t add a space after quoted attributes. */
    if (index !== length - 1 && last !== DQ && last !== SQ) {
      values[index] = result + SPACE
    }
  }

  return values.join(EMPTY)
}

/* Stringify one attribute. */
function attribute (ctx: any, key: string, value?: any) {
  const info: Information = getPropertyInformation(key) || {} as Information
  let name

  if (
    value == null ||
    (typeof value === 'number' && isNaN(value)) ||
    (!value && info.boolean) ||
    (value === false && info.overloadedBoolean)
  ) {
    return EMPTY
  }

  name = attributeName(ctx, key)

  if ((value && info.boolean) || (value === true && info.overloadedBoolean)) {
    return name
  }

  return name + attributeValue(ctx, key, value)
}

/* Stringify the attribute name. */
function attributeName (ctx: any, key: string) {
  const info: Information = getPropertyInformation(key) || {} as Information
  let name = info.name || convertToKebabCase(key)

  if (
    name.slice(0, DATA.length) === DATA &&
    /[0-9]/.test(name.charAt(DATA.length))
  ) {
    name = DATA + '-' + name.slice(4)
  }

  return stringifyEntities(name, {
    ...ctx.entities,
    subset: ctx.NAME,
  })
}

/* Stringify the attribute value. */
function attributeValue (ctx: any, key: string, value: any) {
  const info: Information = getPropertyInformation(key) || {} as Information
  const options = ctx.entities
  let quote = ctx.quote
  const alternative = ctx.alternative
  let unquoted

  if (typeof value === 'object' && 'length' in value) {
    /* `spaces` doesn’t accept a second argument, but it’s
     * given here just to keep the code cleaner. */
    value = (info.commaSeparated ? commas : spaces)(value, {
      padLeft: !ctx.tightLists,
    })
  }

  value = String(value)

  if (value || !ctx.collapseEmpty) {
    unquoted = value

    /* Check unquoted value. */
    if (ctx.unquoted) {
      unquoted = stringifyEntities(value, {
        ...options,
        subset: ctx.UNQUOTED,
        attribute: true,
      })
    }

    /* If `value` contains entities when unquoted... */
    if (!ctx.unquoted || unquoted !== value) {
      /* If the alternative is less common than `quote`, switch. */
      if (
        alternative &&
        ccount(value, quote) > ccount(value, alternative)
      ) {
        quote = alternative
      }

      value = stringifyEntities(value, {
        ...options,
        subset: quote === SQ ? ctx.SINGLE_QUOTED : ctx.DOUBLE_QUOTED,
        attribute: true,
      })

      value = quote + value + quote
    }

    /* Don’t add a `=` for unquoted empties. */
    value = value ? EQ + value : value
  }

  return value
}
