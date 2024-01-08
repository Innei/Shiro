/* eslint-disable @typescript-eslint/no-namespace */
export namespace CrossBell {
  export interface CrossbellNote {
    characterId: number
    noteId: number
    linkItemType: null
    linkKey: string
    deleted: boolean
    locked: boolean
    contractAddress: string
    uri: string
    operator: string
    owner: string
    createdAt: string
    updatedAt: string
    deletedAt: null
    publishedAt: string
    transactionHash: string
    blockNumber: number
    logIndex: number
    updatedTransactionHash: string
    updatedBlockNumber: number
    updatedLogIndex: number
    metadata: Metadata
    toHeadCharacter: null
    toHeadNote: null
  }
  export interface Metadata {
    uri: string
    type: string
    content: Content
    status: string
  }
  export interface Content {
    tags: string[]
    title: string
    content: string
    sources: string[]
    attributes: AttributesItem[]
    external_urls: string[]
    date_published: string
  }
  export interface AttributesItem {
    value: string
    trait_type: string
  }
}
