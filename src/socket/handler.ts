import { queryClient } from '~/providers/root/react-query-provider'
import React from 'react'
import { produce } from 'immer'
import type {
  NoteModel,
  PaginateResult,
  PostModel,
  RecentlyModel,
  SayModel,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { sayQueryKey } from '~/app/says/query'
import { setOnlineCount } from '~/atoms'
import { setActivityMediaInfo, setActivityProcessName } from '~/atoms/activity'
import {
  FaSolidFeatherAlt,
  IcTwotoneSignpost,
  MdiLightbulbOn20,
} from '~/components/icons/menu-collection'
import { DOMCustomEvents } from '~/constants/event'
import { TrackerAction } from '~/constants/tracker'
import { isDev } from '~/lib/env'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { toast } from '~/lib/toast'
import {
  getCurrentNoteData,
  setCurrentNoteData,
} from '~/providers/note/CurrentNoteDataProvider'
import {
  getCurrentPageData,
  setCurrentPageData,
} from '~/providers/page/CurrentPageDataProvider'
import {
  getGlobalCurrentPostData,
  setGlobalCurrentPostData,
} from '~/providers/post/CurrentPostDataProvider'
import { EventTypes } from '~/types/events'

const trackerRealtimeEvent = () => {
  document.dispatchEvent(
    new CustomEvent('impression', {
      detail: {
        action: TrackerAction.Impression,
        label: 'Socket Realtime Event',
      },
    }),
  )
}

export const eventHandler = (
  type: string,
  data: any,
  router: AppRouterInstance,
) => {
  switch (type) {
    case EventTypes.VISITOR_ONLINE:
    case EventTypes.VISITOR_OFFLINE: {
      const { online } = data
      setOnlineCount(online)
      break
    }

    case EventTypes.POST_UPDATE: {
      const post = data as PostModel
      const currentData = getGlobalCurrentPostData()

      if (!currentData) break
      if (currentData.id !== post.id) {
        break
      }

      setGlobalCurrentPostData((draft) => {
        const nextPost = { ...data }
        Reflect.deleteProperty(nextPost, 'category')
        Object.assign(draft, nextPost)
      })
      toast('文章已更新')
      trackerRealtimeEvent()

      if (currentData.text !== post.text) {
        document.dispatchEvent(new CustomEvent(DOMCustomEvents.RefreshToc))
      }

      break
    }

    case EventTypes.POST_DELETE: {
      const post = data as PostModel
      if (
        location.pathname ===
        routeBuilder(Routes.Post, {
          category: post.category.slug,
          slug: post.slug,
        })
      ) {
        if (getGlobalCurrentPostData()?.id === post.id) {
          router.replace(routeBuilder(Routes.PageDeletd, {}))
          toast.error('文章已删除')
          trackerRealtimeEvent()
        }
      }

      break
    }

    case EventTypes.NOTE_UPDATE: {
      const note = data as NoteModel
      const currentData = getCurrentNoteData()?.data

      if (!currentData) break
      if (currentData.id !== note.id) {
        break
      }

      setCurrentNoteData((draft) => {
        Object.assign(draft.data, note)
      })
      toast('手记已更新')
      trackerRealtimeEvent()

      if (currentData.text !== note.text) {
        document.dispatchEvent(new CustomEvent(DOMCustomEvents.RefreshToc))
      }

      break
    }

    case EventTypes.NOTE_DELETE: {
      const note = data as NoteModel
      if (
        location.pathname ===
        routeBuilder(Routes.Note, {
          id: note.id,
        })
      ) {
        if (getCurrentNoteData()?.data.id === note.id) {
          router.replace(routeBuilder(Routes.PageDeletd, {}))
          toast.error('手记已删除')
          trackerRealtimeEvent()
        }
      }

      break
    }

    case EventTypes.PAGE_UPDATED: {
      const { slug } = data
      if (getCurrentPageData()?.slug === slug) {
        setCurrentPageData((draft) => {
          Object.assign(draft, data)
        })
        toast('页面已更新')
        trackerRealtimeEvent()
      }
      break
    }

    case EventTypes.NOTE_CREATE: {
      const { title, nid } = data as NoteModel

      toast.success('有新的内容发布了：' + `「${title}」`, {
        onClick: () => {
          window.peek(`/notes/${nid}`)
        },
        iconElement: React.createElement(FaSolidFeatherAlt),
        autoClose: false,
      })

      trackerRealtimeEvent()
      break
    }

    case EventTypes.POST_CREATE: {
      const { title, category, slug } = data as PostModel
      toast.success('有新的内容发布了：' + `「${title}」`, {
        onClick: () => {
          window.peek(`/posts/${category.slug}/${slug}`)
        },
        iconElement: React.createElement(IcTwotoneSignpost),
      })

      trackerRealtimeEvent()
      break
    }

    case EventTypes.RECENTLY_CREATE: {
      trackerRealtimeEvent()
      if (location.pathname === routeBuilder(Routes.Thinking, {})) {
        // 页面上已经做了更新
        // queryClient.setQueryData<InfiniteData<RecentlyModel[]>>(
        //   ThinkingQueryKey,
        //   (prev) => {
        //     return produce(prev, (draft) => {
        //       draft?.pages[0].unshift(data as RecentlyModel)
        //     })
        //   },
        // )
      } else {
        toast.success(`写下一点小思考：\n${(data as RecentlyModel).content}`, {
          autoClose: 10000,
          iconElement: React.createElement(MdiLightbulbOn20),
          onClick: () => {
            router.push(routeBuilder(Routes.Thinking, {}))
          },
        })
      }
      break
    }

    case EventTypes.SAY_CREATE: {
      if (location.pathname === routeBuilder(Routes.Says, {})) {
        trackerRealtimeEvent()
        queryClient.setQueryData<InfiniteData<PaginateResult<SayModel>>>(
          sayQueryKey,
          (prev) => {
            return produce(prev, (draft) => {
              draft?.pages?.[0].data.unshift(data)
            })
          },
        )
      }
      break
    }

    case 'fn#media-update': {
      setActivityMediaInfo(data)
      break
    }

    case 'fn#ps-update': {
      setActivityProcessName(data.process)
      break
    }

    case 'shiro#update': {
      toast.info('站点版本已更新，请刷新页面', {
        onClick: () => {
          location.reload()
        },
      })
      break
    }

    default: {
      if (isDev) {
        console.log(type, data)
      }
    }
  }
}
