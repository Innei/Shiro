import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition/BottomToUpSoftScaleTransitionView'
import { BottomToUpTransitionView } from '~/components/ui/transition/BottomToUpTransitionView'
import { TocAside } from '~/components/widgets/toc'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import {
  HeaderMetaInfoSetting,
  MarkdownImageRecordProviderInternal,
  PageLoading,
  PagePaginator,
  PageSubTitle,
  PageTitle,
  PostMarkdown,
} from './pageExtra'

const PageDetail = () => {
  return (
    <PageLoading>
      <div className="relative w-full min-w-0">
        <HeaderMetaInfoSetting />
        <article className="prose">
          <header className="mb-8">
            <BottomToUpSoftScaleTransitionView delay={0}>
              <PageTitle />
            </BottomToUpSoftScaleTransitionView>

            <BottomToUpSoftScaleTransitionView delay={200}>
              <PageSubTitle />
            </BottomToUpSoftScaleTransitionView>
          </header>
          <WrappedElementProvider>
            <MarkdownImageRecordProviderInternal>
              <BottomToUpTransitionView delay={600}>
                <PostMarkdown />
              </BottomToUpTransitionView>
            </MarkdownImageRecordProviderInternal>

            <LayoutRightSidePortal>
              <TocAside
                className="sticky top-[120px] ml-4 mt-[120px]"
                treeClassName="max-h-[calc(100vh-6rem-4.5rem-300px)] h-[calc(100vh-6rem-4.5rem-300px)] min-h-[120px] relative"
              />
            </LayoutRightSidePortal>
          </WrappedElementProvider>
        </article>
        <PagePaginator />
      </div>
    </PageLoading>
  )
}
export default PageDetail
