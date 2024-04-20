import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NoteWrappedWithLikedPayload } from '@mx-space/api-client'

import { getAuthFromCookie } from '~/lib/attach-fetch'
import { AuthKeyNames } from '~/lib/cookie'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

export default definePrerenderPage()({
  async fetcher() {
    const { data } =
      await apiClient.note.proxy.latest.get<NoteWrappedWithLikedPayload>({
        params: {
          token: getAuthFromCookie()
            ? `bearer ${getAuthFromCookie()}`
            : undefined,
        },
      })

    return data
  },
  Component: ({ data: { nid, hide } }) => {
    const jwt = cookies().get(AuthKeyNames[0])?.value
    if (hide) {
      return redirect(`/notes/${nid}?token=${jwt}`)
    } else {
      redirect(`/notes/${nid}`)
    }
  },
})
