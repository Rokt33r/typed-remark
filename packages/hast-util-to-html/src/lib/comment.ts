import { Comment } from 'typed-hast'

/** Stringify a comment `node`. */
export function comment (ctx: any, node: Comment): string {
  return '<!--' + (node).value + '-->'
}
