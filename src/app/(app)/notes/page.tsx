import type { NoteWrappedPayload } from '@mx-space/api-client'

import { NotFound404 } from '~/components/common/404'
import { apiClient } from '~/lib/request'

import Redirect from './redirect'

export default async function Page() {
  const data = await fetch(apiClient.note.proxy.latest.toString(true), {
    next: {
      revalidate: 60 * 60,
      tags: ['note'],
    },
  })
    .then((res) => res.json() as Promise<NoteWrappedPayload>)
    .catch(() => {
      return null
    })

  if (!data || !data.data) {
    return <NotFound404 />
  }
  return <Redirect nid={data.data?.nid} />
}
