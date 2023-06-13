'use client'

import { useRef } from 'react'
import { useParams } from 'next/navigation'

import { Toc, TocAutoScroll } from '~/components/widgets/toc'
import { useNoteByNidQuery } from '~/hooks/data/use-note'
import { PageDataHolder } from '~/lib/page-holder'
import { ArticleElementProvider } from '~/providers/article/article-element-provider'
import { useSetCurrentNoteId } from '~/providers/note/current-note-id-provider'
import { NoteLayoutRightSidePortal } from '~/providers/note/right-side-provider'
import { parseMarkdown } from '~/remark'
import { isClientSide } from '~/utils/env'

const PageImpl = () => {
  const { id } = useParams() as { id: string }
  const { data } = useNoteByNidQuery(id)

  const mardownResult = parseMarkdown(data?.data?.text ?? '')

  // Why do this, I mean why do set NoteId to context, don't use `useParams().id` for children components.
  // Because any router params or query changes, will cause components that use `useParams()` hook, this hook is a context hook,
  // For example, `ComA` use `useParams()` just want to get value `id`,
  // but if router params or query changes `page` params, will cause `CompA` re - render.
  const setNoteId = useSetCurrentNoteId()
  const onceRef = useRef(false)
  if (isClientSide() && !onceRef.current) {
    onceRef.current = true
    setNoteId(id)
  }
  return (
    <article className="prose">
      <header>
        <h1>{data?.data?.title}</h1>
      </header>

      <ArticleElementProvider>
        {mardownResult.jsx}

        <NoteLayoutRightSidePortal>
          <Toc className="sticky top-20 mt-20" />
          <TocAutoScroll />
        </NoteLayoutRightSidePortal>
      </ArticleElementProvider>
    </article>
  )
}

export default PageDataHolder(PageImpl, () => {
  const { id } = useParams() as { id: string }
  return useNoteByNidQuery(id)
})
