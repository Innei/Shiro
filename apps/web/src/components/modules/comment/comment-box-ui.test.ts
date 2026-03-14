import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('comment box UI', () => {
  it('does not include kaomoji controls in the universal text area', () => {
    const source = readFileSync(
      resolve(__dirname, 'CommentBox', 'UniversalTextArea.tsx'),
      'utf8',
    )

    expect(source).not.toContain('KaomojiPanel')
    expect(source).not.toContain('KAOMOJI_LIST')
    expect(source).not.toContain('kaomoji_label')
  })
})
