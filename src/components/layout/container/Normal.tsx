import { clsxm } from '~/utils/helper'

import { HeaderHideBg } from '../header/hooks'

export const NormalContainer: Component = (props) => {
  const { children, className } = props

  return (
    <div
      className={clsxm(
        'mx-auto mt-12 max-w-3xl px-2 lg:px-0 2xl:max-w-4xl',
        className,
      )}
    >
      {children}

      <HeaderHideBg />
    </div>
  )
}
