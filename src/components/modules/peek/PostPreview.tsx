import type { PostModel } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import { atom } from 'jotai'
import type { FC } from 'react'
import { useMemo } from 'react'

import {
  PostMarkdown,
  PostMarkdownImageRecordProvider,
  PostMetaBarInternal,
} from '~/app/(app)/posts/(post-detail)/[category]/[slug]/pageExtra'
import { AckRead } from '~/components/common/AckRead'
import { Paper } from '~/components/layout/container/Paper'
import { Loading } from '~/components/ui/loading'
import {
  CurrentPostDataAtomProvider,
  CurrentPostDataProvider,
} from '~/providers/post/CurrentPostDataProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'
import { queries } from '~/queries/definition'

import { PostOutdate } from '../post'

interface PostPreviewProps {
  category: string
  slug: string
}
export const PostPreview: FC<PostPreviewProps> = (props) => {
  const { category, slug } = props
  const { data, isLoading } = useQuery({
    ...queries.post.bySlug(category, slug),
  })

  const overrideAtom = useMemo(() => atom(null! as PostModel), [])
  if (isLoading) return <Loading className="w-full" useDefaultLoadingText />
  if (!data) return null
  return (
    <CurrentPostDataAtomProvider overrideAtom={overrideAtom}>
      <CurrentPostDataProvider data={data} />
      {!!data.id && <AckRead id={data.id} type="post" />}
      <Paper>
        <article className="prose relative w-full min-w-0">
          <header className="mb-8">
            <h1 className="text-balance text-center">{data.title}</h1>
            <PostMetaBarInternal className="mb-8 justify-center" />
            <PostOutdate />
          </header>
          <WrappedElementProvider eoaDetect>
            <PostMarkdownImageRecordProvider>
              <PostMarkdown />
            </PostMarkdownImageRecordProvider>
          </WrappedElementProvider>
        </article>
      </Paper>
    </CurrentPostDataAtomProvider>
  )
}
