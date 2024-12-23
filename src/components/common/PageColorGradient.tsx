import 'server-only'

import chroma from 'chroma-js'
import Color from 'colorjs.io'
import type { FC } from 'react'

import { hexToRgbString } from '~/lib/color'
import {
  getBackgroundGradientByBaseColor,
  getBackgroundGradientBySeed,
} from '~/lib/helper.server'
import { createPngNoiseBackground } from '~/lib/noise'

import { RootPortal } from '../ui/portal'

const hexToOklchString = (hex: string) => new Color(hex).oklch
const lightBg = 'rgb(250, 250, 250)'
const darkBg = 'rgb(0, 2, 18)'
export const PageColorGradient: FC<{
  seed?: string
  baseColor?: string
}> = async ({ seed, baseColor }) => {
  const [bgAccent, bgAccentLight] = baseColor
    ? getBackgroundGradientByBaseColor(baseColor)
    : getBackgroundGradientBySeed(seed!)

  const oklch = hexToOklchString(bgAccent)

  const [hl, sl, ll] = oklch

  return (
    <>
      <RootPortal>
        <div
          style={
            {
              '--gradient-from': hexToRgbString(bgAccent),
              '--gradient-to': hexToRgbString(bgAccentLight),
            } as any
          }
          className="page-head-gradient"
        />
      </RootPortal>
      <style
        id="accent-color-style"
        dangerouslySetInnerHTML={{
          __html: `
        html.themed[data-theme='light'].noise body::before, html.themed[data-theme='dark'].noise body::before  {
          background-image: ${await createPngNoiseBackground(bgAccent)}
        }
        html.themed[data-theme='light'], html.themed[data-theme='dark'] {
          --a: ${`${hl} ${sl} ${ll}`};
        }
        html.themed {
         --root-bg: ${chroma.mix(lightBg, bgAccent, 0.05, 'rgb').hex()};
        }
        html.themed[data-theme='dark'] {
          --root-bg: ${chroma.mix(darkBg, bgAccent, 0.12, 'rgb').hex()};
        }
        `,
        }}
      />
    </>
  )
}
