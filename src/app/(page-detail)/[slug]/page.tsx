import { PageActionAside } from '~/components/widgets/page/PageActionAside'
import { ArticleRightAside } from '~/components/widgets/shared/ArticleRightAside'
import { ReadIndicatorForMobile } from '~/components/widgets/shared/ReadIndicator'
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
        <ArticleRightAside>
          <PageActionAside />
        </ArticleRightAside>
      </LayoutRightSidePortal>
    </WrappedElementProvider>
  )
}
export default PageDetail
