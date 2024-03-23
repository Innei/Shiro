'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { FullPageLoading } from '~/components/ui/loading'
import { apiClient } from '~/lib/request.new'

export default function Page() {
  const {
    data: nid,
    isError,
    isLoading,
  } = useQuery({
    queryFn: async () => {
      return apiClient.note.getLatest()
    },
    queryKey: ['note-latest'],
    select(data) {
      return data.data.nid
    },
  })

  const router = useRouter()
  useEffect(() => {
    if (!nid) return

    router.replace(`/notes/${nid}`)
  }, [nid, router])

  return <FullPageLoading />
}
