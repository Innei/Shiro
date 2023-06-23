'use client'

import { OnlyDesktop } from '~/components/ui/viewport'

import { useNoteMainContainerHeight } from './NoteMainContainer'
import { NoteTimeline } from './NoteTimeline'
import { NoteTopicInfo } from './NoteTopicInfo'

export const NoteLeftSidebar: Component = ({ className }) => {
  return (
    <AutoHeightOptimize className={className}>
      <OnlyDesktop>
        <div className="sticky top-[120px] mt-[120px] min-h-[300px]">
          <NoteTimeline />

          <NoteTopicInfo />
        </div>
      </OnlyDesktop>
    </AutoHeightOptimize>
  )
}

const AutoHeightOptimize: Component = ({ children }) => {
  const mainContainerHeight = useNoteMainContainerHeight()
  return (
    <div
      style={{
        height: mainContainerHeight ? `${mainContainerHeight}px` : 'auto',
      }}
    >
      {children}
    </div>
  )
}
