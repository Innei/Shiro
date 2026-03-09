'use client'

import type { PostModel } from '@mx-space/api-client'
import { m } from 'motion/react'
import { memo, useCallback, useMemo, useState } from 'react'

import { Spring } from '~/constants/spring'
import { Link } from '~/i18n/navigation'
import { clsxm } from '~/lib/helper'
import { routeBuilder, Routes } from '~/lib/route-builder'
import { useCurrentPostDataSelector } from '~/providers/post/CurrentPostDataProvider'

interface CategoryPostListProps {
  categoryPosts?: PostModel[]
  minPostsToShow?: number
  sticky?: boolean
  enabled?: boolean // 是否启用该分类的文章列表
}

// 文件夹节点
interface FolderNode {
  tag: string
  posts: PostModel[]
}

// 字母排序函数：支持中文、英文、数字
function compareStrings(a: string, b: string): number {
  // 移除空格
  const strA = a.trim()
  const strB = b.trim()

  // 检查是否为数字开头
  const numA = Number.parseFloat(strA)
  const numB = Number.parseFloat(strB)

  if (!Number.isNaN(numA) && !Number.isNaN(numB) && /^\d/.test(strA)) {
    return numA - numB
  }

  // 使用 localeCompare 进行本地化比较，支持中文拼音
  return strA.localeCompare(strB, 'zh-CN', {
    sensitivity: 'base',
    numeric: false,
  })
}

export const CategoryPostList = memo(function CategoryPostList({
  categoryPosts: propCategoryPosts,
  minPostsToShow: _minPostsToShow = 3,
  sticky = true,
  enabled,
}: CategoryPostListProps) {
  // 当前阅读的文章
  const currentPost = useCurrentPostDataSelector((data) => {
    if (!data) return null
    return {
      id: data.id,
      slug: data.slug,
      category: data.category,
    }
  })

  // 构建标签文件夹结构
  const folderStructure = useMemo(() => {
    if (!propCategoryPosts) return null

    const folderMap: Record<string, PostModel[]> = {}

    // 将文章按第一个标签分组
    propCategoryPosts.forEach((post) => {
      const tags = post.tags || []
      if (tags.length > 0) {
        const firstTag = tags[0]
        if (!folderMap[firstTag]) {
          folderMap[firstTag] = []
        }
        folderMap[firstTag].push(post)
      } else {
        // 没有标签的文章归入 "未分类"
        const uncategorizedKey = '前方未知'
        if (!folderMap[uncategorizedKey]) {
          folderMap[uncategorizedKey] = []
        }
        folderMap[uncategorizedKey].push(post)
      }
    })

    // 转换为数组并按标签名排序
    const folders = Object.entries(folderMap)
      .map(([tag, posts]) => ({
        tag,
        posts: posts.sort((a, b) => compareStrings(a.title, b.title)),
      }))
      .sort((a, b) => compareStrings(a.tag, b.tag))

    return folders
  }, [propCategoryPosts])

  const categorySlug = currentPost?.category?.slug
  const categoryPosts = propCategoryPosts

  // 如果没有启用，或没有分类信息，或没有文章，不显示
  if (
    enabled !== true ||
    !categorySlug ||
    !categoryPosts ||
    !folderStructure ||
    folderStructure.length === 0
  ) {
    return null
  }

  return (
    <m.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={Spring.presets.smooth}
      className={clsxm(
        'st-category-toc relative z-[3] font-sans hidden lg:block h-full',
      )}
    >
      <div
        className={clsxm(
          sticky ? 'sticky top-[120px]' : '',
          'mt-[120px] h-[calc(100vh-6rem-4.5rem-150px-120px)]',
        )}
      >
        <div className="h-full flex flex-col justify-start">
          <div className="ml-4 flex flex-col items-start">
            <div className="text-sm font-medium text-neutral/50 mb-4 text-left">
              {currentPost?.category?.name}
            </div>

            <div className="overflow-y-auto max-h-[calc(100vh-6rem-4.5rem-150px-120px-200px)] text-left w-full">
              {folderStructure.map((folder) => (
                <FolderItem
                  key={folder.tag}
                  folder={folder}
                  currentPostSlug={currentPost?.slug}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </m.aside>
  )
})

// 文件夹展开/折叠切换 - 移到组件外部
const FolderItem = memo(function FolderItem({
  folder,
  currentPostSlug,
}: {
  folder: FolderNode
  currentPostSlug?: string
}) {
  const [isExpanded, setIsExpanded] = useState(folder.posts.length <= 3)

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  return (
    <div className="mb-4 relative">
      {/* 实心圆点 */}
      <div className="absolute left-[7px] top-3 w-1 h-1 rounded-full bg-neutral/50 z-10" />

      {/* 展开时的细线 - 从圆点下方延伸到所有文章底部 */}
      {isExpanded && (
        <div className="absolute left-[7.5px] top-[15px] bottom-0 w-[1px] bg-neutral/20" />
      )}

      <div className="relative">
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full text-left hover:text-neutral/80 transition-colors pl-6"
        >
          <span className="text-sm font-medium text-neutral/80">
            {folder.tag}
          </span>
          <span className="text-xs text-neutral/40">
            ({folder.posts.length})
          </span>
        </button>
      </div>

      <ul
        className={clsxm(
          'mt-2 space-y-1 overflow-hidden transition-all duration-200',
          isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        {folder.posts.map((post) => (
          <CategoryPostItem
            key={post.id}
            post={post}
            isCurrent={post.slug === currentPostSlug}
            isFolder
          />
        ))}
      </ul>
    </div>
  )
})

const CategoryPostItem = memo(function CategoryPostItem({
  post,
  index,
  isCurrent = false,
  isFolder = false,
}: {
  post: PostModel
  index?: number
  isCurrent?: boolean
  isFolder?: boolean
}) {
  const textClass = isFolder ? 'text-sm' : 'text-base'

  return (
    <li data-index={index} className="relative">
      {isCurrent ? (
        <span
          className={clsxm(
            'group relative mb-[1.5px] block min-w-0 max-w-full truncate text-left',
            `${textClass} leading-normal text-neutral tabular-nums font-medium pl-6`,
          )}
          title={post.title}
        >
          <span className="cursor-default">{post.title}</span>
        </span>
      ) : (
        <Link
          href={routeBuilder(Routes.Post, {
            category: post.category?.slug || '',
            slug: post.slug,
          })}
          className={clsxm(
            'group relative mb-[1.5px] block min-w-0 max-w-full truncate text-left',
            `${textClass} leading-normal text-neutral/60 tabular-nums pl-6`,
            'transition-all duration-500 hover:text-neutral/90',
          )}
          title={post.title}
        >
          <span className="cursor-pointer">{post.title}</span>
        </Link>
      )}
    </li>
  )
})
