import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { attachServerFetchAuth, detachServerFetchAuth } from '~/lib/attach-ua'
import { AuthKeyNames } from '~/lib/cookie'
import { apiClient } from '~/lib/request'
import { definePrerenderPage } from '~/lib/request.server'

export default definePrerenderPage()({
  async fetcher() {
    attachServerFetchAuth()
    const { data } = await apiClient.note.getLatest()
    detachServerFetchAuth()
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
