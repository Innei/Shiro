import { EmitKeyMap } from '~/constants/keys'
import type { NoteDto, PostDto } from '~/models/writing'

export class WriteEditEvent extends Event {
  static readonly type = EmitKeyMap.EditDataUpdate
  constructor(public readonly data: NoteDto | PostDto) {
    super(EmitKeyMap.EditDataUpdate)
  }
}
