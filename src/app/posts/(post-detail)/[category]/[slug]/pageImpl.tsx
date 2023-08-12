import type { PostModel } from '@mx-space/api-client'

import { ClientOnly } from '~/components/common/ClientOnly'
import {
  PostActionAside,
  PostCopyright,
  PostOutdate,
  PostRelated,
} from '~/components/widgets/post'
import { ArticleRightAside } from '~/components/widgets/shared/ArticleRightAside'
import { GoToAdminEditingButton } from '~/components/widgets/shared/GoToAdminEditingButton'
import { ReadIndicatorForMobile } from '~/components/widgets/shared/ReadIndicator'
import { SubscribeBell } from '~/components/widgets/subscribe'
import { XLogInfoForPost } from '~/components/widgets/xlog'
import {
  getCidForBaseModel,
  XLogSummary,
} from '~/components/widgets/xlog/XLogSummaryRSC'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import {
  HeaderMetaInfoSetting,
  MarkdownSelection,
  PostMarkdown,
  PostMarkdownImageRecordProvider,
  PostMetaBarInternal,
  PostTitle,
} from './pageExtra'

const PostPage = (props: PostModel) => {
  const { id } = props

  const cid = getCidForBaseModel(props)

  return (
    <div className="relative w-full min-w-0">
      <HeaderMetaInfoSetting />
      <article className="prose">
        <header className="mb-8">
          <PostTitle />
          <GoToAdminEditingButton
            id={id!}
            type="posts"
            className="absolute -top-6 right-0"
          />

          <PostMetaBarInternal className="mb-8 justify-center" />

          <XLogSummary cid={cid} />
          <PostOutdate />

          <PostRelated />
        </header>
        <WrappedElementProvider>
          <ReadIndicatorForMobile />
          <PostMarkdownImageRecordProvider>
            <MarkdownSelection>
              <PostMarkdown />
            </MarkdownSelection>
          </PostMarkdownImageRecordProvider>

          <LayoutRightSidePortal>
            <ArticleRightAside>
              <PostActionAside />
            </ArticleRightAside>
          </LayoutRightSidePortal>
        </WrappedElementProvider>
      </article>
      <ClientOnly>
        <PostCopyright />
        <SubscribeBell defaultType="post_c" />
        <XLogInfoForPost />
      </ClientOnly>
    </div>
  )
}

export default PostPage
