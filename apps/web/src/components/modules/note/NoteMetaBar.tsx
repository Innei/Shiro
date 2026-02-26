'use client'

import { useTranslations } from 'next-intl'

import { CreativeCommonsIcon } from '~/components/icons/cc'
import { DividerVertical } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import {
  getMoodLabel,
  getWeatherLabel,
  mood2icon,
  weather2icon,
} from '~/lib/meta-icon'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

const dividerVertical = <DividerVertical className="mx-2! scale-y-50" />

const sectionBlockClassName = 'flex items-center space-x-1 shrink-0'
export const NoteMetaBar = () => (
  <>
    <NoteMetaWeather />
    <NoteMetaMood />
    <NoteMetaReadCount />
    <NoteMetaLikeCount />
    <NoteMetaCC />
  </>
)

export const NoteMetaWeather = () => {
  const weather = useCurrentNoteDataSelector((data) => data?.data.weather)
  const t = useTranslations('common')
  if (!weather) return null
  return (
    <>
      {dividerVertical}
      <span className={sectionBlockClassName} key="weather">
        {weather2icon(weather)}
        <span className="font-medium">{getWeatherLabel(weather, t)}</span>
      </span>
    </>
  )
}

export const NoteMetaMood = () => {
  const mood = useCurrentNoteDataSelector((data) => data?.data.mood)
  const t = useTranslations('common')

  if (!mood) return null
  return (
    <>
      {dividerVertical}
      <span className={sectionBlockClassName} key="mood">
        {mood2icon(mood)}
        <span className="font-medium">{getMoodLabel(mood, t)}</span>
      </span>
    </>
  )
}

export const NoteMetaReadCount = () => {
  const read = useCurrentNoteDataSelector((data) => data?.data.count.read)
  if (!read) return null
  return (
    <>
      {dividerVertical}
      <span className={sectionBlockClassName} key="readcount">
        <i className="i-mingcute-book-6-line" />

        <span className="font-medium">
          <NumberSmoothTransition>{read}</NumberSmoothTransition>
        </span>
      </span>
    </>
  )
}

export const NoteMetaLikeCount = () => {
  const like = useCurrentNoteDataSelector((data) => data?.data.count.like)
  if (!like) return null
  return (
    <>
      {dividerVertical}
      <span className={sectionBlockClassName} key="linkcount">
        <i className="i-mingcute-heart-line" />
        <span className="font-medium">
          <NumberSmoothTransition>{like}</NumberSmoothTransition>
        </span>
      </span>
    </>
  )
}

export const NoteMetaCC = () => (
  <>
    {dividerVertical}
    <span className="inline-flex items-center" key="cc">
      <FloatPopover
        asChild
        mobileAsSheet
        type="tooltip"
        triggerElement={
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
            target="_blank"
            className="inline-flex cursor-pointer items-center text-current"
            rel="noreferrer"
          >
            <CreativeCommonsIcon />
          </a>
        }
      >
        知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议
      </FloatPopover>
    </span>
  </>
)
