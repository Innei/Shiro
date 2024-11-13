'use client'

import clsx from 'clsx'
import { m, useMotionTemplate, useMotionValue } from 'motion/react'
import type {
  DetailedHTMLProps,
  PropsWithChildren,
  TextareaHTMLAttributes,
} from 'react'
import { forwardRef, useCallback, useState } from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { useInputComposition } from '~/hooks/common/use-input-composition'
import { clsxm } from '~/lib/helper'

const roundedMap = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  default: 'rounded',
}
export const TextArea = forwardRef<
  HTMLTextAreaElement,
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > &
    PropsWithChildren<{
      wrapperClassName?: string
      onCmdEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
      rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'default'
      bordered?: boolean
    }>
>((props, ref) => {
  const {
    className,
    wrapperClassName,
    children,
    rounded = 'xl',
    bordered = true,
    onCmdEnter,
    onKeyDown,
    ...rest
  } = props
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const handleMouseMove = useCallback(
    ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const bounds = currentTarget.getBoundingClientRect()
      mouseX.set(clientX - bounds.left)
      mouseY.set(clientY - bounds.top)
    },
    [mouseX, mouseY],
  )
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        onCmdEnter?.(e)
      }
      onKeyDown?.(e)
    },
    [onCmdEnter, onKeyDown],
  )
  const background = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 85%)`
  const isMobile = useIsMobile()
  const inputProps = useInputComposition(
    Object.assign({}, props, { onKeyDown: handleKeyDown }),
  )
  const [isFocus, setIsFocus] = useState(false)
  return (
    <div
      className={clsxm(
        'group relative h-full border ring-0 ring-accent/20 duration-200 [--spotlight-color:oklch(var(--a)_/_0.12)]',
        roundedMap[rounded],

        'border-transparent',
        isFocus && 'border-accent/80 bg-accent/5 ring-2',
        // 'bg-gray-200/50 dark:bg-zinc-800/50',
        'dark:text-zinc-200 dark:placeholder:text-zinc-500',
        wrapperClassName,
      )}
      onMouseMove={handleMouseMove}
    >
      {!isMobile && (
        <m.div
          className={clsx(
            'pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100',
            roundedMap[rounded],
          )}
          style={{ background }}
          aria-hidden="true"
        />
      )}

      {bordered && (
        <div
          className={clsx(
            'border-border pointer-events-none absolute inset-0 z-0 border',
            roundedMap[rounded],
          )}
          aria-hidden="true"
        />
      )}
      <textarea
        ref={ref}
        className={clsxm(
          'size-full resize-none bg-transparent',
          'overflow-auto px-3 py-4',
          '!outline-none',
          'text-neutral-900/80 dark:text-slate-100/80',
          roundedMap[rounded],
          className,
        )}
        {...rest}
        onFocus={(e) => {
          setIsFocus(true)
          rest.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocus(false)
          rest.onBlur?.(e)
        }}
        {...inputProps}
      />

      {children}
    </div>
  )
})
TextArea.displayName = 'TextArea'
