/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
'use client'

import { memo, useEffect } from 'react'
import dynamic from 'next/dynamic'

import { ClientOnly } from '~/components/common/ClientOnly'
import { NoteBanner } from '~/components/widgets/note/NoteBanner'
import { ArticleRightAside } from '~/components/widgets/shared/ArticleRightAside'
import { BanCopyWrapper } from '~/components/widgets/shared/BanCopyWrapper'
import { ReadIndicatorForMobile } from '~/components/widgets/shared/ReadIndicator'
import { XLogInfoForNote, XLogSummaryForNote } from '~/components/widgets/xlog'
import { springScrollToTop } from '~/lib/scroller'
import { useCurrentNoteId } from '~/providers/note/CurrentNoteIdProvider'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import { NoteHideIfSecret } from '../../../components/widgets/note/NoteHideIfSecret'
import { NoteMetaBar } from '../../../components/widgets/note/NoteMetaBar'
import {
  IndentArticleContainer,
  NoteHeaderDate,
  NoteHeaderMetaInfoSetting,
  NoteMarkdown,
  NoteMarkdownImageRecordProvider,
  NoteTitle,
} from './pageExtra'

const NoteActionAside = dynamic(() =>
  import('~/components/widgets/note/NoteActionAside').then(
    (mod) => mod.NoteActionAside,
  ),
)

const NoteFooterNavigationBarForMobile = dynamic(() =>
  import('~/components/widgets/note/NoteFooterNavigation').then(
    (mod) => mod.NoteFooterNavigationBarForMobile,
  ),
)

const NoteTopic = dynamic(() =>
  import('~/components/widgets/note/NoteTopic').then((mod) => mod.NoteTopic),
)

const SubscribeBell = dynamic(() =>
  import('~/components/widgets/subscribe/SubscribeBell').then(
    (mod) => mod.SubscribeBell,
  ),
)

const PageImpl = () => {
  return (
    <>
      <NotePage />
      <NoteHeaderMetaInfoSetting />
    </>
  )
}

const NotePage = memo(function Notepage() {
  const noteId = useCurrentNoteId()

  useEffect(() => {
    springScrollToTop()
  }, [noteId])

  if (!noteId) return null

  return (
    <>
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
            <NoteBanner />
          </div>
        </header>

        <NoteHideIfSecret>
          <XLogSummaryForNote />
          <WrappedElementProvider>
            <ReadIndicatorForMobile />
            <NoteMarkdownImageRecordProvider>
              <BanCopyWrapper>
                <NoteMarkdown />
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
})

export default PageImpl
