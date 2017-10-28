import { Parent } from 'typed-unist'
import { one } from './one'
import { ToHTMLContext } from './'

/** Stringify all children of `parent`. */
export function all (ctx: ToHTMLContext, parent: Parent): string {
  const children = parent && parent.children
  const length = children && children.length
  let index = -1
  const results = []

  while (++index < length) {
    results[index] = one(ctx, children[index], index, parent)
  }

  return results.join('')
}
