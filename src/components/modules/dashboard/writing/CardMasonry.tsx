'use client'

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'

import { useMaskScrollArea } from '~/hooks/shared/use-mask-scrollarea'
import { clsxm } from '~/lib/helper'

const columnsCountBreakPoints = {
  0: 1,
  600: 2,
  1024: 3,
  1280: 3,
}

export interface CardProps<T> {
  title: ReactNode
  description: ReactNode

  data?: T
  slots?: Partial<{
    right: (data?: T) => ReactNode
    middle: (data?: T) => ReactNode
    footer: (data?: T) => ReactNode
  }>

  children?: ReactNode

  className?: string
}
export interface CardMasonryProps<T> {
  data: T[]

  children: (data: T) => ReactNode
}
export const CardMasonry = <T,>(props: CardMasonryProps<T>) => {
  return (
    <div className="m-auto max-w-[1200px]">
      <ResponsiveMasonry columnsCountBreakPoints={columnsCountBreakPoints}>
        <Masonry gutter="24px">
          {props.data.map((data) => props.children(data))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  )
}

export function Card<T>(props: CardProps<T>) {
  const [scrollContainerRef, scrollClassname] =
    useMaskScrollArea<HTMLDivElement>()

  const { slots, className, title, description, children, data } = props

  return (
    <div
      className={clsxm(
        'relative flex h-[176px] flex-col rounded-md bg-white px-4 py-5 duration-200 card-shadow dark:bg-neutral-950 dark:hover:ring-1 dark:hover:ring-zinc-300',
        className,
      )}
    >
      <div className="flex grow flex-col">
        <div className="line-clamp-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </div>
        {slots?.middle && (
          <div className="mt-2 text-sm text-neutral-800 dark:text-neutral-300">
            {slots.middle?.(data)}
          </div>
        )}
        <div
          className={clsx(
            'mt-2 h-0 grow overflow-hidden text-sm text-neutral-500 scrollbar-none dark:text-neutral-400',
            scrollClassname,
          )}
          ref={scrollContainerRef}
        >
          {description}
        </div>

        {slots?.footer && (
          <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            {slots.footer?.(data)}
          </div>
        )}
      </div>
      {slots?.right?.(data)}
    </div>
  )
}
