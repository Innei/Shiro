/* eslint-disable react/jsx-no-target-blank */
'use client'

import { useQuery } from '@tanstack/react-query'
import { memo, useCallback, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Markdown from 'markdown-to-jsx'
import type { LinkModel } from '@mx-space/api-client'
import type { FC } from 'react'

import { LinkState, LinkType } from '@mx-space/api-client'

import { NotSupport } from '~/components/common/NotSupport'
import { Avatar } from '~/components/ui/avatar'
import { StyledButton } from '~/components/ui/button'
import { Form, FormInput } from '~/components/ui/form'
import { Loading } from '~/components/ui/loading'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { shuffle } from '~/lib/_'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'
import { useModalStack } from '~/providers/root/modal-stack-provider'

const renderTitle = (text: string) => {
  return <h1 className="headline !mt-12 !text-xl">{text}</h1>
}

export default function Page() {
  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const { data } = await apiClient.link.getAll()
      return data
    },
    staleTime: Infinity,
    cacheTime: Infinity,
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
          case LinkState.Banned:
            banned.push(link)
            continue
          case LinkState.Outdate:
            outdated.push(link)
            continue
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

  if (isLoading) return <Loading useDefaultLoadingText />
  if (!data) return null
  const { banned, collections, friends, outdated } = data
  return (
    <div>
      <header className="prose prose-p:my-2">
        <h1>朋友们</h1>
        <h3>海内存知己，天涯若比邻</h3>
      </header>

      <main className="mt-10">
        {friends.length > 0 && (
          <>
            {collections.length !== 0 && renderTitle('我的朋友')}
            <FriendSection data={friends} />
          </>
        )}
        {collections.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle('我的收藏')}
            <FavoriteSection data={collections} />
          </>
        )}

        {outdated.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle('以下站点无法访问，已失联')}
            <OutdateSection data={outdated} />
          </>
        )}
        {banned.length > 0 && (
          <>
            {friends.length !== 0 && renderTitle('以下站点不合规，已被禁止')}
            <BannedSection data={banned} />
          </>
        )}
      </main>

      <ApplyLinkInfo />
    </div>
  )
}
type FriendSectionProps = {
  data: LinkModel[]
}

const FriendSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {data.map((link) => {
        return (
          <BottomToUpTransitionView key={link.id} duration={50}>
            <Card link={link} />
          </BottomToUpTransitionView>
        )
      })}
    </section>
  )
}

const LayoutBg = memo(() => {
  return (
    <m.span
      layoutId="bg"
      className="absolute -inset-2 z-[-1] rounded-md bg-slate-200/80 dark:bg-neutral-600/80"
      initial={{ opacity: 0.8, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { delay: 0.2 } }}
    />
  )
})
LayoutBg.displayName = 'LayoutBg'

const Card: FC<{ link: LinkModel }> = ({ link }) => {
  const [enter, setEnter] = useState(false)

  return (
    <m.a
      layoutId={link.id}
      href={link.url}
      target="_blank"
      role="link"
      aria-label={`Go to ${link.name}'s website`}
      className="relative flex flex-col items-center justify-center"
      onMouseEnter={() => setEnter(true)}
      onMouseLeave={() => setEnter(false)}
    >
      <AnimatePresence mode="wait">{enter && <LayoutBg />}</AnimatePresence>

      <Avatar
        imageUrl={link.avatar}
        lazy
        text={link.name[0]}
        alt={`Avatar of ${link.name}`}
        size={64}
        className="rounded-xl ring-2 ring-gray-400/30 dark:ring-slate-50"
      />
      <span className="flex h-full flex-col items-center justify-center space-y-2 py-3">
        <span className="text-lg font-medium">{link.name}</span>
        <span className="line-clamp-2 break-all text-sm text-base-content/80">
          {link.description}
        </span>
      </span>
    </m.a>
  )
}

const FavoriteSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul>
      {data.map((link) => {
        return (
          <li key={link.id}>
            <a href={link.url} target="_blank">
              {link.name}
            </a>
            <span className="meta">{link.description || ''}</span>
          </li>
        )
      })}
    </ul>
  )
}

const OutdateSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul>
      {data.map((link) => {
        return (
          <li key={link.id}>
            <a className="cursor-not-allowed">{link.name}</a>
            <span className="meta">{link.description || ''}</span>
          </li>
        )
      })}
    </ul>
  )
}

const BannedSection: FC<FriendSectionProps> = ({ data }) => {
  return (
    <ul>
      {data.map((link) => {
        return (
          <li key={link.id}>
            <span className="cursor-not-allowed">{link.name}</span>
          </li>
        )
      })}
    </ul>
  )
}

const ApplyLinkInfo: FC = () => {
  const {
    seo,
    user: { avatar, name },
  } = useAggregationSelector((a) => ({
    seo: a.seo!,
    user: a.user!,
  }))!

  const { data: canApply } = useQuery(
    ['can-apply'],
    () => apiClient.link.canApplyLink(),
    {
      initialData: true,
    },
  )
  const { present } = useModalStack()
  if (!canApply) {
    return <NotSupport className="mt-20" text="主人禁止了申请友链。" />
  }
  return (
    <>
      <div className="prose mt-20">
        <Markdown>
          {[
            `**在申请友链之前请先将本站加入贵站的友链中**`,
            `**填写邮箱后，待通过申请后会发送邮件**`,
            `**我希望贵站不是商业化门户网站，亦或是植有影响观看体验广告的网站。**`,
            `**失联站点将会定期移除，非法网站会立即禁止并拉黑。**`,
            `<br />`,
            `### 本站信息`,
          ].join('\n\n')}
        </Markdown>
        <Markdown className="[&_p]:!my-1">
          {[
            '',
            `**站点标题**: [${
              seo.title
            }](${`${location.protocol}//${location.host}`})`,
            `**站点描述**: ${seo.description}`,
            `**主人头像**: [点击下载](${avatar})`,
            `**主人名字**: ${name}`,
          ].join('\n\n')}
        </Markdown>
      </div>

      <StyledButton
        variant="primary"
        className="mt-5"
        onClick={() => {
          present({
            title: '我想和你交朋友！',

            content: () => <FormModal />,
          })
        }}
      >
        和我做朋友吧！
      </StyledButton>
    </>
  )
}

const FormModal = () => {
  const { dismissTop } = useModalStack()
  const inputs = useRef([
    {
      name: 'author',
      placeholder: '昵称 *',
      rules: [
        {
          validator: (value: string) => !!value,
          message: '昵称不能为空',
        },
        {
          validator: (value: string) => value.length <= 20,
          message: '昵称不能超过20个字符',
        },
      ],
    },
    {
      name: 'name',
      placeholder: '站点标题 *',
      rules: [
        {
          validator: (value: string) => !!value,
          message: '站点标题不能为空',
        },
        {
          validator: (value: string) => value.length <= 20,
          message: '站点标题不能超过20个字符',
        },
      ],
    },
    {
      name: 'url',
      placeholder: '网站 * https://',
      rules: [
        {
          validator: isHttpsUrl,
          message: '请输入正确的网站链接 https://',
        },
      ],
    },
    {
      name: 'avatar',
      placeholder: '头像链接 * https://',
      rules: [
        {
          validator: isHttpsUrl,
          message: '请输入正确的头像链接 https://',
        },
      ],
    },
    {
      name: 'email',
      placeholder: '留下你的邮箱哦 *',

      rules: [
        {
          validator: isEmail,
          message: '请输入正确的邮箱',
        },
      ],
    },
    {
      name: 'description',
      placeholder: '一句话描述一下自己吧 *',

      rules: [
        {
          validator: (value: string) => !!value,
          message: '一句话描述一下自己吧',
        },
        {
          validator: (value: string) => value.length <= 50,
          message: '一句话描述不要超过50个字啦',
        },
      ],
    },
  ]).current
  const [state, setState] = useState({
    author: '',
    name: '',
    url: '',
    avatar: '',
    description: '',
    email: '',
  })

  const setValue = useCallback((key: keyof typeof state, value: string) => {
    setState((prevState) => ({ ...prevState, [key]: value }))
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.name as keyof typeof state, e.target.value)
  }, [])

  const handleSubmit = useCallback(
    (e: any) => {
      e.preventDefault()

      apiClient.link.applyLink({ ...state }).then(() => {
        dismissTop()
        toast.success('好耶！')
      })
    },
    [state],
  )
  return (
    <Form className="w-[300px] space-y-4 text-center" onSubmit={handleSubmit}>
      {inputs.map((input) => (
        <FormInput
          key={input.name}
          // @ts-expect-error
          value={state[input.name]}
          onChange={handleChange}
          {...input}
        />
      ))}

      <StyledButton variant="primary" type="submit">
        好耶！
      </StyledButton>
    </Form>
  )
}

const isHttpsUrl = (value: string) => {
  return (
    /^https?:\/\/.*/.test(value) &&
    (() => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    })()
  )
}

const isEmail = (value: string) => {
  return /^.+@.+\..+$/.test(value)
}
