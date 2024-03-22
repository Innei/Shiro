'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { NotFound404 } from '~/components/common/404'
import { Loading } from '~/components/ui/loading'
import { apiClient } from '~/lib/request.new'

export default function Page() {
  const { id } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: [id, 'project'],
    queryFn: async ({ queryKey }) => {
      const [id] = queryKey
      return apiClient.project.getById(id as string)
    },
  })
  const router = useRouter()
  useEffect(() => {
    if (data?.projectUrl) {
      window.open(data.projectUrl)
      router.back()
    }
  }, [data?.projectUrl])

  if (isLoading) {
    return <Loading useDefaultLoadingText />
  }

  if (!data) {
    return <NotFound404 />
  }

  return null
}
