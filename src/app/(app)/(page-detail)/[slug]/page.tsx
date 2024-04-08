import { PageActionAside } from '~/components/modules/page/PageActionAside'
import { ArticleRightAside } from '~/components/modules/shared/ArticleRightAside'
import { ReadIndicatorForMobile } from '~/components/modules/shared/ReadIndicator'
import { Signature } from '~/components/modules/shared/Signature'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import {
  MarkdownImageRecordProviderInternal,
  MarkdownSelection,
  PageMarkdown,
} from './pageExtra'

const PageDetail = () => {
  return (
    <WrappedElementProvider eoaDetect>
      <ReadIndicatorForMobile />
      <MarkdownImageRecordProviderInternal>
        <MarkdownSelection>
          <PageMarkdown />
        </MarkdownSelection>
      </MarkdownImageRecordProviderInternal>
      <Signature />

      <LayoutRightSidePortal>
        <ArticleRightAside>
          <PageActionAside />
        </ArticleRightAside>
      </LayoutRightSidePortal>
    </WrappedElementProvider>
  )
}
export default PageDetail
