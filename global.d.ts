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
