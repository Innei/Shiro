import { useEffect, useRef, useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import type { AccentColor } from '~/app/config'
import type { PropsWithChildren } from 'react'

import { generateTransitionColors, hexToHsl } from '~/lib/color'
import { noopObj } from '~/lib/noop'

import { useAppConfigSelector } from './aggregation-data-provider'

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
  const { light, dark } =
    useAppConfigSelector((config) => config.color) || (noopObj as AccentColor)

  const Length = Math.max(light?.length ?? 0, dark?.length ?? 0)
  const randomSeedRef = useRef((Math.random() * Length) | 0)

  const lightColors = light ?? accentColorLight
  const darkColors = dark ?? accentColorDark
  const currentAccentColorLRef = useRef(lightColors[randomSeedRef.current])
  const currentAccentColorDRef = useRef(darkColors[randomSeedRef.current])

  const [u, update] = useState(0)
  useEffect(() => {
    const $style = document.createElement('style')

    const $originColor = document.getElementById('accent-color-style')

    const nextSeed = (randomSeedRef.current + 1) % Length
    const nextColorD = darkColors[nextSeed]
    const nextColorL = lightColors[nextSeed]
    const STEP = 60
    const INTERVAL = 100
    const colorsD = generateTransitionColors(
      currentAccentColorDRef.current,
      nextColorD,
      STEP,
    )
    const colorsL = generateTransitionColors(
      currentAccentColorLRef.current,
      nextColorL,
      STEP,
    )

    const timer = setTimeout(function updateAccent() {
      const colorD = colorsD.shift()
      const colorL = colorsL.shift()
      if (colorD && colorL) {
        currentAccentColorDRef.current = colorD
        currentAccentColorLRef.current = colorL
        setTimeout(updateAccent, INTERVAL)
      } else {
        randomSeedRef.current = nextSeed
        currentAccentColorDRef.current = nextColorD
        currentAccentColorLRef.current = nextColorL
        update(u + 1)
      }

      const lightHsl = hexToHsl(currentAccentColorLRef.current)
      const darkHsl = hexToHsl(currentAccentColorDRef.current)

      const [hl, sl, ll] = lightHsl
      const [hd, sd, ld] = darkHsl

      $style.innerHTML = `html[data-theme='light'] {
          --a: ${`${hl} ${sl}% ${ll}%`};
          --af: ${`${hl} ${sl}% ${ll + 6}%`};
        }
        html[data-theme='dark'] {
          --a: ${`${hd} ${sd}% ${ld}%`};
          --af: ${`${hd} ${sd}% ${ld - 6}%`};
        }
        `
    }, INTERVAL)
    document.head.appendChild($style)
    // FIXME  should remove origin color, if not will not override origin color
    $originColor?.remove()
    return () => {
      clearTimeout(timer)

      setTimeout(() => {
        document.head.removeChild($style)
      }, 1000)
    }
  }, [Length, darkColors, lightColors, u])

  useServerInsertedHTML(() => {
    const lightHsl = hexToHsl(currentAccentColorLRef.current)
    const darkHsl = hexToHsl(currentAccentColorDRef.current)

    const [hl, sl, ll] = lightHsl
    const [hd, sd, ld] = darkHsl

    return (
      <style
        id="accent-color-style"
        data-light={currentAccentColorLRef.current}
        data-dark={currentAccentColorDRef.current}
        dangerouslySetInnerHTML={{
          __html: `html[data-theme='light'] {
          --a: ${`${hl} ${sl}% ${ll}%`};
          --af: ${`${hl} ${sl}% ${ll + 6}%`};
        }
        html[data-theme='dark'] {
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
