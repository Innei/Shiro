import type { ReactNode } from 'react'
import { createElement as h } from 'react'

import {
  FaSolidCircle,
  FaSolidCircleNotch,
  FaSolidComments,
  FaSolidDotCircle,
  FaSolidFeatherAlt,
  FaSolidHistory,
  FaSolidUserFriends,
  IcTwotoneSignpost,
  IonBook,
  MdiFlask,
  MdiLightbulbOn20,
  RMixPlanet,
} from '~/components/icons/menu-collection'

export interface IHeaderMenu {
  title: string
  titleKey?: string
  path: string
  type?: string
  icon?: ReactNode
  subMenu?: Omit<IHeaderMenu, 'exclude'>[]
  exclude?: string[]
  search?: Record<string, string>
  do?: () => void
}
export const headerMenuConfig: IHeaderMenu[] = [
  {
    title: '首页',
    titleKey: 'nav_home',
    path: '/',
    type: 'Home',
    icon: h(FaSolidDotCircle),
    subMenu: [],
  },
  {
    title: '文稿',
    titleKey: 'nav_posts',
    path: '/posts',
    type: 'Post',
    subMenu: [],
    icon: h(IcTwotoneSignpost),
    do() {
      window.__POST_LIST_ANIMATED__ = true
    },
  },
  {
    title: '手记',
    titleKey: 'nav_notes',
    type: 'Note',
    path: '/notes',
    icon: h(FaSolidFeatherAlt),
    exclude: ['/notes/topics'],
  },

  {
    title: '时光',
    titleKey: 'nav_timeline',
    icon: h(FaSolidHistory),
    path: '/timeline',
    subMenu: [
      {
        title: '手记',
        titleKey: 'nav_notes',
        icon: h(FaSolidFeatherAlt),
        path: '/timeline?type=note',
      },
      {
        title: '文稿',
        titleKey: 'nav_posts',
        icon: h(IonBook),
        path: '/timeline?type=post',
      },
      {
        title: '回忆',
        titleKey: 'nav_memories',
        icon: h(FaSolidCircle),
        path: '/timeline?memory=1',
      },
      {
        title: '专栏',
        titleKey: 'nav_topics',
        path: '/notes/topics',
        icon: h('i', {
          className: 'i-mingcute-align-bottom-fill flex center',
        }),
      },
    ],
  },

  {
    title: '思考',
    titleKey: 'nav_thinking',
    icon: h(MdiLightbulbOn20),
    path: '/thinking',
  },

  {
    title: '更多',
    titleKey: 'nav_more',
    icon: h(FaSolidCircleNotch),
    path: '#',
    subMenu: [
      {
        title: '友链',
        titleKey: 'nav_friends',
        icon: h(FaSolidUserFriends),
        path: '/friends',
      },
      {
        title: '项目',
        titleKey: 'nav_projects',
        icon: h(MdiFlask),
        path: '/projects',
      },
      {
        title: '一言',
        titleKey: 'nav_says',
        path: '/says',
        icon: h(FaSolidComments),
      },
      {
        title: '跃迁',
        titleKey: 'nav_travel',
        icon: h(RMixPlanet),
        path: 'https://travel.moe/go.html',
      },
    ],
  },
]
