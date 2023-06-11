'use client'

import { useParams } from 'next/navigation'

import { Toc } from '~/components/widgets/toc'
import { useNoteByNidQuery } from '~/hooks/data/use-note'
import { PageDataHolder } from '~/lib/page-holder'
import { ArticleElementContextProvider } from '~/providers/article/article-element-provider'
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
      <ArticleElementContextProvider>
        {mardownResult.jsx}
        <NoteLayoutRightSidePortal>
          <Toc className="sticky top-20 mt-20" />
        </NoteLayoutRightSidePortal>
      </ArticleElementContextProvider>
    </article>
  )
}

export default PageDataHolder(PageImpl, () => {
  const { id } = useParams() as { id: string }
  return useNoteByNidQuery(id)
})
