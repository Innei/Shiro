import type { CommentModel } from '@mx-space/api-client'

import { Avatar } from '~/components/ui/avatar'
import { clsxm } from '~/lib/helper'

import { OcticonGistSecret } from '../../comment/CommentPinButton'
import { IpInfoPopover } from '../ip'
import { CommentUrlRender } from './UrlRender'

export const CommentAuthorCell: Component<{
  comment: CommentModel
}> = (props) => {
  const { comment, className } = props
  const { author, avatar, url, mail, ip, isWhispers } = comment
  return (
    <div className={clsxm('mt-6 flex gap-8', className)}>
      <div className="self-center lg:self-start">
        <Avatar
          radius="full"
          size={50}
          randomColor
          imageUrl={avatar || ''}
          text={author[0]}
        />
      </div>
      <div className="flex w-0 grow flex-col gap-1 text-sm">
        <div className="flex items-center space-x-1">
          <CommentUrlRender url={url} author={author} />
          {isWhispers && <OcticonGistSecret />}
        </div>

        <a className="truncate text-sm text-accent" href={`mailto:${mail}`}>
          {mail}
        </a>

        {ip && (
          <IpInfoPopover
            className="truncate text-sm text-base-content opacity-60"
            ip={ip}
          />
        )}
      </div>
    </div>
  )
}
