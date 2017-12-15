import {
  encloseTitle,
  encloseURI,
} from '../util'

/* Expression for a protocol:
 * http://en.wikipedia.org/wiki/URI_scheme#Generic_syntax */
const PROTOCOL = /^[a-z][a-z+.-]+:\/?/i;

/* Stringify a link.
 *
 * When no title exists, the compiled `children` equal
 * `url`, and `url` starts with a protocol, an auto
 * link is created:
 *
 *     <http://example.com>
 *
 * Otherwise, is smart about enclosing `url` (see
 * `encloseURI()`) and `title` (see `encloseTitle()`).
 *
 *    [foo](<foo at bar dot com> 'An "example" e-mail')
 *
 * Supports named entities in the `url` and `title` when
 * in `settings.encode` mode. */
function link(node) {
  var self = this;
  var content = self.encode(node.url || '', node);
  var exit = self.enterLink();
  var escaped = self.encode(self.escape(node.url || '', node));
  var value = self.all(node).join('');

  exit();

  if (
    node.title == null &&
    PROTOCOL.test(content) &&
    (escaped === value || escaped === 'mailto:' + value)
  ) {
    /* Backslash escapes do not work in autolinks,
     * so we do not escape. */
    return encloseURI(self.encode(node.url), true);
  }

  content = encloseURI(content);

  if (node.title) {
    content += ' ' + encloseTitle(self.encode(self.escape(node.title, node), node));
  }

  return '[' + value + '](' + content + ')';
}