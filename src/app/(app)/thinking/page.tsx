'use client'

import type { RecentlyModel } from '@mx-space/api-client'
import {
  RecentlyAttitudeEnum,
  RecentlyAttitudeResultEnum,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import clsx from 'clsx'
import { produce } from 'immer'
import { stagger, useAnimate } from 'motion/react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { useIsLogged } from '~/atoms/hooks'
import { TiltedSendIcon } from '~/components/icons/TiltedSendIcon'
import { CommentBoxRootLazy, CommentsLazy } from '~/components/modules/comment'
import { PeekLink } from '~/components/modules/peek/PeekLink'
import { LoadMoreIndicator } from '~/components/modules/shared/LoadMoreIndicator'
import { MotionButtonBase, StyledButton } from '~/components/ui/button'
import { Divider } from '~/components/ui/divider'
import { TextArea } from '~/components/ui/input'
import { Loading } from '~/components/ui/loading'
import { Markdown } from '~/components/ui/markdown'
import { BlockLinkRenderer } from '~/components/ui/markdown/renderers/LinkRenderer'
import { useModalStack } from '~/components/ui/modal'
import { RelativeTime } from '~/components/ui/relative-time'
import { usePrevious } from '~/hooks/common/use-previous'
import { preventDefault } from '~/lib/dom'
import { sample } from '~/lib/lodash'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'
import { urlBuilder } from '~/lib/url-builder'
import { useAggregationSelector } from '~/providers/root/aggregation-data-provider'

import { FETCH_SIZE, QUERY_KEY } from './constants'

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
  const { mutateAsync: handleSend, isPending } = useMutation({
    mutationFn: async () => {
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
    },
  })
  if (!isLogin) return null
  return (
    <form onSubmit={preventDefault} className="mb-8">
      <TextArea
        bordered={false}
        wrapperClassName="h-[150px] bg-gray-200/50 dark:bg-zinc-800/50"
        value={value}
        placeholder="此刻在想什么？"
        onChange={(e) => {
          setValue(e.target.value)
        }}
        onCmdEnter={(e) => {
          e.preventDefault()
          handleSend()
        }}
      >
        <div className="center absolute bottom-2 right-2 flex size-5">
          <MotionButtonBase
            onClick={() => handleSend()}
            disabled={value.length === 0 || isPending}
            className="duration-200 disabled:cursor-not-allowed disabled:opacity-10"
          >
            <TiltedSendIcon className="size-5 text-zinc-800 dark:text-zinc-200" />
            <span className="sr-only">发送</span>
          </MotionButtonBase>
        </div>
      </TextArea>
    </form>
  )
}

const List = () => {
  const [hasNext, setHasNext] = useState(true)

  const { data, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: QUERY_KEY,
    queryFn: async ({ pageParam }) => {
      const { data } = await apiClient.shorthand.getList({
        before: pageParam,
        size: FETCH_SIZE,
      })

      if (data.length < FETCH_SIZE) {
        setHasNext(false)
      }
      return data
    },
    enabled: hasNext,
    refetchOnMount: true,

    getNextPageParam: (l) => {
      return l.length > 0 ? l.at(-1)?.id : undefined
    },
    initialPageParam: undefined as undefined | string,
  })

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

  const [scope, animate] = useAnimate()

  const getPrevData = usePrevious(data)
  useEffect(() => {
    if (!data) return
    const pages = getPrevData()?.pages
    const count = pages?.reduce((acc, cur) => {
      return acc + cur.length
    }, 0)

    animate(
      'li',
      {
        opacity: 1,
        y: 0,
      },
      {
        duration: 0.2,
        delay: stagger(0.1, {
          startDelay: 0.15,
          from: count ? count - FETCH_SIZE : 0,
        }),
      },
    )
  }, [data])

  if (isLoading) <Loading useDefaultLoadingText />

  return (
    <ul ref={scope}>
      {data?.pages.map((page) => {
        return page.map((item) => {
          const isSingleLinkContent = (() => {
            const trimmedContent = item.content.trim()
            return (
              trimmedContent.startsWith('http') &&
              trimmedContent.split('\n').length === 1
            )
          })()

          return (
            <li
              key={item.id}
              className="mb-8 grid translate-y-[50px] grid-cols-[40px_auto] flex-col gap-4 space-y-2 opacity-[0.0001]"
            >
              <div className="translate-y-6">
                <img
                  src={owner.avatar}
                  className="size-[40px] rounded-full ring-2 ring-slate-200 dark:ring-zinc-800"
                />
              </div>
              <div className="min-w-0 max-w-full">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium">{owner.name}</span>

                  <span className="text-xs opacity-80">
                    <RelativeTime date={item.created} />
                  </span>
                </div>

                <div className="relative min-w-0 grow">
                  {isSingleLinkContent ? (
                    <BlockLinkRenderer href={item.content} />
                  ) : (
                    <div
                      className={clsx(
                        'relative inline-block rounded-xl p-3 text-zinc-800 dark:text-zinc-200',
                        'rounded-tl-sm bg-zinc-600/5 dark:bg-zinc-500/20',
                        'max-w-full overflow-auto',
                      )}
                    >
                      <Markdown forceBlock>{item.content}</Markdown>

                      {!!item.ref && (
                        <div>
                          <RefPreview refModel={item.ref} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={clsx(
                    'mt-4 space-x-8 opacity-50 duration-200 hover:opacity-100',
                    '[&_button]:center [&_button:hover]:text-accent [&_button]:inline-flex [&_button]:space-x-1 [&_button]:text-sm',
                    '[&_button]:-my-5 [&_button]:-ml-5 [&_button]:p-5',
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
                    <i className="i-mingcute-comment-line" />

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
                    <i className="i-mingcute-heart-line" />
                    <span className="sr-only">喜欢</span>
                    <span>{item.up}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleDown(item.id)
                    }}
                  >
                    <i className="i-mingcute-heart-crack-line" />
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
      className="text-red-500 hover:text-red-600 dark:hover:text-red-300"
      onClick={() => {
        present({
          title: '确定删除',
          content: ({ dismiss }) => (
            <div className="w-[300px] space-y-4">
              <div className="mt-4 flex justify-end space-x-4">
                <StyledButton
                  variant="primary"
                  onClick={() => {
                    handleDelete()
                    dismiss()
                  }}
                  className="bg-zinc-100/80 !text-red-500 dark:bg-neutral-900/90"
                >
                  确定
                </StyledButton>
                <StyledButton variant="primary" onClick={dismiss}>
                  取消
                </StyledButton>
              </div>
            </div>
          ),
        })
      }}
    >
      <i className="i-mingcute-delete-line" />
      <span className="sr-only">删除</span>
    </button>
  )
}

const CommentModal = (props: RecentlyModel) => {
  const { id, allowComment, content } = props

  return (
    <div className="max-w-[95vw] overflow-y-auto overflow-x-hidden md:w-[500px] lg:w-[600px] xl:w-[700px]">
      <span>{allowComment && '回复：'}</span>

      <Markdown className="mt-4" allowsScript>
        {content}
      </Markdown>

      {allowComment && <CommentBoxRootLazy className="my-12" refId={id} />}

      <CommentsLazy refId={id} />
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
        发表于： <i className="i-mingcute-link-3-line" />
        <PeekLink href={url} className="shiro-link--underline">
          {title}
        </PeekLink>
      </p>
    </>
  )
}
