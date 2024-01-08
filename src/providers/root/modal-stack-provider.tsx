'use client'

import * as Dialog from '@radix-ui/react-dialog'
import {
  createElement,
  Fragment,
  memo,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
} from 'react'
import { AnimatePresence, m, useAnimationControls } from 'framer-motion'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import { usePathname } from 'next/navigation'
import type { Target, Transition } from 'framer-motion'
import type { Context, FC, PropsWithChildren, SyntheticEvent } from 'react'

import { useIsMobile } from '~/atoms'
import { CloseIcon } from '~/components/icons/close'
import { DialogOverlay } from '~/components/ui/dialog/DialogOverlay'
import { Divider } from '~/components/ui/divider'
import { PresentSheet, sheetStackAtom } from '~/components/ui/sheet'
import { microReboundPreset } from '~/constants/spring'
import { useIsClient } from '~/hooks/common/use-is-client'
import { useIsUnMounted } from '~/hooks/common/use-is-unmounted'
import { stopPropagation } from '~/lib/dom'
import { clsxm } from '~/lib/helper'
import { jotaiStore } from '~/lib/store'

const modalIdToPropsMap = {} as Record<string, ModalProps>

export type ModalContentComponent<T> = FC<ModalContentPropsInternal & T>
type ModalContentPropsInternal = {
  dismiss: () => void
}

interface ModalProps {
  title: string
  content: FC<ModalContentPropsInternal>
  CustomModalComponent?: FC<PropsWithChildren>
  clickOutsideToDismiss?: boolean
  modalClassName?: string
  modalContainerClassName?: string

  wrapper?: FC
}

const modalStackAtom = atom([] as (ModalProps & { id: string })[])

const useDismissAllWhenRouterChange = () => {
  const pathname = usePathname()
  useEffect(() => {
    actions.dismissAll()
  }, [pathname])
}

interface ModalStackOptions {
  wrapper?: FC
}

export const InjectContext = (context: Context<any>) => {
  const ctxValue = useContext(context)
  return memo(({ children }: PropsWithChildren) => (
    <context.Provider value={ctxValue}>{children}</context.Provider>
  ))
}

export const useModalStack = (options?: ModalStackOptions) => {
  const id = useId()
  const currentCount = useRef(0)
  const { wrapper } = options || {}
  return {
    present: useCallback(
      (props: ModalProps & { id?: string }) => {
        const modalId = `${id}-${currentCount.current++}`
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

  const isClient = useIsClient()
  useDismissAllWhenRouterChange()
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

const Modal: Component<{
  item: ModalProps & { id: string }
  index: number
}> = memo(function Modal({ item, index }) {
  const setStack = useSetAtom(modalStackAtom)
  const close = useCallback(() => {
    setStack((p) => {
      return p.filter((modal) => modal.id !== item.id)
    })
  }, [item.id, setStack])

  const onClose = useCallback(
    (open: boolean): void => {
      if (!open) {
        close()
      }
    },
    [close],
  )
  const animateController = useAnimationControls()
  useEffect(() => {
    animateController.start(enterStyle)
  }, [])
  const {
    CustomModalComponent,
    modalClassName,
    content,
    title,
    clickOutsideToDismiss,
    modalContainerClassName,
    wrapper: Wrapper = Fragment,
  } = item
  const modalStyle = useMemo(() => ({ zIndex: 99 + index }), [index])
  const dismiss = useCallback(
    (e: SyntheticEvent) => {
      stopPropagation(e)
      close()
    },
    [close],
  )

  const isUnmounted = useIsUnMounted()
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

  const ModalProps: ModalContentPropsInternal = {
    dismiss: close,
  }

  const isMobile = useIsMobile()

  if (isMobile) {
    const drawerLength = jotaiStore.get(sheetStackAtom).length

    return (
      <Wrapper>
        <PresentSheet
          open
          title={title}
          zIndex={1000 + drawerLength}
          // onOpenChange={(open) => {
          //   if (!open) {
          //     setTimeout(() => {
          //       close()
          //     }, 1000)
          //   }
          // }}
          content={createElement(content, ModalProps)}
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
                  <CustomModalComponent>
                    {createElement(content, ModalProps)}
                  </CustomModalComponent>
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
                  'max-h-[70vh] min-w-[300px] max-w-[90vw] lg:max-h-[calc(100vh-20rem)] lg:max-w-[70vw]',
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
                  {createElement(content, ModalProps)}
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
