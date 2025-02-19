import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { adminQueries } from '~/queries/definition'

import { SidebarSection } from '../../writing/SidebarBase'
import {
  usePostModelDataSelector,
  usePostModelSetModelData,
} from '../data-provider'
import { AddTag, PostTag } from './Tag'

export const TagsInput = () => {
  const tags = usePostModelDataSelector((data) => data?.tags)

  const setter = usePostModelSetModelData()
  const handleClose = (tag: string) => {
    setter((prev) => {
      const newTags = prev.tags.filter((t) => t !== tag)
      return {
        ...prev,
        tags: newTags,
      }
    })
  }

  return (
    <SidebarSection label="标签">
      <div className="flex flex-wrap items-center gap-2">
        {tags?.map((tag) => (
          <PostTag canClose key={tag} onClose={() => handleClose(tag)}>
            {tag}
          </PostTag>
        ))}

        <TagCompletion />
      </div>
    </SidebarSection>
  )
}

const TagCompletion = () => {
  const { data } = useQuery(adminQueries.post.getAllTags())

  const setter = usePostModelSetModelData()

  const existsTags = usePostModelDataSelector(
    (data) => data?.tags.map((t) => ({ label: t, value: t })) ?? [],
  )

  return (
    <AddTag
      allTags={data}
      existsTags={existsTags}
      onSelected={(suggestion) => {
        setter((prev) => ({
          ...prev,
          tags: [...prev.tags, suggestion.value],
        }))
      }}
      onEnter={async (value) => {
        setter((prev) => ({
          ...prev,
          tags: [...prev.tags, value],
        }))
      }}
    />
  )
}
