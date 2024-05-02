import { ErrorBoundary } from '~/components/common/ErrorBoundary'

import { ActivityPostList } from './ActivityPostList'
import { ActivityRecent } from './ActivityRecent'
import { TwoColumnLayout } from './TwoColumnLayout'

export const ActivityScreen = () => {
  return (
    <div className="mt-24">
      <TwoColumnLayout
        rightContainerClassName="block lg:flex [&>div]:w-full pr-4"
        leftContainerClassName="[&>div]:w-full"
      >
        <ActivityPostList />
        <ErrorBoundary>
          <ActivityRecent />
        </ErrorBoundary>
      </TwoColumnLayout>
    </div>
  )
}
