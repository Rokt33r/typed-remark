import {
  isFunction,
  isPlainObject,
} from 'lodash'

/* Assert a parser is available. */
export function assertParser(name: string, Parser: any) {
  if (!isFunction(Parser)) {
    throw new Error('Cannot `' + name + '` without `Parser`')
  }
}

/* Assert a compiler is available. */
export function assertCompiler(name: string, Compiler: any) {
  if (!isFunction(Compiler)) {
    throw new Error('Cannot `' + name + '` without `Compiler`')
  }
}

/* Assert the processor is not frozen. */
export function assertUnfrozen(name: string, frozen: boolean) {
  if (frozen) {
    throw new Error(
      'Cannot invoke `' + name + '` on a frozen processor.\n' +
      'Create a new processor first, by invoking it: ' +
      'use `processor()` instead of `processor`.',
    )
  }
}

/* Assert that `complete` is `true`. */
export function throwAsyncTransformError(name: string, asyncName: string): never {
  throw new Error('`' + name + '` finished async. Use `' + asyncName + '` instead')
}

export function isNewable (value: any) {
  return isFunction(value) && value.prototype
}

export function isPromise (obj: any): boolean {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}
