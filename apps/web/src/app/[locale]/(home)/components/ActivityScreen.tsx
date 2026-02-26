import { ErrorBoundary } from '~/components/common/ErrorBoundary'

import { ActivityPostList } from './ActivityPostList'
import { ActivityRecent } from './ActivityRecent'
import { TwoColumnLayout } from './TwoColumnLayout'

export const ActivityScreen = () => (
  <div className="mt-24">
    <TwoColumnLayout
      rightContainerClassName="block lg:flex [&>div]:w-full px-4"
      leftContainerClassName="[&>div]:w-full px-4"
    >
      <ActivityPostList />
      <ErrorBoundary>
        <ActivityRecent />
      </ErrorBoundary>
    </TwoColumnLayout>
  </div>
)
