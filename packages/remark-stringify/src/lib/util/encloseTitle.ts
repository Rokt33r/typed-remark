/**
 * There is currently no way to support nested delimiters
 * across Markdown.pl, CommonMark, and GitHub (RedCarpet).
 * The following code supports Markdown.pl and GitHub.
 * CommonMark is not supported when mixing double- and
 * single quotes inside a title.
 */
export function encloseTitle (title: string): string {
  const delimiter = title.indexOf('"') === -1 ? '"' : '\''
  return delimiter + title + delimiter
}
