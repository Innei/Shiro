import type { FC } from 'react'
import React from 'react'

import {
  FaSolidAngry,
  FaSolidFlushed,
  FaSolidFrownOpen,
  FaSolidGrimace,
  FaSolidGrinSquintTears,
  FaSolidMeh,
  FaSolidSadCry,
  FaSolidSadTear,
  FaSolidSmile,
  FaSolidTired,
} from '~/components/ui/Icons/emoji'
import { PhSunBold } from '~/components/ui/Icons/layout'
import {
  BiCloudLightningRainFill,
  BiCloudRainFill,
  MdiCloud,
  MdiSnowflake,
  RiSunCloudyFill,
} from '~/components/ui/Icons/weather'

export const weather2icon = (weather: string) => {
  const map: Record<string, FC> = {
    晴: PhSunBold,
    多云: RiSunCloudyFill,
    阴: MdiCloud,
    雪: MdiSnowflake,
    雨: BiCloudRainFill,
    雷雨: BiCloudLightningRainFill,
  }
  return React.createElement(map[weather] || PhSunBold)
}

export const mood2icon = (mood: string) => {
  const map: Record<string, FC> = {
    开心: FaSolidSmile,
    伤心: FaSolidSadTear,
    大哭: FaSolidSadCry,
    生气: FaSolidAngry,
    痛苦: FaSolidTired,
    悲哀: FaSolidMeh,
    不快: FaSolidMeh,
    激动: FaSolidGrinSquintTears,
    担心: FaSolidFrownOpen,
    可怕: FaSolidGrimace,
    可恶: FaSolidAngry,
    绝望: FaSolidFrownOpen,
    焦虑: FaSolidFlushed,
  }
  return React.createElement(map[mood] || FaSolidSmile)
}
