import { parseSelector } from 'typed-hast-util-parse-selector'
import { camelCase } from 'typed-string-utils'
import { getPropertyInformation, Information } from 'typed-property-information'
import { parse as spaces } from 'typed-space-separated-tokens'
import { parse as commas } from 'typed-comma-separated-tokens'
import { Element } from 'typed-hast'
import { Node } from 'typed-unist'

/**
 * Hyperscript compatible DSL for creating virtual HAST
 * trees.
 */
function h (selector?: string, children?: (Node | string)[], properties?: {[key: string]: any}): Element {
  const node = parseSelector(selector)
  let property

  if (properties) {
    for (property in properties) {
      addProperty(node.properties, property, properties[property])
    }
  }

  if (children) {
    node.children = node.children.concat(children.map((nodeOrText) => {
      return typeof nodeOrText === 'string'
        ? {
          type: 'text',
          value: nodeOrText,
        }
        : nodeOrText
    }))
  }

  if (node.tagName === 'template') {
    node.content = {type: 'root', children: node.children}
    node.children = []
  }

  return node
}

/* Add `name` and its `value` to `properties`. `properties` can
 * be prefilled by `parseSelector`: it can have `id` and `className`
 * properties. */
function addProperty (properties: {[key: string]: string}, name: string, value: any) {
  const info: Information = getPropertyInformation(name) || {} as Information
  let result = value
  let key

  /* Ignore nully and NaN values. */
  if (value === null || value === undefined || value !== value) {
    return
  }

  /* Handle values. */
  if (name === 'style') {
    /* Accept `object`. */
    if (typeof value !== 'string') {
      result = []

      for (key in value) {
        result.push([key, value[key]].join(': '))
      }

      result = result.join('; ')
    }
  } else if (info.spaceSeparated) {
    /* Accept both `string` and `Array`. */
    result = typeof value === 'string' ? spaces(result) : result

    /* Class-names (which can be added both on
     * the `selector` and here). */
    if (name === 'class' && properties.className) {
      result = properties.className.concat(result)
    }
  } else if (info.commaSeparated) {
    /* Accept both `string` and `Array`. */
    result = typeof value === 'string' ? commas(result) : result
  }

  result = parsePrimitive(info, name, result)

  properties[info.propertyName || camelCase(name)] = result
}

/* Parse a (list of) primitives. */
function parsePrimitive (info: Information, name: string, value: any) {
  let result = value
  let index
  let length

  if (typeof value === 'object' && 'length' in value) {
    length = value.length
    index = -1
    result = []

    while (++index < length) {
      result[index] = parsePrimitive(info, name, value[index])
    }

    return result
  }

  if (info.numeric || info.positiveNumeric) {
    if (!isNaN(result) && result !== '') {
      result = Number(result)
    }
  } else if (info.boolean || info.overloadedBoolean) {
    /* Accept `boolean` and `string`. */
    if (
      typeof result === 'string' &&
      (result === '' || value.toLowerCase() === name)
    ) {
      result = true
    }
  }

  return result
}

export default h
