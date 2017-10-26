import { Node, Parent } from 'typed-unist'

export function isNode (node: any) {
  if (typeof node !== 'object' || !node.type || typeof node.type !== 'string') {
    return false
  }
  return true
}
export type Test = (node: Node, index?: number, parent?: Parent) => boolean

/**
 * Assert if `test` passes for `node`. When a `parent` node is known the
 * `index` of node
 */
export function is (test: string, node: Node): boolean
export function is (test: {[key: string]: any}, node: Node): boolean
export function is (test: Test, node: Node, index: number, parent: Parent, context?: any): boolean
export function is (test: Test, node: Node): boolean
export function is (test: any, node: Node, index?: number, parent?: Parent, context?: any): boolean {
  const hasParent = parent != null
  const hasIndex = index != null
  const check = convert(test)

  if (
    hasIndex &&
    (typeof index !== 'number' || index < 0 || index === Infinity)
  ) {
    throw new Error('Expected positive finite index or child node')
  }

  if (hasParent && (!is(null, parent) || !parent.children)) {
    throw new Error('Expected parent node')
  }

  if (!isNode(node)) {
    return false
  }

  if (hasParent !== hasIndex) {
    throw new Error('Expected both parent and index')
  }

  return Boolean(check.call(context, node, index, parent))
}

function convert (test: any) {
  if (typeof test === 'string') {
    return typeFactory(test)
  }

  if (test == null) {
    return ok
  }

  if (typeof test === 'object') {
    return ('length' in test ? anyFactory : matchesFactory)(test)
  }

  if (typeof test === 'function') {
    return test
  }

  throw new Error('Expected function, string, or object as test')
}

function convertAll (tests: any[]) {
  const results = []
  const length = tests.length
  let index = -1

  while (++index < length) {
    results[index] = convert(tests[index])
  }

  return results
}

/* Utility assert each property in `test` is represented
 * in `node`, and each values are strictly equal. */
function matchesFactory (test: {[key: string]: any}) {
  return matches

  function matches (node: Node) {
    for (const key in test) {
      if ((node as {[key: string]: any})[key] !== test[key]) {
        return false
      }
    }

    return true
  }
}

function anyFactory (tests: any[]) {
  const checks = convertAll(tests)
  const length = checks.length

  return matches

  function matches () {
    let index = -1

    while (++index < length) {
      if (checks[index].apply(this, arguments)) {
        return true
      }
    }

    return false
  }
}

/* Utility to convert a string into a function which checks
 * a given node’s type for said string. */
function typeFactory (test: string) {
  return type

  function type (node: Node) {
    return Boolean(node && node.type === test)
  }
}

/* Utility to return true. */
function ok () {
  return true
}
