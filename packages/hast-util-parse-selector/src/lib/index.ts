import { Element } from 'typed-hast'

interface Properties {
  className?: string[]
  id?: string
}

/* Characters */
const dot = '.'.charCodeAt(0)
const hash = '#'.charCodeAt(0)

/* Parse a simple CSS selector into a HAST node. */
export function parseSelector (selector?: string): Element {
  const value = selector || ''
  let name = 'div'
  const props: Properties = {}
  let index = -1
  const length = value.length
  let className
  let type
  let subvalue
  let lastIndex

  while (++index <= length) {
    const code = value.charCodeAt(index)

    if (!code || code === dot || code === hash) {
      subvalue = value.slice(lastIndex, index)

      if (subvalue) {
        if (type === dot) {
          if (className) {
            className.push(subvalue)
          } else {
            className = [subvalue]
            props.className = className
          }
        } else if (type === hash) {
          props.id = subvalue
        } else {
          name = subvalue
        }
      }

      lastIndex = index + 1
      type = code
    }
  }

  return {
    type: 'element',
    tagName: name,
    properties: props,
    children: [],
  }
}
