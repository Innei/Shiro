import type { PostModel } from '@mx-space/api-client'

import { MdiClockOutline } from '~/components/icons/clock'
import { FeHash } from '~/components/icons/fa-hash'
import { RelativeTime } from '~/components/ui/relative-time'
import { clsxm } from '~/utils/helper'

export const PostMetaBar: Component<{ data: PostModel }> = ({
  data,
  className,
}) => {
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

      {!!data.count?.read && (
        <div className="flex min-w-0 items-center space-x-1">
          <i className="icon-[mingcute--eye-2-line]" />
          <span className="min-w-0 truncate">{data.count.read}</span>
        </div>
      )}
      {!!data.count?.like && (
        <div className="flex min-w-0 items-center space-x-1">
          <i className="icon-[mingcute--heart-fill]" />
          <span className="min-w-0 truncate">{data.count.like}</span>
        </div>
      )}
    </div>
  )
}
