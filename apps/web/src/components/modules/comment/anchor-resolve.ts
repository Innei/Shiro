import type { BlockInfo } from './anchor-utils'
import type { RangeAnchor } from './types'

export interface ResolvedAnchor {
  blockIndex: number
  endOffset: number
  similarity?: number
  startOffset: number
  status: 'exact' | 'fuzzy' | 'block-fallback'
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m

  const row = new Uint16Array(n + 1)
  for (let j = 0; j <= n; j++) row[j] = j

  for (let i = 1; i <= m; i++) {
    let prev = row[0]!
    row[0] = i
    const ch = a.codePointAt(i - 1) ?? 0
    for (let j = 1; j <= n; j++) {
      const val =
        ch === (b.codePointAt(j - 1) ?? 0)
          ? prev
          : Math.min(prev, row[j]!, row[j - 1]!) + 1
      prev = row[j]!
      row[j] = val
    }
  }

  return row[n]!
}

function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length)
  if (maxLen === 0) return 1
  return 1 - levenshtein(a, b) / maxLen
}

function charFreq(s: string): Map<number, number> {
  const freq = new Map<number, number>()
  for (let i = 0; i < s.length; i++) {
    const c = s.codePointAt(i) ?? 0
    freq.set(c, (freq.get(c) ?? 0) + 1)
  }
  return freq
}

function freqDivergence(
  a: Map<number, number>,
  b: Map<number, number>,
): number {
  let diff = 0
  for (const [ch, count] of a) {
    diff += Math.abs(count - (b.get(ch) ?? 0))
  }
  for (const [ch, count] of b) {
    if (!a.has(ch)) diff += count
  }
  return diff
}

function contextScore(
  text: string,
  matchStart: number,
  matchEnd: number,
  prefix: string,
  suffix: string,
): number {
  let score = 0

  if (prefix.length > 0) {
    const before = text.slice(
      Math.max(0, matchStart - prefix.length),
      matchStart,
    )
    let matched = 0
    for (let i = 0; i < Math.min(before.length, prefix.length); i++) {
      if (before[before.length - 1 - i] === prefix[prefix.length - 1 - i]) {
        matched++
      } else {
        break
      }
    }
    score += matched / prefix.length
  }

  if (suffix.length > 0) {
    const after = text.slice(matchEnd, matchEnd + suffix.length)
    let matched = 0
    for (let i = 0; i < Math.min(after.length, suffix.length); i++) {
      if (after[i] === suffix[i]) {
        matched++
      } else {
        break
      }
    }
    score += matched / suffix.length
  }

  const parts = (prefix.length > 0 ? 1 : 0) + (suffix.length > 0 ? 1 : 0)
  return parts > 0 ? score / parts : 0
}

interface FuzzyMatch {
  endOffset: number
  similarity: number
  startOffset: number
}

function findBestFuzzyMatch(
  text: string,
  quote: string,
  prefix: string,
  suffix: string,
): FuzzyMatch | null {
  const quoteLen = quote.length
  if (quoteLen === 0) return null

  if (text.length > 5000 && quoteLen > 200) return null

  const minWindow = Math.max(1, Math.floor(quoteLen * 0.6))
  const maxWindow = Math.ceil(quoteLen * 1.4)
  const quoteFreq = charFreq(quote)
  const freqThreshold = Math.floor(quoteLen * 0.5)

  let best: FuzzyMatch | null = null

  for (let wSize = minWindow; wSize <= maxWindow; wSize++) {
    if (wSize > text.length) break

    for (let start = 0; start <= text.length - wSize; start++) {
      const candidate = text.slice(start, start + wSize)
      const candidateFreq = charFreq(candidate)
      if (freqDivergence(quoteFreq, candidateFreq) > freqThreshold) continue

      const sim = similarity(candidate, quote)
      if (sim < 0.6) continue

      const ctx = contextScore(text, start, start + wSize, prefix, suffix)
      const combined = sim * 0.7 + ctx * 0.3

      if (
        !best ||
        combined >
          best.similarity * 0.7 +
            contextScore(
              text,
              best.startOffset,
              best.endOffset,
              prefix,
              suffix,
            ) *
              0.3
      ) {
        best = { startOffset: start, endOffset: start + wSize, similarity: sim }
      }
    }
  }

  return best
}

function findBlock(
  anchor: RangeAnchor,
  blockInfos: BlockInfo[],
): { block: BlockInfo; index: number } | null {
  for (let i = 0; i < blockInfos.length; i++) {
    const b = blockInfos[i]!
    if (b.blockId === anchor.blockId) return { block: b, index: i }
  }
  return null
}

export function resolveRangeAnchor(
  anchor: RangeAnchor,
  blockInfos: BlockInfo[],
): ResolvedAnchor {
  const found = findBlock(anchor, blockInfos)

  if (found) {
    const { block, index } = found

    // Layer 1: Exact match
    if (block.fingerprint === anchor.blockFingerprint) {
      const text = block.textContent
      if (
        anchor.startOffset >= 0 &&
        anchor.endOffset <= text.length &&
        anchor.startOffset < anchor.endOffset
      ) {
        return {
          status: 'exact',
          startOffset: anchor.startOffset,
          endOffset: anchor.endOffset,
          blockIndex: index,
        }
      }
    }

    // Layer 2: Quote substring
    const text = block.textContent
    const { quote, prefix, suffix } = anchor

    if (quote) {
      const firstIdx = text.indexOf(quote)
      if (firstIdx !== -1) {
        const secondIdx = text.indexOf(quote, firstIdx + 1)
        if (secondIdx === -1) {
          return {
            status: 'fuzzy',
            startOffset: firstIdx,
            endOffset: firstIdx + quote.length,
            blockIndex: index,
            similarity: 1,
          }
        }

        // Multiple matches, disambiguate with context
        let bestStart = firstIdx
        let bestScore = contextScore(
          text,
          firstIdx,
          firstIdx + quote.length,
          prefix,
          suffix,
        )

        let pos = secondIdx
        while (pos !== -1) {
          const score = contextScore(
            text,
            pos,
            pos + quote.length,
            prefix,
            suffix,
          )
          if (score > bestScore) {
            bestScore = score
            bestStart = pos
          }
          pos = text.indexOf(quote, pos + 1)
        }

        return {
          status: 'fuzzy',
          startOffset: bestStart,
          endOffset: bestStart + quote.length,
          blockIndex: index,
          similarity: 1,
        }
      }
    }

    // Layer 3: Levenshtein fuzzy
    if (quote) {
      const fuzzy = findBestFuzzyMatch(text, quote, prefix, suffix)
      if (fuzzy) {
        return {
          status: 'fuzzy',
          startOffset: fuzzy.startOffset,
          endOffset: fuzzy.endOffset,
          blockIndex: index,
          similarity: fuzzy.similarity,
        }
      }
    }

    // Layer 4: Block fallback
    return {
      status: 'block-fallback',
      startOffset: 0,
      endOffset: 0,
      blockIndex: index,
    }
  }

  // No block found by ID, try all blocks
  const { quote, prefix, suffix } = anchor

  if (quote) {
    // Try substring across all blocks
    for (let i = 0; i < blockInfos.length; i++) {
      const block = blockInfos[i]!
      const text = block.textContent
      const idx = text.indexOf(quote)
      if (idx !== -1) {
        return {
          status: 'fuzzy',
          startOffset: idx,
          endOffset: idx + quote.length,
          blockIndex: i,
          similarity: 1,
        }
      }
    }

    // Try fuzzy across all blocks
    let globalBest: (FuzzyMatch & { blockIndex: number }) | null = null
    for (let i = 0; i < blockInfos.length; i++) {
      const block = blockInfos[i]!
      const fuzzy = findBestFuzzyMatch(block.textContent, quote, prefix, suffix)
      if (fuzzy && (!globalBest || fuzzy.similarity > globalBest.similarity)) {
        globalBest = { ...fuzzy, blockIndex: i }
      }
    }

    if (globalBest) {
      return {
        status: 'fuzzy',
        startOffset: globalBest.startOffset,
        endOffset: globalBest.endOffset,
        blockIndex: globalBest.blockIndex,
        similarity: globalBest.similarity,
      }
    }
  }

  // Absolute fallback: first block
  return {
    status: 'block-fallback',
    startOffset: 0,
    endOffset: 0,
    blockIndex: 0,
  }
}
