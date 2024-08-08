import type React from 'react'

import { clsxm } from '~/lib/helper'

export const TwoColumnLayout = ({
  children,
  leftContainerClassName,
  rightContainerClassName,
  className,
}: {
  children:
    | [React.ReactNode, React.ReactNode]
    | [React.ReactNode, React.ReactNode, React.ReactNode]

  leftContainerClassName?: string
  rightContainerClassName?: string
  className?: string
}) => (
  <div
    className={clsxm(
      'relative mx-auto block size-full min-w-0 max-w-[1800px] flex-col flex-wrap items-center lg:flex lg:flex-row',
      className,
    )}
  >
    {children.slice(0, 2).map((child, i) => (
      <div
        key={i}
        className={clsxm(
          'center flex w-full flex-col lg:h-auto lg:w-1/2',

          i === 0 ? leftContainerClassName : rightContainerClassName,
        )}
      >
        <div className="relative max-w-full lg:max-w-2xl">{child}</div>
      </div>
    ))}

    {children[2]}
  </div>
)
