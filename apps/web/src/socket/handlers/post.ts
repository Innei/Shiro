import type { PostModel } from '@mx-space/api-client'
import * as React from 'react'

import {
  getTranslation,
  getViewingOriginal,
  setTranslationPending,
} from '~/atoms/translation'
import { IcTwotoneSignpost } from '~/components/icons/menu-collection'
import { DOMCustomEvents } from '~/constants/event'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { toast } from '~/lib/toast'
import {
  getGlobalCurrentPostData,
  setGlobalCurrentPostData,
} from '~/providers/post/CurrentPostDataProvider'
import { EventTypes } from '~/types/events'

import type { EventHandler } from './types'
import { trackerRealtimeEvent, updateMessage } from './types'

export const postCreateHandler: EventHandler = (data) => {
  const { title, category, slug } = data as PostModel
  toast.success(`有新的内容发布了：「${title}」`, {
    onClick: () => {
      window.peek(`/posts/${category.slug}/${slug}`)
    },
    iconElement: React.createElement(IcTwotoneSignpost),
  })

  trackerRealtimeEvent()
}

export const postUpdateHandler: EventHandler = (data) => {
  const post = data as PostModel
  const currentData = getGlobalCurrentPostData()

  if (!currentData) return
  if (currentData.id !== post.id) return

  const contentChanged =
    currentData.text !== post.text || currentData.content !== post.content

  const currentTranslation = getTranslation()
  if (
    currentTranslation &&
    currentTranslation.refId === post.id &&
    !getViewingOriginal() &&
    contentChanged
  ) {
    setTranslationPending(true)
  }

  setGlobalCurrentPostData((draft) => {
    const nextPost = { ...data }
    Reflect.deleteProperty(nextPost, 'category')
    Object.assign(draft, nextPost)
  })
  toast.info(updateMessage)
  trackerRealtimeEvent()

  if (contentChanged) {
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent(DOMCustomEvents.RefreshToc))
    }, 100)
  }
}

export const postDeleteHandler: EventHandler = (data, { router }) => {
  const post = data as PostModel
  if (
    location.pathname ===
      routeBuilder(Routes.Post, {
        category: post.category.slug,
        slug: post.slug,
      }) &&
    getGlobalCurrentPostData()?.id === post.id
  ) {
    router.replace(routeBuilder(Routes.PageDeletd, {}))
    toast.error('文章已删除')
    trackerRealtimeEvent()
  }
}

export const postHandlers = {
  [EventTypes.POST_CREATE]: postCreateHandler,
  [EventTypes.POST_UPDATE]: postUpdateHandler,
  [EventTypes.POST_DELETE]: postDeleteHandler,
} as const
