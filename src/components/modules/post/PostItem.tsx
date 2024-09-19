import type { PostModel } from '@mx-space/api-client'
import clsx from 'clsx'
import Link from 'next/link'
import { memo } from 'react'
import RemoveMarkdown from 'remove-markdown'

import { useIsLogged } from '~/atoms/hooks'
import { PostPinIcon } from '~/components/modules/post/PostPinIcon'

import { PostItemHoverOverlay } from './PostItemHoverOverlay'
import { PostMetaBar } from './PostMetaBar'

export const PostLooseItem = memo<{ data: PostModel }>(function PostLooseItem({
  data,
}) {
  const displayText =
    data.text.length > 300
      ? `${RemoveMarkdown(data.text.slice(0, 300))}...`
      : data.text
  const hasImage = data.images?.length > 0 && data.images[0].src
  const categorySlug = data.category?.slug
  const postLink = `/posts/${categorySlug}/${data.slug}`

  const isLogged = useIsLogged()
  return (
    <Link
      href={postLink}
      className="relative flex flex-col py-8 focus-visible:!shadow-none"
    >
      <PostItemHoverOverlay />
      <h2 className="relative break-words text-2xl font-medium">
        <div
          className={isLogged || data.pin ? 'w-[calc(100%-2rem)]' : 'w-full'}
        >
          {data.title}
        </div>

        <PostPinIcon pin={!!data.pin} id={data.id} />
      </h2>
      <div className="relative mt-8 space-y-2">
        {!!data.summary && (
          <p className="mb-4 break-all rounded-md px-4 py-2 text-sm leading-relaxed text-gray-900 ring-1 ring-accent/10 dark:text-zinc-50">
            摘要： {data.summary}
          </p>
        )}
        <div className="relative overflow-hidden text-justify">
          {hasImage && (
            <div
              className={clsx(
                'float-right mb-2 ml-3 size-[5.5rem] overflow-hidden rounded-md',
                'bg-cover bg-center bg-no-repeat',
              )}
              style={{ backgroundImage: `url(${hasImage})` }}
            />
          )}
          <p className="break-all leading-loose text-gray-800/90 dark:text-gray-200/90">
            {displayText}
          </p>
        </div>
      </div>

      <div className="mt-2 flex select-none flex-wrap items-center justify-end gap-4 text-base-content/60">
        <PostMetaBar meta={data} />
        <span className="flex shrink-0 select-none items-center space-x-1 text-right text-accent hover:text-accent [&>svg]:hover:ml-2">
          <span>阅读全文</span>
          <i className="icon-[mingcute--arrow-right-line] text-lg transition-[margin]" />
        </span>
      </div>
    </Link>
  )
})

export const PostCompactItem = memo<{ data: PostModel }>(
  function PostCompactItem({ data }) {
    const categorySlug = data.category?.slug
    const postLink = `/posts/${categorySlug}/${data.slug}`

    const isLogged = useIsLogged()
    return (
      <Link
        href={postLink}
        className="relative flex flex-col py-8 focus-visible:!shadow-none"
      >
        <PostItemHoverOverlay />
        <h2 className="relative break-words text-2xl font-medium">
          <div
            className={isLogged || data.pin ? 'w-[calc(100%-2rem)]' : 'w-full'}
          >
            {data.title}
          </div>

          <PostPinIcon pin={!!data.pin} id={data.id} />
        </h2>
        <div className="relative mt-4 space-y-2">
          <div className="relative overflow-hidden text-justify">
            {data.summary && (
              <p className="mb-2 break-all leading-loose text-gray-800/90 dark:text-gray-200/90">
                {data.summary}
              </p>
            )}
          </div>
        </div>

        <div className="post-meta-bar flex select-none flex-wrap items-center justify-end gap-4 text-base-content/60">
          <PostMetaBar meta={data} />
        </div>
      </Link>
    )
  },
)
