'use client'

import { useCurrentPageDataSelector } from '~/providers/page/CurrentPageDataProvider'

import { ActionAsideContainer } from '../shared/ActionAsideContainer'
import { AsideCommentButton } from '../shared/AsideCommentButton'
import { AsideDonateButton } from '../shared/AsideDonateButton'

export const PageActionAside: Component = ({ className }) => {
  return (
    <ActionAsideContainer className={className}>
      <PageAsideCommentButton />
      <AsideDonateButton />
    </ActionAsideContainer>
  )
}

const PageAsideCommentButton = () => {
  const { title, id } =
    useCurrentPageDataSelector((data) => {
      return {
        title: data?.title,
        id: data?.id,
      }
    }) || {}
  if (!id) return null
  return <AsideCommentButton refId={id} title={title!} />
}
