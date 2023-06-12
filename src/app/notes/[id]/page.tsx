'use client'

import { useParams } from 'next/navigation'

import { Toc, TocAutoScroll } from '~/components/widgets/toc'
import { useNoteByNidQuery } from '~/hooks/data/use-note'
import { PageDataHolder } from '~/lib/page-holder'
import { ArticleElementProvider } from '~/providers/article/article-element-provider'
import { NoteLayoutRightSidePortal } from '~/providers/note/right-side-provider'
import { parseMarkdown } from '~/remark'

const PageImpl = () => {
  const { id } = useParams() as { id: string }
  const { data } = useNoteByNidQuery(id)

  const mardownResult = parseMarkdown(data?.data?.text ?? '')

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
