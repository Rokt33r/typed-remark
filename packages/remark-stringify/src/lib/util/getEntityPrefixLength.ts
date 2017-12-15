import { parseEntities } from 'typed-parse-entities'

/* Returns the length of HTML entity that is a prefix of
 * the given string (excluding the ampersand), 0 if it
 * does not start with an entity. */
export function getEntityPrefixLength (value: string): number {
  /* istanbul ignore if - Currently also tested for at
   * implemention, but we keep it here because that’s
   * proper. */
  if (value.charAt(0) !== '&') {
    return 0
  }

  const prefix = value.split('&', 2).join('&')

  return prefix.length - parseEntities(prefix).length
}
