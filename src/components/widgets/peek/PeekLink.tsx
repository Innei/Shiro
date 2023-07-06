import { useCallback } from 'react'
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { FC, PropsWithChildren, SyntheticEvent } from 'react'

import { useIsMobile } from '~/atoms'
import { preventDefault } from '~/lib/dom'
import { useModalStack } from '~/providers/root/modal-stack-provider'

import { PeekModal } from './PeekModal'

export const usePeek = () => {
  const isMobile = useIsMobile()
  const { present } = useModalStack()
  return useCallback(
    (href: string) => {
      if (isMobile) return

      if (href.startsWith('/notes/')) {
        requestAnimationFrame(async () => {
          const NotePreview = await import('./NotePreview').then(
            (module) => module.NotePreview,
          )
          present({
            clickOutsideToDismiss: true,
            title: 'Preview',
            modalClassName: 'flex justify-center',
            modalContainerClassName: 'flex justify-center',
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
            clickOutsideToDismiss: true,
            title: 'Preview',
            modalClassName: 'flex justify-center',
            modalContainerClassName: 'flex justify-center',
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

export const PeekLink: FC<
  {
    href: string
  } & LinkProps &
    PropsWithChildren &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
> = (props) => {
  const { href, children, ...rest } = props

  const peek = usePeek()

  const handlePeek = useCallback(
    async (e: SyntheticEvent) => {
      const success = peek(href)
      if (success) preventDefault(e)
    },
    [href, peek],
  )

  return (
    <Link href={href} onClick={handlePeek} data-event="peek" {...rest}>
      {children}
    </Link>
  )
}
