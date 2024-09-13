import { EmitKeyMap } from '~/constants/keys'
import type { NoteDto, PostDto } from '~/models/writing'

export class PublishEvent extends Event {
  static readonly type = EmitKeyMap.Publish
  constructor(public readonly data: NoteDto | PostDto) {
    super(EmitKeyMap.Publish)
  }
}
