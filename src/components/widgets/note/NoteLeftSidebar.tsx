import { OnlyDesktop } from '~/components/ui/viewport'

import { NoteTimeline } from './NoteTimeline'
import { NoteTopicInfo } from './NoteTopicInfo'

export const NoteLeftSidebar: Component = ({ className }) => {
  return (
    <div className={className}>
      <OnlyDesktop>
        <div className="sticky top-[120px] mt-[120px]">
          <NoteTimeline />

          <NoteTopicInfo />
        </div>
      </OnlyDesktop>
    </div>
  )
}
