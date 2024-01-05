import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { atom } from 'jotai'
import type { NoteWrappedPayload } from '@mx-space/api-client'
import type { FC } from 'react'

import {
  IndentArticleContainer,
  NoteHeaderDate,
  NoteMarkdown,
  NoteMarkdownImageRecordProvider,
  NoteTitle,
} from '~/app/(app)/notes/[id]/pageExtra'
import { AckRead } from '~/components/common/AckRead'
import { ClientOnly } from '~/components/common/ClientOnly'
import { Paper } from '~/components/layout/container/Paper'
import { Loading } from '~/components/ui/loading'
import {
  CurrentNoteDataAtomProvider,
  CurrentNoteDataProvider,
} from '~/providers/note/CurrentNoteDataProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'
import { queries } from '~/queries/definition'

import { NoteHideIfSecret, NoteMetaBar, NoteRootBanner } from '../note'
import { NoteHeadCover } from '../note/NoteHeadCover'
import { BanCopyWrapper } from '../shared/BanCopyWrapper'
import { XLogSummary } from '../xlog'
import { getCidForBaseModel } from '../xlog/utils'

interface NotePreviewProps {
  noteId: number
}
export const NotePreview: FC<NotePreviewProps> = (props) => {
  const { data, isLoading } = useQuery({
    ...queries.note.byNid(props.noteId.toString()),
  })

  useEffect(() => {
    const currentState = history.state
    const currentLocation = window.location.href
    const nextUrl = new URL(currentLocation)
    nextUrl.pathname = `/notes/${props.noteId}`
    const nextUrlString = nextUrl.href

    // 虽然但是，这样浏览器的前进后退会有问题
    // 如果用 NextJS 的 parallel-routes 情况太复杂
    history.replaceState(null, '', nextUrlString)
    return () => {
      history.replaceState(currentState, '', currentLocation)
    }
  }, [props.noteId])

  const overrideAtom = useMemo(() => atom(null! as NoteWrappedPayload), [])
  if (isLoading) return <Loading className="w-full" useDefaultLoadingText />
  if (!data) return null
  const note = data.data
  return (
    <CurrentNoteDataAtomProvider overrideAtom={overrideAtom}>
      <CurrentNoteDataProvider data={data} />
      {!!note.id && <AckRead id={note.id} type="note" />}
      <Paper>
        <NoteHeadCover image={note.meta?.cover} />
        <IndentArticleContainer>
          <header>
            <NoteTitle />
            <span className="flex flex-wrap items-center text-sm text-neutral-content/60">
              <NoteHeaderDate />

              <ClientOnly>
                <NoteMetaBar />
              </ClientOnly>
            </span>
            <NoteRootBanner />
          </header>

          <NoteHideIfSecret>
            <XLogSummary cid={getCidForBaseModel(data)} />
            <WrappedElementProvider>
              <BanCopyWrapper>
                <NoteMarkdownImageRecordProvider>
                  <NoteMarkdown />
                </NoteMarkdownImageRecordProvider>
              </BanCopyWrapper>
            </WrappedElementProvider>
          </NoteHideIfSecret>
        </IndentArticleContainer>
      </Paper>
    </CurrentNoteDataAtomProvider>
  )
}
