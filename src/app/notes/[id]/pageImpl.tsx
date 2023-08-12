/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { NoteModel } from '@mx-space/api-client'

import { ClientOnly } from '~/components/common/ClientOnly'
import {
  NoteActionAside,
  NoteFooterNavigationBarForMobile,
  NoteTopic,
} from '~/components/widgets/note'
import { NoteRootBanner } from '~/components/widgets/note/NoteBanner'
import { ArticleRightAside } from '~/components/widgets/shared/ArticleRightAside'
import { BanCopyWrapper } from '~/components/widgets/shared/BanCopyWrapper'
import { ReadIndicatorForMobile } from '~/components/widgets/shared/ReadIndicator'
import { SubscribeBell } from '~/components/widgets/subscribe'
import { XLogInfoForNote } from '~/components/widgets/xlog'
import {
  getCidForBaseModel,
  XLogSummary,
} from '~/components/widgets/xlog/XLogSummaryRSC'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import { NoteHideIfSecret } from '../../../components/widgets/note/NoteHideIfSecret'
import { NoteMetaBar } from '../../../components/widgets/note/NoteMetaBar'
import {
  IndentArticleContainer,
  MarkdownSelection,
  NoteHeaderDate,
  NoteHeaderMetaInfoSetting,
  NoteMarkdown,
  NoteMarkdownImageRecordProvider,
  NoteTitle,
} from './pageExtra'

const NotePage = function (props: NoteModel) {
  return (
    <>
      <NoteHeaderMetaInfoSetting />
      <IndentArticleContainer>
        <header>
          <NoteTitle />
          <span className="flex flex-wrap items-center text-[13px] text-neutral-content/60">
            <NoteHeaderDate />

            <ClientOnly>
              <NoteMetaBar />
            </ClientOnly>
          </span>
          <div className="ml-[-1.25em] mr-[-1.25em] mt-8 text-sm lg:ml-[calc(-3em)] lg:mr-[calc(-3em)]">
            <NoteRootBanner />
          </div>
        </header>

        <NoteHideIfSecret>
          <XLogSummary cid={getCidForBaseModel(props)} />
          <WrappedElementProvider>
            <ReadIndicatorForMobile />
            <NoteMarkdownImageRecordProvider>
              <BanCopyWrapper>
                <MarkdownSelection>
                  <NoteMarkdown />
                </MarkdownSelection>
              </BanCopyWrapper>
            </NoteMarkdownImageRecordProvider>

            <LayoutRightSidePortal>
              <ArticleRightAside>
                <NoteActionAside />
              </ArticleRightAside>
            </LayoutRightSidePortal>
          </WrappedElementProvider>
        </NoteHideIfSecret>
      </IndentArticleContainer>

      <SubscribeBell defaultType="note_c" />
      <NoteTopic />
      <XLogInfoForNote />
      <NoteFooterNavigationBarForMobile />
    </>
  )
}

export default NotePage
