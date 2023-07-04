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

    const lightHsl = hexToHsl(accentColorL)
    const darkHsl = hexToHsl(accentColorD)

    const [hl, sl, ll] = lightHsl
    const [hd, sd, ld] = darkHsl

    return (
      <style
        dangerouslySetInnerHTML={{
          __html: `html[data-theme='dark'] {
          --a: ${`${hl} ${sl}% ${ll}%`};
          --af: ${`${hl} ${sl}% ${ll + 6}%`};
        }
        html[data-theme='light'] {
          --a: ${`${hd} ${sd}% ${ld}%`};
          --af: ${`${hd} ${sd}% ${ld - 6}%`};
        }
        `,
        }}
      />
    )
  })

  return children
}
