import { clsxm } from '~/lib/helper'

export const WiderContainer: Component = (props) => {
  const { children, className } = props

  return (
    <div
      className={clsxm(
        'mx-auto mt-14 max-w-5xl px-2 lg:mt-[120px] lg:px-0 2xl:max-w-6xl',
        className,
      )}
    >
      {children}
    </div>
  )
}
