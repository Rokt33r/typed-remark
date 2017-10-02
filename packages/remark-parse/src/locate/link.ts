export function locateLink (value: string, fromIndex?: number) {
  const link = value.indexOf('[', fromIndex)
  const image = value.indexOf('![', fromIndex)

  if (image === -1) {
    return link
  }

  /* Link can never be `-1` if an image is found, so we don’t need
   * to check for that :) */
  return link < image ? link : image
}
