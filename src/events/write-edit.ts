import type { NoteDto, PostDto } from '~/models/writing'

import { EmitKeyMap } from '~/constants/keys'

export class WriteEditEvent extends Event {
  static readonly type = EmitKeyMap.EditDataUpdate
  constructor(public readonly data: NoteDto | PostDto) {
    super(EmitKeyMap.EditDataUpdate)
  }
}
