/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import type { NoteModel } from '@mx-space/api-client'

import { AckRead } from '~/components/common/AckRead'
import { ClientOnly } from '~/components/common/ClientOnly'
import { Presence } from '~/components/modules/activity'
import {
  NoteActionAside,
  NoteBottomBarAction,
  NoteFooterNavigationBarForMobile,
  NoteMetaBar,
  NoteMetaReadingCount,
  NoteTopic,
} from '~/components/modules/note'
import { NoteRootBanner } from '~/components/modules/note/NoteBanner'
import { ArticleRightAside } from '~/components/modules/shared/ArticleRightAside'
import { BanCopyWrapper } from '~/components/modules/shared/BanCopyWrapper'
import { ReadIndicatorForMobile } from '~/components/modules/shared/ReadIndicator'
import { SummarySwitcher } from '~/components/modules/shared/SummarySwitcher'
import { XLogInfoForNote } from '~/components/modules/xlog'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import { NoteHeadCover } from '../../../../components/modules/note/NoteHeadCover'
import { NoteHideIfSecret } from '../../../../components/modules/note/NoteHideIfSecret'
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
      <AckRead id={props.id} type="note" />

      <NoteHeadCover image={props.meta?.cover} />
      <NoteHeaderMetaInfoSetting />
      <IndentArticleContainer>
        <header>
          <NoteTitle />
          <span className="flex flex-wrap items-center text-sm text-neutral-content/60">
            <NoteHeaderDate />

            <ClientOnly>
              <NoteMetaBar />
              <NoteMetaReadingCount />
            </ClientOnly>
          </span>
          <NoteRootBanner />
        </header>

        <NoteHideIfSecret>
          <SummarySwitcher data={props} />
          <WrappedElementProvider eoaDetect>
            <Presence />
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

      {/* <SubscribeBell defaultType="note_c" /> */}
      <ClientOnly>
        <div className="mt-8" data-hide-print />
        <NoteBottomBarAction />
        <NoteTopic />
        <XLogInfoForNote />
        <NoteFooterNavigationBarForMobile />
      </ClientOnly>
    </>
  )
}

export default NotePage
