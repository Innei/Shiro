import { useCallback, useEffect, useId, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { usePathname } from 'next/navigation'
import type { FC, PropsWithChildren } from 'react'
import type { ModalProps } from './types'

import { jotaiStore } from '~/lib/store'

import { modalIdToPropsMap, modalStackAtom } from './context'
import { Modal } from './modal'

const useDismissAllWhenRouterChange = () => {
  const pathname = usePathname()
  useEffect(() => {
    actions.dismissAll()
  }, [pathname])
}

interface ModalStackOptions {
  wrapper?: FC
}

export const useModalStack = (options?: ModalStackOptions) => {
  const id = useId()
  const currentCount = useRef(0)
  const { wrapper } = options || {}
  return {
    present: useCallback(
      (props: ModalProps & { id?: string }) => {
        const modalId = `${id}-${++currentCount.current}`
        jotaiStore.set(modalStackAtom, (p) => {
          const modalProps = {
            ...props,
            id: props.id ?? modalId,
            wrapper,
          }
          modalIdToPropsMap[modalProps.id] = modalProps
          return p.concat(modalProps)
        })

        return () => {
          jotaiStore.set(modalStackAtom, (p) => {
            return p.filter((item) => item.id !== modalId)
          })
        }
      },
      [id],
    ),

    ...actions,
  }
}

const actions = {
  dismiss(id: string) {
    jotaiStore.set(modalStackAtom, (p) => {
      return p.filter((item) => item.id !== id)
    })
  },
  dismissTop() {
    jotaiStore.set(modalStackAtom, (p) => {
      return p.slice(0, -1)
    })
  },
  dismissAll() {
    jotaiStore.set(modalStackAtom, [])
  },
}
export const ModalStackProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      {children}
      <ModalStack />
    </>
  )
}

const ModalStack = () => {
  const stack = useAtomValue(modalStackAtom)

  useDismissAllWhenRouterChange()

  return (
    <AnimatePresence mode="popLayout">
      {stack.map((item, index) => {
        return <Modal key={item.id} item={item} index={index} />
      })}
    </AnimatePresence>
  )
}
