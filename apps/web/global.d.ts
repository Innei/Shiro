import type { FC, PropsWithChildren } from 'react'

import type { AiGenValueOrArray } from '~/components/modules/ai/ai-gen'

declare global {
  export type NextErrorProps = {
    reset(): void
    error: Error
  }
  export type NextPageParams<P extends {}, Props = {}> = PropsWithChildren<
    {
      params: Promise<P>
    } & Props
  >

  export type LocaleParams = {
    locale: string
  }

  export type NextPageExtractedParams<
    P extends {},
    Props = {},
  > = PropsWithChildren<
    {
      params: P
      locale: string
    } & Props
  >

  export type Component<P = {}> = FC<ComponentType & P>

  export type ComponentType<P = {}> = {
    className?: string
  } & PropsWithChildren &
    P

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
}

declare module 'react' {
  export interface AriaAttributes {
    'data-hide-print'?: boolean
    'data-event'?: string
    'data-testid'?: string
  }
}

declare module '@mx-space/api-client' {
  export interface BaseArticleMeta {
    /**
     * AI 参与声明：
     * - 无 AI (-1)：本文内容完全由作者独立创作，未使用任何 AI 辅助
     * - 辅助写作 (0)：AI 辅助构思/结构/表达，作者审阅修改
     * - 润色 (1)：AI 仅用于语言润色/语法调整
     * - 完全 (2)：内容主要由 AI 生成并由作者选择/编辑
     * - 故事整理 (3)：作者口述内容，AI 进行整理与润色后发布
     * - 标题生成 (4)：标题由 AI 生成或优化
     * - 校对 (5)：AI 协助校对文本，检查拼写、语法和逻辑问题
     * - 灵感提供 (6)：AI 提供创意灵感或写作思路
     * - 改写 (7)：AI 将内容改写成不同风格或语气
     * - AI 作图 (8)：文章中的图片、表格或流程图由 AI 生成或辅助绘制
     *
     * 支持单选或多选（"手作"和"完全"为单选，其他可多选组合）
     * 使用空字符串代表"未声明/无"（便于表单清空）
     */
    aiGen?: AiGenValueOrArray
  }
  export interface PostMeta extends BaseArticleMeta {
    style?: string
    cover?: string
    banner?: string | { type: string; message: string }
    keywords?: string[]
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
