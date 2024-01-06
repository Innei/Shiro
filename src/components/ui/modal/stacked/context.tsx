import { createContext, useContext } from 'react'
import { atom } from 'jotai'
import type { FC, RefObject } from 'react'
import type { ModalProps } from './types'

export const modalIdToPropsMap = {} as Record<string, ModalProps>

export type CurrentModalContentProps = ModalContentPropsInternal & {
  ref: RefObject<HTMLElement>
}

export const CurrentModalContext = createContext<CurrentModalContentProps>(
  null as any,
)

export const useCurrentModal = () => {
  return useContext(CurrentModalContext)
}

export type ModalContentComponent<T> = FC<ModalContentPropsInternal & T>
export type ModalContentPropsInternal = {
  dismiss: () => void
}
export const modalStackAtom = atom([] as (ModalProps & { id: string })[])
