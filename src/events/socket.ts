import { EmitKeyMap } from '~/constants/keys'

export class SocketConnectedEvent extends Event {
  static readonly type = EmitKeyMap.SocketConnected
  constructor() {
    super(EmitKeyMap.SocketConnected)
  }
}

export class SocketDisconnectedEvent extends Event {
  static readonly type = EmitKeyMap.SocketDisconnected
  constructor() {
    super(EmitKeyMap.SocketDisconnected)
  }
}
