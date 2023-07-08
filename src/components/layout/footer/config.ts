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
export const defaultLinkSections: LinkSection[] = [
  {
    name: '关于',
    links: [
      {
        name: '关于本站',
        href: '/about-site',
      },
      {
        name: '关于我',
        href: '/about-me',
      },
      {
        name: '关于此项目',
        href: 'https://github.com/innei/Shiro',
        external: true,
      },
    ],
  },
  {
    name: '更多',
    links: [
      {
        name: '时间线',
        href: '/timeline',
      },
      {
        name: '友链',
        href: '/friends',
      },
      {
        name: '监控',
        href: 'https://status.shizuri.net/status/main',
        external: true,
      },
    ],
  },
  {
    name: '联系',
    links: [
      {
        name: '写留言',
        href: '/message',
      },
      {
        name: '发邮件',
        href: 'mailto:i@innei.ren',
        external: true,
      },
      {
        name: 'GitHub',
        href: 'https://github.com/innei',
        external: true,
      },
    ],
  },
]

export interface FooterConfig {
  linkSections: LinkSection[]
  otherInfo: OtherInfo
}

// export const footerConfig = {
//   linkSections,
//   otherInfo: {
//     date: '2020-{{now}}',
//     // icp: {
//     //   text: '浙 ICP 备 20028356 号',
//     //   link: 'http://www.beian.miit.gov.cn/',
//     // }
//   } as OtherInfo,
// }
