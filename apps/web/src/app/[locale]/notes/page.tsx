import type { NoteWrappedWithLikedPayload } from '@mx-space/api-client'
import { notFound } from 'next/navigation'

import type { Locale } from '~/i18n/config'
import { redirect } from '~/i18n/navigation'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

export default definePrerenderPage<{ locale: Locale }>()({
  async fetcher() {
    const latest =
      await apiClient.note.proxy.latest.get<NoteWrappedWithLikedPayload>()

    return latest?.data
  },
  Component: async ({ data: nullableData, params }) => {
    if (!nullableData || !nullableData.isPublished) {
      notFound()
    }
    const { locale } = params
    redirect({ href: `/notes/${nullableData.nid}`, locale })
    return null
  },
})
