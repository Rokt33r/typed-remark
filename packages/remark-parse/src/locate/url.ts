const PROTOCOLS = ['https://', 'http://', 'mailto:']

export function locateURL (value: string, fromIndex?: number) {
  const length = PROTOCOLS.length
  let index = -1
  let min = -1
  let position

  if (!this.options.gfm) {
    return -1
  }

  while (++index < length) {
    position = value.indexOf(PROTOCOLS[index], fromIndex)

    if (position !== -1 && (position < min || min === -1)) {
      min = position
    }
  }

  return min
}
