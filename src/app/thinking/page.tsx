'use client'

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { produce } from 'immer'
import type { RecentlyModel } from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'
import type { FC } from 'react'

import {
  RecentlyAttitudeEnum,
  RecentlyAttitudeResultEnum,
} from '@mx-space/api-client'

import { useIsLogged } from '~/atoms'
import { TiltedSendIcon } from '~/components/icons/TiltedSendIcon'
import { MotionButtonBase } from '~/components/ui/button'
import { Divider } from '~/components/ui/divider'
import { TextArea } from '~/components/ui/input'
import { Loading } from '~/components/ui/loading'
import { Markdown } from '~/components/ui/markdown'
import { RelativeTime } from '~/components/ui/relative-time'
import { CommentBoxRoot } from '~/components/widgets/comment/CommentBox'
import { Comments } from '~/components/widgets/comment/Comments'
import { PeekLink } from '~/components/widgets/peek/PeekLink'
import { LoadMoreIndicator } from '~/components/widgets/shared/LoadMoreIndicator'
import { sample } from '~/lib/_'
import { preventDefault } from '~/lib/dom'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'
import { urlBuilder } from '~/lib/url-builder'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'
import { useModalStack } from '~/providers/root/modal-stack-provider'

const FETCH_SIZE = 10
const QUERY_KEY = ['recent']
export default function Page() {
  return (
    <div>
      <header className="prose">
        <h1>思考</h1>
        <h3>谢谢你听我诉说</h3>
      </header>

      <main className="mt-10">
        <PostBox />
        <List />
      </main>
    </div>
  )
}

const PostBox = () => {
  const isLogin = useIsLogged()

  const [value, setValue] = useState('')
  const queryClient = useQueryClient()
  if (!isLogin) return null

  return (
    <form onSubmit={preventDefault} className="mb-8">
      <TextArea
        className="h-[150px] rounded-md border border-slate-200 bg-slate-100 dark:border-zinc-800 dark:bg-neutral-900/50"
        value={value}
        placeholder="此刻在想什么？"
        onChange={(e) => {
          setValue(e.target.value)
        }}
      >
        <div className="absolute bottom-2 right-2">
          <MotionButtonBase
            onClick={() => {
              apiClient.shorthand.proxy
                .post({ data: { content: value } })
                .then((res) => {
                  setValue('')

                  queryClient.setQueryData<
                    InfiniteData<
                      RecentlyModel[] & {
                        comments: number
                      }
                    >
                  >(QUERY_KEY, (old) => {
                    return produce(old, (draft) => {
                      draft?.pages[0].unshift(res.$serialized as any)
                      return draft
                    })
                  })
                })
            }}
            disabled={value.length === 0}
            className="duration-200 disabled:cursor-not-allowed disabled:opacity-10"
          >
            <TiltedSendIcon className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />
            <span className="sr-only">发送</span>
          </MotionButtonBase>
        </div>
      </TextArea>
    </form>
  )
}

const List = () => {
  const [hasNext, setHasNext] = useState(true)

  const { data, isLoading, fetchNextPage } = useInfiniteQuery(
    QUERY_KEY,
    async ({ pageParam }) => {
      const { data } = await apiClient.shorthand.getList(
        pageParam,
        undefined,
        FETCH_SIZE,
      )

      if (data.length < FETCH_SIZE) {
        setHasNext(false)
      }
      return data
    },
    {
      enabled: hasNext,
      refetchOnMount: true,

      getNextPageParam: (l) => {
        return l.length > 0 && l[l.length - 1]?.id
      },
    },
  )

  const owner = useAggregationSelector((a) => a.user)!

  const handleUp = (id: string) => {
    apiClient.recently
      .attitude(id, RecentlyAttitudeEnum.Up)
      .then(({ code }) => {
        if (code === RecentlyAttitudeResultEnum.Inc) {
          toast.success(sample(['(￣▽￣*) ゞ', '(＾▽＾)']))
        } else {
          toast.success('[○･｀Д´･○]')
        }
      })
  }

  const handleDown = (id: string) => {
    apiClient.recently
      .attitude(id, RecentlyAttitudeEnum.Down)
      .then(({ code }) => {
        if (code === RecentlyAttitudeResultEnum.Inc) {
          toast.success('(╥_╥)')
        } else {
          toast.success('ヽ (・∀・) ﾉ')
        }
      })
  }
  const { present } = useModalStack()

  if (isLoading) <Loading useDefaultLoadingText />

  return (
    <ul>
      {data?.pages.map((page) => {
        return page.map((item) => {
          return (
            <li
              key={item.id}
              className="mb-8 grid grid-cols-[40px_auto] flex-col gap-4 space-y-2"
            >
              <div className="translate-y-6">
                <img
                  src={owner.avatar}
                  className="rounded-full ring-2 ring-slate-200 dark:ring-zinc-800"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium">{owner.name}</span>

                  <span className="text-xs opacity-80">
                    <RelativeTime date={item.created} />
                  </span>
                </div>

                <div className="my-4 leading-relaxed">
                  <Markdown allowsScript>{item.content}</Markdown>

                  {!!item.ref && (
                    <div>
                      <RefPreview refModel={item.ref} />
                    </div>
                  )}
                </div>

                <div
                  className={clsx(
                    'mt-4 space-x-8 opacity-50 duration-200 hover:opacity-100',
                    '[&_button:hover]:text-accent [&_button]:inline-flex [&_button]:space-x-1 [&_button]:text-sm [&_button]:center',
                    '[&_button]:-mb-5 [&_button]:-ml-5 [&_button]:-mt-5 [&_button]:p-5',
                  )}
                >
                  <button
                    onClick={() => {
                      present({
                        title: '评论',
                        content: () => <CommentModal {...item} />,
                      })
                    }}
                  >
                    <i className="icon-[mingcute--comment-line]" />

                    <span className="sr-only">评论</span>
                    <span>
                      {/* @ts-expect-error */}
                      {item.comments}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      handleUp(item.id)
                    }}
                  >
                    <i className="icon-[mingcute--heart-line]" />
                    <span className="sr-only">喜欢</span>
                    <span>{item.up}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleDown(item.id)
                    }}
                  >
                    <i className="icon-[mingcute--heart-half-line]" />
                    <span className="sr-only">不喜欢</span>
                    <span>{item.down}</span>
                  </button>

                  <DeleteButton id={item.id} />
                </div>
              </div>
            </li>
          )
        })
      })}

      {hasNext && (
        <LoadMoreIndicator
          onLoading={() => {
            fetchNextPage()
          }}
        />
      )}
    </ul>
  )
}

const DeleteButton = (props: { id: string }) => {
  const isLogin = useIsLogged()
  const queryClient = useQueryClient()

  const handleDelete = () => {
    apiClient.shorthand
      .proxy(props.id)
      .delete()
      .then(() => {
        toast.success('删除成功')

        queryClient.setQueryData<InfiniteData<RecentlyModel[]>>(
          QUERY_KEY,
          (old) => {
            return produce(old, (draft) => {
              draft?.pages.forEach((page) => {
                page.forEach((item, index) => {
                  if (item.id === props.id) {
                    page.splice(index, 1)
                  }
                })
              })
            })
          },
        )
      })
  }
  const { present } = useModalStack()
  if (!isLogin) return null

  return (
    <button
      className="text-red-500"
      onClick={() => {
        present({
          title: '确定删除',
          content: ({ dismiss }) => (
            <div className="w-[300px] space-y-4">
              <div className="mt-4 flex justify-end space-x-4">
                <MotionButtonBase
                  onClick={() => {
                    handleDelete()
                    dismiss()
                  }}
                  className="text-red-500"
                >
                  确定
                </MotionButtonBase>
                <MotionButtonBase onClick={dismiss}>取消</MotionButtonBase>
              </div>
            </div>
          ),
        })
      }}
    >
      <i className="icon-[mingcute--delete-line]" />
      <span className="sr-only">删除</span>
    </button>
  )
}

const CommentModal = (props: RecentlyModel) => {
  const { id, allowComment, content } = props

  return (
    <div className="max-w-95vw w-[700px] overflow-y-auto overflow-x-hidden">
      <span>{allowComment && '回复：'}</span>

      <Markdown className="mt-4" allowsScript>
        {content}
      </Markdown>

      {allowComment && <CommentBoxRoot className="my-12" refId={id} />}

      <Comments refId={id} />
    </div>
  )
}

const RefPreview: FC<{ refModel: any }> = (props) => {
  const title = props.refModel?.title

  const url = useMemo(() => {
    return urlBuilder.build(props.refModel)
  }, [props.refModel])

  if (!title) {
    return null
  }

  return (
    <>
      <Divider className="my-4 w-12 bg-current opacity-50" />
      <p className="flex items-center space-x-2 opacity-80">
        发表于： <i className="icon-[mingcute--link-3-line]" />
        <PeekLink href={url} className="shiro-link--underline">
          {title}
        </PeekLink>
      </p>
    </>
  )
}
