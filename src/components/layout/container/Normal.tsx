import { clsxm } from '~/lib/helper'

import { HeaderHideBg } from '../header/hooks'

export const NormalContainer: Component = (props) => {
  const { children, className } = props

  return (
    <div
      className={clsxm(
        'mx-auto mt-14 max-w-3xl px-2 lg:mt-[120px] lg:px-0 2xl:max-w-4xl',
        className,
      )}
    >
      {children}

      <HeaderHideBg />
    </div>
  )
}
