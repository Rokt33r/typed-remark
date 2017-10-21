import { Node, Parent } from 'typed-unist'

/* Assert if `test` passes for `node`.
 * When a `parent` node is known the `index` of node */
export function is (test?: string, node?: Node, index?: number, parent?: Parent, context?: string): boolean {
  const hasParent: boolean = parent != null
  const hasIndex: boolean = index != null
  const check = convert(test)

  if (
    hasIndex &&
    (index < 0 || index === Infinity)
  ) {
    throw new Error('Expected positive finite index or child node')
  }

  if ( hasParent && (!is(null, parent))) {
    throw new Error('Expected parent node')
  }

  if (hasParent !== hasIndex) {
    throw new Error('Expected both parent and index')
  }

  return Boolean(check.call(context, node, index, parent))
}




interface Converter {
  (node?: Node): boolean
}

type Test = string | Converter | TestObject
type TestObject = {
  [key: string]: any
}

type ConverterTest = Test | Test[]

function convert (test: ConverterTest): Converter {
  if (typeof test === 'string') {
    return typeFactory(test)
  }

  if (test == null) {
    return ok
  }

  if (typeof test === 'object') {
    return 'length' in test ? anyFactory((test as Test[])) : matchesFactory(test)
  }

  if (typeof test === 'function') {
    return test
  }

  throw new Error('Expected function, string, or object as test');
}

function convertAll(tests: ConverterTest[]): Converter[] {
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
function matchesFactory (test: TestObject): Converter {
  return function matches (node: Node): boolean {
    for (const key in test) {
      if ((node as any)[key] !== test[key]) {
        return false
      }
    }

    return true
  }
}

function anyFactory (tests: Test[]): Converter {
  const checks: Converter[] = convertAll(tests)
  const length: number = checks.length

  return function matches (node: Node): boolean {
    let index = -1

    while (++index < length) {
      if (checks[index](node)) {
        return true
      }
    }

    return false
  }
}


/* Utility to convert a string into a function which checks
 * a given node’s type for said string. */
function typeFactory (test: string): Converter {
  return function type(node: Node):boolean {
    return node.type === test
  }
}

/* Utility to return true. */
const ok: Converter = () => {
  return true
}
