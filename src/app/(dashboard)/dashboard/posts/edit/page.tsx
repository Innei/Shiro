'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { atom } from 'jotai'
import { useSearchParams } from 'next/navigation'
import type { PostDto } from '~/models/writing'
import type { FC } from 'react'

import { PageLoading } from '~/components/layout/dashboard/PageLoading'
import {
  PostEditorSidebar,
  PostModelDataAtomProvider,
  SlugInput,
} from '~/components/modules/dashboard/post-editing'
import { BaseWritingProvider } from '~/components/modules/dashboard/writing/BaseWritingProvider'
import { EditorLayer } from '~/components/modules/dashboard/writing/EditorLayer'
import { Writing } from '~/components/modules/dashboard/writing/Writing'
import { cloneDeep } from '~/lib/_'
import { adminQueries } from '~/queries/definition'

export default function Page() {
  const search = useSearchParams()
  const id = search.get('id')

  const { data, isLoading } = useQuery({
    ...adminQueries.post.getPost(id!),
    enabled: !!id,
  })

  if (id) {
    if (isLoading) return <PageLoading />

    return <EditPage initialData={data} />
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

    summary: '',
  }
}

const EditPage: FC<{
  initialData?: PostDto
}> = (props) => {
  const [editingData] = useState<PostDto>(() =>
    props.initialData
      ? cloneDeep(props.initialData)
      : createInitialEditingData(),
  )

  const editingAtom = useMemo(() => atom(editingData), [editingData])

  return (
    <PostModelDataAtomProvider overrideAtom={editingAtom}>
      <BaseWritingProvider atom={editingAtom}>
        <EditorLayer>
          <span>
            {props.initialData ? <>编辑「{editingData.title}」</> : '撰写'}
          </span>
          <ActionButtonGroup initialData={props.initialData} />
          <Writing middleSlot={SlugInput} />
          <PostEditorSidebar />
        </EditorLayer>
      </BaseWritingProvider>
    </PostModelDataAtomProvider>
  )
}

const ActionButtonGroup = ({ initialData }: { initialData?: PostDto }) => (
  <div />
)
