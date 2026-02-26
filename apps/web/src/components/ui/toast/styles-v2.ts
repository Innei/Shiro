import clsx from 'clsx'

export const toastStylesV2 = {
  toast: clsx(
    'group relative flex w-full items-center gap-3 rounded-xl px-4 py-3',
    // Glassmorphism background - light and airy
    'bg-white/75 backdrop-blur-xl',
    'dark:bg-zinc-900/75 dark:backdrop-blur-xl',
    // Subtle border for definition
    'ring-1 ring-black/[0.05] dark:ring-white/[0.1]',
    // Soft shadow
    'shadow-lg shadow-black/[0.08]',
    'dark:shadow-black/[0.3]',
    // Size
    'min-w-[280px] max-w-sm',
  ),
  title: clsx('text-sm font-medium', 'text-zinc-800 dark:text-zinc-100'),
  description: clsx('mt-0.5 text-xs', 'text-zinc-500 dark:text-zinc-400'),
  content: 'flex min-w-0 flex-1 flex-col justify-center',
  icon: clsx(
    'relative flex size-2 shrink-0 items-center justify-center rounded-full',
    // Pulse animation on mount
    'animate-[toast-dot-pulse_0.6s_ease-out]',
    // Success - Accent color
    '[li[data-type="success"]_&]:bg-accent',
    // Error - Red
    '[li[data-type="error"]_&]:bg-red-500',
    // Warning - Amber
    '[li[data-type="warning"]_&]:bg-amber-500',
    // Info - Accent color with opacity
    '[li[data-type="info"]_&]:bg-accent/80',
    // Loading - keep spinning icon behavior
    '[li[data-type="loading"]_&]:size-4 [li[data-type="loading"]_&]:bg-transparent',
    // Hide inner icon for dot types
    '[&>i]:hidden [li[data-type="loading"]_&_>i]:block [li[data-type="loading"]_&_>i]:text-accent',
  ),
  actionButton: clsx(
    'h-7 shrink-0 rounded-lg px-3 text-xs font-medium',
    'transition-all duration-200',
    'bg-zinc-800 text-white hover:bg-zinc-700',
    'dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
  ),
  cancelButton: clsx(
    'h-7 rounded-lg px-3 text-xs font-medium',
    'bg-zinc-100 text-zinc-600',
    'hover:bg-zinc-200',
    'dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700',
    'transition-colors duration-200',
  ),
  closeButton: clsx(
    'absolute -right-2 -top-2 rounded-full p-0.5',
    'bg-zinc-100 text-zinc-500',
    'hover:bg-zinc-200 hover:text-zinc-700',
    'dark:bg-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-600 dark:hover:text-zinc-200',
    'transition-all duration-200',
    'opacity-0 group-hover:opacity-100',
    'shadow-xs ring-1 ring-black/[0.05] dark:ring-white/[0.1]',
  ),
}

// CSS keyframes to be added
export const toastKeyframes = `
@keyframes toast-dot-pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.8);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
`
