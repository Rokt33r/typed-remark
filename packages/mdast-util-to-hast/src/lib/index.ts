import u from 'typed-unist-builder'
import { visit } from 'typed-unist-util-visit'
import { getDefinitionFactory, DefinitionOptions } from 'typed-mdast-util-definitions'
import { Node, Text, Parent } from 'typed-unist'
import { Root, Element } from 'typed-hast'
import { one } from './one'
import { Definition, FootnoteDefinition } from 'typed-mdast'
import handlers from './handlers'
import { generateFootnotes } from './footer'

export interface HNode extends Node {
  data: HProperties
}

export interface HProperties {
  hName: string
  hProperty: {
    [key: string]: any
  }
  hChildren: Node[]
}

export interface ToHastOptions extends DefinitionOptions {
  allowDangerousHTML?: boolean
  handlers: {
    [key: string]: Handler
  }
}

export interface Handler {
  (h: H, node: Node, parent?: Parent): Node
}

export interface H {
  (node: Node, tagName: string, props?: {[key: string]: any} | Node[], children?: Node[]): Node
  dangerous: boolean
  definition: (identifier: string) => Definition
  footnotes: FootnoteDefinition[]
  handlers: {
    [key: string]: Handler
  }
  augment: Augment
}

export interface Augment {
  (left: Node, right: Root | Element | Text): Node
}

/* Factory to transform. */
function factory (tree: Node, options: ToHastOptions) {
  const settings: ToHastOptions = options || {} as ToHastOptions
  const dangerous: boolean = settings.allowDangerousHTML

  /* Create an element for a `node`. */
  const h: H = function (node: Node, tagName: string, props: {[key: string]: any} | Node, children: Node[]) {
    if (
      (children == null) &&
      typeof props === 'object' &&
      'length' in props
    ) {
      children = props as Node[]
      props = {}
    }

    return augment(node, {
      type: 'element',
      tagName,
      properties: props || {},
      children: children || [],
    })
  } as H

  h.dangerous = dangerous
  h.definition = getDefinitionFactory(tree, settings as DefinitionOptions)
  h.footnotes = []
  h.augment = augment
  h.handlers = Object.assign(handlers, (settings.handlers || {}))

  visit(tree, 'footnoteDefinition', visitor)

  return h

  /* Finalise the created `right`, a HAST node, from
   * `left`, an MDAST node.   */
  function augment (left: Node, right: Element): Node {
    let data

    /* Handle `data.hName`, `data.hProperties, `hChildren`. */
    if (left && 'data' in left) {
      data = (left as any).data

      if (right.type === 'element' && data.hName) {
        right.tagName = data.hName
      }

      if (right.type === 'element' && data.hProperties) {
        right.properties = Object.assign(right.properties, data.hProperties)
      }

      if (right.children && data.hChildren) {
        right.children = data.hChildren
      }
    }

    const ctx: Node = left
    // const ctx: Node = left && left.position ? left : {position: left}

    if (ctx.position) {
      right.position = {
        start: ctx.position.start,
        end: ctx.position.end,
      }
    }

    return right
  }

  function visitor (definition: FootnoteDefinition) {
    h.footnotes.push(definition)
  }
}

/* Transform `tree`, which is an MDAST node, to a HAST node. */
export function toHAST (tree: Node, options: ToHastOptions) {
  const h = factory(tree, options)
  const node = one(h, tree)
  const footnotes = generateFootnotes(h)

  if (node && (node as Parent).children && footnotes) {
    (node as Parent).children = (node as Parent).children.concat(u('text', '\n'), footnotes)
  }

  return node
}
