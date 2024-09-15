import type { ScriptProps } from 'next/script'

declare global {
  export interface AppThemeConfig {
    config: AppConfig
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
    }

    signature: Signature

    posts: {
      mode: 'loose' | 'compact'
    }
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
  }
}

export {}
