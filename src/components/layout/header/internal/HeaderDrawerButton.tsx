'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, m } from 'framer-motion'
import { atom, useAtom } from 'jotai'
import type { SVGProps } from 'react'

import { CloseIcon } from '~/components/icons/close'
import { MotionButtonBase } from '~/components/ui/button'
import { DialogOverlay } from '~/components/ui/dlalog/DialogOverlay'
import { useIsClient } from '~/hooks/common/use-is-client'

import { HeaderActionButton } from './HeaderActionButton'
import { HeaderDrawerContent } from './HeaderDrawerContent'

function IcBaselineMenuOpen(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12L21 8.41L19.59 7l-5 5l5 5L21 15.59z"
      />
    </svg>
  )
}

export const drawerOpenAtom = atom(false)
export const HeaderDrawerButton = () => {
  const [open, setOpen] = useAtom(drawerOpenAtom)

  const isClient = useIsClient()
  const ButtonElement = (
    <HeaderActionButton>
      <IcBaselineMenuOpen />
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
                    className="fixed left-0 right-0 top-0 z-[12] block overflow-auto rounded-xl bg-base-100/90"
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
