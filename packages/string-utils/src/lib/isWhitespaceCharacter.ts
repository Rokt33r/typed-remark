const whiteSpaceRegExp = /\s/
export function isWhitespaceCharacter (charOrCharCode: string | number) {
  const character = typeof charOrCharCode === 'number'
    ? String.fromCharCode(charOrCharCode)
    : charOrCharCode.charAt(0)

  return whiteSpaceRegExp.test(character)
}
