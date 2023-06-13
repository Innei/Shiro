import Link from 'next/link'

interface LinkSection {
  name: string
  links: {
    name: string
    href: string
    external?: boolean
  }[]
}

const linkSections: LinkSection[] = [
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

export const Footer = () => {
  return (
    <footer className="relative z-[1] mt-32 border-t border-base-200 bg-uk-grouped-primary-light py-6 dark:bg-uk-grouped-primary-dark">
      <div className="px-4 sm:px-8">
        <div className="mx-auto max-w-7xl lg:px-8">
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

          <div className="mt-6 space-y-3">
            <p>
              © 2020-2023 Innei.
              <span>
                <Divider />
                RSS
                <Divider />
                站点地图
                <Divider />
              </span>
              Stay hungry. Stay foolish.
            </p>
            <p>
              Powered by{' '}
              <StyledLink href="https://github.com/mx-space" target="_blank">
                Mix Space
              </StyledLink>
              . <Divider />
              <StyledLink
                href="https://github.com/innei/springtide"
                target="_blank"
              >
                springtide
              </StyledLink>
              .
              <Divider />
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
        </div>
      </div>
    </footer>
  )
}

const GatewayCount = () => {
  return '1'
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

const Divider = () => {
  return <span className="select-none whitespace-pre opacity-50"> | </span>
}
