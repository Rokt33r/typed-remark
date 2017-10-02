export function locateStrong (value: string, fromIndex?: number) {
  const asterisk = value.indexOf('**', fromIndex)
  const underscore = value.indexOf('__', fromIndex)

  if (underscore === -1) {
    return asterisk
  }

  if (asterisk === -1) {
    return underscore
  }

  return underscore < asterisk ? underscore : asterisk
}
