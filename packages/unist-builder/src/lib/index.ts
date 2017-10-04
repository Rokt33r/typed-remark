import { Node, Text, Parent } from 'typed-unist'

export default function unistBuilder (type: string): Node
export default function unistBuilder (type: string, value: string): Text
export default function unistBuilder (type: string, value: Node[]): Parent
export default function unistBuilder<P extends {}> (type: string, props: P): Node
export default function unistBuilder<P extends {}> (type: string, props: P, value: string): Text
export default function unistBuilder<P extends {}> (type: string, props: P, value: Node[]): Parent
export default function unistBuilder (type: string, propsOrValue?: any, value?: string | Node[]): Node {
  let props = propsOrValue
  if (value == null && (typeof propsOrValue !== 'object' || Array.isArray(propsOrValue))) {
    value = propsOrValue
    props = {}
  }

  return Object.assign({}, props,
    { type: String(type) },
    value != null && (Array.isArray(value)
      ? { children: value }
      : { value: String(value),
  }))
}
