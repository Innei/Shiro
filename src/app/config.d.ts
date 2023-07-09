export interface AppConfig {
  site: Site
  hero: Hero
  module: Module
}
export interface Site {
  favicon: string
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
}
export interface Donate {
  enable: boolean
  link: string
  qrcode: string[]
}
export interface Bilibili {
  liveId: number
}
