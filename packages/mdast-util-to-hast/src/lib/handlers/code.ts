import { detab } from 'typed-string-utils'
import u from 'typed-unist-builder'
import { H } from '../'
import { Node, Text } from 'typed-unist'
import { Code } from 'typed-mdast'

/* Transform a code block. */
export function code (h: H, node: Node) {
  const value = (node as Text).value ? detab((node as Text).value + '\n') : ''
  const lang = (node as Code).lang && (node as Code).lang.match(/^[^ \t]+(?=[ \t]|$)/)
  const props: {
    [key: string]: any
  } = {}

  if (lang) {
    props.className = ['language-' + lang]
  }

  return h({
    position: node.position,
  } as Node, 'pre', [
    h(node, 'code', props, [u('text', value)]),
  ])
}
