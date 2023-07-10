import { useEffect } from 'react'
import { toast, Toaster } from 'sonner'

export const Sonner = () => {
  useEffect(() => {
    requestAnimationFrame(() => {
      toast.success('ss', {
        action: {
          label: 'test',
          onClick(event) {
            console.log(event)
          },
        },
      })
    })
  }, [])
  return (
    <>
      <Toaster closeButton richColors />
    </>
  )
}
