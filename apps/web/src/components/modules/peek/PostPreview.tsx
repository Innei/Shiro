import { useQuery } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { atom } from 'jotai'
import type { FC } from 'react'
import { useMemo } from 'react'

import {
  PostMarkdownImageRecordProvider,
  PostMetaBarInternal,
} from '~/app/[locale]/posts/(post-detail)/[category]/[slug]/pageExtra'
import { PostMarkdown } from '~/app/[locale]/posts/(post-detail)/[category]/[slug]/PostMarkdown'
import { AckRead } from '~/components/common/AckRead'
import { Paper } from '~/components/layout/container/Paper'
import { Loading } from '~/components/ui/loading'
import { BottomToUpSmoothTransitionView } from '~/components/ui/transition'
import {
  CurrentPostDataAtomProvider,
  CurrentPostDataProvider,
} from '~/providers/post/CurrentPostDataProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'
import type { PostWithTranslation } from '~/queries/definition'
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

  const overrideAtom = useMemo(() => atom(null! as PostWithTranslation), [])
  if (isLoading) return <Loading className="w-full" useDefaultLoadingText />
  if (!data) return null
  const postData = data as PostWithTranslation
  return (
    <CurrentPostDataAtomProvider overrideAtom={overrideAtom}>
      <CurrentPostDataProvider data={postData} />
      {!!postData.id && <AckRead id={postData.id} type="post" />}
      <BottomToUpSmoothTransitionView>
        <Paper>
          <article
            className={clsx(
              'relative w-full min-w-0',
             'prose',
            )}
          >
            <header className="mb-8">
              <h1 className="mt-8 text-balance text-center">
                {postData.title}
              </h1>
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
      </BottomToUpSmoothTransitionView>
    </CurrentPostDataAtomProvider>
  )
}
