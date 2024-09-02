import clsx from 'clsx'
import { useAtom } from 'jotai'
import Image from 'next/image'

import { useIsLogged } from '~/atoms/hooks'
import { UserAuthFromIcon } from '~/components/layout/header/internal/UserAuthFromIcon'
import { Form, FormInput as FInput } from '~/components/ui/form'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { CommentBoxActionBar } from './ActionBar'
import { useGetCommentBoxAtomValues } from './hooks'
import { UniversalTextArea } from './UniversalTextArea'

export const CommentBoxLegacyForm = () => {
  const isLogger = useIsLogged()
  if (isLogger) return <LoggedForm />
  return <FormWithUserInfo />
}

const taClassName =
  'relative h-[150px] w-full rounded-xl bg-gray-200/50 dark:bg-zinc-800/50'
type FormKey = 'author' | 'mail' | 'url'
const placeholderMap = {
  author: '昵称',
  mail: '邮箱',
  url: '网址',
} as const

const validatorMap = {
  author: {
    validator: (v: string) => v.length > 0 && v.length <= 20,
    message: '昵称长度应在 1-20 之间',
  },
  mail: {
    validator: (v: string) => /^[\w-]+@[\w-]+(\.[\w-]+)+$/.test(v),
    message: '邮箱格式不正确',
  },
  url: {
    validator: (v: string) =>
      /^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(v),
    message: '网址格式不正确',
  },
}
const FormInput = (props: { fieldKey: FormKey; required?: boolean }) => {
  const { fieldKey: key, required } = props
  const [value, setValue] = useAtom(useGetCommentBoxAtomValues()[key])
  return (
    <FInput
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      required={required}
      placeholder={placeholderMap[key] + (required ? ' *' : '')}
      name={key}
      className="bg-gray-200/50 dark:bg-zinc-800/50"
      rules={[validatorMap[key]]}
    />
  )
}
const FormWithUserInfo = () => (
  <Form className="flex flex-col space-y-4 px-2 pt-2" showErrorMessage={false}>
    <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <FormInput fieldKey="author" required />
      <FormInput fieldKey="mail" required />
      <FormInput fieldKey="url" />
    </div>
    <div className={taClassName}>
      <UniversalTextArea className="pb-8" />
    </div>

    <CommentBoxActionBar className="absolute bottom-4 left-0 right-4 mb-2 ml-2 w-auto px-4" />
  </Form>
)

const LoggedForm = () => {
  const user = useAggregationSelector((v) => v.user)!

  return (
    <div className="flex space-x-4">
      <div
        className={clsx(
          'relative mb-2 shrink-0 select-none self-end rounded-full',
          'ring-2 ring-accent',
          'backface-hidden ml-[2px]',
        )}
      >
        <Image
          className="rounded-full object-cover"
          src={user.avatar}
          alt={`${user.name || user.username}'s avatar`}
          width={48}
          height={48}
        />
        <UserAuthFromIcon className="absolute -bottom-1 right-0" />
      </div>
      <div className={taClassName}>
        <UniversalTextArea className="pb-5" />
      </div>

      <CommentBoxActionBar className="absolute bottom-0 left-14 right-0 mb-2 ml-4 w-auto px-4" />
    </div>
  )
}
