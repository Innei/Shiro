import * as Dialog from '@radix-ui/react-dialog'
import { createElement, memo, useCallback, useId, useMemo, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import type { Target, Transition } from 'framer-motion'
import type { FC, PropsWithChildren } from 'react'

import { CloseIcon } from '~/components/icons/close'
import { Divider } from '~/components/ui/divider'
import { DialogOverlay } from '~/components/ui/dlalog/DialogOverlay'
import { microReboundPreset } from '~/constants/spring'
import { useIsClient } from '~/hooks/common/use-is-client'
import { jotaiStore } from '~/lib/store'
import { clsxm } from '~/utils/helper'

const modalIdToPropsMap = {} as Record<string, ModalProps>
interface ModalProps {
  title: string
  content: FC<{}>

  modalClassName?: string
}

const modalStackAtom = atom([] as (ModalProps & { id: string })[])

export const useModalStack = () => {
  const id = useId()
  const currentCount = useRef(0)
  return {
    present(props: ModalProps) {
      const modalId = `${id}-${currentCount.current++}`
      jotaiStore.set(modalStackAtom, (p) => {
        const modalProps = {
          ...props,
          id: modalId,
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
  }
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

  const isClient = useIsClient()
  if (!isClient) return null

  return (
    <AnimatePresence>
      {stack.map((item, index) => {
        return <Modal key={item.id} item={item} index={index} />
      })}
    </AnimatePresence>
  )
}

const enterStyle: Target = {
  scale: 1,
  opacity: 1,
}

const initialStyle: Target = {
  scale: 0.96,
  opacity: 0,
}
const modalTransition: Transition = {
  ...microReboundPreset,
}
export const Modal: Component<{
  item: ModalProps & { id: string }
  index: number
}> = memo(({ item, index }) => {
  const setStack = useSetAtom(modalStackAtom)
  const close = useCallback(() => {
    setStack((p) => {
      return p.filter((modal) => modal.id !== item.id)
    })
  }, [item.id])
  const onClose = useCallback(
    (open: boolean): void => {
      if (!open) {
        close()
      }
    },
    [close],
  )
  return (
    <Dialog.Root open onOpenChange={onClose}>
      <Dialog.Portal>
        <DialogOverlay />
        <Dialog.Content asChild>
          <div className="fixed inset-0 z-[20] flex center">
            <motion.div
              style={useMemo(() => ({ zIndex: 99 + index }), [index])}
              exit={initialStyle}
              initial={initialStyle}
              animate={enterStyle}
              transition={modalTransition}
              className={clsxm(
                'relative flex flex-col overflow-hidden rounded-lg',
                'bg-slate-50/90 dark:bg-neutral-900/90',
                'p-2 shadow-2xl shadow-stone-300 backdrop-blur-sm dark:shadow-stone-800',
                'max-h-[70vh] min-w-[300px] max-w-[90vw] lg:max-h-[50vh] lg:max-w-[50vw]',
                'border border-slate-200 dark:border-neutral-800',
                item.modalClassName,
              )}
            >
              <Dialog.Title className="flex-shrink-0 px-4 py-2 text-lg font-medium">
                {item.title}
              </Dialog.Title>
              <Divider className="my-2 flex-shrink-0 border-slate-200 opacity-80 dark:border-neutral-800" />

              <div className="min-h-0 flex-shrink flex-grow overflow-auto px-4 py-2">
                {createElement(item.content)}
              </div>

              <Dialog.DialogClose
                onClick={close}
                className="absolute right-0 top-0 z-[9] p-5"
              >
                <CloseIcon />
              </Dialog.DialogClose>
            </motion.div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})
