import { EmitKeyMap } from '~/constants/keys'

export class RefetchEvent extends Event {
  static readonly type = EmitKeyMap.Refetch
  constructor() {
    super(EmitKeyMap.Refetch)
  }
}
