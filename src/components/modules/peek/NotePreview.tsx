import type { NoteWrappedPayload } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import { atom } from 'jotai'
import type { FC } from 'react'
import { useMemo } from 'react'

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

interface NotePreviewProps {
  noteId: number
}
export const NotePreview: FC<NotePreviewProps> = (props) => {
  const { data, isLoading } = useQuery({
    ...queries.note.byNid(props.noteId.toString()),
  })

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
            <WrappedElementProvider eoaDetect>
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
