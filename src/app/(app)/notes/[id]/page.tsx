import type { NoteModel } from '@mx-space/api-client'
import type { Metadata } from 'next'

import { AckRead } from '~/components/common/AckRead'
import { ClientOnly } from '~/components/common/ClientOnly'
import { CommentAreaRootLazy } from '~/components/modules/comment'
import {
  NoteActionAside,
  NoteBottomBarAction,
  NoteBottomTopic,
  NoteFooterNavigationBarForMobile,
  NoteMetaBar,
  NotePasswordForm,
} from '~/components/modules/note'
import {
  NoteBanner,
  NoteRootBanner,
} from '~/components/modules/note/NoteBanner'
import { NoteFontSettingFab } from '~/components/modules/note/NoteFontFab'
import { NoteMainContainer } from '~/components/modules/note/NoteMainContainer'
import { ArticleRightAside } from '~/components/modules/shared/ArticleRightAside'
import { BanCopyWrapper } from '~/components/modules/shared/BanCopyWrapper'
import { ReadIndicatorForMobile } from '~/components/modules/shared/ReadIndicator'
import { SummarySwitcher } from '~/components/modules/shared/SummarySwitcher'
import { TocFAB } from '~/components/modules/toc/TocFAB'
import { XLogInfoForNote } from '~/components/modules/xlog'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { definePrerenderPage } from '~/lib/request.server'
import {
  CurrentNoteDataProvider,
  SyncNoteDataAfterLoggedIn,
} from '~/providers/note/CurrentNoteDataProvider'
import { CurrentNoteNidProvider } from '~/providers/note/CurrentNoteIdProvider'
import { LayoutRightSidePortal } from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import { Paper } from '../../../../components/layout/container/Paper'
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
import { Transition } from './Transition'

export const dynamic = 'force-dynamic'

function PageInner({ data }: { data: NoteModel }) {
  return (
    <>
      <AckRead id={data.id} type="note" />

      <NoteHeadCover image={data.meta?.cover} />
      <NoteHeaderMetaInfoSetting />
      <div>
        <NoteTitle />
        <span className="flex flex-wrap items-center text-sm text-neutral-content/60">
          <NoteHeaderDate />

          <ClientOnly>
            <NoteMetaBar />
          </ClientOnly>
        </span>

        <NoteRootBanner />
        {data.hide && (
          <NoteBanner type="warning" message="这篇文章是非公开的，仅登录可见" />
        )}
      </div>

      <NoteHideIfSecret>
        <SummarySwitcher data={data} />
        <WrappedElementProvider eoaDetect>
          <ReadIndicatorForMobile />
          <NoteMarkdownImageRecordProvider>
            <BanCopyWrapper>
              <MarkdownSelection>
                <IndentArticleContainer>
                  <header className="sr-only">
                    <NoteTitle />
                  </header>
                  <NoteMarkdown />
                </IndentArticleContainer>
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

type NoteDetailPageParams = {
  id: string

  password?: string
  token?: string
}
export const generateMetadata = async ({
  params,
}: {
  params: NoteDetailPageParams
}): Promise<Metadata> => {
  try {
    const res = await getData(params)

    const { data } = res
    const { title, text } = data
    const description = getSummaryFromMd(text ?? '')

    const ogUrl = getOgUrl('note', {
      nid: params.id,
    })

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogUrl,
        type: 'article',
      },
      twitter: {
        images: ogUrl,
        title,
        description,
        card: 'summary_large_image',
      },
    } satisfies Metadata
  } catch {
    return {}
  }
}

export default definePrerenderPage<NoteDetailPageParams>()({
  fetcher: getData,
  requestErrorRenderer(error, parsed, { id }) {
    const { status } = parsed

    if (status === 403) {
      return (
        <Paper>
          <NotePasswordForm />
          <CurrentNoteNidProvider nid={id} />
        </Paper>
      )
    }
  },
  Component({ data, params: { id: nid } }) {
    return (
      <>
        <CurrentNoteNidProvider nid={nid} />
        <CurrentNoteDataProvider data={data} />

        <SyncNoteDataAfterLoggedIn />

        <Transition className="min-w-0" lcpOptimization>
          <Paper key={nid} as={NoteMainContainer}>
            <PageInner data={data.data} />
          </Paper>
          <BottomToUpSoftScaleTransitionView delay={500}>
            <CommentAreaRootLazy
              refId={data.data.id}
              allowComment={data.data.allowComment}
            />
          </BottomToUpSoftScaleTransitionView>
        </Transition>

        <NoteFontSettingFab />

        <OnlyMobile>
          <TocFAB />
        </OnlyMobile>
      </>
    )
  },
})
