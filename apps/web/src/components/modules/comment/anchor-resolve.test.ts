import { describe, expect, it } from 'vitest'

import { resolveRangeAnchor } from './anchor-resolve'
import type { BlockInfo } from './anchor-utils'
import { computeBlockFingerprint } from './anchor-utils'
import type { RangeAnchor } from './types'

function makeBlock(
  index: number,
  blockId: string,
  textContent: string,
  type = 'paragraph',
): BlockInfo {
  return {
    index,
    blockId,
    type,
    textContent,
    fingerprint: computeBlockFingerprint(textContent),
  }
}

function makeAnchor(
  block: BlockInfo,
  startOffset: number,
  endOffset: number,
  overrides?: Partial<RangeAnchor>,
): RangeAnchor {
  const text = block.textContent
  const quote = text.slice(startOffset, endOffset)
  return {
    mode: 'range',
    blockId: block.blockId,
    blockType: block.type,
    blockFingerprint: block.fingerprint,
    snapshotText: text.slice(0, 300),
    quote,
    prefix: text.slice(Math.max(0, startOffset - 50), startOffset),
    suffix: text.slice(endOffset, endOffset + 50),
    startOffset,
    endOffset,
    lang: null,
    ...overrides,
  }
}

describe('resolveRangeAnchor', () => {
  describe('Layer 1: Exact match', () => {
    it('returns exact when fingerprint matches and offsets are valid', () => {
      const block = makeBlock(0, 'b1', 'Hello world, this is a test.')
      const anchor = makeAnchor(block, 6, 11) // "world"

      const result = resolveRangeAnchor(anchor, [block])

      expect(result.status).toBe('exact')
      expect(result.startOffset).toBe(6)
      expect(result.endOffset).toBe(11)
      expect(result.blockIndex).toBe(0)
    })
  })

  describe('Layer 2: Quote substring search', () => {
    it('finds quote at new position after text insertion before it', () => {
      const originalText = 'Hello world, this is a test.'
      const originalBlock = makeBlock(0, 'b1', originalText)
      const anchor = makeAnchor(originalBlock, 6, 11) // "world"

      // Text modified: "ADDED " inserted at start
      const modifiedBlock = makeBlock(
        0,
        'b1',
        'ADDED Hello world, this is a test.',
      )

      const result = resolveRangeAnchor(anchor, [modifiedBlock])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBe(1)
      expect(result.startOffset).toBe(12) // "world" moved to index 12
      expect(result.endOffset).toBe(17)
    })

    it('disambiguates multiple identical quotes using prefix/suffix', () => {
      const originalText = 'The cat sat on the mat. The cat ran away.'
      const originalBlock = makeBlock(0, 'b1', originalText)
      // Select second "cat" (at index 28)
      const anchor = makeAnchor(originalBlock, 28, 31) // "cat"

      // Text stays same but fingerprint changes (simulated)
      const modifiedBlock = makeBlock(0, 'b1', originalText)

      // Force fingerprint mismatch to enter Layer 2
      const anchorWithMismatch = {
        ...anchor,
        blockFingerprint: 'mismatch',
      }

      const result = resolveRangeAnchor(anchorWithMismatch, [modifiedBlock])

      expect(result.status).toBe('fuzzy')
      expect(result.startOffset).toBe(28) // second "cat"
      expect(result.endOffset).toBe(31)
    })
  })

  describe('Layer 3: Levenshtein fuzzy match', () => {
    it('finds quote with minor edits (typo correction)', () => {
      const originalText = 'The quick brown fox jumps over the lazy dog.'
      const originalBlock = makeBlock(0, 'b1', originalText)
      const anchor = makeAnchor(originalBlock, 10, 19) // "brown fox"

      // Author fixed a typo: "brown" → "brwon" (but we stored "brown fox")
      // Actually let's reverse: stored quote was from old text, new text has slight edit
      const modifiedBlock = makeBlock(
        0,
        'b1',
        'The quick brwon fox jumps over the lazy dog.',
      )

      const result = resolveRangeAnchor(anchor, [modifiedBlock])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBeGreaterThanOrEqual(0.6)
      expect(result.startOffset).toBe(10)
      expect(result.endOffset).toBe(19)
    })

    it('finds quote when words were added around it', () => {
      const originalText = 'The function returns a value.'
      const originalBlock = makeBlock(0, 'b1', originalText)
      const anchor = makeAnchor(originalBlock, 4, 12) // "function"

      // "function" became "functions" (extra char)
      const modifiedBlock = makeBlock(0, 'b1', 'The functions returns a value.')

      const result = resolveRangeAnchor(anchor, [modifiedBlock])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBeGreaterThanOrEqual(0.6)
      // Should find "functions" or "function" approximately at the right spot
      expect(result.startOffset).toBeGreaterThanOrEqual(3)
      expect(result.startOffset).toBeLessThanOrEqual(5)
    })
  })

  describe('Layer 4: Block fallback', () => {
    it('falls back when quote is completely gone', () => {
      const originalText = 'This paragraph had important content.'
      const originalBlock = makeBlock(0, 'b1', originalText)
      const anchor = makeAnchor(originalBlock, 20, 29) // "important"

      // Completely rewritten
      const modifiedBlock = makeBlock(0, 'b1', 'XXXXXXXXX YYYYYYYYY ZZZZZZZZZ.')

      const result = resolveRangeAnchor(anchor, [modifiedBlock])

      expect(result.status).toBe('block-fallback')
      expect(result.blockIndex).toBe(0)
    })

    it('falls back to first block when blockId is gone and no match anywhere', () => {
      const originalBlock = makeBlock(0, 'deleted-id', 'Original content here.')
      const anchor = makeAnchor(originalBlock, 0, 8) // "Original"

      const newBlocks = [
        makeBlock(0, 'new1', 'Completely different text.'),
        makeBlock(1, 'new2', 'Also unrelated words.'),
      ]

      const result = resolveRangeAnchor(anchor, newBlocks)

      expect(result.status).toBe('block-fallback')
      expect(result.blockIndex).toBe(0)
    })
  })

  describe('Cross-block search', () => {
    it('finds quote in a different block when blockId is gone', () => {
      const originalBlock = makeBlock(
        0,
        'deleted-id',
        'The important conclusion here.',
      )
      const anchor = makeAnchor(originalBlock, 4, 24) // "important conclusion"

      // Block was deleted, but the text moved to block index 2
      const newBlocks = [
        makeBlock(0, 'b1', 'Introduction paragraph.'),
        makeBlock(1, 'b2', 'Middle content here.'),
        makeBlock(2, 'b3', 'The important conclusion here.'),
      ]

      const result = resolveRangeAnchor(anchor, newBlocks)

      expect(result.status).toBe('fuzzy')
      expect(result.blockIndex).toBe(2)
      expect(result.startOffset).toBe(4)
      expect(result.endOffset).toBe(24)
    })
  })

  describe('Edge cases', () => {
    it('handles empty blockInfos', () => {
      const block = makeBlock(0, 'b1', 'Some text.')
      const anchor = makeAnchor(block, 0, 4)

      const result = resolveRangeAnchor(anchor, [])

      expect(result.status).toBe('block-fallback')
      expect(result.blockIndex).toBe(0)
    })

    it('handles anchor with empty quote', () => {
      const block = makeBlock(0, 'b1', 'Some text.')
      const anchor = makeAnchor(block, 5, 5, { quote: '' })

      resolveRangeAnchor(anchor, [block])

      // Empty quote with mismatched fingerprint goes to fallback
      const modifiedBlock = makeBlock(0, 'b1', 'Different text entirely.')
      const result2 = resolveRangeAnchor(anchor, [modifiedBlock])

      expect(result2.status).toBe('block-fallback')
    })

    it('works with CJK characters', () => {
      const text = '这是一段中文测试文本，用来验证锚点定位。'
      const block = makeBlock(0, 'b1', text)
      const anchor = makeAnchor(block, 4, 8) // "中文测试"

      // Slight modification
      const modifiedBlock = makeBlock(
        0,
        'b1',
        '这是一段中文的测试文本，用来验证锚点定位。',
      )

      const result = resolveRangeAnchor(anchor, [modifiedBlock])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBeGreaterThanOrEqual(0.6)
    })
  })

  describe('CJK scenarios', () => {
    it('中文：前方插入整句后仍能定位原文', () => {
      const original = '核心算法采用动态规划实现，效率较高。'
      const block = makeBlock(0, 'b1', original)
      const anchor = makeAnchor(block, 4, 10) // "采用动态规划"

      const modified = makeBlock(
        0,
        'b1',
        '在经过多次迭代后，核心算法采用动态规划实现，效率较高。',
      )
      const result = resolveRangeAnchor(anchor, [modified])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBe(1)
      const matched = modified.textContent.slice(
        result.startOffset,
        result.endOffset,
      )
      expect(matched).toBe('采用动态规划')
    })

    it('中文：句尾标点变更不影响定位', () => {
      const original = '这个函数的返回值是一个字符串。'
      const block = makeBlock(0, 'b1', original)
      const anchor = makeAnchor(block, 5, 8) // "返回值"

      const modified = makeBlock(0, 'b1', '这个函数的返回值是一个字符串！')
      const result = resolveRangeAnchor(anchor, [modified])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBe(1)
      const matched = modified.textContent.slice(
        result.startOffset,
        result.endOffset,
      )
      expect(matched).toBe('返回值')
    })

    it('中文：插入助词"的"后 fuzzy 仍可匹配', () => {
      const original = '深度学习自然语言处理技术取得重大突破。'
      const block = makeBlock(0, 'b1', original)
      const anchor = makeAnchor(block, 4, 12) // "自然语言处理技术"

      // "自然语言处理技术" → "自然语言的处理技术"（插入"的"）
      const modified = makeBlock(
        0,
        'b1',
        '深度学习自然语言的处理技术取得重大突破。',
      )
      const result = resolveRangeAnchor(anchor, [modified])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBeGreaterThanOrEqual(0.6)
    })

    it('中文：同义词替换导致 quote 完全不同则降级', () => {
      const original = '这个方案非常优秀，值得推广。'
      const block = makeBlock(0, 'b1', original)
      const anchor = makeAnchor(block, 4, 8) // "非常优秀"

      // 同义词全部替换："非常优秀" → "十分出色"
      const modified = makeBlock(0, 'b1', '这个方案十分出色，值得推广。')
      const result = resolveRangeAnchor(anchor, [modified])

      // 4 个字全换，编辑距离 4/4 = 1.0，similarity = 0，应降级
      expect(result.status).toBe('block-fallback')
    })

    it('中文：短 quote（2字符）精确匹配仍有效', () => {
      const original = '今天天气非常好，适合出门散步。'
      const block = makeBlock(0, 'b1', original)
      const anchor = makeAnchor(block, 4, 6) // "非常"

      // 前面插入文字
      const modified = makeBlock(
        0,
        'b1',
        '据预报今天天气非常好，适合出门散步和骑车。',
      )
      const result = resolveRangeAnchor(anchor, [modified])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBe(1)
      const matched = modified.textContent.slice(
        result.startOffset,
        result.endOffset,
      )
      expect(matched).toBe('非常')
    })

    it('中文：长段落中定位未变的引用文本', () => {
      const original =
        '人工智能技术在近年来取得了飞速发展。深度学习、自然语言处理、计算机视觉等领域都有重大突破。特别是大语言模型的出现，彻底改变了人机交互的方式。'
      const block = makeBlock(0, 'b1', original)
      // "特别是大语言模型的出现" — find offset
      const quoteStart = original.indexOf('特别是大语言模型的出现')
      const quoteEnd = quoteStart + '特别是大语言模型的出现'.length
      const anchor = makeAnchor(block, quoteStart, quoteEnd)

      // 前面两句有少量编辑
      const modified = makeBlock(
        0,
        'b1',
        '人工智能技术在近几年取得了飞速的发展。深度学习、自然语言处理和计算机视觉等领域都有重大突破。特别是大语言模型的出现，彻底改变了人机交互的方式。',
      )
      const result = resolveRangeAnchor(anchor, [modified])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBe(1)
      const matched = modified.textContent.slice(
        result.startOffset,
        result.endOffset,
      )
      expect(matched).toBe('特别是大语言模型的出现')
    })

    it('中文：quote 含中英混排（小幅编辑）', () => {
      const original = '我们使用React框架开发了一套完整的前端系统。'
      const block = makeBlock(0, 'b1', original)
      const anchor = makeAnchor(block, 4, 13) // "React框架开发了"

      // 小幅编辑：React → React.js
      const modified = makeBlock(
        0,
        'b1',
        '我们使用React.js框架开发了一套完整的前端系统。',
      )
      const result = resolveRangeAnchor(anchor, [modified])

      expect(result.status).toBe('fuzzy')
      expect(result.similarity).toBeGreaterThanOrEqual(0.6)
    })

    it('中文：quote 中英混排大幅替换则降级', () => {
      const original = '我们使用React框架开发了一套完整的前端系统。'
      const block = makeBlock(0, 'b1', original)
      const anchor = makeAnchor(block, 4, 13) // "React框架开发了"

      // 大幅替换：React → Vue（5/9字符变化）
      const modified = makeBlock(
        0,
        'b1',
        '我们使用Vue框架开发了一套完整的前端系统。',
      )
      const result = resolveRangeAnchor(anchor, [modified])

      // 超过 40% 字符被替换，正确降级
      expect(result.status).toBe('block-fallback')
    })

    it('中文：重复短语用 prefix/suffix 消歧', () => {
      const original =
        '第一章介绍了方法。第二章也介绍了方法。第三章总结了方法。'
      const block = makeBlock(0, 'b1', original)
      // 选择第二个"介绍了方法"
      const secondIdx = original.indexOf('介绍了方法', 10)
      const anchor = makeAnchor(block, secondIdx, secondIdx + 5)

      // 强制进入 Layer 2
      const anchorMismatch = { ...anchor, blockFingerprint: 'mismatch' }

      const modified = makeBlock(0, 'b1', original)
      const result = resolveRangeAnchor(anchorMismatch, [modified])

      expect(result.status).toBe('fuzzy')
      expect(result.startOffset).toBe(secondIdx)
    })
  })
})
