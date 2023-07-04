import { useCallback } from 'react'
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { FC, PropsWithChildren, SyntheticEvent } from 'react'

import { useIsMobile } from '~/atoms'
import { useModalStack } from '~/providers/root/modal-stack-provider'

import { NotePreview } from './NotePreview'
import { PeekModal } from './PeekModal'
import { PostPreview } from './PostPreview'

export const PeekLink: FC<
  {
    href: string
  } & LinkProps &
    PropsWithChildren &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
> = (props) => {
  const { href, children, ...rest } = props
  const isMobile = useIsMobile()
  const { present } = useModalStack()
  const handlePeek = useCallback(
    (e: SyntheticEvent) => {
      if (isMobile) return

      if (href.startsWith('/notes/')) {
        {
          e.preventDefault()
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
        }
      } else if (href.startsWith('/posts/')) {
        e.preventDefault()
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
      }
    },
    [href, isMobile, present],
  )

  return (
    <Link href={href} onClick={handlePeek} {...rest}>
      {children}
    </Link>
  )
}
