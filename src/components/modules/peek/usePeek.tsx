import { useCallback } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { useModalStack } from '~/components/ui/modal'

import { PeekModal } from './PeekModal'

export const usePeek = () => {
  const isMobile = useIsMobile()
  const { present } = useModalStack()
  return useCallback(
    (href: string) => {
      if (isMobile) return
      const basePresentProps = {
        clickOutsideToDismiss: true,
        title: 'Preview',
        modalClassName:
          'relative mx-auto mt-[10vh] scrollbar-none max-w-full overflow-auto px-2 lg:max-w-[65rem] lg:p-0',
      }

      if (href.startsWith('/notes/')) {
        requestAnimationFrame(async () => {
          const NotePreview = await import('./NotePreview').then(
            (module) => module.NotePreview,
          )
          present({
            ...basePresentProps,
            CustomModalComponent: () => (
              <PeekModal to={href}>
                <NotePreview noteId={parseInt(href.split('/').pop()!)} />
              </PeekModal>
            ),
            content: () => null,
          })
        })

        return true
      } else if (href.startsWith('/posts/')) {
        requestAnimationFrame(async () => {
          const PostPreview = await import('./PostPreview').then(
            (module) => module.PostPreview,
          )
          const splitpath = href.split('/')
          const slug = splitpath.pop()!
          const category = splitpath.pop()!
          present({
            ...basePresentProps,
            CustomModalComponent: () => (
              <PeekModal to={href}>
                <PostPreview category={category} slug={slug} />
              </PeekModal>
            ),
            content: () => null,
          })
        })
        return true
      }

      return false
    },
    [isMobile, present],
  )
}
