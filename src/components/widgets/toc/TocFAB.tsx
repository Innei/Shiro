'use client'

import { useCallback } from 'react'
import { useParams, usePathname } from 'next/navigation'

import { FABPortable } from '~/components/ui/fab'
import { MAIN_MARKDOWN_ID } from '~/constants/dom-id'
import { useModalStack } from '~/providers/root/modal-stack-provider'

import { TocTree } from './TocTree'

export const TocFAB = () => {
  const { present } = useModalStack()
  const pathname = usePathname()
  const params = useParams()

  const presentToc = useCallback(() => {
    const $mainMarkdownRender = document.getElementById(MAIN_MARKDOWN_ID)
    if (!$mainMarkdownRender) return
    const $headings = [
      ...$mainMarkdownRender.querySelectorAll('h1,h2,h3,h4,h5,h6'),
    ] as HTMLHeadingElement[]
    const dispose = present({
      title: 'Table of Content',

      content: () => (
        <TocTree
          $headings={$headings}
          className="space-y-3 [&>li]:py-1"
          onItemClick={() => {
            dispose()
          }}
          scrollInNextTick
        />
      ),
    })
  }, [pathname, params])
  return (
    <FABPortable aria-label="Show ToC" onClick={presentToc}>
      <i className="icon-[mingcute--list-expansion-line]" />
    </FABPortable>
  )
}
