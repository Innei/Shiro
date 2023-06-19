/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import type { ReactNode } from 'react'

import { CreativeCommonsIcon } from '~/components/icons/cc'
import { DividerVertical } from '~/components/ui/divider'
import { useNoteData } from '~/hooks/data/use-note'
import { mood2icon, weather2icon } from '~/lib/meta-icon'

const dividerVertical = <DividerVertical className="!mx-2 scale-y-50" />
export const NoteMetaBar = () => {
  const note = useNoteData()
  if (!note) return null

  const children = [] as ReactNode[]

  if (note.weather) {
    children.push(
      dividerVertical,
      <span className="inline-flex items-center space-x-1" key="weather">
        {weather2icon(note.weather)}
        <span className="font-medium">{note.weather}</span>
      </span>,
    )
  }

  if (note.mood) {
    children.push(
      dividerVertical,
      <span className="inline-flex items-center space-x-1" key="mood">
        {mood2icon(note.mood)}
        <span className="font-medium">{note.mood}</span>
      </span>,
    )
  }

  if (note.count.read > 0) {
    children.push(
      dividerVertical,
      <span className="inline-flex items-center space-x-1" key="readcount">
        <i className="icon-[mingcute--book-6-line]" />
        <span className="font-medium">{note.count.read}</span>
      </span>,
    )
  }

  if (note.count.like > 0) {
    children.push(
      dividerVertical,
      <span className="inline-flex items-center space-x-1" key="linkcount">
        <i className="icon-[mingcute--heart-line]" />
        <span className="font-medium">{note.count.like}</span>
      </span>,
    )
  }

  children.push(
    dividerVertical,
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
    </span>,
  )

  return children
}
