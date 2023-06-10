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
}
export {}
