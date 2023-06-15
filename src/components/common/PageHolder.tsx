import type { UseQueryResult } from '@tanstack/react-query'
import type { FC } from 'react'

import { Loading } from '~/components/ui/loading'

const LoadingComponent = () => <Loading loadingText="别着急，坐和放宽" />
export const PageDataHolder = (
  PageImpl: FC<any>,
  useQuery: () => UseQueryResult<any>,
): FC => {
  const Component: FC = (props) => {
    const { data, isLoading } = useQuery()

    if (isLoading || data === null) {
      return <LoadingComponent />
    }
    return <PageImpl {...props} />
  }
  return Component
}
