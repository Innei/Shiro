import { atom } from 'jotai'
import type { FC } from 'react'
import { createContext, use } from 'react'

import type { ModalProps } from './types'

export const modalIdToPropsMap = {} as Record<string, ModalProps>

export type CurrentModalContentProps = ModalContentPropsInternal & {
  ref: HTMLElement | null
}

export const CurrentModalContext = createContext<CurrentModalContentProps>(
  null as any,
)

export const useCurrentModal = () => use(CurrentModalContext)

export type ModalContentComponent<T> = FC<ModalContentPropsInternal & T>
export type ModalContentPropsInternal = {
  dismiss: () => void
}
export const modalStackAtom = atom([] as (ModalProps & { id: string })[])
