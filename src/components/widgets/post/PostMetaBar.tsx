'use client'

import type { PostModel } from '@mx-space/api-client'

import { MdiClockOutline } from '~/components/icons/clock'
import { FeHash } from '~/components/icons/fa-hash'
import { FloatPopover } from '~/components/ui/float-popover'
import { RelativeTime } from '~/components/ui/relative-time'
import { clsxm } from '~/lib/helper'

export const PostMetaBar: Component<{
  meta: Pick<PostModel, 'created' | 'modified' | 'category' | 'tags' | 'count'>
}> = ({ className, meta }) => {
  return (
    <div
      className={clsxm(
        'flex min-w-0 flex-shrink flex-grow flex-wrap space-x-2 text-sm',
        className,
      )}
    >
      <div className="flex min-w-0 items-center space-x-1">
        <MdiClockOutline />
        <span>
          <RelativeTime date={meta.created} />
        </span>
        {meta.modified && (
          <FloatPopover
            wrapperClassName="text-xs self-end translate-y-[-1px]"
            as="span"
            TriggerComponent={() => '(已编辑)'}
          >
            编辑于 <RelativeTime date={meta.modified} />
          </FloatPopover>
        )}
      </div>

      <div className="flex min-w-0 items-center space-x-1">
        <FeHash className="translate-y-[0.5px]" />
        <span className="min-w-0 truncate">
          {meta.category.name}
          {meta.tags.length ? ` / ${meta.tags.join(', ')}` : ''}
        </span>
      </div>

      {!!meta.count?.read && (
        <div className="flex min-w-0 items-center space-x-1">
          <i className="icon-[mingcute--eye-2-line]" />
          <span className="min-w-0 truncate">{meta.count.read}</span>
        </div>
      )}
      {!!meta.count?.like && (
        <div className="flex min-w-0 items-center space-x-1">
          <i className="icon-[mingcute--heart-fill]" />
          <span className="min-w-0 truncate">{meta.count.like}</span>
        </div>
      )}
    </div>
  )
}
