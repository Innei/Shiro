import { headers } from 'next/dist/client/components/headers'
import type { Metadata } from 'next'

import { BottomToUpSoftScaleTransitionView } from '~/components/ui/transition/BottomToUpSoftScaleTransitionView'
import { OnlyMobile } from '~/components/ui/viewport/OnlyMobile'
import { CommentAreaRootLazy } from '~/components/widgets/comment'
import { NoteFontSettingFab } from '~/components/widgets/note/NoteFontFab'
import { NoteMainContainer } from '~/components/widgets/note/NoteMainContainer'
import { TocFAB } from '~/components/widgets/toc/TocFAB'
import { REQUEST_QUERY } from '~/constants/system'
import { attachUAAndRealIp } from '~/lib/attach-ua'
import { getOgUrl } from '~/lib/helper.server'
import { getSummaryFromMd } from '~/lib/markdown'
import { getQueryClient } from '~/lib/query-client.server'
import {
  CurrentNoteDataProvider,
  SyncNoteDataAfterLoggedIn,
} from '~/providers/note/CurrentNoteDataProvider'
import { CurrentNoteIdProvider } from '~/providers/note/CurrentNoteIdProvider'
import { queries } from '~/queries/definition'

import { Paper } from '../../../components/layout/container/Paper'
import NotePage from './pageImpl'
import { Transition } from './Transition'

export const generateMetadata = async ({
  params,
}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  try {
    attachUAAndRealIp()
    const { data } = await getQueryClient().fetchQuery(
      queries.note.byNid(params.id),
    )
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
  attachUAAndRealIp()
  const header = headers()
  const searchParams = new URLSearchParams(header.get(REQUEST_QUERY) || '')
  const id = props.params.id
  const query = queries.note.byNid(
    id,
    searchParams.get('password') || undefined,
  )
  const data = await getQueryClient().fetchQuery(query)

  const { id: noteObjectId, allowComment } = data.data

  return (
    <>
      <CurrentNoteIdProvider noteId={id} />
      <CurrentNoteDataProvider data={data} />
      <SyncNoteDataAfterLoggedIn />

      <Transition className="min-w-0" lcpOptimization>
        <Paper key={id} as={NoteMainContainer}>
          <NotePage {...data.data} />
        </Paper>
        <BottomToUpSoftScaleTransitionView delay={500}>
          <CommentAreaRootLazy
            refId={noteObjectId}
            allowComment={allowComment}
          />
        </BottomToUpSoftScaleTransitionView>
      </Transition>

      <NoteFontSettingFab />

      <OnlyMobile>
        <TocFAB />
      </OnlyMobile>
    </>
  )
}
