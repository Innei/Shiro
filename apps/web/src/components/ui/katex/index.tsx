import katex from 'katex'
import type { FC } from 'react'
import { useMemo } from 'react'

type KateXProps = {
  children: string
  mode?: string // If `display` the math will be rendered in display mode. Otherwise the math will be rendered in inline mode.
}

export const KateX: FC<KateXProps> = (props) => {
  const { children, mode } = props

  const displayMode = mode === 'display'

  const throwOnError = false // render unsupported commands as text instead of throwing a `ParseError`

  return (
    <span
      dangerouslySetInnerHTML={useMemo(
        () => ({
          __html: katex.renderToString(children, {
            displayMode,
            throwOnError,
          }),
        }),
        [children, displayMode, throwOnError],
      )}
    />
  )
}
