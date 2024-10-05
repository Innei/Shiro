'use client'

import { useQuery } from '@tanstack/react-query'
import { sleep } from 'openai/core'

import { useOnlineCount } from '~/atoms'
import { useSocketIsConnect } from '~/atoms/hooks'
import { ImpressionView } from '~/components/common/ImpressionTracker'
import { PeekLink } from '~/components/modules/peek/PeekLink'
import { Divider } from '~/components/ui/divider'
import { FloatPopover } from '~/components/ui/float-popover'
import { NumberSmoothTransition } from '~/components/ui/number-transition/NumberSmoothTransition'
import { TrackerAction } from '~/constants/tracker'
import { usePageIsActive } from '~/hooks/common/use-is-active'
import { apiClient } from '~/lib/request'
import { routeBuilder, Routes } from '~/lib/route-builder'

const Help = () => {
  return (
    <FloatPopover
      mobileAsSheet
      as="span"
      triggerElement={<i className="i-mingcute-question-line cursor-help" />}
      type="tooltip"
      asChild
      sheet={{
        triggerAsChild: true,
      }}
    >
      <div className="space-y-2 leading-relaxed">
        <p className="flex items-center space-x-1 opacity-80">
          <i className="i-mingcute-question-line" />
          <span className="font-medium">这是如何实现的？</span>
        </p>
        <p>
          当你打开这个页面时，会自动建立 WebSocket
          连接，当成功连接后服务器会推送当前浏览页面的人数。
        </p>
        <p>
          WebSocket
          用于通知站点，站长在站点的实时活动，包括不限于文章的发布和更新。
        </p>

        <Divider />

        <p>
          当前 Socket 状态： <ConnectedIndicator />
        </p>
      </div>
    </FloatPopover>
  )
}

const ConnectedIndicator = () => {
  const connected = useSocketIsConnect()

  return (
    <div className="inline-flex items-center">
      <ImpressionView
        trackerMessage="socket_status"
        action={TrackerAction.Impression}
      />
      <ConnectionStatus isConnected={connected} />
    </div>
  )
}

function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
  const color = isConnected ? '#00FC47' : '#FC0000'
  const secondaryColor = isConnected
    ? 'rgba(174, 244, 194, 0.46)'
    : 'rgba(244, 174, 174, 0.46)'
  const text = isConnected ? '已连接' : '未连接'

  const backgroundStyle = {
    background: `radial-gradient(45.91% 45.91% at 49.81% 54.09%, ${color} 7.13%, ${secondaryColor} 65.83%, rgba(252, 252, 252, 0.00) 100%)`,
  }

  return (
    <>
      <span className="absolute size-5" style={backgroundStyle} />
      <span className="ml-6">{text}</span>
    </>
  )
}

export const GatewayInfo = () => {
  const isActive = usePageIsActive()
  const count = useOnlineCount()

  if (!isActive) return null
  return (
    <div className="inline-flex items-center gap-2">
      <FloatPopover
        asChild
        mobileAsSheet
        placement="top"
        trigger="both"
        offset={10}
        triggerElement={
          <span key={count} className="cursor-pointer">
            正在被{' '}
            <span>
              <NumberSmoothTransition>{count}</NumberSmoothTransition>
            </span>{' '}
            人看爆
          </span>
        }
      >
        <RoomsInfo />
      </FloatPopover>
      <Help />
    </div>
  )
}

const RoomsInfo = () => {
  const { data } = useQuery({
    queryKey: ['rooms'],
    refetchOnMount: true,
    staleTime: 1000 * 10,
    queryFn: async () => {
      await sleep(1000)
      const res = await apiClient.activity.getRoomsInfo()
      const data = res.$serialized
      const result = [] as {
        path: string
        title: string
        count: number
      }[]
      const morphArticleIdToRoomName = (id: string) => `article_${id}`
      data.objects.notes.forEach((note) => {
        result.push({
          path: routeBuilder(Routes.Note, {
            id: note.nid,
          }),
          title: note.title,
          count: data.roomCount[morphArticleIdToRoomName(note.id)],
        })
      })
      data.objects.posts.forEach((post) => {
        result.push({
          path: routeBuilder(Routes.Post, {
            category: post.category.slug,
            slug: post.slug,
          }),
          title: post.title,
          count: data.roomCount[morphArticleIdToRoomName(post.id)],
        })
      })
      data.objects.pages.forEach((page) => {
        result.push({
          path: routeBuilder(Routes.Page, {
            slug: page.slug,
          }),
          title: page.title,
          count: data.roomCount[morphArticleIdToRoomName(page.id)],
        })
      })
      return result.sort((a, b) => b.count - a.count)
    },
  })

  if (!data)
    return (
      <div className="center flex size-6">
        <div className="loading loading-spinner" />
      </div>
    )
  if (data.length === 0)
    return <div className="text-gray-500">还没有小伙伴在阅览文章哦~</div>
  return (
    <div className="lg:max-w-[400px]">
      <div className="mb-2 text-sm font-medium">下面的内容正在被看爆：</div>
      <ul className="flex flex-col justify-between gap-2">
        {data.map((room) => (
          <li key={room.path} className="flex items-center justify-between">
            <PeekLink href={room.path} className="hover:underline">
              {room.title}
            </PeekLink>
            {!!room.count && (
              <span className="ml-5 inline-flex items-center text-sm text-gray-500">
                <i className="i-mingcute-user-visible-line" /> {room.count}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
