import { useCallback, useState } from 'react'

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  const onOpen = useCallback(() => setIsOpen(true), [])
  const onToggle = useCallback(() => setIsOpen((isOpen) => !isOpen), [])
  const onOpenChange = useCallback((open: boolean) => setIsOpen(open), [])
  return {
    isOpen,
    onClose,
    onOpen,
    onToggle,
    onOpenChange,
  }
}
