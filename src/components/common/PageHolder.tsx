import { memo } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { FC } from 'react'

import { Loading } from '~/components/ui/loading'

const LoadingComponent = () => <Loading useDefaultLoadingText />
export const PageDataHolder = (
  PageImpl: FC<any>,
  useQuery: () => UseQueryResult<any>,
): FC => {
  const MemoedPageImpl = memo(PageImpl)
  MemoedPageImpl.displayName = `PageImplMemoed`
  const Component: FC = (props) => {
    const { data, isLoading } = useQuery()

    if (isLoading || data === null) {
      return <LoadingComponent />
    }
    return <MemoedPageImpl {...props} />
  }
  return Component
}
