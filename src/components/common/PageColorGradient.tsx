import 'server-only'

import Color from 'colorjs.io'
import type { FC } from 'react'

import { hexToRgbString } from '~/lib/color'
import { getBackgroundGradient } from '~/lib/helper.server'
import { createPngNoiseBackground } from '~/lib/noise'

import { RootPortal } from '../ui/portal'

const hexToOklchString = (hex: string) => {
  return new Color(hex).oklch
}

export const PageColorGradient: FC<{
  seed: string
}> = async ({ seed }) => {
  const [bgAccent, bgAccentLight] = getBackgroundGradient(seed)

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
        }`,
        }}
      />
    </>
  )
}
