import { ReadIndicatorForMobile } from '~/components/widgets/shared/ReadIndicator'
import { TocAside } from '~/components/widgets/toc'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import { MarkdownImageRecordProviderInternal, PageMarkdown } from './pageExtra'

const PageDetail = () => {
  return (
    <WrappedElementProvider>
      <ReadIndicatorForMobile />
      <MarkdownImageRecordProviderInternal>
        <PageMarkdown />
      </MarkdownImageRecordProviderInternal>

      <LayoutRightSidePortal>
        <TocAside
          className="sticky top-[120px] ml-4 mt-[120px]"
          treeClassName="max-h-[calc(100vh-6rem-4.5rem-300px)] h-[calc(100vh-6rem-4.5rem-300px)] min-h-[120px] relative"
        />
      </LayoutRightSidePortal>
    </WrappedElementProvider>
  )
}
export default PageDetail
