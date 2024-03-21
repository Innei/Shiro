import { forwardRef } from 'react'
import clsx from 'clsx'

export const Spinner = forwardRef<
  HTMLDivElement,
  {
    size?: number
    className?: string
  }
>(({ className, size }, ref) => {
  return (
    <div className={className} ref={ref}>
      <div
        className="loading loading-dots"
        style={{
          width: size || '2rem',
          height: size || '2rem',
        }}
      />
    </div>
  )
})

Spinner.displayName = 'Spinner'

export const AbsoluteCenterSpinner: Component = ({ children, className }) => {
  return (
    <div
      className={clsx(
        'inset-0 z-10 flex flex-col items-center justify-center gap-6',
        className,
      )}
    >
      <Spinner />
      {children}
    </div>
  )
}
