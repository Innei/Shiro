import 'server-only'

import { getTranslations } from 'next-intl/server'
import type { JSX } from 'react'

import { fetchAggregationData } from '~/app/[locale]/api'
import { IonIosArrowDown } from '~/components/icons/arrow'
import { SubscribeTextButton } from '~/components/modules/subscribe/SubscribeTextButton'
import { FloatPopover } from '~/components/ui/float-popover'
import { MarkdownLink } from '~/components/ui/link'
import { Link } from '~/i18n/navigation'
import { clsxm } from '~/lib/helper'

import type { FooterConfig } from './config'
import { defaultLinkSections } from './config'
import { GatewayInfo } from './GatewayInfo'
import { OwnerName } from './OwnerName'

export const FooterInfo = () => (
  <>
    <div className="relative">
      <FooterLinkSection />
    </div>

    <FooterBottom />
  </>
)

const FooterLinkSection = async () => {
  const { footer } = (await fetchAggregationData()).theme
  const footerConfig: FooterConfig = footer || {
    linkSections: defaultLinkSections,
  }

  return (
    <div className="space-x-0 space-y-3 md:space-x-6 md:space-y-0">
      {footerConfig.linkSections.map((section) => (
        <div
          className="flex items-center gap-4 md:inline-flex"
          key={section.name}
        >
          <b className="inline-flex items-center font-medium">
            {section.name}
            <IonIosArrowDown className="ml-2 inline -rotate-90 select-none" />
          </b>

          <span className="space-x-4 text-neutral/90">
            {section.links.map((link) => (
              <StyledLink
                external={link.external}
                className="link-hover link"
                href={link.href}
                key={link.name}
              >
                {link.name}
              </StyledLink>
            ))}
          </span>
        </div>
      ))}
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
const Divider: Component = ({ className }) => (
  <span className={clsxm('select-none whitespace-pre opacity-50', className)}>
    {' '}
    |{' '}
  </span>
)

const PoweredBy = async ({ className }: { className?: string }) => {
  const t = await getTranslations('common')
  return (
    <span className={className}>
      Powered by{' '}
      <StyledLink href="https://github.com/mx-space" target="_blank">
        Mix Space
      </StyledLink>
      <span className="mx-1">&</span>
      <FloatPopover
        mobileAsSheet
        type="tooltip"
        triggerElement={
          <StyledLink
            className="cursor-help"
            href="https://github.com/innei/Shiro"
            target="_blank"
          >
            白
          </StyledLink>
        }
      >
        <div className="space-y-2">
          <p>
            {t.rich('shiroi_closed_source', {
              link: (chunks) => (
                <StyledLink
                  className="underline"
                  href="https://github.com/innei/Shiro"
                  target="_blank"
                >
                  {chunks}
                </StyledLink>
              ),
            })}
          </p>
          <p>
            {t.rich('shiroi_get_via', {
              link: (chunks) => (
                <MarkdownLink
                  popper={false}
                  noIcon
                  href="https://github.com/sponsors/Innei"
                >
                  {chunks}
                </MarkdownLink>
              ),
            })}
          </p>
          {process.env.COMMIT_HASH && process.env.COMMIT_URL && (
            <p>
              <MarkdownLink popper={false} noIcon href={process.env.COMMIT_URL}>
                {t('version_hash', {
                  hash: process.env.COMMIT_HASH.slice(0, 8),
                })}
              </MarkdownLink>
            </p>
          )}
          {process.env.BUILD_TIME && (
            <p>
              {t('build_time', {
                time: new Date(process.env.BUILD_TIME).toLocaleDateString(),
              })}
            </p>
          )}
        </div>
      </FloatPopover>
      .
    </span>
  )
}

const FooterBottom = async () => {
  const t = await getTranslations('common')
  const data = await fetchAggregationData()
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
            {t('sitemap')}
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
