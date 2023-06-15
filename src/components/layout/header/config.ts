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
    title: '文',
    path: '/posts',
    type: 'Post',
    subMenu: [],
    icon: h(IcTwotoneSignpost),
  },
  {
    title: '记',
    type: 'Note',
    path: '/notes',
    icon: h(FaSolidFeatherAlt),
  },
  {
    title: '言',
    path: '/says',
    icon: h(FaSolidComments),
  },
  {
    title: '览',
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
    title: '友',
    icon: h(FaSolidUserFriends),
    path: '/friends',
  },
  {
    title: '诉',
    icon: h(FaSolidComment),
    path: '/recently',
  },
  {
    title: '码',
    icon: h(MdiFlask),
    path: '/projects',
  },
  {
    title: '趣',
    icon: h(FaSolidCircleNotch),
    path: '/favorite/music',
    subMenu: [
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
