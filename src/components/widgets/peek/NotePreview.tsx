import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { atom } from 'jotai'
import type { NoteWrappedPayload } from '@mx-space/api-client'
import type { FC } from 'react'

import {
  IndentArticleContainer,
  NoteHeaderDate,
  NoteMarkdown,
  NoteMarkdownImageRecordProvider,
  NoteTitle,
} from '~/app/notes/[id]/pageExtra'
import { ClientOnly } from '~/components/common/ClientOnly'
import { Paper } from '~/components/layout/container/Paper'
import { Loading } from '~/components/ui/loading'
import {
  CurrentNoteDataAtomProvider,
  CurrentNoteDataProvider,
} from '~/providers/note/CurrentNoteDataProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'
import { queries } from '~/queries/definition'

import { NoteBanner, NoteHideIfSecret, NoteMetaBar } from '../note'
import { BanCopyWrapper } from '../shared/BanCopyWrapper'
import { XLogSummaryForNote } from '../xlog'

interface NotePreviewProps {
  noteId: number
}
export const NotePreview: FC<NotePreviewProps> = (props) => {
  const { data, isLoading } = useQuery({
    ...queries.note.byNid(props.noteId.toString()),
  })
  const overrideAtom = useMemo(
    () => atom(null as null | NoteWrappedPayload),
    [data],
  )
  if (isLoading) return <Loading className="w-full" useDefaultLoadingText />
  if (!data) return null
  return (
    <CurrentNoteDataAtomProvider overrideAtom={overrideAtom}>
      <CurrentNoteDataProvider data={data} />
      <Paper>
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
