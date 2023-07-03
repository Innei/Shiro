import { useServerInsertedHTML } from 'next/navigation'
import type { PropsWithChildren } from 'react'

import { sample } from '~/lib/_'
import { hexToHsl } from '~/lib/color'

const accentColorLight = [
  // 浅葱
  '#33A6B8',

  '#FF6666',
  '#26A69A',
  '#fb7287',
  '#69a6cc',
]
const accentColorDark = [
  // 桃
  '#F596AA',

  '#A0A7D4',
  '#ff7b7b',
  '#99D8CF',
  '#838BC6',
]
export const AccentColorProvider = ({ children }: PropsWithChildren) => {
  useServerInsertedHTML(() => {
    const accentColorL = sample(accentColorLight)
    const accentColorD = sample(accentColorDark)

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `html[data-theme='dark'] {
          --a: ${hexToHsl(accentColorD)};
        }
        html[data-theme='light'] {
          --a: ${hexToHsl(accentColorL)};
        }
        `,
        }}
      />
    )
  })

  return children
}
