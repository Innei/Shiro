import { useTranslations } from 'next-intl'

import { MotionButtonBase } from '~/components/ui/button'
import { useModalStack } from '~/components/ui/modal'
import { useIsClient } from '~/hooks/common/use-is-client'

import { ActionAsideIcon } from './ActionAsideContainer'
import type { CommentModalProps } from './CommentModal'
import { CommentModal } from './CommentModal'

export interface AsideCommentButtonProps {}

export const AsideCommentButton = (
  props: CommentModalProps & AsideCommentButtonProps,
) => {
  const t = useTranslations('common')
  const isClient = useIsClient()
  const { present } = useModalStack()

  if (!isClient) return null

  return (
    <MotionButtonBase
      aria-label={t('aria_comment')}
      className="flex flex-col space-y-2"
      onClick={() => {
        present({
          title: t('comment_title'),
          content: (rest) => <CommentModal {...props} {...rest} />,
        })
      }}
    >
      <ActionAsideIcon className="i-mingcute-comment-line hover:text-pink-500" />
    </MotionButtonBase>
  )
}
