import * as Dialog from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'

export const DialogOverlay = () => {
  return (
    <Dialog.Overlay asChild>
      <motion.div
        className="fixed inset-0 z-[11] bg-slate-50/80 backdrop-blur-sm dark:bg-slate-900/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
    </Dialog.Overlay>
  )
}
