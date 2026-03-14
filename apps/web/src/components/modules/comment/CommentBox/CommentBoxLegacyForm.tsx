'use client'

import clsx from 'clsx'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { useIsOwnerLogged } from '~/atoms/hooks/owner'
import { UserAuthFromIcon } from '~/components/layout/header/internal/UserAuthFromIcon'
import { Form, FormInput as FInput } from '~/components/ui/form'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { CommentBoxActionBar } from './ActionBar'
import { useCommentCompact, useGetCommentBoxAtomValues } from './hooks'
import { UniversalTextArea } from './UniversalTextArea'

export const CommentBoxLegacyForm: Component<{ autoFocus?: boolean }> = ({
  autoFocus,
}) => {
  const isLogger = useIsOwnerLogged()
  if (isLogger) return <LoggedForm autoFocus={autoFocus} />
  return <FormWithUserInfo autoFocus={autoFocus} />
}

const taClassName =
  'relative h-[150px] w-full rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50'
type FormKey = 'author' | 'mail' | 'url'

const FormInput = (props: { fieldKey: FormKey; required?: boolean }) => {
  const { fieldKey: key, required } = props
  const [value, setValue] = useAtom(useGetCommentBoxAtomValues()[key])
  const t = useTranslations('comment')

  const placeholderMap = useMemo(
    () =>
      ({
        author: t('form_nickname'),
        mail: t('form_email'),
        url: t('form_url'),
      }) as const,
    [t],
  )

  const validatorMap = useMemo(
    () => ({
      author: {
        validator: (v: string) => v.length > 0 && v.length <= 20,
        message: t('validation_nicknameLength'),
      },
      mail: {
        validator: (v: string) => /^[\w-]+@[\w-]+(?:\.[\w-]+)+$/.test(v),
        message: t('validation_invalidEmail'),
      },
      url: {
        validator: (v: string) =>
          /^https?:\/\/[\dA-Za-z-]+(?:\.[\dA-Za-z-]+)+$/.test(v),
        message: t('validation_invalidUrl'),
      },
    }),
    [t],
  )

  return (
    <FInput
      className="bg-neutral-200/50 dark:bg-neutral-800/50"
      name={key}
      placeholder={placeholderMap[key] + (required ? ' *' : '')}
      required={required}
      rules={[validatorMap[key]]}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
const FormWithUserInfo: Component<{ autoFocus?: boolean }> = ({
  autoFocus,
}) => {
  const compact = useCommentCompact()

  if (compact) {
    return (
      <div className="relative">
        <div className="relative h-[88px] w-full rounded-xl bg-neutral-100/80 dark:bg-neutral-800/40">
          <UniversalTextArea autoFocus={autoFocus} className="pb-7" />
        </div>
        <CommentBoxActionBar className="absolute bottom-0 left-0 right-0 mb-1.5 w-auto px-3" />
      </div>
    )
  }

  return (
    <Form
      className="flex flex-col space-y-4 px-2 pt-2"
      showErrorMessage={false}
    >
      <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <FormInput required fieldKey="author" />
        <FormInput required fieldKey="mail" />
        <FormInput fieldKey="url" />
      </div>
      <div className={taClassName}>
        <UniversalTextArea autoFocus={autoFocus} className="pb-8" />
      </div>

      <CommentBoxActionBar className="absolute bottom-4 left-0 right-4 mb-2 ml-2 w-auto px-4" />
    </Form>
  )
}

const LoggedForm: Component<{ autoFocus?: boolean }> = ({ autoFocus }) => {
  const user = useAggregationSelector((v) => v.user)!
  const compact = useCommentCompact()

  if (compact) {
    return (
      <div className="flex gap-2.5 py-1 pr-1">
        <Image
          alt={`${user.name || user.username}'s avatar`}
          className="mb-1 shrink-0 self-end rounded-full object-cover"
          height={28}
          src={user.avatar}
          width={28}
        />
        <div className="relative min-w-0 flex-1">
          <div className="relative h-[88px] w-full rounded-xl bg-neutral-100/80 dark:bg-neutral-800/40">
            <UniversalTextArea autoFocus={autoFocus} className="pb-7" />
          </div>
          <CommentBoxActionBar className="absolute bottom-0 left-0 right-0 mb-1.5 w-auto px-3" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4">
      <div
        className={clsx(
          'relative mb-2 size-[48px] shrink-0 select-none self-end rounded-full',
          'ring-2 ring-accent',
          'backface-hidden ml-[2px]',
        )}
      >
        <Image
          alt={`${user.name || user.username}'s avatar`}
          className="rounded-full object-cover"
          height={48}
          src={user.avatar}
          width={48}
        />
        <UserAuthFromIcon className="absolute -bottom-1 right-0" />
      </div>
      <div className={taClassName}>
        <UniversalTextArea autoFocus={autoFocus} className="pb-5" />
      </div>

      <CommentBoxActionBar className="absolute bottom-0 left-14 right-0 mb-2 ml-4 w-auto px-4" />
    </div>
  )
}
