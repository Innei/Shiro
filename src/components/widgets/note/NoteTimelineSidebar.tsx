import { OnlyLg } from '~/components/ui/viewport/OnlyLg'
import { clsxm } from '~/utils/helper'

import { NoteTimeline } from './NoteTimeline'
import { NoteTopicInfo } from './NoteTopicInfo'

export const NoteTimelineSidebar: Component = ({ className }) => {
  return (
    <div className={clsxm(className)}>
      <OnlyLg>
        <NoteTimeline />

        <NoteTopicInfo />
      </OnlyLg>
    </div>
  )
}
