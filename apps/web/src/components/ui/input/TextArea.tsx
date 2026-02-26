'use client'

import clsx from 'clsx'
import { m, useMotionTemplate, useMotionValue } from 'motion/react'
import type {
  DetailedHTMLProps,
  PropsWithChildren,
  TextareaHTMLAttributes,
} from 'react'
import { useCallback, useState } from 'react'

import { useIsMobile } from '~/atoms/hooks/viewport'
import { useInputComposition } from '~/hooks/common/use-input-composition'
import { clsxm } from '~/lib/helper'

const roundedMap = {
  sm: 'rounded-xs',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  default: 'rounded',
}
export const TextArea = ({
  ref,
  ...props
}: DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> &
  PropsWithChildren<{
    wrapperClassName?: string
    onCmdEnter?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'default'
    bordered?: boolean
  }>) => {
  const {
    className,
    wrapperClassName,
    children,
    rounded = 'xl',
    bordered: _bordered = true,
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
        'group relative h-full border ring-accent/20 duration-200 [--spotlight-color:oklch(from_var(--color-accent)_l_c_h_/_0.12)]',
        roundedMap[rounded],

        'border-border',
        isFocus && 'border-accent/80! bg-accent/5! ring-2',
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

      <textarea
        ref={ref as any}
        className={clsxm(
          'size-full resize-none bg-transparent',
          'overflow-auto px-3 py-4',
          'focus:outline-hidden',
          'placeholder:text-zinc-400 dark:text-zinc-200 dark:placeholder:text-zinc-500',
          'font-sans',
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
}
TextArea.displayName = 'TextArea'
