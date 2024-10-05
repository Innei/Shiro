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
  path: string
  type?: string
  icon?: ReactNode
  subMenu?: Omit<IHeaderMenu, 'exclude'>[]
  exclude?: string[]
}
export const headerMenuConfig: IHeaderMenu[] = [
  {
    title: '首页',
    path: '/',
    type: 'Home',
    icon: h(FaSolidDotCircle),
    subMenu: [],
  },
  {
    title: '文稿',
    path: '/posts',
    type: 'Post',
    subMenu: [],
    icon: h(IcTwotoneSignpost),
  },
  {
    title: '手记',
    type: 'Note',
    path: '/notes',
    icon: h(FaSolidFeatherAlt),
    exclude: ['/notes/topics'],
  },

  {
    title: '时光',
    icon: h(FaSolidHistory),
    path: '/timeline',
    subMenu: [
      {
        title: '手记',
        icon: h(FaSolidFeatherAlt),
        path: '/timeline?type=note',
      },
      {
        title: '文稿',
        icon: h(IonBook),
        path: '/timeline?type=post',
      },
      {
        title: '回忆',
        icon: h(FaSolidCircle),
        path: '/timeline?memory=1',
      },
      {
        title: '专栏',
        path: '/notes/topics',
        icon: h('i', {
          className: 'i-mingcute-align-bottom-fill flex center',
        }),
      },
    ],
  },
  {
    title: '友链',
    icon: h(FaSolidUserFriends),
    path: '/friends',
  },

  {
    title: '更多',
    icon: h(FaSolidCircleNotch),
    path: '#',
    subMenu: [
      {
        title: '思考',
        icon: h(MdiLightbulbOn20),
        path: '/thinking',
      },
      {
        title: '项目',
        icon: h(MdiFlask),
        path: '/projects',
      },
      {
        title: '一言',
        path: '/says',
        icon: h(FaSolidComments),
      },
      {
        title: '跃迁',
        icon: h(RMixPlanet),
        path: 'https://travel.moe/go.html',
      },
    ],
  },
]
