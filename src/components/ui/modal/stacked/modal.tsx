import * as Dialog from '@radix-ui/react-dialog'
import { m, useAnimationControls, useDragControls } from 'framer-motion'
import { useAtomValue, useSetAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import type { SyntheticEvent } from 'react'
import {
  createElement,
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { CloseIcon } from '~/components/icons/close'
import { Divider } from '~/components/ui/divider'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { nextFrame, stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'
import { jotaiStore } from '~/lib/store'

import type { SheetRef } from '../../sheet'
import { PresentSheet, sheetStackAtom } from '../../sheet'
import { MODAL_STACK_Z_INDEX, modalMontionConfig } from './constants'
import type {
  CurrentModalContentProps,
  ModalContentPropsInternal,
} from './context'
import { CurrentModalContext, modalStackAtom } from './context'
import type { ModalProps } from './types'

export const ModalInternal: Component<{
  item: ModalProps & { id: string }
  index: number

  isTop: boolean
  onClose?: (open: boolean) => void
}> = memo(function Modal({
  item,
  index,
  onClose: onPropsClose,
  children,
  isTop,
}) {
  const setStack = useSetAtom(modalStackAtom)
  const close = useEventCallback(() => {
    setStack((p) => p.filter((modal) => modal.id !== item.id))
    onPropsClose?.(false)
  })

  const currentIsClosing = useAtomValue(
    useMemo(
      () =>
        selectAtom(modalStackAtom, (atomValue) =>
          atomValue.every((modal) => modal.id !== item.id),
        ),
      [item.id],
    ),
  )
  useEffect(() => {
    if (currentIsClosing) {
      // Radix dialog will block pointer events
      document.body.style.pointerEvents = 'auto'
    }
  }, [currentIsClosing])

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
  const zIndexStyle = useMemo(
    () => ({ zIndex: MODAL_STACK_Z_INDEX + index + 1 }),
    [index],
  )

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
  const dragController = useDragControls()
  useEffect(() => {
    if (isMobile) return
    nextFrame(() => {
      animateController.start(modalMontionConfig.animate)
    })
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

  useEffect(() => {
    if (isTop) return
    animateController.start({
      scale: 0.96,
      y: 10,
    })
    return () => {
      try {
        animateController.stop()
        animateController.start({
          scale: 1,
          y: 0,
        })
      } catch {
        /* empty */
      }
    }
  }, [isTop])

  const modalContentRef = useRef<HTMLDivElement>(null)
  const ModalProps: ModalContentPropsInternal = useMemo(
    () => ({
      dismiss: () => {
        sheetRef.current?.dismiss()
        close()
      },
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
      {children ?? createElement(content, ModalProps)}
    </CurrentModalContext.Provider>
  )

  const edgeElementRef = useRef<HTMLDivElement>(null)

  const sheetRef = useRef<SheetRef>(null)

  if (isMobile) {
    const drawerLength = jotaiStore.get(sheetStackAtom).length

    return (
      <Wrapper>
        <PresentSheet
          ref={sheetRef}
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
            <Dialog.Content asChild>
              <div
                className={clsxm(
                  'fixed inset-0 z-20 overflow-auto',
                  currentIsClosing
                    ? '!pointer-events-none'
                    : 'pointer-events-auto',

                  modalContainerClassName,
                )}
                onClick={clickOutsideToDismiss ? dismiss : undefined}
                style={zIndexStyle}
              >
                <Dialog.Title className="sr-only">{title}</Dialog.Title>
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
          <Dialog.Content asChild>
            <div
              ref={edgeElementRef}
              className={clsxm(
                'center fixed inset-0 z-20 flex',
                currentIsClosing
                  ? '!pointer-events-none'
                  : 'pointer-events-auto',
                modalContainerClassName,
              )}
              style={zIndexStyle}
              onClick={clickOutsideToDismiss ? dismiss : noticeModal}
            >
              <m.div
                style={zIndexStyle}
                {...modalMontionConfig}
                animate={animateController}
                className={clsxm(
                  'relative flex flex-col overflow-hidden rounded-lg',
                  'bg-zinc-50/90 dark:bg-neutral-900/90',
                  'p-2 shadow-2xl shadow-stone-300 backdrop-blur-sm dark:shadow-stone-800',
                  max
                    ? 'h-[90vh] w-[90vw]'
                    : 'max-h-[70vh] min-w-[300px] max-w-[90vw] lg:max-h-[calc(100vh-20rem)] lg:max-w-[70vw]',

                  'border border-slate-200 dark:border-neutral-800',
                  modalClassName,
                )}
                onClick={stopPropagation}
                drag
                dragControls={dragController}
                dragListener={false}
                dragElastic={0}
                dragMomentum={false}
                dragConstraints={edgeElementRef}
                whileDrag={{
                  cursor: 'grabbing',
                }}
              >
                <div
                  className="relative flex items-center"
                  onPointerDown={(e) => dragController.start(e)}
                >
                  <Dialog.Title className="shrink-0 grow items-center px-4 py-1 text-lg font-medium">
                    {title}
                  </Dialog.Title>
                  <Dialog.DialogClose className="p-2" onClick={close}>
                    <CloseIcon />
                  </Dialog.DialogClose>
                </div>
                <Divider className="my-2 shrink-0 border-slate-200 opacity-80 dark:border-neutral-800" />

                <div className="min-h-0 shrink grow overflow-auto px-4 py-2">
                  {finalChildren}
                </div>
              </m.div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Wrapper>
  )
})
