'use client'

import Link from 'next/link'
import type { FC } from 'react'

import { Avatar } from '~/components/ui/avatar'
import { Divider } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

import { NoteTopicDetail } from './NoteTopicDetail'
import { NoteTopicMarkdownRender } from './NoteTopicMarkdownRender'

const textToBigCharOrWord = (name: string | undefined) => {
  if (!name) {
    return ''
  }
  const splitOnce = name.split(' ')[0]
  const bigChar = splitOnce.length > 4 ? name[0] : splitOnce
  return bigChar
}

export const NoteTopic: FC = () => {
  const topic = useCurrentNoteDataSelector((state) => state?.data.topic)

  if (!topic) return null
  const { icon, name, introduce } = topic

  return (
    <div data-hide-print>
      <div className="text-md">
        <strong>文章被专栏收录：</strong>
      </div>
      <Divider />
      <div className="flex items-center gap-4">
        <Avatar
          radius="full"
          size={60}
          imageUrl={icon}
          text={textToBigCharOrWord(name)}
          className="shrink-0"
          shadow={false}
          alt={`专栏 ${name} 的头像`}
        />
        <div className="flex grow flex-col self-start">
          <span className="text-md mb-2 font-medium">
            <FloatPopover
              strategy="absolute"
              triggerElement={
                <Link
                  href={routeBuilder(Routes.NoteTopic, {
                    slug: topic.slug,
                  })}
                >
                  <span>{name}</span>
                </Link>
              }
            >
              <NoteTopicDetail topic={topic} />
            </FloatPopover>
          </span>

          <div className="line-clamp-2 text-sm opacity-80">
            <NoteTopicMarkdownRender>{introduce}</NoteTopicMarkdownRender>
          </div>
        </div>
      </div>
    </div>
  )
}
