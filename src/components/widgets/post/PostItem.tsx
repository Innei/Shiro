import { memo } from 'react'
import { Balancer } from 'react-wrap-balancer'
import clsx from 'clsx'
import Link from 'next/link'
import RemoveMarkdown from 'remove-markdown'
import type { PostModel } from '@mx-space/api-client'

import { IcRoundKeyboardDoubleArrowRight } from '~/components/icons/arrow'
import { MdiClockOutline } from '~/components/icons/clock'
import { FeHash } from '~/components/icons/fa-hash'
import { RelativeTime } from '~/components/ui/relative-time'

import { PostItemHoverOverlay } from './PostItemHoverOverlay'

export const PostItem = memo<{ data: PostModel }>(({ data }) => {
  const displayText =
    data.text.length > 300
      ? `${RemoveMarkdown(data.text.slice(0, 300))}...`
      : data.text
  const hasImage = data.images?.length > 0 && data.images[0].src
  const categorySlug = data.category?.slug
  const postLink = `/posts/${categorySlug}/${data.slug}`

  return (
    <Link
      href={postLink}
      className="relative flex flex-col space-y-2 py-6 focus-visible:!shadow-none"
    >
      <PostItemHoverOverlay />
      <h2 className="text-2xl font-medium">
        <Balancer>{data.title}</Balancer>
      </h2>
      {!!data.summary && (
        <p className="break-all leading-relaxed text-gray-900 dark:text-slate-50">
          摘要： {data.summary}
        </p>
      )}
      <div className="relative overflow-hidden">
        {hasImage && (
          <div
            className={clsx(
              'float-right h-24 w-24 overflow-hidden rounded-md',
              'bg-contain bg-center bg-no-repeat',
            )}
            style={{ backgroundImage: `url(${hasImage})` }}
          />
        )}
        <p className="break-all leading-loose text-gray-800/90 dark:text-gray-200/90">
          {displayText}
        </p>
      </div>

      <div className="post-meta-bar flex select-none items-center gap-4 text-base-content/60">
        <div className="flex min-w-0 flex-shrink flex-grow space-x-2 text-sm">
          <div className="flex min-w-0 items-center space-x-1">
            <MdiClockOutline />
            <span>
              <RelativeTime date={data.created} />
            </span>
          </div>

          <div className="flex min-w-0 items-center space-x-1">
            <FeHash className="translate-y-[0.5px]" />
            <span className="min-w-0 truncate">
              {data.category.name}
              {data.tags.length ? ` / ${data.tags.join(', ')}` : ''}
            </span>
          </div>

          {!!data.count?.like && (
            <div className="flex min-w-0 items-center space-x-1">
              <i className="icon-[mingcute--heart-fill]" />
              <span className="min-w-0 truncate">{data.count.like}</span>
            </div>
          )}
        </div>
        <span className="flex flex-shrink-0 select-none items-center space-x-1 text-accent hover:text-accent [&>svg]:hover:ml-2">
          <span>阅读全文</span>
          <IcRoundKeyboardDoubleArrowRight className="text-lg transition-[margin]" />
        </span>
      </div>
    </Link>
  )
})
