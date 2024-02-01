import * as Dialog from '@radix-ui/react-dialog'
import {
  createElement,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { m, useAnimationControls } from 'framer-motion'
import { useSetAtom } from 'jotai'
import type { Target, Transition } from 'framer-motion'
import type { SyntheticEvent } from 'react'
import type {
  CurrentModalContentProps,
  ModalContentPropsInternal,
} from './context'
import type { ModalProps } from './types'

import { useIsMobile } from '~/atoms'
import { CloseIcon } from '~/components/icons/close'
import { DialogOverlay } from '~/components/ui/dialog/DialogOverlay'
import { Divider } from '~/components/ui/divider'
import { microReboundPreset } from '~/constants/spring'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'
import { jotaiStore } from '~/lib/store'

import { PresentSheet, sheetStackAtom } from '../../sheet'
import { CurrentModalContext, modalStackAtom } from './context'

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

  onClose?: (open: boolean) => void
}> = memo(function Modal({ item, index, onClose: onPropsClose, children }) {
  const setStack = useSetAtom(modalStackAtom)
  const close = useEventCallback(() => {
    setStack((p) => {
      return p.filter((modal) => modal.id !== item.id)
    })
    onPropsClose?.(false)
  })

  const onClose = useCallback(
    (open: boolean): void => {
      if (!open) {
        close()
      }
    },
    [close],
  )

  const {
    CustomModalComponent,
    modalClassName,
    content,
    title,
    clickOutsideToDismiss,
    modalContainerClassName,
    wrapper: Wrapper = Fragment,
    max,
  } = item
  const modalStyle = useMemo(() => ({ zIndex: 99 + index }), [index])
  const dismiss = useCallback(
    (e: SyntheticEvent) => {
      stopPropagation(e)
      close()
    },
    [close],
  )
  const isMobile = useIsMobile()
  const isUnmounted = useIsUnMounted()
  const animateController = useAnimationControls()
  useEffect(() => {
    if (isMobile) return
    animateController.start(enterStyle)
  }, [animateController, isMobile])
  const noticeModal = useCallback(() => {
    animateController
      .start({
        scale: 1.05,
        transition: {
          duration: 0.06,
        },
      })
      .then(() => {
        if (isUnmounted.current) return
        animateController.start({
          scale: 1,
        })
      })
  }, [animateController])

  const modalContentRef = useRef<HTMLDivElement>(null)
  const ModalProps: ModalContentPropsInternal = useMemo(
    () => ({
      dismiss: close,
    }),
    [close],
  )

  const ModalContextProps = useMemo<CurrentModalContentProps>(
    () => ({
      ...ModalProps,
      ref: modalContentRef,
    }),
    [ModalProps],
  )
  const finalChildren = (
    <CurrentModalContext.Provider value={ModalContextProps}>
      {children ? children : createElement(content, ModalProps)}
    </CurrentModalContext.Provider>
  )

  if (isMobile) {
    const drawerLength = jotaiStore.get(sheetStackAtom).length

    return (
      <Wrapper>
        <PresentSheet
          title={title}
          defaultOpen
          zIndex={1000 + drawerLength}
          onOpenChange={(open) => {
            if (!open) {
              setTimeout(() => {
                close()
              }, 1000)
            }
          }}
          content={finalChildren}
        />
      </Wrapper>
    )
  }

  if (CustomModalComponent) {
    return (
      <Wrapper>
        <Dialog.Root open onOpenChange={onClose}>
          <Dialog.Portal>
            <DialogOverlay zIndex={20} />
            <Dialog.Content asChild>
              <div
                className={clsxm(
                  'fixed inset-0 z-[20] overflow-auto',
                  modalContainerClassName,
                )}
                onClick={clickOutsideToDismiss ? dismiss : undefined}
              >
                <div className="contents" onClick={stopPropagation}>
                  <CustomModalComponent>{finalChildren}</CustomModalComponent>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Wrapper>
    )
  }
  return (
    <Wrapper>
      <Dialog.Root open onOpenChange={onClose}>
        <Dialog.Portal>
          <DialogOverlay zIndex={20} />
          <Dialog.Content asChild>
            <div
              className={clsxm(
                'fixed inset-0 z-[20] flex center',
                modalContainerClassName,
              )}
              onClick={clickOutsideToDismiss ? dismiss : noticeModal}
            >
              <m.div
                style={modalStyle}
                exit={initialStyle}
                initial={initialStyle}
                animate={animateController}
                transition={modalTransition}
                className={clsxm(
                  'relative flex flex-col overflow-hidden rounded-lg',
                  'bg-slate-50/80 dark:bg-neutral-900/80',
                  'p-2 shadow-2xl shadow-stone-300 backdrop-blur-sm dark:shadow-stone-800',
                  max
                    ? 'h-[90vh] w-[90vw]'
                    : 'max-h-[70vh] min-w-[300px] max-w-[90vw] lg:max-h-[calc(100vh-20rem)] lg:max-w-[70vw]',

                  'border border-slate-200 dark:border-neutral-800',
                  modalClassName,
                )}
                onClick={stopPropagation}
              >
                <Dialog.Title className="flex-shrink-0 px-4 py-2 text-lg font-medium">
                  {title}
                </Dialog.Title>
                <Divider className="my-2 flex-shrink-0 border-slate-200 opacity-80 dark:border-neutral-800" />

                <div className="min-h-0 flex-shrink flex-grow overflow-auto px-4 py-2">
                  {finalChildren}
                </div>

                <Dialog.DialogClose
                  onClick={close}
                  className="absolute right-0 top-0 z-[9] p-5"
                >
                  <CloseIcon />
                </Dialog.DialogClose>
              </m.div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Wrapper>
  )
})
