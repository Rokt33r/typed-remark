export function iterate<I, C> (values: I[], callback: (this: C, value: I, index: number, values: I[]) => number | void, context?: C) {
  let index = -1
  let result

  /* The length might change, so we do not cache it. */
  while (++index < values.length) {
    /* Skip missing values. */
    if (!(index in values)) {
      continue
    }

    result = callback.call(context, values[index], index, values)

    /* If `callback` returns a `number`, move `index` over to
     * `number`. */
    if (typeof result === 'number') {
      /* Make sure that negative numbers do not break the loop. */
      if (result < 0) {
        index = 0
      }

      index = result - 1
    }
  }
}
