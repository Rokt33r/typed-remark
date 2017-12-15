import { RemarkCompiler } from '../RemarkCompiler'
import { Node } from 'typed-unist'
import { returner } from './returner'

/**
 * Shortcut and collapsed link references need no escaping
 * and encoding during the processing of child nodes (it
 * must be implied from identifier).
 *
 * This toggler turns encoding and escaping off for shortcut
 * and collapsed references.
 *
 * Implies `enterLink`.
 */
export function enterLinkReference (compiler: RemarkCompiler, node: Node) {
  const encode = compiler.encode
  const escape = compiler.escape
  const exit = compiler.enterLink()

  if (
    node.referenceType !== 'shortcut' &&
    node.referenceType !== 'collapsed'
  ) {
    return exit
  }

  compiler.escape = returner
  compiler.encode = returner

  return function () {
    compiler.encode = encode
    compiler.escape = escape
    exit()
  }
}
