import React, { useEffect, useMemo, useState } from 'react'
import { atom, useStore } from 'jotai'
import { Drawer } from 'vaul'
import type { FC, PropsWithChildren, ReactNode } from 'react'

import { SheetContext } from './context'

export interface PresentSheetProps {
  content: ReactNode | FC
  open?: boolean
  onOpenChange?: (value: boolean) => void
  title?: ReactNode
  zIndex?: number
  dismissible?: boolean
  defaultOpen?: boolean

  triggerAsChild?: boolean
}

export const sheetStackAtom = atom([] as HTMLDivElement[])

export const PresentSheet: FC<PropsWithChildren<PresentSheetProps>> = (
  props,
) => {
  const {
    content,
    children,
    zIndex = 998,
    title,
    dismissible = true,
    defaultOpen,
    triggerAsChild,
  } = props

  const [isOpen, setIsOpen] = useState(props.open ?? defaultOpen)

  const nextRootProps = useMemo(() => {
    const nextProps = {
      onOpenChange: setIsOpen,
    } as any
    if (isOpen !== undefined) {
      nextProps.open = isOpen
    }

    if (props.onOpenChange !== undefined) {
      nextProps.onOpenChange = (v: boolean) => {
        setIsOpen(v)
        props.onOpenChange?.(v)
      }
    }

    return nextProps
  }, [props, isOpen, setIsOpen])

  useEffect(() => {
    if (props.open !== undefined) {
      setIsOpen(props.open)
    }
  }, [props.open])
  const [holderRef, setHolderRef] = useState<HTMLDivElement | null>()
  const store = useStore()

  useEffect(() => {
    const holder = holderRef
    if (!holder) return
    store.set(sheetStackAtom, (p) => {
      return p.concat(holder)
    })

    return () => {
      store.set(sheetStackAtom, (p) => {
        return p.filter((item) => item !== holder)
      })
    }
  }, [holderRef, store])

  const Root = Drawer.Root

  const overlayZIndex = zIndex - 1
  const contentZIndex = zIndex

  return (
    <Root dismissible={dismissible} {...nextRootProps}>
      <Drawer.Trigger asChild={triggerAsChild}>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Content
          style={{
            zIndex: contentZIndex,
          }}
          className="fixed inset-x-0 bottom-0 mt-24 flex max-h-[95vh] flex-col rounded-t-[10px] bg-base-100 p-4"
        >
          {dismissible && (
            <div className="mx-auto mb-8 h-1.5 w-12 shrink-0 rounded-full bg-zinc-300 dark:bg-neutral-800" />
          )}

          {title && (
            <Drawer.Title className="-mt-4 mb-4 flex justify-center text-lg font-medium">
              {title}
            </Drawer.Title>
          )}

          <SheetContext.Provider
            value={useMemo(
              () => ({
                dismiss() {
                  setIsOpen(false)
                },
              }),
              [setIsOpen],
            )}
          >
            {typeof content === 'function'
              ? React.createElement(content)
              : content}
          </SheetContext.Provider>
          <div ref={setHolderRef} />
        </Drawer.Content>
        <Drawer.Overlay
          className="fixed inset-0 bg-neutral-800/40"
          style={{
            zIndex: overlayZIndex,
          }}
        />
      </Drawer.Portal>
    </Root>
  )
}
