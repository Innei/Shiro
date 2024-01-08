import type { NoteDto, PostDto } from '~/models/writing'

import { EmitKeyMap } from '~/constants/keys'

export class PublishEvent extends Event {
  static readonly type = EmitKeyMap.Publish
  constructor(public readonly data: NoteDto | PostDto) {
    super(EmitKeyMap.Publish)
  }
}
