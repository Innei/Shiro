/**
 * @deprecated
 */

'use client'

import { useQueryClient } from '@tanstack/react-query'
import { memo } from 'react'
import type { QueryKey } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'

import { useBeforeMounted } from '~/hooks/common/use-before-mounted'

export const QueryHydration = memo(
  (props: PropsWithChildren & { data: any; queryKey: QueryKey }) => {
    const client = useQueryClient()
    useBeforeMounted(() => {
      client.setQueriesData(props.queryKey, props.data)

      console.log('QueryHydration', props.queryKey, props.data)
    })

    return props.children
  },
)
