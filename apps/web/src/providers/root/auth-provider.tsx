'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { FC, PropsWithChildren } from 'react'

import { apiClient } from '~/lib/request'
import { toast } from '~/lib/toast'

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: ok, isLoading } = useQuery({
    queryKey: ['check-auth'],
    // 5 min ,
    refetchInterval: 5 * 60 * 1000,
    queryFn: async () => {
      const { ok } = await apiClient.owner.checkTokenValid()

      return !!ok
    },
  })
  const router = useRouter()
  if (isLoading) return null

  if (!ok) {
    toast.error('Not auth!')
    router.push('/')
  }

  return children
}
