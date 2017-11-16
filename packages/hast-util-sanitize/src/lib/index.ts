import githubRule from './github'
import { Node, Parent, Text } from 'typed-unist'
import { Root, Element } from 'typed-hast'

export interface SanitizeSchema {
  strip: string[],
  clobberPrefix: string,
  clobber: string[],
  ancestors: {
    [tagName: string]: string[]
  }
  protocols: {
    [attributeName: string]: string[]
  }
  tagNames: string[]
  attributes: {
    [tagName: string]: string[]
  }
}

export interface Properties {
  [key: string]: any
}

const hasOwnProperty = {}.hasOwnProperty

/** Sanitize `node`, according to `schema`. */
export function sanitizeHAST (node: Node, schema?: Partial<SanitizeSchema>): Node {
  const ctx: Root = {type: 'root', children: []} as Root

  if (!node || typeof node !== 'object' || !node.type) {
    return ctx
  }

  const replace = one(Object.assign({}, githubRule, schema), node, [])

  if (!replace) {
    return ctx
  }

  if ('length' in replace) {
    if ((replace as Node[]).length === 1) {
      return (replace as Node[])[0]
    }

    ctx.children = replace as Node[]

    return ctx
  }

  return replace as Node
}

/* Sanitize `node`. */
function one (schema: SanitizeSchema, node: Node, stack: string[]): Node | Node[] {
  const type = node && node.type
  const replacement: Node = {type: node.type}
  let replace = true

  switch (type) {
    case 'root':
      (replacement as Root).children = all(schema, (node as Root).children, node, stack)
      break
    case 'element':
      const replacedTagName = handleTagName(schema, (node as Element).tagName, node, stack)
      if (replacedTagName === false) {
        (replacement as Element).tagName = (node as Element).tagName
        replace = false
      } else if (replacedTagName != null) {
        (replacement as Element).tagName = replacedTagName
      }
      const replacedProperties = handleProperties(schema, (node as Element).properties, node as Element, stack)
      if (replacedTagName === false) {
        (replacement as Element).properties = (node as Element).properties
        replace = false
      } else if (replacedProperties != null) {
        (replacement as Element).properties = replacedProperties
      }
      (replacement as Element).children = all(schema, (node as Element).children, node, stack)
      break
    case 'text':
      (replacement as Text).value = handleValue(schema, (node as Text).value)
      break
    default:
      replace = false
  }

  if (node.data) replacement.data = node.data
  if (node.position) replacement.position = node.position

  if (!replace) {
    if (
      !(replacement as Parent).children ||
      (replacement as Parent).children.length === 0 ||
      schema.strip.indexOf((replacement as Element).tagName) !== -1
    ) {
      return null
    }

    return (replacement as Parent).children
  }

  return replacement
}

/* Sanitize `children`. */
function all (schema: SanitizeSchema, children: Node[], node: Node, stack: string[]): Node[] {
  const nodes = children || []
  const length = nodes.length || 0
  const results: Node[] = []
  let index = -1
  let result

  stack = stack.concat((node as Element).tagName)

  while (++index < length) {
    result = one(schema, nodes[index], stack)

    if (result) {
      if ('length' in result) {
        results.push(...result as Node[])
      } else {
        results.push(result as Node)
      }
    }
  }

  return results
}

/* Sanitize `properties`. */
function handleProperties (schema: SanitizeSchema, properties: Properties, node: Element, stack: string[]): {} {
  const name = handleTagName(schema, node.tagName, node, stack)
  const attrs = schema.attributes
  const props = properties || {}
  const result: Properties = {}
  let allowed
  let prop
  let value

  allowed = hasOwnProperty.call(attrs, name) ? attrs[name as string] : []

  allowed = [].concat(allowed, attrs['*'])
  for (prop in props) {
    value = props[prop]

    if (
      allowed.indexOf(prop) === -1 &&
      !(data(prop) && allowed.indexOf('data*') !== -1)
    ) {
      continue
    }

    if (value && typeof value === 'object' && 'length' in value) {
      value = handlePropertyValues(schema, value, prop)
    } else {
      value = handlePropertyValue(schema, value, prop)
    }

    if (value !== null && value !== undefined) {
      result[prop] = value
    }
  }

  return result
}

/* Sanitize a property value which is a list. */
function handlePropertyValues (schema: SanitizeSchema, values: string[], prop: string) {
  const length = values.length
  const result = []
  let index = -1
  let value

  while (++index < length) {
    value = handlePropertyValue(schema, values[index], prop)

    if (value !== null && value !== undefined) {
      result.push(value)
    }
  }

  return result
}

/* Sanitize a property value. */
function handlePropertyValue (schema: SanitizeSchema, value: string, prop: string) {
  if (
    typeof value !== 'boolean' &&
    typeof value !== 'number' &&
    typeof value !== 'string'
  ) {
    return null
  }

  if (!handleProtocol(schema, value, prop)) {
    return null
  }

  if (schema.clobber.indexOf(prop) !== -1) {
    value = schema.clobberPrefix + value
  }

  return value
}

/* Check whether `value` is a safe URL. */
function handleProtocol (schema: SanitizeSchema, value: string, prop: string) {
  const protocolsMap = schema.protocols
  let protocol
  let first
  let colon
  let length
  let index

  const protocols = hasOwnProperty.call(protocolsMap, prop) ? protocolsMap[prop].concat() : []

  if (protocols.length === 0) {
    return true
  }

  value = String(value)
  first = value.charAt(0)

  if (first === '#' || first === '/') {
    return true
  }

  colon = value.indexOf(':')

  if (colon === -1) {
    return true
  }

  length = protocols.length
  index = -1

  while (++index < length) {
    protocol = protocols[index]

    if (
      colon === protocol.length &&
      value.slice(0, protocol.length) === protocol
    ) {
      return true
    }
  }

  index = value.indexOf('?')

  if (index !== -1 && colon > index) {
    return true
  }

  index = value.indexOf('#')

  if (index !== -1 && colon > index) {
    return true
  }

  return false
}

/* Sanitize `tagName`. */
function handleTagName (schema: SanitizeSchema, tagName: string, node: Node, stack: string[]): false | string {
  const name = typeof tagName === 'string' ? tagName : null
  let length
  let index

  if (!name || name === '*' || schema.tagNames.indexOf(name) === -1) {
    return false
  }

  const ancestors = hasOwnProperty.call(schema.ancestors, name) ? schema.ancestors[name] : []

  /* Some nodes can break out of their context if they
   * don’t have a certain ancestor. */
  if (ancestors.length !== 0) {
    length = ancestors.length + 1
    index = -1

    while (++index < length) {
      if (!ancestors[index]) {
        return false
      }

      if (stack.indexOf(ancestors[index]) !== -1) {
        break
      }
    }
  }

  return name
}

/* Sanitize `value`. */
function handleValue (schema: SanitizeSchema, value: any): string {
  return typeof value === 'string' ? value : ''
}

/* Check if `prop` is a data property. */
function data (prop: string) {
  return prop.length > 4 && prop.slice(0, 4).toLowerCase() === 'data'
}
