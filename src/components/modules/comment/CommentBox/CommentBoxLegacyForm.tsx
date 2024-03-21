import clsx from 'clsx'
import { useAtom } from 'jotai'
import Image from 'next/image'

import { useIsLogged } from '~/atoms/hooks'
import { FormInput as FInput, Form } from '~/components/ui/form'
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
  'relative h-[150px] w-full rounded-lg bg-gray-200/50 dark:bg-zinc-800/50'
type FormKey = 'author' | 'mail' | 'url'
const placeholderMap = {
  author: '昵称',
  mail: '邮箱',
  url: '网址',
} as const
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
      className="border-0 bg-gray-200/50 dark:bg-zinc-800/50"
    />
  )
}
const FormWithUserInfo = () => {
  return (
    <Form
      className="flex flex-col space-y-4 px-2 pt-2"
      showErrorMessage={false}
    >
      <div className="flex flex-col space-x-0 space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <FormInput fieldKey="author" required />
        <FormInput fieldKey="mail" required />
        <FormInput fieldKey="url" />
      </div>
      <div className={taClassName}>
        <UniversalTextArea className="pb-8" />
      </div>

      <CommentBoxActionBar className="absolute bottom-4 left-0 right-4 mb-2 ml-4 w-auto px-4" />
    </Form>
  )
}

const LoggedForm = () => {
  const user = useAggregationSelector((v) => v.user)!

  return (
    <div className="flex space-x-4">
      <div
        className={clsx(
          'mb-2 shrink-0 select-none self-end overflow-hidden rounded-full',
          'dark:ring-zinc-800" bg-zinc-200 ring-2 ring-zinc-200 dark:bg-zinc-800',
          'ml-[2px] backface-hidden',
        )}
      >
        <Image
          className="rounded-full object-cover"
          src={user.avatar}
          alt={`${user.name || user.username}'s avatar`}
          width={48}
          height={48}
        />
      </div>
      <div className={taClassName}>
        <UniversalTextArea className="pb-5" />
      </div>

      <CommentBoxActionBar className="absolute bottom-0 left-12 right-0 mb-2 ml-4 w-auto px-4" />
    </div>
  )
}
