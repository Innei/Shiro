'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { produce } from 'immer'
import { atom, useStore } from 'jotai'
import { useRouter, useSearchParams } from 'next/navigation'
import type { PostDto } from '~/models/writing'
import type { FC } from 'react'

import { useIsMobile } from '~/atoms'
import { PageLoading } from '~/components/layout/dashboard/PageLoading'
import {
  PostEditorSidebar,
  PostModelDataAtomProvider,
  SlugInput,
  usePostModelGetModelData,
  usePostModelSetModelData,
} from '~/components/modules/dashboard/post-editing'
import {
  BaseWritingProvider,
  useAutoSaver,
} from '~/components/modules/dashboard/writing/BaseWritingProvider'
import { EditorLayer } from '~/components/modules/dashboard/writing/EditorLayer'
import { ImportMarkdownButton } from '~/components/modules/dashboard/writing/ImportMarkdownButton'
import { PreviewButton } from '~/components/modules/dashboard/writing/PreviewButton'
import {
  useEditorRef,
  Writing,
} from '~/components/modules/dashboard/writing/Writing'
import { LoadingButtonWrapper, StyledButton } from '~/components/ui/button'
import { PublishEvent, WriteEditEvent } from '~/events'
import { useRefetchData } from '~/hooks/biz/use-refetch-data'
import { useEventCallback } from '~/hooks/common/use-event-callback'
import { cloneDeep } from '~/lib/_'
import { toast } from '~/lib/toast'
import { adminQueries } from '~/queries/definition'
import { useCreatePost, useUpdatePost } from '~/queries/definition/post'

export default function Page() {
  const search = useSearchParams()
  const id = search.get('id')

  const { data, isLoading, refetch } = useQuery({
    ...adminQueries.post.getPost(id!),
    enabled: !!id,
  })

  const [key] = useRefetchData(refetch)

  if (id) {
    if (isLoading) return <PageLoading />

    return <EditPage initialData={data} key={key} />
  }
  return <EditPage />
}

const createInitialEditingData = (): PostDto => {
  return {
    title: '',
    allowComment: true,

    copyright: true,

    categoryId: '',
    id: '',
    images: [],

    pin: null,
    pinOrder: 0,
    relatedId: [],
    slug: '',
    tags: [],
    text: '',
    meta: {},
    related: [],

    summary: '',
  }
}

const EditPage: FC<{
  initialData?: PostDto
}> = (props) => {
  const [editingData, setEditingData] = useState<PostDto>(() =>
    props.initialData
      ? cloneDeep(props.initialData)
      : createInitialEditingData(),
  )

  const [forceUpdateKey] = useAutoSaver([editingData, setEditingData])
  const editingAtom = useMemo(() => atom(editingData), [editingData])
  const store = useStore()
  useEffect(() => {
    return store.sub(editingAtom, () => {
      window.dispatchEvent(new WriteEditEvent(store.get(editingAtom)))
    })
  }, [editingAtom, store])

  const isMobile = useIsMobile()
  return (
    <PostModelDataAtomProvider overrideAtom={editingAtom} key={forceUpdateKey}>
      <BaseWritingProvider atom={editingAtom}>
        <EditorLayer>
          {isMobile ? (
            <div />
          ) : (
            <span>
              {props.initialData ? <>编辑「{editingData.title}」</> : '撰写'}
            </span>
          )}
          <ActionButtonGroup initialData={props.initialData} />
          <Writing middleSlot={SlugInput} />
          <PostEditorSidebar />
        </EditorLayer>
      </BaseWritingProvider>
    </PostModelDataAtomProvider>
  )
}

const ActionButtonGroup = ({ initialData }: { initialData?: PostDto }) => {
  const getData = usePostModelGetModelData()
  const setData = usePostModelSetModelData()
  const editorRef = useEditorRef()
  const handleParsed = useEventCallback(
    (data: {
      title?: string | undefined
      text: string
      meta?: Record<string, any> | undefined
    }): void => {
      setData((prev) => {
        return produce(prev, (draft) => {
          const nextData = data
          Reflect.deleteProperty(nextData, 'meta')
          Object.assign(draft, nextData)
          const meta = data.meta

          if (data.text) {
            editorRef?.setMarkdown(data.text)
          }

          if (meta) {
            const created = meta.created || meta.date
            const parsedCreated = created ? dayjs(created) : null

            if (parsedCreated) {
              draft.created = parsedCreated.toISOString()
            }

            draft.meta = meta
          }
        })
      })
    },
  )

  const { mutateAsync: createPost, isPending: p1 } = useCreatePost()
  const { mutateAsync: updatePost, isPending: p2 } = useUpdatePost()
  const isPending = p1 || p2

  const router = useRouter()
  return (
    <>
      <div className="flex-shrink flex-grow" />
      <div className="flex flex-grow-0 items-center gap-4">
        <div className="flex gap-2">
          <ImportMarkdownButton onParsedValue={handleParsed} />
          <PreviewButton
            getData={() => {
              return {
                ...getData(),
                id: 'preview',
              }
            }}
          />
        </div>
        <LoadingButtonWrapper isLoading={isPending}>
          <StyledButton
            onClick={() => {
              const currentData = {
                ...getData(),
              }

              const payload: PostDto & {
                id?: string
              } = {
                ...currentData,
              }

              // if (
              //   currentData.created === initialData?.created &&
              //   currentData.created
              // ) {
              //   payload.custom_created = new Date(currentData.created)
              // }

              Reflect.deleteProperty(currentData, 'category')

              const isCreate = !currentData.id
              const promise = isCreate
                ? createPost(payload).then((res) => {
                    router.replace(`/dashboard/posts/edit?id=${res.id}`)
                    return res
                  })
                : updatePost(payload)

              promise.then((res) => {
                window.dispatchEvent(
                  new PublishEvent({
                    ...payload,
                    id: res.id,
                  }),
                )
              })
              promise.catch((err) => {
                toast.error(err.message)
              })
            }}
          >
            {initialData ? '保存' : '发布'}
          </StyledButton>
        </LoadingButtonWrapper>
      </div>
    </>
  )
}
