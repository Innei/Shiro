'use client'

import type { PropsWithChildren } from 'react'
import { createContext, use, useMemo } from 'react'

export type HeadingQueryStrategy = (
  container: HTMLElement,
) => HTMLHeadingElement[]

export const markdownHeadingStrategy: HeadingQueryStrategy = (container) => {
  return [...container.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(
    ($h) => ($h as HTMLElement).dataset['markdownHeading'] === 'true',
  ) as HTMLHeadingElement[]
}

const textToSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s\u3001-\u9fff\uac00-\ud7af\uff00-\uffef-]/g, '')
    .replaceAll(/[\s_]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
}

const normalizeHeadingIds = (headings: HTMLHeadingElement[]) => {
  const slugCountMap = new Map<string, number>()

  return headings.map((heading, index) => {
    const existingId = heading.id.trim()
    if (existingId) {
      const count = slugCountMap.get(existingId)
      if (count === undefined) {
        slugCountMap.set(existingId, 1)
        return heading
      }
      const uniqueId = `${existingId}-${count}`
      slugCountMap.set(existingId, count + 1)
      heading.id = uniqueId
      return heading
    }

    const baseSlug =
      textToSlug(heading.textContent || '') || `heading-${index + 1}`
    const count = slugCountMap.get(baseSlug)
    const generatedId = count === undefined ? baseSlug : `${baseSlug}-${count}`
    slugCountMap.set(baseSlug, (count ?? 0) + 1)
    heading.id = generatedId
    return heading
  })
}

const lexicalHeadingSelector = [
  'h1.rich-heading-h1',
  'h2.rich-heading-h2',
  'h3.rich-heading-h3',
  'h4.rich-heading-h4',
  'h5.rich-heading-h5',
  'h6.rich-heading-h6',
].join(',')

export const lexicalHeadingStrategy: HeadingQueryStrategy = (container) => {
  const headings = [
    ...container.querySelectorAll(lexicalHeadingSelector),
  ] as HTMLHeadingElement[]
  return normalizeHeadingIds(headings)
}

const TocHeadingStrategyContext = createContext<HeadingQueryStrategy>(
  markdownHeadingStrategy,
)

export const useTocHeadingStrategy = () => use(TocHeadingStrategyContext)

export function TocHeadingStrategyProvider({
  contentFormat,
  content,
  children,
}: PropsWithChildren<{ contentFormat?: string; content?: string | null }>) {
  const strategy = useMemo(
    () =>
      contentFormat === 'lexical' && content
        ? lexicalHeadingStrategy
        : markdownHeadingStrategy,
    [contentFormat, content],
  )
  return (
    <TocHeadingStrategyContext.Provider value={strategy}>
      {children}
    </TocHeadingStrategyContext.Provider>
  )
}
