import type { FC } from 'react'
import * as React from 'react'

import { PhSunBold } from '~/components/icons/appearance'
import {
  EmojiAngry,
  EmojiFlushed,
  EmojiFrownOpen,
  EmojiGrimace,
  EmojiGrinSquintTears,
  EmojiMeh,
  EmojiSadCry,
  EmojiSadTear,
  EmojiSmile,
  EmojiTired,
} from '~/components/icons/emoji'
import {
  BiCloudLightningRainFill,
  BiCloudRainFill,
  MdiCloud,
  MdiSnowflake,
  RiSunCloudyFill,
} from '~/components/icons/weather'

// 图标映射 - key 是后端返回的中文值
const weatherIconMap: Record<string, FC> = {
  晴: PhSunBold,
  多云: RiSunCloudyFill,
  阴: MdiCloud,
  雪: MdiSnowflake,
  雨: BiCloudRainFill,
  雷雨: BiCloudLightningRainFill,
}

const moodIconMap: Record<string, FC> = {
  开心: EmojiSmile,
  伤心: EmojiSadTear,
  大哭: EmojiSadCry,
  生气: EmojiAngry,
  痛苦: EmojiTired,
  悲哀: EmojiMeh,
  不快: EmojiMeh,
  激动: EmojiGrinSquintTears,
  担心: EmojiFrownOpen,
  可怕: EmojiGrimace,
  可恶: EmojiAngry,
  绝望: EmojiFrownOpen,
  焦虑: EmojiFlushed,
}

// 中文值到翻译 key 的映射
export const weatherTranslationKeyMap: Record<string, string> = {
  晴: 'weather_sunny',
  多云: 'weather_cloudy',
  阴: 'weather_overcast',
  雪: 'weather_snow',
  雨: 'weather_rain',
  雷雨: 'weather_thunderstorm',
}

export const moodTranslationKeyMap: Record<string, string> = {
  开心: 'mood_happy',
  伤心: 'mood_sad',
  大哭: 'mood_crying',
  生气: 'mood_angry',
  痛苦: 'mood_pain',
  悲哀: 'mood_sorrow',
  不快: 'mood_unhappy',
  激动: 'mood_excited',
  担心: 'mood_worried',
  可怕: 'mood_scary',
  可恶: 'mood_hateful',
  绝望: 'mood_despair',
  焦虑: 'mood_anxious',
}

export const weather2icon = (weather: string) => {
  return React.createElement(weatherIconMap[weather] || PhSunBold)
}

export const mood2icon = (mood: string) => {
  return React.createElement(moodIconMap[mood] || EmojiSmile)
}

export const getWeatherLabel = (
  weather: string,
  t: (key: string) => string,
) => {
  const key = weatherTranslationKeyMap[weather]
  return key ? t(key) : weather
}

export const getMoodLabel = (mood: string, t: (key: string) => string) => {
  const key = moodTranslationKeyMap[mood]
  return key ? t(key) : mood
}
