import { Handler } from '../'
import { blockquote } from './blockquote'
import { hardBreak } from './break'
import { code } from './code'
import { strikethrough } from './delete'
import { emphasis } from './emphasis'
import { footnoteReference } from './footnoteReference'
import { footnote } from './footnote'
import { heading } from './heading'
import { html } from './html'
import { imageReference } from './imageReference'
import { image } from './image'
import { inlineCode } from './inlineCode'
import { linkReference } from './linkReference'
import { link } from './link'
import { listItem } from './listItem'
import { list } from './list'
import { paragraph } from './paragraph'
import { root } from './root'
import { strong } from './strong'
import { table } from './table'
import { text } from './text'
import { thematicBreak } from './thematicBreak'

export default {
  blockquote,
  break: hardBreak as Handler,
  code,
  delete: strikethrough,
  emphasis,
  footnoteReference,
  footnote,
  heading,
  html,
  imageReference,
  image,
  inlineCode,
  linkReference,
  link,
  listItem,
  list,
  paragraph,
  root,
  strong,
  table,
  text,
  thematicBreak,
  toml: ignore,
  yaml: ignore,
  definition: ignore,
  footnoteDefinition: ignore,
} as {
  [key: string]: Handler
}

/* Return nothing for nodes which are ignored. */
function ignore (): null {
  return null
}
