import * as Dialog from '@radix-ui/react-dialog'
import { m } from 'motion/react'

export const DialogOverlay = ({
  onClick,
  zIndex,
}: {
  onClick?: () => void
  zIndex?: number
}) => {
  return (
    <Dialog.Overlay asChild>
      <m.div
        onClick={onClick}
        className="fixed inset-0 z-[11] bg-zinc-50/80 dark:bg-neutral-900/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ zIndex }}
      />
    </Dialog.Overlay>
  )
}
