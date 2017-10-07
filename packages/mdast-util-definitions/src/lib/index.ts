import { Node } from 'typed-unist'
import { visit } from 'typed-unist-util-visit'

// 재료
const hasOwnProperty = {}.hasOwnProperty

export interface DefinitionOptions {
  commonmark: boolean
}

export interface DefinitionNode extends Node {
  type: 'definition'
  identifier: string
  title?: string
  url: string
}

interface DefinitionCache {
  [id: string]: DefinitionNode
}

/* Get a definition in `node` by `identifier`. */
export function getDefinitionFactory (node: Node, options?: DefinitionOptions) {
  return getterFactory(gather(node, options))
}

/* Gather all definitions in `node` */
function gather (node: Node, options: DefinitionOptions): DefinitionCache {
  const cache: DefinitionCache = {}

  visit(node, 'definition', options && options.commonmark ? commonmark : normal)

  return cache

  function commonmark (definition: DefinitionNode) {
    const id = normalise(definition.identifier)
    if (!hasOwnProperty.call(cache, id)) {
      cache[id] = definition
    }
  }

  function normal (definition: DefinitionNode) {
    cache[normalise(definition.identifier)] = definition
  }
}

/* Factory to get a node from the given definition-cache. */
function getterFactory (cache: DefinitionCache) {
  /* Get a node from the bound definition-cache. */
  return function getter (identifier: string): DefinitionNode | null {
    const id = identifier && normalise(identifier)

    return id && hasOwnProperty.call(cache, id) ? cache[id] : null
  }
}

function normalise (identifier: string) {
  return identifier.toUpperCase()
}
