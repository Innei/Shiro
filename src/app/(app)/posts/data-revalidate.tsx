'use client'

import { useEffect, useRef } from 'react'
import type { FC } from 'react'

import { appStaticConfig } from '~/app.static.config'
import { withClientOnly } from '~/components/common/ClientOnly'

import { revalidatePostList } from './action'

export const PostListDataRevaildate: FC<{
  fetchedAt: string
}> = withClientOnly((props) => {
  const onceRef = useRef(false)

  useEffect(() => {
    if (onceRef.current) return

    const isOutdated =
      Date.now() - new Date(props.fetchedAt).getTime() >
      appStaticConfig.revalidate

    onceRef.current = true
    if (!isOutdated) return

    revalidatePostList()
  }, [props.fetchedAt])
  return null
})
