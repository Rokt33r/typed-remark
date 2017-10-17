import { Node } from 'typed-unist'
import { visit } from 'typed-unist-util-visit'
import { Definition } from 'typed-mdast'

// 재료
const hasOwnProperty = {}.hasOwnProperty

export interface DefinitionOptions {
  commonmark?: boolean
}

interface DefinitionCache {
  [id: string]: Definition
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

  function commonmark (definition: Definition) {
    const id = normalise(definition.identifier)
    if (!hasOwnProperty.call(cache, id)) {
      cache[id] = definition
    }
  }

  function normal (definition: Definition) {
    cache[normalise(definition.identifier)] = definition
  }
}

/* Factory to get a node from the given definition-cache. */
function getterFactory (cache: DefinitionCache) {
  /* Get a node from the bound definition-cache. */
  return function getter (identifier: string): Definition | null {
    const id = identifier && normalise(identifier)

    return id && hasOwnProperty.call(cache, id) ? cache[id] : null
  }
}

function normalise (identifier: string) {
  return identifier.toUpperCase()
}
