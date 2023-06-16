import { createElement as h } from 'react'
import type { ReactNode } from 'react'

import {
  FaSolidCircle,
  FaSolidCircleNotch,
  FaSolidComment,
  FaSolidComments,
  FaSolidDotCircle,
  FaSolidFeatherAlt,
  FaSolidHistory,
  FaSolidSubway,
  FaSolidUserFriends,
  IcBaselineLiveTv,
  IcTwotoneSignpost,
  IonBook,
  MdiFlask,
  RiNeteaseCloudMusicLine,
} from '~/components/icons/menu-collection'

export interface IHeaderMenu {
  title: string
  path: string
  type?: string
  icon?: ReactNode
  subMenu?: IHeaderMenu[]
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
    title: '水文',
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
  },

  {
    title: '速览',
    icon: h(FaSolidHistory),
    path: '/timeline',
    subMenu: [
      {
        title: '生活',
        icon: h(FaSolidFeatherAlt),
        path: '/timeline?type=note',
      },
      {
        title: '博文',
        icon: h(IonBook),
        path: '/timeline?type=post',
      },
      {
        title: '回忆',
        icon: h(FaSolidCircle),
        path: '/timeline?memory=1',
      },
    ],
  },
  {
    title: '友链',
    icon: h(FaSolidUserFriends),
    path: '/friends',
  },
  {
    title: '之言',
    icon: h(FaSolidComment),
    path: '/recently',
  },
  {
    title: '项目',
    icon: h(MdiFlask),
    path: '/projects',
  },
  {
    title: '其他',
    icon: h(FaSolidCircleNotch),
    path: '/favorite/music',
    subMenu: [
      {
        title: '一言',
        path: '/says',
        icon: h(FaSolidComments),
      },
      {
        title: '听歌',
        icon: h(RiNeteaseCloudMusicLine),
        type: 'Music',
        path: '/favorite/music',
      },
      {
        title: '看番',
        icon: h(IcBaselineLiveTv),
        path: '/favorite/bangumi',
      },
    ],
  },
  {
    title: '开往',
    icon: h(FaSolidSubway),
    path: 'https://travellings.link',
  },
]
