'use client'

import { CreativeCommonsIcon } from '~/components/icons/cc'
import { DividerVertical } from '~/components/ui/divider'
import { useCurrentNoteData } from '~/hooks/data/use-note'
import { mood2icon, weather2icon } from '~/lib/meta-icon'

const dividerVertical = <DividerVertical className="!mx-2 scale-y-50" />

const sectionBlockClassName = 'flex items-center space-x-1 flex-shrink-0'
export const NoteMetaBar = () => {
  const note = useCurrentNoteData()
  if (!note) return null
  const { weather, mood, count } = note
  return (
    <>
      <NoteMetaWeather weather={weather} />
      <NoteMetaMood mood={mood} />
      <NoteMetaReadCount read={count.read} />
      <NoteMetaLikeCount like={count.like} />
      <NoteMetaCC />
    </>
  )
}

export const NoteMetaWeather = ({ weather }: { weather?: string }) => {
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

export const NoteMetaMood = ({ mood }: { mood?: string }) => {
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

export const NoteMetaReadCount = ({ read }: { read?: number }) => {
  if (!read) return null
  return (
    <>
      {dividerVertical}
      <span className={sectionBlockClassName} key="readcount">
        <i className="icon-[mingcute--book-6-line]" />
        <span className="font-medium">{read}</span>
      </span>
    </>
  )
}

export const NoteMetaLikeCount = ({ like }: { like?: number }) => {
  if (!like) return null
  return (
    <>
      {dividerVertical}
      <span className={sectionBlockClassName} key="linkcount">
        <i className="icon-[mingcute--heart-line]" />
        <span className="font-medium">{like}</span>
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
          href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
          target="_blank"
          className="inline-flex cursor-pointer items-center text-current"
        >
          <span
            title="创作共用保留署名-非商业-禁止演绎4.0国际许可证"
            className="inline-flex items-center"
          >
            <CreativeCommonsIcon />
          </span>
        </a>
      </span>
    </>
  )
}
