/* eslint-disable react/display-name */
import { Suspense } from 'react'
import type { Metadata } from 'next'

import { buildRoomName, RoomProvider } from '~/components/modules/activity'
import { CommentAreaRootLazy } from '~/components/modules/comment'
import { NoteFontSettingFab } from '~/components/modules/note/NoteFontFab'
import { NoteMainContainer } from '~/components/modules/note/NoteMainContainer'
import { TocFAB } from '~/components/modules/toc/TocFAB'
import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import {
  CurrentNoteDataProvider,
  SyncNoteDataAfterLoggedIn,
} from '~/providers/note/CurrentNoteDataProvider'
import { CurrentNoteNidProvider } from '~/providers/note/CurrentNoteIdProvider'

import { Paper } from '../../../../components/layout/container/Paper'
import { getData } from './api'
import { Transition } from './Transition'

export const dynamic = 'force-dynamic'
export const generateMetadata = async ({
  params,
}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  try {
    const data = (await getData(params)).data
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

export default async (
  props: NextPageParams<{
    id: string
  }>,
) => {
  const { params } = props
  const { id: nid } = params
  const data = await getData(params)

  const { id: noteObjectId, allowComment } = data.data

  return (
    <>
      <CurrentNoteNidProvider nid={nid} />
      <CurrentNoteDataProvider data={data} />
      <SyncNoteDataAfterLoggedIn />
      <RoomProvider roomName={buildRoomName(data.data.id)}>
        <Transition className="min-w-0" lcpOptimization>
          <Paper key={nid} as={NoteMainContainer}>
            <Suspense>{props.children}</Suspense>
          </Paper>
          <BottomToUpSoftScaleTransitionView delay={500}>
            <CommentAreaRootLazy
              refId={noteObjectId}
              allowComment={allowComment}
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
}
