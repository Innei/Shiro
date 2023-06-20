/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx'
import Link from 'next/link'
import { tv } from 'tailwind-variants'

import { MotionButtonBase } from './MotionButton'

const variantStyles = tv({
  base: 'inline-flex items-center gap-2 justify-center rounded-lg py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
  variants: {
    variant: {
      primary: clsx(
        'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 dark:text-black dark:hover:bg-zinc-300',
        'active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-200 dark:active:bg-zinc-300/70',
        'font-semibold',
        'disabled:bg-gray-400 disabled:opacity-30 disabled:dark:bg-gray-800 disabled:dark:text-slate-50 disabled:cursor-not-allowed',
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
}
type ButtonProps = SharedProps & (NativeButtonProps | NativeLinkProps)
export function StyledButton({
  variant = 'primary',
  className,
  href,
  ...props
}: ButtonProps) {
  return href ? (
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
  )
}
