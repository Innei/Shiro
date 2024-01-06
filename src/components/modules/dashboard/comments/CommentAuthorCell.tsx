import type { CommentModel } from '@mx-space/api-client'

import { Avatar } from '~/components/ui/avatar'

import { OcticonGistSecret } from '../../comment/CommentPinButton'
import { IpInfoPopover } from '../ip'
import { CommentUrlRender } from './UrlRender'

export const CommentAuthorCell = (props: CommentModel) => {
  const { author, avatar, url, mail, ip, isWhispers } = props
  return (
    <div className="mt-6 flex space-x-8">
      <div className="self-center lg:self-start">
        <Avatar
          height={50}
          width={50}
          imageUrl={avatar || ''}
          text={author[0]}
        />
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex items-center space-x-1">
          <CommentUrlRender url={url} author={author} />
          {isWhispers && <OcticonGistSecret />}
        </div>

        <a className="text-sm text-primary" href={`mailto:${mail}`}>
          {mail}
        </a>

        {ip && (
          <IpInfoPopover
            className="text-sm text-base-content opacity-60"
            ip={ip}
          />
        )}
      </div>
    </div>
  )
}
