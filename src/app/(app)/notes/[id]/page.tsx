import type { NoteModel } from '@mx-space/api-client'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

import { AckRead } from '~/components/common/AckRead'
import { ClientOnly } from '~/components/common/ClientOnly'
import { PageColorGradient } from '~/components/common/PageColorGradient'
import {
  buildRoomName,
  Presence,
  RoomProvider,
} from '~/components/modules/activity'
import { CommentAreaRootLazy } from '~/components/modules/comment'
import {
  NoteActionAside,
  NoteBottomBarAction,
  NoteBottomTopic,
  NoteFooterNavigationBarForMobile,
  NoteMetaBar,
  NoteMetaReadingCount,
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
import { Signature } from '~/components/modules/shared/Signature'
import { SummarySwitcher } from '~/components/modules/shared/SummarySwitcher'
import { TocFAB } from '~/components/modules/toc/TocFAB'
import { XLogInfoForNote } from '~/components/modules/xlog'
import { getCidForBaseModel } from '~/components/modules/xlog/utils'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { apiClient } from '~/lib/request'
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
  NoteDataReValidate,
  NoteHeaderDate,
  NoteHeaderMetaInfoSetting,
  NoteMarkdown,
  NoteMarkdownImageRecordProvider,
  NoteTitle,
} from './pageExtra'
import { Transition } from './Transition'

export const dynamic = 'force-dynamic'

const Summary = async ({ data }: { data: NoteModel }) => {
  const acceptLang = headers().get('accept-language')
  const { summary } = await apiClient.ai
    .getSummary({
      articleId: data.id,
      onlyDb: true,
      lang: acceptLang || undefined,
    })
    .then((res) => ({
      summary: res?.summary,
    }))
    .catch(() => ({
      summary: false,
    }))
  return (
    <SummarySwitcher
      articleId={data.id!}
      enabledMixSpaceSummary={summary !== false}
      cid={getCidForBaseModel(data)}
      hydrateText={summary as string}
      className="mb-8"
    />
  )
}
function PageInner({ data }: { data: NoteModel }) {
  const coverImage = data.images?.find((i) => i.src === data.meta?.cover)
  return (
    <>
      <AckRead id={data.id} type="note" />

      <NoteHeadCover image={data.meta?.cover} />
      <NoteHeaderMetaInfoSetting />
      {!!data.meta?.cover && !!coverImage?.accent && (
        <PageColorGradient baseColor={coverImage.accent} />
      )}
      <div>
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
          <NoteBanner type="warning" message="这篇文章是非公开的，仅登录可见" />
        )}
      </div>

      <NoteHideIfSecret>
        <Summary data={data} />
        <WrappedElementProvider eoaDetect>
          <Presence />
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
      <Signature />
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
  Component({ data, params: { id: nid }, fetchedAt }) {
    return (
      <>
        <CurrentNoteNidProvider nid={nid} />
        <CurrentNoteDataProvider data={data} />
        <NoteDataReValidate fetchedAt={fetchedAt} />
        <SyncNoteDataAfterLoggedIn />
        <RoomProvider roomName={buildRoomName(data.data.id)}>
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
        </RoomProvider>

        <NoteFontSettingFab />

        <OnlyMobile>
          <TocFAB />
        </OnlyMobile>
      </>
    )
  },
})
