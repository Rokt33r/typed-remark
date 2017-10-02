export function locateEmphasis (value: string, fromIndex?: number) {
  const asterisk = value.indexOf('*', fromIndex)
  const underscore = value.indexOf('_', fromIndex)

  if (underscore === -1) {
    return asterisk
  }

  if (asterisk === -1) {
    return underscore
  }

  return underscore < asterisk ? underscore : asterisk
}
