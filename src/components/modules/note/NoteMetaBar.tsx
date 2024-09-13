'use client'

import { CreativeCommonsIcon } from '~/components/icons/cc'
import { DividerVertical } from '~/components/ui/divider'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import { mood2icon, weather2icon } from '~/lib/meta-icon'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

const dividerVertical = <DividerVertical className="!mx-2 scale-y-50" />

const sectionBlockClassName = 'flex items-center space-x-1 flex-shrink-0'
export const NoteMetaBar = () => {
  return (
    <>
      <NoteMetaWeather />
      <NoteMetaMood />
      <NoteMetaReadCount />
      <NoteMetaLikeCount />
      <NoteMetaCC />
    </>
  )
}

export const NoteMetaWeather = () => {
  const weather = useCurrentNoteDataSelector((data) => data?.data.weather)
  if (!weather) return null
  return (
    <>
      {dividerVertical}
      <span className={sectionBlockClassName} key="weather">
        {weather2icon(weather)}
        <span className="font-medium">{weather}</span>
      </span>
    </>
  )
}

export const NoteMetaMood = () => {
  const mood = useCurrentNoteDataSelector((data) => data?.data.mood)

  if (!mood) return null
  return (
    <>
      {dividerVertical}
      <span className={sectionBlockClassName} key="mood">
        {mood2icon(mood)}
        <span className="font-medium">{mood}</span>
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
        <i className="icon-[mingcute--book-6-line]" />

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
        <i className="icon-[mingcute--heart-line]" />
        <span className="font-medium">
          <NumberSmoothTransition>{like}</NumberSmoothTransition>
        </span>
      </span>
    </>
  )
}

export const NoteMetaCC = () => {
  return (
    <>
      {dividerVertical}
      <span className="inline-flex items-center" key="cc">
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh"
          target="_blank"
          className="inline-flex cursor-pointer items-center text-current"
          rel="noreferrer"
        >
          <span
            title="知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议"
            className="inline-flex items-center"
          >
            <CreativeCommonsIcon />
          </span>
        </a>
      </span>
    </>
  )
}
