import React from 'react'
import type { PostTag } from '@model'

import { select } from '@nextui-org/theme'

import { AddTag, Label, Tag } from '~/components/ui'
import { useI18n } from '~/i18n/hooks'
import { trpc } from '~/lib/trpc'

import {
  usePostModelDataSelector,
  usePostModelSetModelData,
} from '../data-provider'

const styles = select({
  variant: 'faded',
})

export const TagsInput = () => {
  const tags = usePostModelDataSelector((data) => data?.tags)
  const t = useI18n()

  const setter = usePostModelSetModelData()
  const handleClose = (tag: PostTag) => {
    setter((prev) => {
      const newTags = prev.tags.filter((t) => t.id !== tag.id)
      return {
        ...prev,
        tags: newTags,
        tagIds: newTags.map((t) => t.id),
      }
    })
  }

  return (
    <div>
      <Label>{t('common.tags')}</Label>

      <div className="mt-2 flex flex-wrap gap-2">
        {tags?.map((tag) => (
          <Tag canClose key={tag.id} onClose={() => handleClose(tag)}>
            {tag.name}
          </Tag>
        ))}

        <TagCompletion />
      </div>
    </div>
  )
}

const TagCompletion = () => {
  const { data: tags } = trpc.post.tags.useQuery(void 0, {
    refetchOnMount: true,
  })

  const { mutateAsync: createTag } = trpc.post.createTag.useMutation()

  const setter = usePostModelSetModelData()

  const existsTags = usePostModelDataSelector(
    (data) => data?.tags.map((t) => ({ id: t.id })),
  )

  return (
    <AddTag
      allTags={tags}
      existsTags={existsTags}
      onSelected={(suggestion) => {
        setter((prev) => {
          if (prev.tagIds.find((id) => id === suggestion.value)) return prev
          return {
            ...prev,
            tags: [
              ...prev.tags,
              { id: suggestion.value, name: suggestion.name, postId: [] },
            ],
            tagIds: [...prev.tagIds, suggestion.value],
          }
        })
      }}
      onEnter={async (value) => {
        const data = await createTag({
          name: value,
        })

        setter((prev) => {
          if (prev.tagIds.find((id) => id === data.id)) return prev
          return {
            ...prev,
            tags: [...prev.tags, { id: data.id, name: value, postId: [] }],
            tagIds: [...prev.tagIds, data.id],
          }
        })
      }}
    />
  )
}
