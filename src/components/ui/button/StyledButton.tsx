/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { tv } from 'tailwind-variants'
import type { FC, PropsWithChildren } from 'react'

import { MotionButtonBase } from './MotionButton'

const variantStyles = tv({
  base: 'inline-flex select-none cursor-default items-center gap-2 justify-center rounded-lg py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
  variants: {
    variant: {
      primary: clsx(
        'bg-accent text-zinc-100',
        'active:contrast-125 hover:contrast-[1.10]',
        'font-semibold',
        'disabled:bg-gray-400 disabled:opacity-30 disabled:dark:bg-gray-800 disabled:dark:text-slate-50 disabled:cursor-not-allowed',
        'dark:text-neutral-800',
      ),
      secondary: clsx(
        'group rounded-full bg-gradient-to-b from-zinc-50/50 to-white/90 px-3 py-2 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur transition dark:from-zinc-900/50 dark:to-zinc-800/90 dark:ring-white/10 dark:hover:ring-white/20',
        'disabled:bg-gray-400 disabled:opacity-30 disabled:dark:bg-gray-800 disabled:dark:text-slate-50 disabled:cursor-not-allowed',
      ),
    },
  },
})
type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
}
type NativeLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>
type SharedProps = {
  variant?: 'primary' | 'secondary'
  className?: string
  isLoading?: boolean
}
type ButtonProps = SharedProps & (NativeButtonProps | NativeLinkProps)

export const StyledButton: FC<ButtonProps> = ({
  variant = 'primary',
  className,
  isLoading,
  href,

  ...props
}) => {
  const Wrapper = isLoading ? LoadingButtonWrapper : Fragment
  return (
    <Wrapper>
      {href ? (
        <Link
          href={href}
          className={variantStyles({
            variant,
            className,
          })}
          {...(props as any)}
        />
      ) : (
        <MotionButtonBase
          className={variantStyles({
            variant,
            className,
          })}
          {...(props as any)}
        />
      )}
    </Wrapper>
  )
}

const LoadingButtonWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative">
      {children}

      <div className="absolute inset-0 z-[1] flex items-center justify-center">
        <div className="loading loading-spinner h-5 w-5" />
      </div>
    </div>
  )
}
