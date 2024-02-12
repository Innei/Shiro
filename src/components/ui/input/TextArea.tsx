import { forwardRef, useCallback } from 'react'
import { m, useMotionTemplate, useMotionValue } from 'framer-motion'
import type {
  DetailedHTMLProps,
  PropsWithChildren,
  TextareaHTMLAttributes,
} from 'react'

import { useIsMobile } from '~/atoms/hooks'
import { useInputComposition } from '~/hooks/common/use-input-composition'
import { clsxm } from '~/lib/helper'

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > &
    PropsWithChildren<{
      wrapperClassName?: string
    }>
>((props, ref) => {
  const { className, wrapperClassName, children, ...rest } = props
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
  const background = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, var(--spotlight-color) 0%, transparent 85%)`
  const isMobile = useIsMobile()
  const inputProps = useInputComposition(props)
  return (
    <div
      className={clsxm(
        'group relative h-full overflow-hidden [--spotlight-color:oklch(var(--a)_/_0.12)]',
        wrapperClassName,
      )}
      onMouseMove={handleMouseMove}
    >
      {!isMobile && (
        <m.div
          className="pointer-events-none absolute bottom-[-150px] left-0 right-0 top-0 z-0 rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background }}
          aria-hidden="true"
        />
      )}
      <textarea
        ref={ref}
        className={clsxm(
          'h-full w-full resize-none bg-transparent',
          'overflow-auto px-3 py-4',
          'text-neutral-900/80 dark:text-slate-100/80',
          className,
        )}
        {...rest}
        {...inputProps}
      />

      {children}
    </div>
  )
})
TextArea.displayName = 'TextArea'
