import {
  Parent,
  Node,
  Text,
} from 'typed-unist'

/**
 * Root (`Parent`) houses all nodes.
 */
export interface Root extends Parent {
  type: 'root'
}

/**
 * Paragraph (`Parent`) represents a unit of discourse dealing with a particular
 * point or idea.
 */
export interface Paragraph extends Parent {
  type: 'paragraph'
}

/**
 * Blockquote (`Parent`) represents a quote.
 */
export interface Blockquote extends Parent {
  type: 'blockquote'
}

/**
 * Heading (`Parent`), just like with HTML, with a level greater than or equal
 * to 1, lower than or equal to 6.
 */
export interface Heading extends Parent {
  type: 'heading'
  depth: number
}

/**
 * Code (`Text`) occurs at block level (see InlineCode for code spans). Code
 * sports a language tag (when using GitHub Flavoured Markdown fences with a
 * flag, null otherwise).
 */
export interface Code extends Text {
  type: 'code'
  lang?: string
}

/**
 * `InlineCode` (`Text`) occurs inline (see Code for blocks). Inline code does not
 * sport a lang attribute.
 */
export interface InlineCode extends Text {
  type: 'inlineCode'
}

/**
 * `YAML` (`Text`) can occur at the start of a document, and contains embedded YAML data.
 */
export interface YAML extends Text {
  type: 'yaml'
}

/**
 * `HTML` (`Text`) contains embedded HTML.
 */
export interface HTML extends Text {
  type: 'html'
}

/**
 * `List` (`Parent`) contains `ListItem`s. No other nodes may occur in lists.
 *
 * The start property contains the starting number of the list when
 * `ordered: true`; `null` otherwise.
 * When all list items have `loose: false`, the list’s loose property is also
 * `false`. Otherwise, `loose: true`.
 */
export interface List extends Parent {
  type: 'list'
  ordered: boolean
  start?: number
  loose: boolean
}

/**
 * `ListItem` (`Parent`) is a child of a `List`.
 *
 * Loose `ListItem`s often contain more than one block-level elements.
 * A checked property exists on `ListItem`s, set to `true` (when checked),
 * `false` (when unchecked), or `null` (when not containing a checkbox).
 * See Task Lists on GitHub for information.
 */
export interface ListItem extends Parent {
  type: 'listItem'
  loose: boolean
  checked?: boolean
}

export type AlignTypes = 'left' | 'right' | 'center' | null

/**
 * `Table` (`Parent`) represents tabular data, with alignment.
 *
 * Its children are `TableRow`s, the first of which acts as a table
 * header row. `table.align` represents the alignment of columns.
 */
export interface Table extends Parent {
  type: 'table'
  align: AlignTypes
}

/**
 * `TableRow` (`Parent`).  Its children are always `TableCell`.
 */
export interface TableRow extends Parent {
  type: 'tableRow'
}

/**
 * `TableCell` (`Parent`).  Contains a single tabular field.
 */
export interface TableCell extends Parent {
  type: 'tableCell'
}

/**
 * `ThematicBreak` (`Node`) represents a break in content, often
 * shown as a horizontal rule, or by two HTML section elements.
 */
export interface ThematicBreak extends Node {
  type: 'thematicBreak'
}

/**
 * `Break` (`Node`) represents an explicit line break.
 */
export interface Break extends Node {
  type: 'break'
}

/**
 * `Emphasis` (`Parent`) represents slight emphasis.
 */
export interface Emphasis extends Parent {
  type: 'emphasis'
}

/**
 * `Strong` (`Parent`) represents strong emphasis.
 */
export interface Strong extends Parent {
  type: 'strong'
}

/**
 * `Delete` (`Parent`) represents text ready for removal.
 */
export interface Delete extends Parent {
  type: 'delete'
}

/**
 * `Link` (`Parent`) represents the humble hyperlink.
 */
export interface Link extends Parent {
  type: 'link'
  title?: string
  url: string
}

/**
 * `Image` (`Node`) represents the figurative figure.
 */
export interface Image extends Parent {
  type: 'image'
  title?: string
  alt?: string
  url: string
}

/**
 * `Footnote` (`Parent`) represents an inline marker, whose content relates to
 * the document but is outside its flow.
 */
export interface Footnote extends Parent {
  type: 'footnote'
}

export type ReferenceTypes = 'shortcut' | 'collapsed' | 'full'

/**
 * `LinkReference` (`Parent`) represents a humble hyperlink, its `url` and
 * `title` defined somewhere else in the document by a`Definition`.
 *
 * `referenceType` is needed to detect if a reference was meant as
 * a reference (`[foo][]`) or just unescaped brackets (`[foo]`).
 */
interface LinkReference extends Parent {
  type: 'linkReference'
  identifier: string
  referenceType: ReferenceTypes
}

/**
 * `ImageReference` (`Node`) represents a figurative figure, its `url` and
 * `title` defined somewhere else in the document by a `Definition`.
 *
 * `referenceType` is needed to detect if a reference was meant as
 * a reference (`![foo][]`) or just unescaped brackets (`![foo]`). See
 * `LinkReference` for the definition of `referenceType`.
 */
interface ImageReference extends Node {
  type: 'imageReference'
  identifier: string
  referenceType: ReferenceTypes
  alt: string | null
}

/**
 * `FootnoteReference` (`Node`) is like `Footnote`, but its content is already
 * outside the documents flow: placed in a `FootnoteDefinition`.
 */
interface FootnoteReference extends Node {
  type: 'footnoteReference'
  identifier: string
}

/**
 * `Definition` (`Node`) represents the definition (i.e., location and title) of
 * a `LinkReference` or an `ImageReference`.
 */
interface Definition extends Node {
  type: 'definition'
  identifier: string
  title?: string
  url: string
}

/**
 * `FootnoteDefinition` (`Parent`) represents the definition (i.e., content) of
 * a `FootnoteReference`.
 */
interface FootnoteDefinition extends Parent {
  type: 'footnoteDefinition'
  identifier: string
}

/**
 * `TextNode` (`Text`) represents everything that is just text. Note that its
 * `type` property is `text`, but it is different from `Text`.
 */
interface TextNode extends Text {
  type: 'text'
}
