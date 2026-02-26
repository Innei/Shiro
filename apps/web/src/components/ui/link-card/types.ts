import type { ReactNode } from 'react'

/**
 * 卡片数据 - 插件只提供数据，渲染统一
 */
export interface LinkCardData {
  /** 卡片标题 */
  title: ReactNode
  /** 卡片描述 */
  desc?: ReactNode
  /** 图片 URL */
  image?: string
  /** 高亮/主题色 (hex 格式) */
  color?: string
  /** CSS 类名覆盖 */
  classNames?: {
    image?: string
    cardRoot?: string
  }
}

/**
 * URL 匹配结果
 */
export interface UrlMatchResult {
  /** 解析后的 ID */
  id: string
  /** 完整 URL（用于链接跳转） */
  fullUrl?: string
  /** 额外元数据 */
  meta?: Record<string, unknown>
}

/**
 * Feature Gate 配置
 */
export interface PluginFeatureGate {
  /** Feature flag key */
  featureKey: string
  /** 是否必须启用（默认 true） */
  mustBeEnabled?: boolean
}

/** 卡片类型样式 */
export type LinkCardTypeClass =
  | 'media'
  | 'github'
  | 'academic'
  | 'wide'
  | 'full'

/**
 * 插件接口 - 每个插件自包含
 */
export interface LinkCardPlugin<TMeta = Record<string, unknown>> {
  /** 唯一标识符，匹配 LinkCardSource 枚举值 */
  readonly name: string

  /** 可读名称（调试/文档用） */
  readonly displayName: string

  /** URL 匹配优先级（越高越先匹配） */
  readonly priority?: number

  /** 卡片样式类型 */
  readonly typeClass?: LinkCardTypeClass

  /** Feature gate 配置 */
  readonly featureGate?: PluginFeatureGate

  /**
   * 匹配 URL
   * @returns 匹配结果或 null
   */
  matchUrl(url: URL): UrlMatchResult | null

  /**
   * 验证 ID 格式（支持显式 source 用法）
   */
  isValidId(id: string): boolean

  /**
   * 获取卡片数据
   * @param id - 解析后的标识符
   * @param meta - URL 匹配时的元数据
   */
  fetch(id: string, meta?: TMeta): Promise<LinkCardData>
}

/**
 * 插件注册表类型
 */
export type PluginRegistry = readonly LinkCardPlugin[]
