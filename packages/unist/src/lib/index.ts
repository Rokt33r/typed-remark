/**
 * Point references a point consisting of two indices in a Unist file: line and column, set to 1-based integers. An offset (0-based) may be used.
 *
 * - line >= 1
 * - column >= 1
 * - offset >= 0
 *
 * @export
 * @interface Point
 */
export interface Point {
  line: number
  column: number
  offset?: number
}

/**
 * Position references a range consisting of two points in a Unist file. Position consists of a start and end point. And, if relevant, an indent property.
 *
 * When the value represented by a node is not present in the document corresponding to the syntax tree at the time of reading, it must not have positional information. These nodes are said to be generated.
 *
 * - indent >= 1
 *
 * @export
 * @interface Position
 */
export interface Position {
  start: Point
  end: Point
  indent?: number[]
}

/**
 * A Node represents any unit in the Unist hierarchy. It is an abstract interface. Interfaces extending Node must have a type property, and may have data or position properties. types are defined by their namespace.
 *
 * Subsets of Unist are allowed to define properties on interfaces which extend Unist’s abstract interfaces. For example, mdast defines Link (Parent) with a url property.
 *
 * @export
 * @interface Node
 */
export interface Node {
  type: string
  position?: Position
}

/**
 * Node with data
 *
 * Data represents data associated with any node. Data is a scope for plug-ins to store any information. For example, remark-html uses hProperties to let other plug-ins specify properties added to the compiled HTML element.
 *
 * @export
 * @interface DataNode
 * @extends {Node}
 * @template D
 */
export interface DataNode<D extends {}> extends Node {
  data: D
}

/**
 * Nodes containing a value extend the abstract interface Text (Node).
 *
 * @export
 * @interface Text
 * @extends {Node}
 */
export interface Text extends Node {
  value: string
}

/**
 * Nodes containing other nodes (said to be children) extend the abstract interface Parent (Node).
 *
 * @export
 * @interface Parent
 * @extends {Node}
 */
export interface Parent extends Node {
  children: Node[]
}
