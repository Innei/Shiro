'use client'

import type { FC } from 'react'

import { ShadowDOM } from '~/components/ui/react-component-render/ShadowDOM'

import type { LinkCardProps } from './LinkCard'
import { LinkCard } from './LinkCard'

export interface ShadowLinkCardProps extends Omit<
  LinkCardProps,
  'placeholder'
> {
  /**
   * Additional class name for the shadow DOM container
   */
  containerClassName?: string
}

/**
 * LinkCard wrapped in Shadow DOM for style isolation.
 * Use this component when rendering LinkCard inside article content
 * where parent styles (e.g., .prose) might pollute the card styles.
 */
export const ShadowLinkCard: FC<ShadowLinkCardProps> = (props) => {
  const { containerClassName, ...linkCardProps } = props

  return (
    <ShadowDOM
      injectHostStyles
      className={containerClassName}
      style={{ display: 'contents' }}
    >
      <LinkCard {...linkCardProps} />
    </ShadowDOM>
  )
}
