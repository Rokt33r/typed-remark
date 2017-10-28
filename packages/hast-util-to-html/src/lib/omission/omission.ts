import { Node, Parent } from 'typed-unist'
import { Element } from 'typed-hast'

const hasOwnProperty = {}.hasOwnProperty

export type Handler = (node: Node, index: number, parent: Parent) => boolean
export interface HandlerMap {
  [key: string]: Handler
}

/* Factory to check if a given node can have a tag omitted. */
export function omission (handlers: HandlerMap) {
  return omit

  /** Check if a given node can have a tag omitted.   */
  function omit (node: Node, index: number, parent: Parent): boolean {
    const name = (node as Element).tagName
    const fn = hasOwnProperty.call(handlers, name) ? handlers[name] : false

    return fn ? fn(node, index, parent) : false
  }
}
