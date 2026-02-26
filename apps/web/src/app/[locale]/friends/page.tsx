'use client'

import type { LinkModel } from '@mx-space/api-client'
import { LinkState, LinkType, RequestError } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import Markdown from 'markdown-to-jsx'
import { useTranslations } from 'next-intl'
import type { FC } from 'react'
import { useCallback, useRef } from 'react'

import { NotSupport } from '~/components/common/NotSupport'
import { Avatar } from '~/components/ui/avatar'
import { StyledButton } from '~/components/ui/button'
import { Collapse } from '~/components/ui/collapse'
import { MagneticHoverEffect } from '~/components/ui/effect/MagneticHoverEffect'
import { BackToTopFAB } from '~/components/ui/fab'
import type { FormContextType } from '~/components/ui/form'
import { Form, FormInput } from '~/components/ui/form'
import { FullPageLoading } from '~/components/ui/loading'
import { useModalStack } from '~/components/ui/modal'
import { BottomToUpTransitionView } from '~/components/ui/transition'
import { shuffle } from '~/lib/lodash'
import { apiClient } from '~/lib/request'
import { getErrorMessageFromRequestError } from '~/lib/request.shared'
import { toast } from '~/lib/toast'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

const renderTitle = (text: string) => (
  <h1 className="my-12! text-xl! font-bold">{text}</h1>
)

export default function Page() {
  const t = useTranslations('friends')
  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data } = await apiClient.link.getAll()
      return data
    },
    select: useCallback((data: LinkModel[]) => {
      const friends: LinkModel[] = []
      const collections: LinkModel[] = []
      const outdated: LinkModel[] = []
      const banned: LinkModel[] = []

      for (const link of data) {
        if (link.hide) {
          continue
        }

        switch (link.state) {
          case LinkState.Banned: {
            banned.push(link)
            continue
          }
          case LinkState.Outdate: {
            outdated.push(link)
            continue
          }
        }

        switch (link.type) {
          case LinkType.Friend: {
            friends.push(link)
            break
          }
          case LinkType.Collection: {
            collections.push(link)
          }
        }
      }

      return { friends: shuffle(friends), collections, outdated, banned }
    }, []),
  })

  if (isLoading) return <FullPageLoading />
  if (!data) return null
  const { banned, collections, friends, outdated } = data
  return (
    <div>
      <header className="prose prose-p:my-2">
        <h1>{t('page_title')}</h1>
        <h3>{t('page_subtitle')}</h3>
      </header>

      <main className="mt-10 flex w-full flex-col">
        {friends.length > 0 && (
          <>
            {collections.length > 0 && renderTitle(t('section_friends'))}
            <FriendSection data={friends} />
          </>
        )}
        {collections.length > 0 && (
          <>
            {friends.length > 0 && renderTitle(t('section_collections'))}
            <FavoriteSection data={collections} />
          </>
        )}

        {outdated.length > 0 && (
          <>
            <Collapse
              title={
                <div className="mt-8 font-bold">{t('section_outdated')}</div>
              }
            >
              <OutdateSection data={outdated} />
            </Collapse>
          </>
        )}
        {banned.length > 0 && (
          <>
            <Collapse
              title={
                <div className="mt-8 font-bold">{t('section_banned')}</div>
              }
            >
              <BannedSection data={banned} />
            </Collapse>
          </>
        )}
      </main>

      <ApplyLinkInfo />
      <BackToTopFAB />
    </div>
  )
}
type FriendSectionProps = {
  data: LinkModel[]
}

const FriendSection: FC<FriendSectionProps> = ({ data }) => (
  <section className="grid cursor-none grid-cols-2 gap-6 md:grid-cols-3 2xl:grid-cols-3">
    {data.map((link) => (
      <BottomToUpTransitionView key={link.id} duration={50}>
        <Card link={link} />
      </BottomToUpTransitionView>
    ))}
  </section>
)

const Card: FC<{ link: LinkModel }> = ({ link }) => {
  return (
    <MagneticHoverEffect
      as="a"
      href={link.url}
      target="_blank"
      role="link"
      aria-label={`Go to ${link.name}'s website`}
      className="relative flex flex-col items-center justify-center before:-top-3"
      rel="noreferrer"
    >
      <Avatar
        randomColor
        imageUrl={link.avatar}
        lazy
        radius={8}
        text={link.name[0]}
        alt={`Avatar of ${link.name}`}
        size={64}
        className="ring-2 ring-zinc-400/30 dark:ring-zinc-50"
      />
      <span className="flex h-full flex-col items-center justify-center space-y-2 py-3">
        <span className="text-lg font-medium">{link.name}</span>
        <span className="line-clamp-2 text-balance break-all text-center text-sm text-base-content/80">
          {link.description}
        </span>
      </span>
    </MagneticHoverEffect>
  )
}

const FavoriteSection: FC<FriendSectionProps> = ({ data }) => (
  <ul className="relative flex w-full grow flex-col gap-4">
    {data.map((link) => (
      <li key={link.id} className="flex w-full items-end">
        <a
          href={link.url}
          target="_blank"
          className="shrink-0 text-base leading-none"
          rel="noreferrer"
        >
          {link.name}
        </a>

        <span className="ml-2 h-[12px] max-w-full truncate break-all text-xs leading-none text-base-content/80">
          {link.description || ''}
        </span>
      </li>
    ))}
  </ul>
)

const OutdateSection: FC<FriendSectionProps> = ({ data }) => (
  <ul className="space-y-1 p-4 opacity-80">
    {data.map((link) => (
      <li key={link.id}>
        <span className="cursor-not-allowed font-medium">{link.name}</span>
        <span className="ml-2 text-sm">{link.description || ''}</span>
      </li>
    ))}
  </ul>
)

const BannedSection: FC<FriendSectionProps> = ({ data }) => (
  <ul className="space-y-1 p-4 opacity-40">
    {data.map((link) => (
      <li key={link.id}>
        <span className="cursor-not-allowed">{link.name}</span>
      </li>
    ))}
  </ul>
)

const ApplyLinkInfo: FC = () => {
  const t = useTranslations('friends')
  const {
    seo,
    user: { avatar, name },
  } = useAggregationSelector((a) => ({
    seo: a.seo!,
    user: a.user!,
  }))!

  const { data: canApply } = useQuery({
    queryKey: ['can-apply'],
    queryFn: () => apiClient.link.canApplyLink(),
    initialData: true,
    refetchOnMount: 'always',
  })
  const { present } = useModalStack()
  if (!canApply) {
    return <NotSupport className="mt-20" text={t('apply_disabled')} />
  }
  return (
    <>
      <div className="prose mt-20">
        <Markdown>
          {[
            t('rule_mutual'),
            t('rule_unavailable'),
            t('rule_content'),
            t('rule_https'),
            t('rule_domain'),
            t('rule_personal'),
          ].join('\n\n')}
        </Markdown>
        <Markdown className="[&_p]:my-1!">
          {[
            '',
            `${t('info_title')}: [${
              seo.title
            }](${`${location.protocol}//${location.host}`})`,
            `${t('info_description')}: ${seo.description}`,
            `${t('info_avatar')}: [${t('info_avatar_download')}](${avatar})`,
            `${t('info_name')}: ${name}`,
          ].join('\n\n')}
        </Markdown>
      </div>

      <StyledButton
        variant="primary"
        className="mt-5"
        onClick={() => {
          present({
            title: t('apply_modal_title'),

            content: () => <FormModal />,
          })
        }}
      >
        {t('apply_button')}
      </StyledButton>
    </>
  )
}

const FormModal = () => {
  const t = useTranslations('friends')
  const { dismissTop } = useModalStack()
  const inputs = [
    {
      name: 'author',
      placeholder: t('form_nickname'),
      rules: [
        {
          validator: (value: string) => !!value,
          message: t('validation_nickname_required'),
        },
        {
          validator: (value: string) => value.length <= 20,
          message: t('validation_nickname_length'),
        },
      ],
    },
    {
      name: 'name',
      placeholder: t('form_site_title'),
      rules: [
        {
          validator: (value: string) => !!value,
          message: t('validation_title_required'),
        },
        {
          validator: (value: string) => value.length <= 20,
          message: t('validation_title_length'),
        },
      ],
    },
    {
      name: 'url',
      placeholder: t('form_url'),
      rules: [
        {
          validator: isHttpsUrl,
          message: t('validation_url'),
        },
      ],
    },
    {
      name: 'avatar',
      placeholder: t('form_avatar'),
      rules: [
        {
          validator: isHttpsUrl,
          message: t('validation_avatar'),
        },
      ],
    },
    {
      name: 'email',
      placeholder: t('form_email'),

      rules: [
        {
          validator: isEmail,
          message: t('validation_email'),
        },
      ],
    },
    {
      name: 'description',
      placeholder: t('form_description'),

      rules: [
        {
          validator: (value: string) => !!value,
          message: t('validation_description_required'),
        },
        {
          validator: (value: string) => value.length <= 50,
          message: t('validation_description_length'),
        },
      ],
    },
  ]

  const formRef = useRef<FormContextType>(null)

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault()
      const currentValues = formRef.current?.getCurrentValues()
      if (!currentValues) return

      apiClient.link
        .applyLink({ ...(currentValues as any) })
        .then(() => {
          dismissTop()
          toast.success(t('submit_success'))
        })
        .catch((err) => {
          if (err instanceof RequestError)
            toast.error(getErrorMessageFromRequestError(err))
          else {
            toast.error(err.message)
          }
        })
    },
    [dismissTop, t],
  )

  return (
    <Form
      ref={formRef}
      className="w-full space-y-4 text-center lg:w-[300px]"
      onSubmit={handleSubmit}
    >
      {inputs.map((input) => (
        <FormInput key={input.name} {...input} />
      ))}

      <StyledButton variant="primary" type="submit">
        {t('submit_button')}
      </StyledButton>
    </Form>
  )
}

const isHttpsUrl = (value: string) =>
  /^https?:\/\/.*/.test(value) &&
  (() => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  })()

const isEmail = (value: string) =>
  /^.[^\n\r@\u2028\u2029]*@.[^\n\r.\u2028\u2029]*\..+$/.test(value)
