import { NoteTimeline } from './NoteTimeline'
import { NoteTopicInfo } from './NoteTopicInfo'

// TODO hide if viewport width less than 768px
export const NoteTimelineSidebar = () => {
  return (
    <div className="absolute left-0">
      <NoteTimeline />

      <NoteTopicInfo />
    </div>
  )
}
