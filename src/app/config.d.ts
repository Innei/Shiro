import type { ScriptProps } from 'next/script'

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
  styles: any[]
  js: string[]
  scripts: ScriptProps[]
}

export interface Site {
  favicon: string
  faviconDark?: string
}
export interface Hero {
  title: Title
  description: string
}
export interface Title {
  template: TemplateItem[]
}
export interface TemplateItem {
  type: string
  text?: string
  class?: string
}
export interface Module {
  donate: Donate
  bilibili: Bilibili
  activity: {
    enable: boolean
    endpoint: string
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
