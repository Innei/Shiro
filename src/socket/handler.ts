import { queryClient } from '~/providers/root/react-query-provider'
import { produce } from 'immer'
import type {
  NoteModel,
  PaginateResult,
  PostModel,
  SayModel,
} from '@mx-space/api-client'
import type { InfiniteData } from '@tanstack/react-query'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'

import { sayQueryKey } from '~/app/says/query'
import { setOnlineCount } from '~/atoms'
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
  getCurrentPostData,
  setCurrentPostData,
} from '~/providers/post/CurrentPostDataProvider'
import { EventTypes } from '~/types/events'

export const eventHandler = (
  type: EventTypes,
  data: any,
  router: AppRouterInstance,
) => {
  switch (type) {
    case 'VISITOR_ONLINE':
    case 'VISITOR_OFFLINE': {
      const { online } = data
      setOnlineCount(online)
      break
    }

    case EventTypes.POST_UPDATE: {
      const post = data as PostModel
      if (getCurrentPostData()?.id === post.id) {
        setCurrentPostData((draft) => {
          const nextPost = { ...data }
          Reflect.deleteProperty(nextPost, 'category')
          Object.assign(draft, nextPost)
        })
        toast('文章已更新')
      }
      break
    }

    case EventTypes.POST_DELETE: {
      const post = data as PostModel
      if (getCurrentPostData()?.id === post.id) {
        router.replace(routeBuilder(Routes.PageDeletd, {}))
        toast.error('文章已删除')
      }
      break
    }

    case 'NOTE_UPDATE': {
      const note = data as NoteModel
      if (getCurrentNoteData()?.data.id === note.id) {
        setCurrentNoteData((draft) => {
          Object.assign(draft.data, note)
        })
        toast('手记已更新')
      }
      break
    }

    case 'NOTE_DELETE': {
      const note = data as NoteModel
      if (getCurrentNoteData()?.data.id === note.id) {
        router.replace(routeBuilder(Routes.PageDeletd, {}))
        toast.error('手记已删除')
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
      }
      break
    }

    // TODO create event

    case EventTypes.SAY_CREATE: {
      if (location.pathname === routeBuilder(Routes.Says, {})) {
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

    default: {
      if (isDev) {
        console.log(type, data)
      }
    }
  }
}
