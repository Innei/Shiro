import type { FC } from 'react'

import { clsxm } from '~/lib/helper'

import { pluginMap } from './plugins'

export const LinkCardSkeleton: FC<{
  className?: string
  source?: string
}> = ({ className, source }) => {
  const plugin = source ? pluginMap.get(source) : undefined
  const typeClass = plugin?.typeClass ? `link-card--${plugin.typeClass}` : ''

  return (
    <span
      data-hide-print
      className={clsxm(
        'link-card',
        'link-card--skeleton',
        typeClass,
        className,
      )}
    >
      <span className="link-card__contents">
        <span className="link-card__title" />
        <span className="link-card__desc" />
      </span>
      <span className="link-card__image" />
    </span>
  )
}
