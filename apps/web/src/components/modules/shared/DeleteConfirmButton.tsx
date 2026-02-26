'use client'

import { useTranslations } from 'next-intl'
import type { FC, PropsWithChildren } from 'react'

import { MotionButtonBase, StyledButton } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { toast } from '~/lib/toast'

export const DeleteConfirmButton: FC<
  {
    onDelete: () => Promise<any>
    confirmText?: string
    deleteItemText?: string
  } & PropsWithChildren
> = (props) => {
  const t = useTranslations('common')
  const { onDelete, confirmText, deleteItemText } = props

  const defaultButton = (
    <StyledButton
      variant="secondary"
      className="rounded-lg"
      onClick={() => {
        onDelete().then(() => {
          toast.success(t('delete_success'))
        })
      }}
    >
      {t('actions_confirm')}
    </StyledButton>
  )

  return (
    <FloatPopover
      trigger="click"
      type="tooltip"
      triggerElement={
        <MotionButtonBase className="duration-200 hover:text-red-500">
          {t('actions_delete')}
        </MotionButtonBase>
      }
    >
      <div className="flex p-2">
        <p className="text-center text-base font-bold text-error">
          {confirmText ??
            (deleteItemText
              ? t('delete_confirm_title', { item: deleteItemText })
              : t('delete_confirm_default'))}
        </p>
      </div>
      <div className="text-right">{props.children || defaultButton}</div>
    </FloatPopover>
  )
}
