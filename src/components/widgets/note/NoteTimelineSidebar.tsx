import { OnlyLg } from '~/components/ui/viewport'

import { NoteTimeline } from './NoteTimeline'
import { NoteTopicInfo } from './NoteTopicInfo'

export const NoteTimelineSidebar: Component = ({ className }) => {
  return (
    <div className={className}>
      <OnlyLg>
        <div className="sticky top-20 mt-20">
          <NoteTimeline />

          <NoteTopicInfo />
        </div>
      </OnlyLg>
    </div>
  )
}
