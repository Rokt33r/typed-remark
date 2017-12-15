declare module 'commonmark.json' {
  interface CommonmarkStub {
    markdown: string
    html: string
    section: string
  }

  const StubList: CommonmarkStub[]

  export = StubList
}
