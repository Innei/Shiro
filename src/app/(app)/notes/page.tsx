import type { NoteWrappedWithLikedPayload } from '@mx-space/api-client'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import { getAuthFromCookie } from '~/lib/attach-fetch'
import { AuthKeyNames } from '~/lib/cookie'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

export default definePrerenderPage()({
  async fetcher() {
    const cookie = await getAuthFromCookie()
    const latest =
      await apiClient.note.proxy.latest.get<NoteWrappedWithLikedPayload>({
        params: {
          token: cookie ? `bearer ${cookie}` : undefined,
        },
      })

    return latest?.data
  },
  Component: async ({ data: nullableData }) => {
    if (!nullableData) {
      notFound()
    }
    const { nid, hide } = nullableData
    const jwt = (await cookies()).get(AuthKeyNames[0])?.value
    if (hide) {
      return redirect(`/notes/${nid}?token=${jwt}`)
    } else {
      redirect(`/notes/${nid}`)
    }
  },
})
