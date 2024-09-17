'use client'

import { useParams, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { FABPortable } from '~/components/ui/fab'
import { useModalStack } from '~/components/ui/modal'
import { MAIN_MARKDOWN_ID } from '~/constants/dom-id'

import { TocTree } from './TocTree'

export const TocFAB = () => {
  const { present } = useModalStack()
  const pathname = usePathname()
  const params = useParams()

  const $headings = useMemo(() => {
    const $mainMarkdownRender = document.getElementById(MAIN_MARKDOWN_ID)
    if (!$mainMarkdownRender) return

    const $headings = [
      ...$mainMarkdownRender.querySelectorAll('h1,h2,h3,h4,h5,h6'),
    ] as HTMLHeadingElement[]

    return $headings.filter(($heading) => {
      if ($heading.dataset['markdownHeading'] === 'true') return true
      return false
    })
  }, [])
  const presentToc = useCallback(() => {
    present({
      title: '文章目录',
      clickOutsideToDismiss: true,
      content: ({ dismiss }) => (
        <TocTree
          $headings={$headings!}
          className="max-h-full space-y-3 overflow-y-auto [&>li]:py-1"
          onItemClick={() => {
            dismiss()
          }}
          scrollInNextTick
        />
      ),
    })
  }, [pathname, params, $headings])

  if (!$headings?.length) return null

  return (
    <FABPortable aria-label="Show ToC" onClick={presentToc}>
      <i className="icon-[mingcute--list-expansion-line]" />
    </FABPortable>
  )
}
