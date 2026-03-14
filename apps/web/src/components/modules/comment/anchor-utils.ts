import type { BlockAnchor, RangeAnchor } from './types'

export interface BlockInfo {
  blockId: string
  fingerprint: string
  index: number
  textContent: string
  type: string
}

export function computeBlockFingerprint(text: string): string {
  const input = text.slice(0, 200) + String(text.length)
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + (input.codePointAt(i) ?? 0)) | 0
  }
  return (hash >>> 0).toString(16)
}

function getNodeType(node: Record<string, any>): string {
  return node.type as string
}

function getTextContent(node: Record<string, any>): string {
  if (typeof node.text === 'string') return node.text
  if (node.type === 'linebreak') return '\n'
  if (Array.isArray(node.children)) {
    return (node.children as Record<string, any>[]).map(getTextContent).join('')
  }
  return ''
}

export function extractBlockInfos(content: string): BlockInfo[] {
  let parsed: Record<string, any>
  try {
    parsed = JSON.parse(content)
  } catch {
    return []
  }

  const rootChildren = parsed.root?.children as
    | Record<string, any>[]
    | undefined
  if (!rootChildren) return []

  return rootChildren.map((child, index) => {
    const blockId = (child.$ as Record<string, any> | undefined)?.blockId as
      | string
      | undefined
    const textContent = getTextContent(child)
    return {
      index,
      blockId: blockId || '',
      type: getNodeType(child),
      textContent,
      fingerprint: computeBlockFingerprint(textContent),
    }
  })
}

export function findBlockIndex(contentEl: Element, node: Node): number {
  const { children } = contentEl
  let current: Node | null = node
  while (current && current !== contentEl) {
    if (current.parentNode === contentEl) {
      for (let i = 0; i < children.length; i++) {
        if (children[i] === current) return i
      }
      return -1
    }
    current = current.parentNode
  }
  return -1
}

function createTextWalker(container: Element) {
  return document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT
        if (node instanceof HTMLBRElement) return NodeFilter.FILTER_ACCEPT
        return NodeFilter.FILTER_SKIP
      },
    },
  )
}

export function getTextOffset(
  container: Element,
  targetNode: Node,
  targetOffset: number,
): number {
  const walker = createTextWalker(container)
  let offset = 0
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node === targetNode) {
      return offset + targetOffset
    }
    if (node.nodeType === Node.TEXT_NODE) {
      offset += (node as Text).length
    } else if (node instanceof HTMLBRElement) {
      offset += 1
    }
  }
  return offset
}

export function getBlockTextContent(container: Element): string {
  const walker = createTextWalker(container)
  let result = ''
  let node: Node | null
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += (node as Text).data
    } else if (node instanceof HTMLBRElement) {
      result += '\n'
    }
  }
  return result
}

export function buildRangeAnchorFromSelection(
  sel: Selection,
  contentEl: Element,
  blockInfos: BlockInfo[],
  lang?: string | null,
): RangeAnchor | null {
  const { anchorNode, anchorOffset, focusNode, focusOffset } = sel
  if (!anchorNode || !focusNode) return null

  const anchorBlockIdx = findBlockIndex(contentEl, anchorNode)
  const focusBlockIdx = findBlockIndex(contentEl, focusNode)
  if (anchorBlockIdx < 0 || focusBlockIdx < 0) return null
  if (anchorBlockIdx !== focusBlockIdx) return null

  const info = blockInfos[anchorBlockIdx]
  if (!info?.blockId) return null

  const blockEl = contentEl.children[anchorBlockIdx]
  if (!blockEl) return null

  let startOffset = getTextOffset(blockEl, anchorNode, anchorOffset)
  let endOffset = getTextOffset(blockEl, focusNode, focusOffset)
  if (startOffset > endOffset) {
    ;[startOffset, endOffset] = [endOffset, startOffset]
  }

  const text = getBlockTextContent(blockEl)
  const quote = text.slice(startOffset, endOffset)
  if (!quote) return null

  return {
    mode: 'range',
    blockId: info.blockId,
    blockType: info.type,
    blockFingerprint: lang ? computeBlockFingerprint(text) : info.fingerprint,
    snapshotText: text.slice(0, 300),
    quote,
    prefix: text.slice(Math.max(0, startOffset - 50), startOffset),
    suffix: text.slice(endOffset, endOffset + 50),
    startOffset,
    endOffset,
    lang: lang ?? null,
  }
}

export function buildBlockAnchorFromIndex(
  blockInfos: BlockInfo[],
  index: number,
  lang?: string | null,
): BlockAnchor | null {
  const info = blockInfos[index]
  if (!info?.blockId) return null

  return {
    mode: 'block',
    blockId: info.blockId,
    blockType: info.type,
    blockFingerprint: info.fingerprint,
    snapshotText: info.textContent.slice(0, 300),
    lang: lang ?? null,
  }
}
