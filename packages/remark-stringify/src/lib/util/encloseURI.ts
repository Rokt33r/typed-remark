import {
  ccount
} from 'typed-string-utils'

const re = /\s/

/**
 * Wrap `url` in angle brackets when needed, or when
 * forced.
 * In links, images, and definitions, the URL part needs
 * to be enclosed when it:
 *
 * - has a length of `0`;
 * - contains white-space;
 * - has more or less opening than closing parentheses.
 */
export function encloseURI (uri: string, always?: boolean) {
  if (always || uri.length === 0 || re.test(uri) || ccount(uri, '(') !== ccount(uri, ')')) {
    return '<' + uri + '>'
  }

  return uri
}
