'use client'

import { useMemo } from 'react'
import { useIsomorphicLayoutEffect } from 'foxact/use-isomorphic-layout-effect'
import { atom, useAtomValue } from 'jotai'
import type {
  NoteModel,
  NoteWrappedPayload,
  PageModel,
  PostModel,
} from '@mx-space/api-client'

import { simpleCamelcaseKeys } from '@mx-space/api-client'

import { ErrorBoundary } from '~/components/common/ErrorBoundary'
import { Paper } from '~/components/layout/container/Paper'
import { NoteMetaBar, NoteRootBanner } from '~/components/modules/note'
import { NoteHeadCover } from '~/components/modules/note/NoteHeadCover'
import { ArticleRightAside } from '~/components/modules/shared/ArticleRightAside'
import { ReadIndicatorForMobile } from '~/components/modules/shared/ReadIndicator'
import { jotaiStore } from '~/lib/store'
import { isNoteModel, isPageModel, isPostModel } from '~/lib/url-builder'
import {
  CurrentNoteDataAtomProvider,
  CurrentNoteDataProvider,
} from '~/providers/note/CurrentNoteDataProvider'
import {
  CurrentPageDataAtomProvider,
  CurrentPageDataProvider,
} from '~/providers/page/CurrentPageDataProvider'
import {
  CurrentPostDataAtomProvider,
  CurrentPostDataProvider,
} from '~/providers/post/CurrentPostDataProvider'
import {
  LayoutRightSidePortal,
  LayoutRightSideProvider,
} from '~/providers/shared/LayoutRightSideProvider'
import { WrappedElementProvider } from '~/providers/shared/WrappedElementProvider'

import {
  MarkdownImageRecordProviderInternal,
  PageMarkdown,
  PageSubTitle,
  PageTitle,
} from '../(page-detail)/[slug]/pageExtra'
import {
  IndentArticleContainer,
  NoteHeaderDate,
  NoteMarkdown,
  NoteMarkdownImageRecordProvider,
  NoteTitle,
} from '../notes/[id]/pageExtra'
import {
  HeaderMetaInfoSetting,
  PostMarkdown,
  PostMarkdownImageRecordProvider,
  PostMetaBarInternal,
} from '../posts/(post-detail)/[category]/[slug]/pageExtra'

const safeParse = (value: string) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    return null
  }
}
const previewDataAtom = atom<PostModel | NoteModel | null>(null)
export default function PreviewPage() {
  // handle preview by storage observer
  useIsomorphicLayoutEffect(() => {
    const search = location.search
    const searchParams = new URLSearchParams(search)

    const sameSite = searchParams.get('same-site')
    if (sameSite !== '1') {
      return
    }
    const storageKey = searchParams.get('storageKey')
    if (!storageKey) return

    const handler = (event: StorageEvent) => {
      if (event.storageArea === localStorage) {
        if (event.key !== storageKey) return

        const data = event.newValue
        if (!data) return
        const parsedData = safeParse(data)
        if (!parsedData) return
        jotaiStore.set(previewDataAtom, simpleCamelcaseKeys(parsedData))
      }
    }
    window.addEventListener('storage', handler)

    const exist = localStorage.getItem(storageKey)

    if (exist) {
      const parsedData = safeParse(exist)

      if (!parsedData) return
      jotaiStore.set(previewDataAtom, simpleCamelcaseKeys(parsedData))
    }

    return () => {
      window.removeEventListener('storage', handler)
    }
  }, [])

  // handle preview by postMessage

  useIsomorphicLayoutEffect(() => {
    const search = location.search
    const searchParams = new URLSearchParams(search)

    let targetOrigin = searchParams.get('origin')

    // const isInIframe = window.self !== window.top

    // if (isInIframe) {
    //   return
    // }

    if (!targetOrigin) {
      return
    }
    targetOrigin = decodeURIComponent(targetOrigin)

    const handler = (e: MessageEvent) => {
      const parsedData = safeParse(e.data)

      if (!parsedData) return
      const PREVIEW_HASH = new URLSearchParams(location.search).get('key')

      if (!PREVIEW_HASH) return
      if (parsedData.key !== PREVIEW_HASH) {
        return
      }

      if (parsedData.type === 'preview') {
        if (
          JSON.stringify(jotaiStore.get(previewDataAtom)) ===
          JSON.stringify(parsedData.data)
        )
          return

        jotaiStore.set(previewDataAtom, simpleCamelcaseKeys(parsedData.data))
      }
    }
    window.addEventListener('message', handler)

    console.info('preview page ready')
    const parentWindow = window.opener || window.parent
    parentWindow.postMessage('ok', targetOrigin)

    const timer = setInterval(() => {
      parentWindow.postMessage('ok', targetOrigin)
    }, 3000)
    return () => {
      window.removeEventListener('message', handler)
      clearInterval(timer)
    }
  }, [])

  const previewData = useAtomValue(previewDataAtom)

  if (!previewData) {
    return null
  }

  switch (true) {
    case isNoteModel(previewData):
      return <NotePreview />
    case isPostModel(previewData):
      return <PostPreview />

    case isPageModel(previewData):
      return <PagePreview />
  }

  return null
}

const PostPreview = () => {
  const data = useAtomValue(previewDataAtom) as PostModel
  const overrideAtom = useMemo(() => atom(null! as PostModel), [])
  return (
    <div className="container m-auto mt-[120px] max-w-7xl px-2 md:px-6 lg:p-0">
      <CurrentPostDataAtomProvider overrideAtom={overrideAtom}>
        <CurrentPostDataProvider data={data} />
        <div className="relative flex min-h-[120px] grid-cols-[auto,200px] lg:grid">
          <article className="prose relative w-full min-w-0">
            <header className="mb-8">
              <h1 className="text-balance text-center">{data.title}</h1>

              <PostMetaBarInternal className="mb-8 justify-center" />
            </header>
            <WrappedElementProvider eoaDetect>
              <PostMarkdownImageRecordProvider>
                <ErrorBoundary>
                  <PostMarkdown />
                </ErrorBoundary>
              </PostMarkdownImageRecordProvider>

              <LayoutRightSidePortal>
                <ArticleRightAside />
              </LayoutRightSidePortal>
            </WrappedElementProvider>
          </article>

          <LayoutRightSideProvider className="relative hidden lg:block" />
        </div>
      </CurrentPostDataAtomProvider>
    </div>
  )
}

const NotePreview = () => {
  const data = useAtomValue(previewDataAtom) as NoteModel

  const overrideAtom = useMemo(() => atom(null! as NoteWrappedPayload), [])
  return (
    <div className="mx-auto mt-[100px] max-w-[60rem]">
      <CurrentNoteDataAtomProvider overrideAtom={overrideAtom}>
        <CurrentNoteDataProvider
          data={useMemo(() => {
            return {
              prev: undefined,
              next: undefined,
              data: {
                ...data,
                created: new Date().toISOString(),
                images: data.images ?? [],
                count: data.count ?? {
                  read: 0,
                  like: 0,
                },
              },
            } as NoteWrappedPayload
          }, [data])}
        />
        <Paper>
          <NoteHeadCover image={data.meta?.cover} />
          <IndentArticleContainer>
            <header>
              <NoteTitle />
              <span className="flex flex-wrap items-center text-sm text-neutral-content/60">
                <NoteHeaderDate />
                <NoteMetaBar />
              </span>
              <NoteRootBanner />
            </header>

            <WrappedElementProvider eoaDetect>
              <NoteMarkdownImageRecordProvider>
                <ErrorBoundary>
                  <NoteMarkdown />
                </ErrorBoundary>

                <LayoutRightSidePortal>
                  <ArticleRightAside />
                </LayoutRightSidePortal>
              </NoteMarkdownImageRecordProvider>
            </WrappedElementProvider>
          </IndentArticleContainer>
        </Paper>
      </CurrentNoteDataAtomProvider>
    </div>
  )
}

const PagePreview = () => {
  const data = useAtomValue(previewDataAtom) as PageModel

  const overrideAtom = useMemo(() => atom(null! as PageModel), [])

  return (
    <div className="relative m-auto mt-[120px] min-h-[300px] w-full max-w-5xl px-2 md:px-6 lg:p-0">
      <CurrentPageDataAtomProvider overrideAtom={overrideAtom}>
        <CurrentPageDataProvider data={data} />
        <div className="relative w-full min-w-0">
          <HeaderMetaInfoSetting />
          <article className="prose">
            <header className="mb-8">
              <PageTitle />

              <PageSubTitle />
            </header>

            <WrappedElementProvider eoaDetect>
              <ReadIndicatorForMobile />
              <MarkdownImageRecordProviderInternal>
                <PageMarkdown />
              </MarkdownImageRecordProviderInternal>

              <LayoutRightSidePortal>
                <ArticleRightAside />
              </LayoutRightSidePortal>
            </WrappedElementProvider>
          </article>
        </div>

        <LayoutRightSideProvider className="absolute inset-y-0 right-0 hidden translate-x-full lg:block" />
      </CurrentPageDataAtomProvider>
    </div>
  )
}
