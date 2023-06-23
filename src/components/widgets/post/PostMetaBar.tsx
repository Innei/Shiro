import type { PostModel } from '@mx-space/api-client'

import { MdiClockOutline } from '~/components/icons/clock'
import { FeHash } from '~/components/icons/fa-hash'
import { RelativeTime } from '~/components/ui/relative-time'
import { clsxm } from '~/utils/helper'

export const PostMetaBar: Component<{
  meta: Pick<PostModel, 'created' | 'category' | 'tags' | 'count'>
}> = ({ className, meta }) => {
  return (
    <div
      className={clsxm(
        'flex min-w-0 flex-shrink flex-grow space-x-2 text-sm',
        className,
      )}
    >
      <div className="flex min-w-0 items-center space-x-1">
        <MdiClockOutline />
        <span>
          <RelativeTime date={meta.created} />
        </span>
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
