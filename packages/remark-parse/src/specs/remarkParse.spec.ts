import * as path from 'path'
import * as fs from 'fs'
import { VFile } from 'typed-vfile'
import unified from 'typed-unified'
import remarkParse from '../lib'
import { Parent } from 'typed-unist'

const processor = unified().use(remarkParse)

describe('remark-parse', () => {
  describe('', () => {
    it('', () => {
      const result = processor.parse('Alfred')

      expect((result as Parent).children.length).toEqual(1)
    })
  })
})
