'use client'

import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { tv } from 'tailwind-variants'
import type { FC, MouseEvent } from 'react'

import { clsxm } from '~/lib/helper'

const styles = tv({
  base: clsxm(
    'relative mb-[1.5px] inline-block min-w-0 max-w-full leading-normal text-neutral-content',
    'truncate text-left tabular-nums opacity-50 transition-all duration-500 hover:opacity-80',
  ),
  variants: {
    status: {
      active: 'ml-2 opacity-100',
    },
  },
})
export interface ITocItem {
  depth: number
  title: string
  anchorId: string
  index: number

  $heading: HTMLHeadingElement
}

export const TocItem: FC<{
  heading: ITocItem

  active: boolean
  rootDepth: number
  onClick?: (i: number, $el: HTMLElement | null, anchorId: string) => void
}> = memo((props) => {
  const { active, rootDepth, onClick, heading } = props
  const { $heading, anchorId, depth, index, title } = heading

  const $ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (active) {
      $ref.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const renderDepth = useMemo(() => {
    const result = depth - rootDepth

    return result
  }, [depth, rootDepth])

  return (
    <a
      ref={$ref}
      data-index={index}
      href={`#${anchorId}`}
      className={clsxm(
        styles({
          status: active ? 'active' : undefined,
        }),
      )}
      style={useMemo(
        () => ({
          paddingLeft:
            depth >= rootDepth ? `${renderDepth * 0.6 + 0.5}rem` : '0.5rem',
        }),
        [depth, renderDepth, rootDepth],
      )}
      data-depth={depth}
      onClick={useCallback(
        (e: MouseEvent) => {
          e.preventDefault()

          onClick?.(index, $heading, anchorId)
        },
        [onClick, index, $heading, anchorId],
      )}
      title={title}
    >
      <span className="cursor-pointer">{title}</span>
    </a>
  )
})

TocItem.displayName = 'TocItem'
