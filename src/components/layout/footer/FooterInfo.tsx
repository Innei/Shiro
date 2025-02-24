import Link from 'next/link'
import type { JSX } from 'react'

import { fetchAggregationData } from '~/app/(app)/api'
import { IonIosArrowDown } from '~/components/icons/arrow'
import { SubscribeTextButton } from '~/components/modules/subscribe/SubscribeTextButton'
import { FloatPopover } from '~/components/ui/float-popover'
import { MLink } from '~/components/ui/link'
import { clsxm } from '~/lib/helper'
import { getQueryClient } from '~/lib/query-client.server'
import { queries } from '~/queries/definition'

import type { FooterConfig } from './config'
import { defaultLinkSections } from './config'
// import { footerConfig } from './config'
import { GatewayInfo } from './GatewayInfo'
import { OwnerName } from './OwnerName'

// const isVercelEnv = !!process.env.NEXT_PUBLIC_VERCEL_ENV
export const FooterInfo = () => {
  return (
    <>
      <div className="relative">
        <FooterLinkSection />
        {/* {isVercelEnv && (
          <div className="absolute top-0 hidden lg:-right-8 lg:block">
            <VercelPoweredBy />
          </div>
        )} */}
      </div>

      <FooterBottom />

      {/* {isVercelEnv && (
        <div className="mt-6 flex justify-center lg:hidden">
          <VercelPoweredBy />
        </div>
      )} */}
    </>
  )
}

const FooterLinkSection = async () => {
  const { footer } = (await fetchAggregationData()).theme
  const footerConfig: FooterConfig = footer || {
    linkSections: defaultLinkSections,
  }

  return (
    <div className="space-x-0 space-y-3 md:space-x-6 md:space-y-0">
      {footerConfig.linkSections.map((section) => {
        return (
          <div
            className="flex items-center gap-4 md:inline-flex"
            key={section.name}
          >
            <b className="inline-flex items-center font-medium">
              {section.name}
              <IonIosArrowDown className="ml-2 inline -rotate-90 select-none" />
            </b>

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
      <span className="mx-1">&</span>
      <FloatPopover
        isDisabled={!process.env.COMMIT_HASH}
        mobileAsSheet
        type="tooltip"
        triggerElement={
          <StyledLink href="https://github.com/innei/Shiro" target="_blank">
            Shiro
          </StyledLink>
        }
      >
        这是{' '}
        <StyledLink
          className="underline"
          href="https://github.com/innei/Shiro"
          target="_blank"
        >
          Shiro
        </StyledLink>{' '}
        的开源版本。
        {process.env.COMMIT_HASH && process.env.COMMIT_URL && (
          <MLink popper={false} href={process.env.COMMIT_URL}>
            版本哈希：{process.env.COMMIT_HASH.slice(0, 8)}
          </MLink>
        )}
      </FloatPopover>
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

  const queryClient = getQueryClient()
  const data = await queryClient.fetchQuery(queries.aggregation.root())
  const { footer } = data.theme
  const footerConfig = footer || {}
  const { otherInfo } = footerConfig
  const currentYear = new Date().getFullYear().toString()
  const { date = currentYear, icp } = otherInfo || {}

  return (
    <div className="mt-12 space-y-3 text-center md:mt-6 md:text-left">
      <div>
        <span>© {date.replace('{{now}}', currentYear)} </span>
        <a href="/">
          <OwnerName />
        </a>
        <span>.</span>
        <span>
          <Divider />
          <a href="/feed" target="_blank" rel="noreferrer">
            RSS
          </a>
          <Divider />
          <a href="/sitemap.xml" target="_blank" rel="noreferrer">
            站点地图
          </a>
          <Divider className="inline" />

          <SubscribeTextButton>
            <Divider className="hidden md:inline" />
          </SubscribeTextButton>
        </span>
        <span className="mt-3 block md:mt-0 md:inline">
          Stay hungry. Stay foolish.
        </span>
      </div>
      <div>
        <PoweredBy className="my-3 block md:my-0 md:inline" />
        {icp && (
          <>
            <Divider className="hidden md:inline" />
            <StyledLink href={icp.link} target="_blank" rel="noreferrer">
              {icp.text}
            </StyledLink>
          </>
        )}

        {icp ? (
          <Divider className="inline" />
        ) : (
          <Divider className="hidden md:inline" />
        )}
        <GatewayInfo />
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
      </div>
    </div>
  )
}
