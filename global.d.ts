import type { FC, PropsWithChildren } from 'react'

declare global {
  export type NextPageParams<P extends {}, Props = {}> = PropsWithChildren<
    {
      params: P
    } & Props
  >

  export type Component<P = {}> = FC<
    {
      className?: string
    } & P &
      PropsWithChildren
  >

  // TODO should remove in next TypeScript version
  interface Document {
    startViewTransition(callback?: () => void | Promise<void>): ViewTransition
  }

  interface ViewTransition {
    finished: Promise<void>
    ready: Promise<void>
    updateCallbackDone: () => void
    skipTransition(): void
  }

  declare module 'react' {
    export interface HTMLAttributes<T>
      extends AriaAttributes,
        DOMAttributes<T> {
      'data-hide-print'?: boolean
      'data-testid'?: string
    }
  }
}

export {}

declare module '@mx-space/api-client' {
  export interface PostMeta {
    style?: string
    cover?: string
    banner?: string | { type: string; message: string }
  }
  interface TextBaseModel extends BaseCommentIndexModel {
    meta?: PostMeta
  }

  interface AggregateTopNote {
    meta?: PostMeta
  }

  interface AggregateTopPost {
    meta?: PostMeta
  }
}

export {}
