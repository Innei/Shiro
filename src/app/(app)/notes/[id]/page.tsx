/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { AckRead } from '~/components/common/AckRead'
import { ClientOnly } from '~/components/common/ClientOnly'
import { Presence } from '~/components/modules/activity'
import {
  NoteActionAside,
  NoteBottomBarAction,
  NoteBottomTopic,
  NoteFooterNavigationBarForMobile,
  NoteMetaBar,
  NoteMetaReadingCount,
} from '~/components/modules/note'
import {
  NoteBanner,
  NoteRootBanner,
} from '~/components/modules/note/NoteBanner'
import { ArticleRightAside } from '~/components/modules/shared/ArticleRightAside'
import { BanCopyWrapper } from '~/components/modules/shared/BanCopyWrapper'
import { ReadIndicatorForMobile } from '~/components/modules/shared/ReadIndicator'
import { SummarySwitcher } from '~/components/modules/shared/SummarySwitcher'
import { XLogInfoForNote } from '~/components/modules/xlog'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import { NoteHeadCover } from '../../../../components/modules/note/NoteHeadCover'
import { NoteHideIfSecret } from '../../../../components/modules/note/NoteHideIfSecret'
import { getData } from './api'
import {
  IndentArticleContainer,
  MarkdownSelection,
  NoteHeaderDate,
  NoteHeaderMetaInfoSetting,
  NoteMarkdown,
  NoteMarkdownImageRecordProvider,
  NoteTitle,
} from './pageExtra'

export const dynamic = 'force-dynamic'
export default async function Page(props: {
  params: {
    id: string
  }
}) {
  const { data } = await getData(props.params)
  return (
    <>
      <AckRead id={data.id} type="note" />

      <NoteHeadCover image={data.meta?.cover} />
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
          {data.hide && (
            <NoteBanner
              type="warning"
              message="这篇文章是非公开的，仅登录可见"
            />
          )}
        </header>

        <NoteHideIfSecret>
          <SummarySwitcher data={data} />
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
        <NoteBottomTopic />
        <XLogInfoForNote />
        <NoteFooterNavigationBarForMobile />
      </ClientOnly>
    </>
  )
}
