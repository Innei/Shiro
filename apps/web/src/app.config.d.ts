import type { ScriptProps } from 'next/script'

declare global {
  export interface AppThemeConfig {
    config: AppConfig
    header?: HeaderConfig
    footer: FooterConfig
  }

  export interface AccentColor {
    light: string[]
    dark: string[]
  }

  export interface AppConfig {
    site: Site
    hero: Hero
    module: Module
    color?: AccentColor

    custom?: Custom

    poweredBy?: {
      vercel?: boolean
    }
  }

  export interface LinkSection {
    name: string
    links: {
      name: string
      href: string
      external?: boolean
    }[]
  }

  export interface OtherInfo {
    date: string
    icp?: {
      text: string
      link: string
    }
  }

  export interface Custom {
    css: string[]
    js: string[]
    styles: string[]
    scripts: ScriptProps[]
  }

  export interface Site {
    favicon: string
    faviconDark?: string
  }
  export interface Hero {
    title: Title
    description: string
    hitokoto?: {
      random?: boolean
      custom?: string
    }
  }
  export interface Title {
    template: TemplateItem[]
  }
  export interface TemplateItem {
    type: string
    text?: string
    class?: string
  }

  type RSSCustomElements = Array<Record<string, RSSCustomElements | string>>
  export interface Module {
    subscription: {
      tg?: string
    }
    og: {
      avatar?: string
    }
    donate: Donate
    bilibili: Bilibili
    activity: {
      enable: boolean
      endpoint: string
    }
    openpanel: {
      enable: boolean
      id: string
      url: string
    }
    rss: {
      custom_elements: RSSCustomElements
      noRSS?: boolean
    }

    signature: Signature

    posts: {
      mode: 'loose' | 'compact'
    }

    categoryPostList: CategoryPostListConfig
  }

  export interface CategoryPostListConfig {
    // 全局默认配置
    default: {
      sticky: boolean // 是否启用粘性
    }
    // 分类级别的配置
    categories?: Record<string, CategoryPostListCategoryConfig>
  }

  export interface CategoryPostListCategoryConfig {
    // 是否启用该分类的文章列表（必须为 true 才会显示）
    enabled?: boolean
    // 是否启用粘性（可选，默认使用全局配置）
    sticky?: boolean
  }

  export interface Donate {
    enable: boolean
    link: string
    qrcode: string[]
  }
  export interface Bilibili {
    liveId: number
  }

  export interface Signature {
    svg: string
    animated?: boolean
  }

  export interface HeaderConfig {
    menu: HeaderMenuItem[]
  }

  export interface HeaderMenuItem {
    title: string
    titleKey?: string
    path: string
    type?: string
    icon?: string
    subMenu?: HeaderMenuItem[]
    exclude?: string[]
    external?: boolean
  }
}
