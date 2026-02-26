import type { NoteWrappedWithLikedAndTranslationPayload } from '@mx-space/api-client'
import { useQuery } from '@tanstack/react-query'
import { atom } from 'jotai'
import type { FC } from 'react'
import { useMemo } from 'react'

import { NoteMarkdown } from '~/app/[locale]/notes/[id]/NoteMarkdown'
import {
  IndentArticleContainer,
  NoteHeaderDate,
  NoteMarkdownImageRecordProvider,
  NoteTitle,
} from '~/app/[locale]/notes/[id]/pageExtra'
import { AckRead } from '~/components/common/AckRead'
import { ClientOnly } from '~/components/common/ClientOnly'
import { Paper } from '~/components/layout/container/Paper'
import { Loading } from '~/components/ui/loading'
import { BottomToUpSmoothTransitionView } from '~/components/ui/transition'
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

  const overrideAtom = useMemo(
    () => atom(null! as NoteWrappedWithLikedAndTranslationPayload),
    [],
  )
  if (isLoading) return <Loading className="w-full" useDefaultLoadingText />
  if (!data) return null
  const noteData = data as NoteWrappedWithLikedAndTranslationPayload
  const note = noteData.data
  return (
    <CurrentNoteDataAtomProvider overrideAtom={overrideAtom}>
      <CurrentNoteDataProvider data={noteData} />
      {!!note.id && <AckRead id={note.id} type="note" />}
      <BottomToUpSmoothTransitionView>
        <Paper>
          <NoteHeadCover image={note.meta?.cover} />
          <IndentArticleContainer prose={note.contentFormat !== 'lexical'}>
            <header>
              <NoteTitle />
              <span className="flex flex-wrap items-center text-sm text-neutral/60">
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
      </BottomToUpSmoothTransitionView>
    </CurrentNoteDataAtomProvider>
  )
}
