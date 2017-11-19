import { Node, Parent } from 'typed-unist'
import { iterate } from 'typed-array-iterate'

type Modifier <C extends Parent> = (child: Node, index: number, parent: C) => number | void

/**
 * Turn `callback` into a child-modifier accepting a parent.
 * See `array-iterate` for more info.
 */
export function modifyChildrenFactory <C extends Parent> (callback: Modifier<C>) {
  return iteratorFactory(wrapperFactory(callback))
}

/**
 * Turn `callback` into a `iterator' accepting a parent.
 */
function iteratorFactory (callback: (child: Node, index: number) => number | void) {
  return iterator

  function iterator (parent: Parent) {
    if (parent.children == null) {
      throw new Error('Missing children in `parent` for `modifier`')
    }

    return iterate(parent.children, callback, parent)
  }
}

/* Pass the context as the third argument to `callback`. */
function wrapperFactory <C extends Parent> (callback: Modifier<C>) {
  return wrapper

  function wrapper (this: C, value: Node, index: number) {
    return callback(value, index, this)
  }
}
