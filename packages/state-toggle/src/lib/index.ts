/* Construct a state `toggler`: a function which inverses
 * `property` in context based on its current value.
 * The by `toggler` returned function restores that value. */
export function stateToggleFactory <C> (key: string, state: boolean, ctx?: C) {
  return enter

  function enter (): () => void {
    const context = ctx || this
    const current = context[key]

    context[key] = !state

    return exit

    function exit () {
      context[key] = current
    }
  }
}
