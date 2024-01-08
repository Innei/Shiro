import { memo, useMemo } from 'react'

import { useIsDark } from '~/hooks/common/use-is-dark'
import { addAlphaToHSL, getColorScheme, stringToHue } from '~/lib/color'
import { clsxm } from '~/lib/helper'

import { MotionButtonBase } from '../button'

export const Tag = memo(function Tag<T>(props: {
  onClick?: (passProps?: T) => void
  text: string
  passProps?: T
  count?: number

  className?: string
}) {
  const { text, count, passProps, onClick, className } = props
  const { dark, light } = useMemo(
    () => getColorScheme(stringToHue(text)),
    [text],
  )
  const isDark = useIsDark()

  const bgColor = isDark ? dark.background : light.background
  const Tag = onClick ? MotionButtonBase : 'span'
  return (
    <Tag
      onClick={() => {
        onClick?.(passProps)
      }}
      key={text}
      className={clsxm(
        'inline-block space-x-1 rounded-md px-3 py-2',
        className,
      )}
      style={{
        backgroundColor: addAlphaToHSL(bgColor, 0.7),
      }}
    >
      <span>{text}</span>
      {!!count && <span className="self-end text-xs">({count})</span>}
    </Tag>
  )
})
