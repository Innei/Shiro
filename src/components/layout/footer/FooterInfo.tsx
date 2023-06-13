import Link from 'next/link'

import { ThemeSwitcher } from '~/components/ui/theme-switcher'
import { clsxm } from '~/utils/helper'

import { GatewayCount } from './GatewayCount'

interface LinkSection {
  name: string
  links: {
    name: string
    href: string
    external?: boolean
  }[]
}

export const linkSections: LinkSection[] = [
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
        href: 'https://github.com/innei/springtide',
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

export const FooterInfo = () => {
  return (
    <div className="px-4 sm:px-8">
      <div className="relative mx-auto max-w-7xl lg:px-8">
        <div className="space-x-0 space-y-3 md:space-x-6 md:space-y-0">
          {linkSections.map((section) => {
            return (
              <div
                className="block space-x-4 md:inline-flex"
                key={section.name}
              >
                <b className="font-medium">{section.name}</b>
                <span className="space-x-4 text-neutral-content/90">
                  {section.links.map((link) => {
                    return (
                      <StyledLink
                        external={link.external}
                        className="link-hover link"
                        href={link.href}
                        key={link.name}
                      >
                        {link.name}
                      </StyledLink>
                    )
                  })}
                </span>
              </div>
            )
          })}
        </div>

        {/*  */}

        <FooterBottom />

        <div className="mt-6 block text-center md:absolute md:bottom-0 md:right-0 md:mt-0">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  )
}
const StyledLink = (
  props: JSX.IntrinsicElements['a'] & {
    external?: boolean
  },
) => {
  const As = props.external ? 'a' : Link

  return (
    // @ts-ignore
    <As
      className="link-hover link"
      target={props.external ? '_blank' : props.target}
      {...props}
    >
      {props.children}
    </As>
  )
}
const Divider: Component = ({ className }) => {
  return (
    <span className={clsxm('select-none whitespace-pre opacity-50', className)}>
      {' '}
      |{' '}
    </span>
  )
}

const PoweredBy: Component = ({ className }) => {
  return (
    <span className={className}>
      Powered by{' '}
      <StyledLink href="https://github.com/mx-space" target="_blank">
        Mix Space
      </StyledLink>
      . <Divider />
      <StyledLink href="https://github.com/innei/springtide" target="_blank">
        springtide
      </StyledLink>
      .
    </span>
  )
}

const FooterBottom = () => {
  return (
    <div className="mt-12 space-y-3 text-center md:mt-6 md:text-left">
      <p>
        © 2020-2023 Innei.
        <span>
          <Divider />
          RSS
          <Divider />
          站点地图
          <Divider className="hidden md:inline" />
        </span>
        <span className="mt-3 block md:mt-0 md:inline">
          Stay hungry. Stay foolish.
        </span>
      </p>
      <p>
        <PoweredBy className="my-3 block md:my-0 md:inline" />
        <Divider className="hidden md:inline" />
        <StyledLink
          href="http://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
        >
          浙 ICP 备 20028356 号
        </StyledLink>
        <Divider />
        <span>
          <GatewayCount /> 个小伙伴正在浏览
        </span>
      </p>
    </div>
  )
}
