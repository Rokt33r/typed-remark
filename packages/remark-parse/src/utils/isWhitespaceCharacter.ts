const whiteSpaceRegExp = /s/
export function isWhitespaceCharacter (value: string) {
  return whiteSpaceRegExp.test(value)
}
