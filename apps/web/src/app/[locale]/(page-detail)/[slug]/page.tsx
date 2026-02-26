import { PageActionAside } from '~/components/modules/page/PageActionAside'
import { ArticleRightAside } from '~/components/modules/shared/ArticleRightAside'
import { ReadIndicatorForMobile } from '~/components/modules/shared/ReadIndicator'

import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import { getData } from './api'
import { EquipmentPage } from './EquipmentPage'
import { PageContent } from './PageContent'
import {
  FocusReadingEffect,
  MarkdownImageRecordProviderInternal,
  MarkdownSelection,
} from './pageExtra'

export default async function PageDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getData(slug)

  return (
    <WrappedElementProvider eoaDetect>
      <ReadIndicatorForMobile />
      <FocusReadingEffect />
      <MarkdownImageRecordProviderInternal>
        <MarkdownSelection>
          {data.meta?.style === 'equipment' ? (
            <EquipmentPage />
          ) : (
            <PageContent
              contentFormat={data.contentFormat}
              content={data.content}
            />
          )}
        </MarkdownSelection>
      </MarkdownImageRecordProviderInternal>
      <LayoutRightSidePortal>
        <ArticleRightAside>
          <PageActionAside />
        </ArticleRightAside>
      </LayoutRightSidePortal>
    </WrappedElementProvider>
  )
}
