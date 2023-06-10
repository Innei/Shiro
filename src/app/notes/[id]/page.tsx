'use client'

import { useParams } from 'next/navigation'
import type { UseQueryResult } from '@tanstack/react-query'
import type { FC } from 'react'

import { Loading } from '~/components/ui/loading'
import { useNoteByNidQuery } from '~/queries/hooks/useNoteQuery'
import { parseMarkdown } from '~/remark'

const LoadingComponent = () => <Loading />
const PageDataHolder = (
  PageImpl: FC<any>,
  useQuery: () => UseQueryResult<any>,
) => {
  const Component: FC = (props) => {
    const { data, isLoading } = useQuery()

    if (isLoading || data === null) {
      return <LoadingComponent />
    }
    return <PageImpl {...props} />
  }
  return Component
}

const PageImpl = () => {
  const { id } = useParams() as { id: string }
  const { data } = useNoteByNidQuery(id)

  return (
    <article className="prose">
      <header>
        <h1>{data?.data?.title}</h1>
      </header>
      {parseMarkdown(data?.data?.text || ' ').result}
    </article>
  )
}

export default PageDataHolder(PageImpl, () => {
  const { id } = useParams() as { id: string }
  return useNoteByNidQuery(id)
})
