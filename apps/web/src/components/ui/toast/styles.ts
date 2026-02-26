import clsx from 'clsx'

export const toastStyles = {
  toast: clsx(
    'group relative flex w-full items-center gap-4 rounded-xl p-4',
    'border-[0.5px] border-zinc-900/40 bg-base-100',
    'shadow-[0_8px_16px_-4px_rgba(0,0,0,0.08)]', // Lighter shadow for light mode
    'dark:border-zinc-700/60 dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.4)]', // Stronger shadow/border for dark mode
    'min-w-[320px] max-w-md',
  ),
  title: 'text-base font-medium text-base-content',
  description: 'text-sm text-base-content/60 mt-1',
  content: 'flex min-w-0 flex-1 flex-col justify-center',
  icon: clsx(
    'relative flex size-10 shrink-0 items-center justify-center rounded-full',
    // Success - Green
    '[li[data-type="success"]_&]:bg-green-100 [li[data-type="success"]_&]:text-green-600',
    '[li[data-type="success"]_&]:dark:bg-green-500/15 [li[data-type="success"]_&]:dark:text-green-400',

    // Error - Red
    '[li[data-type="error"]_&]:bg-red-100 [li[data-type="error"]_&]:text-red-600',
    '[li[data-type="error"]_&]:dark:bg-red-500/15 [li[data-type="error"]_&]:dark:text-red-400',

    // Warning - Orange
    '[li[data-type="warning"]_&]:bg-orange-100 [li[data-type="warning"]_&]:text-orange-600',
    '[li[data-type="warning"]_&]:dark:bg-orange-500/15 [li[data-type="warning"]_&]:dark:text-orange-400',

    // Info - Blue
    '[li[data-type="info"]_&]:bg-blue-100 [li[data-type="info"]_&]:text-blue-600',
    '[li[data-type="info"]_&]:dark:bg-blue-500/15 [li[data-type="info"]_&]:dark:text-blue-400',

    // Icon Size wrapper for the inner icon
    '[&>i]:text-xl',
  ),
  actionButton: clsx(
    'h-8 shrink-0 rounded-lg px-3 text-xs font-semibold',
    'transition-all duration-200',
    'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90',
    'dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200',
  ),
  cancelButton: clsx(
    'h-8 rounded-lg px-3 text-xs font-medium',
    'border-border border bg-base-100 text-base-content/80',
    'hover:bg-zinc-100 hover:text-base-content dark:hover:bg-zinc-800',
    'transition-colors duration-200',
  ),
  closeButton: clsx(
    'absolute right-4 top-4 rounded-md p-1',
    'text-base-content/40 hover:bg-zinc-100 hover:text-base-content dark:hover:bg-zinc-800',
    'transition-all duration-200',
    'opacity-0 group-hover:opacity-100',
  ),
}
