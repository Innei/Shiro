'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, m } from 'framer-motion'
import { atom, useAtom } from 'jotai'

import { CloseIcon } from '~/components/icons/close'
import { MotionButtonBase } from '~/components/ui/button'
import { DialogOverlay } from '~/components/ui/dialog/DialogOverlay'
import { useIsClient } from '~/hooks/common/use-is-client'

import { HeaderActionButton } from './HeaderActionButton'
import { HeaderDrawerContent } from './HeaderDrawerContent'

export const drawerOpenAtom = atom(false)
export const HeaderDrawerButton = () => {
  const [open, setOpen] = useAtom(drawerOpenAtom)

  const isClient = useIsClient()
  const ButtonElement = (
    <HeaderActionButton>
      <i className="icon-[mingcute--menu-line]" />
    </HeaderActionButton>
  )
  if (!isClient) return ButtonElement

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger asChild>{ButtonElement}</Dialog.Trigger>
      <Dialog.Portal forceMount>
        <div>
          <AnimatePresence>
            {open && (
              <>
                <DialogOverlay />

                <Dialog.Content>
                  <m.dialog
                    className="fixed left-0 right-0 top-0 z-[12] m-0 block h-screen w-full overflow-auto rounded-xl bg-base-100/90 px-3 backdrop-blur-sm"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Dialog.DialogClose asChild>
                      <MotionButtonBase
                        aria-label="Close Header Drawer"
                        className="absolute right-0 top-0 z-[9] p-8"
                        onClick={() => {
                          setOpen(false)
                        }}
                      >
                        <CloseIcon />
                      </MotionButtonBase>
                    </Dialog.DialogClose>

                    <HeaderDrawerContent />
                  </m.dialog>
                </Dialog.Content>
              </>
            )}
          </AnimatePresence>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
