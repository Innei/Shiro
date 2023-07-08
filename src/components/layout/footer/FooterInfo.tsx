import Link from 'next/link'
import type { FooterConfig } from './config'

import { get } from '@vercel/edge-config'

import { SubscribeTextButton } from '~/components/widgets/subscribe/SubscribeTextButton'
import { clsxm } from '~/lib/helper'

import { defaultLinkSections } from './config'
// import { footerConfig } from './config'
import { GatewayCount } from './GatewayCount'
import { OwnerName } from './OwnerName'

export const FooterInfo = () => {
  return (
    <>
      <FooterLinkSection />

      <FooterBottom />
    </>
  )
}

const FooterLinkSection = async () => {
  const footerConfig =
    ((await get('footer')) as FooterConfig) || defaultLinkSections

  return (
    <div className="space-x-0 space-y-3 md:space-x-6 md:space-y-0">
      {footerConfig.linkSections.map((section) => {
        return (
          <div className="block space-x-4 md:inline-flex" key={section.name}>
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
  )
}

const StyledLink = (
  props: JSX.IntrinsicElements['a'] & {
    external?: boolean
  },
) => {
  const { external, ...rest } = props
  const As = external ? 'a' : Link

  return (
    // @ts-ignore
    <As
      className="link-hover link"
      target={props.external ? '_blank' : props.target}
      {...rest}
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
      <StyledLink href="https://github.com/innei/Shiro" target="_blank">
        Shiro
      </StyledLink>
      .
    </span>
  )
}

// type VisitorGeolocation = {
//   country: string
//   city?: string
//   flag: string
// }
const FooterBottom = async () => {
  // let lastVisitor: VisitorGeolocation | undefined = undefined
  // if (process.env.VERCEL_ENV === 'production') {
  //   const [lv, cv] = await redis.mget<VisitorGeolocation[]>(
  //     kvKeys.lastVisitor,
  //     kvKeys.currentVisitor,
  //   )
  //   lastVisitor = lv
  //   await redis.set(kvKeys.lastVisitor, cv)
  // }

  // if (isDev) {
  //   lastVisitor = {
  //     country: 'US',
  //     flag: '🇺🇸',
  //   }
  // }

  const footerConfig = (await get('footer')) as FooterConfig
  const { otherInfo } = footerConfig
  const currentYear = new Date().getFullYear().toString()
  const { date = currentYear, icp } = otherInfo || {}

  return (
    <div className="mt-12 space-y-3 text-center md:mt-6 md:text-left">
      <p>
        © {date.replace('{{now}}', currentYear)}{' '}
        <a href="/">
          <OwnerName />
        </a>
        .
        <span>
          <Divider />
          <a href="/feed">RSS</a>
          <Divider />
          <a href="/sitemap.xml">站点地图</a>
          <Divider className="hidden md:inline" />

          <SubscribeTextButton>
            <Divider className="inline" />
          </SubscribeTextButton>
        </span>
        <span className="mt-3 block md:mt-0 md:inline">
          Stay hungry. Stay foolish.
        </span>
      </p>
      <p>
        <PoweredBy className="my-3 block md:my-0 md:inline" />
        {icp && (
          <>
            <Divider className="hidden md:inline" />
            <StyledLink href={icp.link} target="_blank" rel="noreferrer">
              {icp.text}
            </StyledLink>
          </>
        )}

        <Divider />
        <GatewayCount />
        {/* {!!lastVisitor && (
          <>
            <Divider />
            <span>
              最近访客来自&nbsp;
              {lastVisitor.flag}&nbsp;
              {[lastVisitor.city, lastVisitor.country]
                .filter(Boolean)
                .join(', ')}
            </span>
          </>
        )} */}
      </p>
    </div>
  )
}
