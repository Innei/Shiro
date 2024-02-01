import type { FC, PropsWithChildren } from 'react'
import type { ModalContentPropsInternal } from './context'

export interface ModalProps {
  title: string
  CustomModalComponent?: FC<PropsWithChildren>
  content: FC<ModalContentPropsInternal>
  clickOutsideToDismiss?: boolean
  modalClassName?: string
  modalContainerClassName?: string

  max?: boolean

  ////
  sheetFullScreen?: boolean | 'half'

  wrapper?: FC
}
