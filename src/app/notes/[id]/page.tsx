'use client'

import dayjs from 'dayjs'
import { useParams } from 'next/navigation'

import { PageDataHolder } from '~/components/common/PageHolder'
import { Toc, TocAutoScroll } from '~/components/widgets/toc'
import { useBeforeMounted } from '~/hooks/common/use-before-mounted'
import { useNoteByNidQuery } from '~/hooks/data/use-note'
import { ArticleElementProvider } from '~/providers/article/article-element-provider'
import { useSetCurrentNoteId } from '~/providers/note/current-note-id-provider'
import { NoteLayoutRightSidePortal } from '~/providers/note/right-side-provider'
import { parseMarkdown } from '~/remark'

const PageImpl = () => {
  const { id } = useParams() as { id: string }
  const { data } = useNoteByNidQuery(id)

  const mardownResult = parseMarkdown(data?.data?.text ?? '')

  // Why do this, I mean why do set NoteId to context, don't use `useParams().id` for children components.
  // Because any router params or query changes, will cause components that use `useParams()` hook, this hook is a context hook,
  // For example, `ComA` use `useParams()` just want to get value `id`,
  // but if router params or query changes `page` params, will cause `CompA` re - render.
  const setNoteId = useSetCurrentNoteId()

  useBeforeMounted(() => {
    setNoteId(id)
  })

  const dateFormat = dayjs(data?.data.created)
    .locale('cn')
    .format('YYYY 年 M 月 D 日 dddd')

  return (
    <article className="prose">
      <header>
        <div className="relative inline-flex items-center">
          <div className="mr-2 inline-block h-[1rem] w-[2px] rounded-sm bg-accent" />
          <span className="inline-flex items-center text-lg">
            <time className="font-medium">{dateFormat}</time>
          </span>
        </div>
        <h1 className="mt-8 text-center text-xl font-bold text-base-content/95">
          {data?.data?.title}
        </h1>
      </header>

      <ArticleElementProvider>
        {mardownResult.jsx}

        <NoteLayoutRightSidePortal>
          <Toc className="sticky top-20 ml-4 mt-20" />
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
