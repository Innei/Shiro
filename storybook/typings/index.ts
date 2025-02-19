import type * as React from 'react'

export interface DocumentComponent<T = unknown> extends React.FC<T> {
  meta?: Partial<{
    title?: string
    /**
     * @description Markdown support
     */
    description?: string
  }>
}

export interface DocumentPageMeta {
  title: string
  description?: string
}
