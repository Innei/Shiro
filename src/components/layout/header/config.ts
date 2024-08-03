import { createElement as h } from 'react'
import type { ReactNode } from 'react'

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
    title: 'Home',
    path: '/',
    type: 'Home',
    icon: h(FaSolidDotCircle),
    subMenu: [],
  },
  {
    title: 'Posts',
    path: '/posts',
    type: 'Post',
    subMenu: [],
    icon: h(IcTwotoneSignpost),
  },
  {
    title: 'Notes',
    type: 'Note',
    path: '/notes',
    icon: h(FaSolidFeatherAlt),
    exclude: ['/notes/topics'],
  },

  {
    title: 'Timeline',
    icon: h(FaSolidHistory),
    path: '/timeline',
    subMenu: [
      {
        title: 'Notes',
        icon: h(FaSolidFeatherAlt),
        path: '/timeline?type=note',
      },
      {
        title: 'Posts',
        icon: h(IonBook),
        path: '/timeline?type=post',
      },
      {
        title: 'Memory',
        icon: h(FaSolidCircle),
        path: '/timeline?memory=1',
      },
      {
        title: 'Topics',
        path: '/notes/topics',
        icon: h('i', {
          className: 'icon-[mingcute--align-bottom-fill] flex center',
        }),
      },
    ],
  },
  {
    title: 'Friends',
    icon: h(FaSolidUserFriends),
    path: '/friends',
  },

  {
    title: 'More',
    icon: h(FaSolidCircleNotch),
    path: '#',
    subMenu: [
      {
        title: 'Thoughts',
        icon: h(MdiLightbulbOn20),
        path: '/thinking',
      },
      {
        title: 'Projects',
        icon: h(MdiFlask),
        path: '/projects',
      },
      {
        title: 'Sayings',
        path: '/says',
        icon: h(FaSolidComments),
      },
      {
        title: 'Warp',
        icon: h(RMixPlanet),
        path: 'https://travel.moe/go.html',
      },
    ],
  },
]
