import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { StyledButton } from '~/components/ui/button'
import { RelativeTime } from '~/components/ui/relative-time'
import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'

import {
  CodeIcon,
  FluentGuest28Filled,
  IcBaselineFavoriteBorder,
  IcSharpPeopleOutline,
  MingcuteGame1Line,
  NotebookMinimalistic,
  PhAlignLeft,
  RedisIcon,
  SolarPieChartBroken,
  TablerActivityHeartbeat,
} from './icons'

interface CardProps {
  label: string
  value: number | string
  icon: ReactNode
  actions?: {
    name: string
    onClick: () => void
    primary?: boolean
    showBadage?: boolean
  }[]

  highlight?: boolean
}

export const DataStat = () => {
  const { data: stat, dataUpdatedAt } = useQuery({
    queryKey: ['stat'],
    queryFn: () => fetchStat(),

    refetchInterval: 1000 * 15,
  })

  const { data: counts } = useQuery({
    queryKey: ['readAndLikeCounts'],
    queryFn: () => fetchReadAndLikeCounts(),
    select(data) {
      if (!data) return
      return {
        readAndLikeCounts: data,
      }
    },
  })

  const { data: siteWordCount } = useQuery({
    queryKey: ['siteWordCount'],
    queryFn: () => fetchSiteWordCount(),
    select(data) {
      if (!data) return
      return data.data.length
    },
  })
  const { readAndLikeCounts } = counts || {}
  const navigate = useNavigate()

  const dataStat = useMemo<CardProps[]>(() => {
    if (!stat) return []
    return [
      {
        label: '博文',
        value: stat.posts,
        icon: <CodeIcon />,
        actions: [
          {
            name: '撰写',
            primary: true,
            onClick() {
              navigate('/dashboard/posts/edit')
            },
          },
          {
            name: '管理',
            onClick() {
              navigate('/dashboard/posts/list')
            },
          },
        ],
      },

      {
        label: '手记',
        value: stat.notes,
        icon: <i className="i-mingcute-quill-pen-line" />,
        actions: [
          {
            name: '撰写',
            primary: true,
            onClick() {
              navigate('/dashboard/notes/edit')
            },
          },
          {
            name: '管理',
            onClick() {
              navigate('/dashboard/notes/list')
            },
          },
        ],
      },

      {
        label: '页面',
        value: stat.pages,
        icon: <i className="i-mingcute-file-line" />,
        actions: [
          {
            primary: true,
            name: '管理',
            onClick() {
              navigate('/dashboard/pages')
            },
          },
        ],
      },

      {
        label: '分类',
        value: stat.categories,
        icon: <i className="i-mingcute-pen-line" />,
        actions: [
          {
            primary: true,
            name: '管理',
            onClick() {
              navigate('/dashboard/posts/category')
            },
          },
        ],
      },

      {
        label: '未读评论',
        value: stat.unreadComments,
        icon: <i className="i-mingcute-comment-line" />,
        highlight: stat.unreadComments > 0,
        actions: [
          {
            primary: true,
            name: '管理',
            onClick() {
              navigate('/dashboard/comments')
            },
          },
        ],
      },

      {
        label: '缓存',
        value: 'Redis',
        icon: <RedisIcon />,
        actions: [
          {
            primary: false,
            name: '清除 API 缓存',
            onClick() {
              apiClient.proxy.clean_catch.get().then(() => {
                toast.success('清除成功')
              })
            },
          },
          {
            primary: false,
            name: '清除数据缓存',
            onClick() {
              apiClient.proxy.clean_redis.get().then(() => {
                toast.success('清除成功')
              })
            },
          },
        ],
      },

      {
        label: 'API 总调用次数',
        value: stat.callTime,
        icon: <TablerActivityHeartbeat />,
      },
      {
        label: '今日 IP 访问次数',
        value: stat.todayIpAccessCount,
        icon: <SolarPieChartBroken />,
      },
      {
        label: '全站字符数',
        value: siteWordCount,
        icon: <PhAlignLeft />,
      },

      {
        label: '总阅读量',
        value: readAndLikeCounts?.totalReads,
        icon: <NotebookMinimalistic />,
      },
      {
        label: '总点赞数',
        value: readAndLikeCounts?.totalLikes,
        icon: <IcBaselineFavoriteBorder />,
      },

      {
        label: '当前在线访客',
        value: stat.online,
        icon: <IcSharpPeopleOutline />,
      },
      {
        label: '今日访客',
        value: stat.todayOnlineTotal,
        icon: <FluentGuest28Filled />,
      },
      {
        value: stat.todayMaxOnline,
        label: '今日最多同时在线人数',
        icon: <MingcuteGame1Line />,
      },
    ]
  }, [
    navigate,
    readAndLikeCounts?.totalLikes,
    readAndLikeCounts?.totalReads,
    siteWordCount,
    stat,
  ])

  return (
    <div className="relative @container">
      <h3 className="mb-4 text-xl font-light text-opacity-80">
        数据看板：
        <small className="text-sm">
          数据更新于： <RelativeTime date={new Date(dataUpdatedAt)} />
        </small>
      </h3>
      <div className="grid grid-cols-1 gap-6 @[550px]:grid-cols-2 @[900px]:grid-cols-3 @[1124px]:grid-cols-4 @[1200px]:grid-cols-5">
        {dataStat.map((stat) => (
          <div
            className={clsx(
              'relative rounded-md border p-4',
              stat.highlight && 'border-accent bg-accent/20',
            )}
            key={stat.label}
          >
            <div className="font-medium">{stat.label}</div>

            <div className="my-2 text-2xl font-medium">
              {formatNumber(stat.value)}
            </div>

            <div className="center absolute right-4 top-1/2 flex -translate-y-1/2 text-[30px]">
              {stat.icon}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {stat.actions?.map((action) => (
                <StyledButton
                  variant={action.primary ? 'primary' : 'secondary'}
                  key={action.name}
                  className="rounded-md shadow-none"
                  onClick={action.onClick}
                >
                  {action.name}
                </StyledButton>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const formatNumber = (num: string | number) => {
  const isNumber = !Number.isNaN(+num)
  if (!isNumber) return num
  return Intl.NumberFormat().format(+num)
}

const fetchStat = async () => {
  const counts = (await apiClient.aggregate.proxy.stat.get()) as any

  return counts
}

const fetchReadAndLikeCounts = async () =>
  await apiClient.aggregate.proxy.count_read_and_like.get<{
    totalLikes: number
    totalReads: number
  }>()

const fetchSiteWordCount = async () =>
  await apiClient.proxy.aggregate.count_site_words.get<{
    data: { length: number }
  }>()
