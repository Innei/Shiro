import { OnlyDesktop } from '~/components/ui/viewport'

import { NoteTimeline } from './NoteTimeline'
import { NoteTopicInfo } from './NoteTopicInfo'

export const NoteLeftSidebar: Component = ({ className }) => {
  return (
    <div className={className}>
      <OnlyDesktop>
        <div className="sticky top-20 mt-20">
          <NoteTimeline />

          <NoteTopicInfo />
        </div>
      </OnlyDesktop>
    </div>
  )
}
