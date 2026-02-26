'use client'

import type { PostModel } from '@mx-space/api-client'
import { Fragment } from 'react'

import { MdiClockOutline } from '~/components/icons/clock'
import { FeHash } from '~/components/icons/fa-hash'
import { ThumbsupIcon } from '~/components/icons/thumbs-up'
import { FloatPopover } from '~/components/ui/float-popover'
import { useModalStack } from '~/components/ui/modal'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import { RelativeTime } from '~/components/ui/relative-time'
import { useIsClient } from '~/hooks/common/use-is-client'
import { clsxm } from '~/lib/helper'

import { TagDetailModal } from './fab/PostTagsFAB'

export const PostMetaBar: Component<{
  meta: Partial<
    Pick<PostModel, 'created' | 'modified' | 'category' | 'tags' | 'count'>
  >
}> = ({ className, meta, children }) => {
  const { present } = useModalStack()
  const isClient = useIsClient()
  return (
    <div
      className={clsxm(
        'flex min-w-0 shrink grow flex-wrap gap-2 text-sm text-neutral',
        className,
      )}
    >
      <div className="flex min-w-0 items-center space-x-1">
        {!!meta.created && (
          <>
            <MdiClockOutline />
            <span>
              <RelativeTime date={meta.created} />
            </span>
          </>
        )}
        {meta.modified ? (
          isClient ? (
            <FloatPopover
              mobileAsSheet
              wrapperClassName="text-xs"
              as="span"
              type="tooltip"
              triggerElement="(已编辑)"
            >
              编辑于 <RelativeTime date={meta.modified} />
            </FloatPopover>
          ) : (
            <span className="text-xs">(已编辑)</span>
          )
        ) : null}
      </div>

      {!!meta.category && (
        <div className="flex min-w-0 items-center space-x-1">
          <FeHash className="translate-y-[0.5px]" />
          <span className="min-w-0 truncate">
            <span>{meta.category?.name}</span>

            {meta.tags?.length ? (
              <>
                {' '}
                /{' '}
                {meta.tags.map((tag, index) => {
                  const isLast = index === meta.tags!.length - 1

                  return (
                    <Fragment key={tag}>
                      <button
                        className="shiro-link--underline"
                        onClick={() =>
                          present({
                            content: () => <TagDetailModal name={tag} />,
                            title: `Tag: ${tag}`,
                          })
                        }
                        key={tag}
                      >
                        {tag}
                      </button>
                      {!isLast && <span>, </span>}
                    </Fragment>
                  )
                })}
              </>
            ) : (
              ''
            )}
          </span>
        </div>
      )}

      {!!meta.count?.read && (
        <div className="flex min-w-0 items-center space-x-1">
          <i className="i-mingcute-eye-2-line" />
          <span className="min-w-0 truncate">
            <NumberSmoothTransition>{meta.count.read}</NumberSmoothTransition>
          </span>
        </div>
      )}
      {!!meta.count?.like && (
        <div className="flex min-w-0 items-center space-x-1">
          <ThumbsupIcon />
          <span className="min-w-0 truncate">
            <NumberSmoothTransition>{meta.count.like}</NumberSmoothTransition>
          </span>
        </div>
      )}

      {children}
    </div>
  )
}
