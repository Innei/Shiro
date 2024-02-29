export const enum EmitKeyMap {
  EditDataUpdate = 'editDataUpdate',

  Publish = 'Publish',
  Refetch = 'Refetch',

  SocketConnected = 'SocketConnected',
  SocketDisconnected = 'SocketDisconnected',
}

export const CacheKeyMap = {
  RootData: 'root-data',
  AggregateTop: 'aggregate-top',
  PostListWithPage: (current: number) => CacheKeyMap.PostList + current,
  PostList: 'post-list:',
  Post: (id: string) => `post-${id}`,
}
