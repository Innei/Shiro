import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import Balancer from 'react-wrap-balancer'
import { atom } from 'jotai'
import type { PostModel } from '@mx-space/api-client'
import type { FC } from 'react'

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
import { XLogSummary } from '../xlog'
import { getCidForBaseModel } from '../xlog/utils'

interface PostPreviewProps {
  category: string
  slug: string
}
export const PostPreview: FC<PostPreviewProps> = (props) => {
  const { category, slug } = props
  const { data, isLoading } = useQuery({
    ...queries.post.bySlug(category, slug),
  })

  useEffect(() => {
    const currentState = history.state
    const currentLocation = window.location.href
    const nextUrl = new URL(currentLocation)
    nextUrl.pathname = `/posts/${category}/${slug}`
    const nextUrlString = nextUrl.href

    // 虽然但是，这样浏览器的前进后退会有问题
    // 如果用 NextJS 的 parallel-routes 情况太复杂
    history.replaceState(null, '', nextUrlString)
    return () => {
      history.replaceState(currentState, '', currentLocation)
    }
  }, [category, slug])

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
            <h1 className="text-center">
              <Balancer>{data.title}</Balancer>
            </h1>
            <PostMetaBarInternal className="mb-8 justify-center" />
            <XLogSummary cid={getCidForBaseModel(data)} />
            <PostOutdate />
          </header>
          <WrappedElementProvider>
            <PostMarkdownImageRecordProvider>
              <PostMarkdown />
            </PostMarkdownImageRecordProvider>
          </WrappedElementProvider>
        </article>
      </Paper>
    </CurrentPostDataAtomProvider>
  )
}
