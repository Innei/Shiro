'use client'

import './LinkCard.css'

import { m, useMotionTemplate, useMotionValue } from 'motion/react'
import type * as React from 'react'
import type { FC, ReactNode, SyntheticEvent } from 'react'
import { useCallback } from 'react'

import { LazyLoad } from '~/components/common/Lazyload'
import { usePeek } from '~/components/modules/peek/usePeek'
import { useIsClientTransition } from '~/hooks/common/use-is-client'
import useIsCommandOrControlPressed from '~/hooks/common/use-is-command-or-control-pressed'
import { Link } from '~/i18n/navigation'
import { preventDefault } from '~/lib/dom'
import { clsxm } from '~/lib/helper'

import { useCardFetcher } from './hooks/useCardFetcher'
import { LinkCardSkeleton } from './LinkCardSkeleton'
import { pluginMap } from './plugins'

export interface LinkCardProps {
  id: string
  source?: string
  className?: string
  fallbackUrl?: string
  placeholder?: ReactNode
}

export const LinkCard: FC<Omit<LinkCardProps, 'placeholder'>> = (props) => {
  const isClient = useIsClientTransition()
  const { source = 'self' } = props

  const placeholder = <LinkCardSkeleton source={source} />

  if (!isClient) return placeholder

  return (
    <LazyLoad placeholder={placeholder}>
      <LinkCardImpl {...props} placeholder={placeholder} />
    </LazyLoad>
  )
}

const LinkCardImpl: FC<LinkCardProps> = (props) => {
  const { id, source = 'self', className, fallbackUrl, placeholder } = props

  const { loading, isError, cardInfo, fullUrl, isValid, ref } = useCardFetcher({
    source,
    id,
    fallbackUrl,
  })

  const plugin = pluginMap.get(source)
  const typeClass = plugin?.typeClass ? `link-card--${plugin.typeClass}` : ''

  const peek = usePeek()
  const isCommandPressed = useIsCommandOrControlPressed()

  const handleCanPeek = useCallback(
    async (e: SyntheticEvent<any>) => {
      if (isCommandPressed) return
      const success = peek(fullUrl)
      if (success) preventDefault(e)
    },
    [fullUrl, isCommandPressed, peek],
  )

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const radius = useMotionValue(0)

  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
      radius.set(Math.hypot(bounds.width, bounds.height) * 1.3)
    },
    [mouseX, mouseY, radius],
  )

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 65%)`

  if (!isValid) {
    return null
  }

  const LinkComponent = source === 'self' ? Link : 'a'
  const classNames = cardInfo?.classNames || {}

  if (loading) {
    return (
      <a
        data-hide-print
        ref={ref}
        href={fullUrl}
        target={source !== 'self' ? '_blank' : '_self'}
        rel="noreferrer"
      >
        {placeholder}
      </a>
    )
  }

  return (
    <LinkComponent
      data-hide-print
      href={fullUrl}
      target={source !== 'self' ? '_blank' : '_self'}
      className={clsxm(
        'link-card',
        typeClass,
        (loading || isError) && 'link-card--skeleton',
        isError && 'link-card--error',
        'not-prose',
        'group',
        className,
        classNames.cardRoot,
      )}
      style={{
        borderColor: cardInfo?.color ? `${cardInfo.color}30` : undefined,
      }}
      onClick={handleCanPeek}
      onMouseMove={handleMouseMove}
    >
      {cardInfo?.color && (
        <>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: cardInfo?.color,
              opacity: 0.06,
            }}
          />
          <m.div
            layout
            className="absolute inset-0 z-0 opacity-0 duration-500 group-hover:opacity-100"
            style={
              {
                '--spotlight-color': `${cardInfo?.color}50`,
                background,
              } as any
            }
          />
        </>
      )}
      <span className="link-card__contents">
        <span className="link-card__title">{cardInfo?.title}</span>
        <span className="link-card__desc">{cardInfo?.desc}</span>
      </span>
      {(loading || cardInfo?.image) && (
        <span
          className={clsxm('link-card__image', classNames.image)}
          data-image={cardInfo?.image || ''}
          style={{
            backgroundImage: cardInfo?.image
              ? `url(${cardInfo.image})`
              : undefined,
          }}
        />
      )}
    </LinkComponent>
  )
}
